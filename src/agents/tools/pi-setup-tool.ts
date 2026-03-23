import { Type } from "@sinclair/typebox";
import type { OpenClawConfig } from "../../config/config.js";
import { resolveSessionAgentId } from "../agent-scope.js";
import { stringEnum } from "../schema/typebox.js";
import { type AnyAgentTool, jsonResult, readStringParam } from "./common.js";
import { callGatewayTool, readGatewayCallOptions } from "./gateway.js";

const SETUP_ACTIONS = [
  "skills_list",
  "skills_install",
  "mcp_list",
  "mcp_add",
  "mcp_remove",
] as const;

type SetupAction = (typeof SETUP_ACTIONS)[number];

const SetupToolSchema = Type.Object(
  {
    action: stringEnum(SETUP_ACTIONS),
    gatewayUrl: Type.Optional(Type.String()),
    gatewayToken: Type.Optional(Type.String()),
    // skills_install
    skillName: Type.Optional(Type.String()),
    installId: Type.Optional(Type.String()),
    // mcp_add
    name: Type.Optional(Type.String()),
    command: Type.Optional(Type.String()),
    args: Type.Optional(Type.Array(Type.String())),
    env: Type.Optional(Type.Object({}, { additionalProperties: true })),
    url: Type.Optional(Type.String()),
  },
  { additionalProperties: true },
);

type SetupToolOptions = {
  agentSessionKey?: string;
  config?: OpenClawConfig;
};

export function createSetupTool(opts?: SetupToolOptions): AnyAgentTool {
  return {
    label: "Setup",
    name: "setup",
    ownerOnly: true,
    description: `Manage skills and MCP servers for autonomous self-configuration.

ACTIONS:
- skills_list: List available skills and install status for the current agent. Call this first before skills_install to discover skillName and installId values.
- skills_install: Install a skill dependency (requires skillName and installId from skills_list output)
- mcp_list: List currently configured MCP servers
- mcp_add: Add or update an MCP server (requires name + one of: command, or url)
- mcp_remove: Remove an MCP server by name (requires name)

SCHEMA:
{ "action": "skills_list" }
{ "action": "skills_install", "skillName": "<skill-name>", "installId": "<install-id>" }
{ "action": "mcp_list" }
{ "action": "mcp_add", "name": "<server-name>", "command": "<cmd>", "args": ["..."], "env": {"KEY": "val"} }
{ "action": "mcp_add", "name": "<server-name>", "url": "<http-or-ws-url>" }
{ "action": "mcp_remove", "name": "<server-name>" }

USAGE NOTES:
- After mcp_add or mcp_remove, use the gateway tool (action=restart) for changes to take effect.
- For skills_install, installation may take up to 2 minutes; wait for the result before proceeding.
- Use skills_list proactively when a capability seems to be missing.`,
    parameters: SetupToolSchema,
    execute: async (_toolCallId, args) => {
      const params = args as Record<string, unknown>;
      const action = (readStringParam(params, "action") ?? "") as SetupAction;
      const gatewayOpts = readGatewayCallOptions(params);

      const agentId = resolveSessionAgentId({
        sessionKey: opts?.agentSessionKey,
        config: opts?.config,
      });

      switch (action) {
        case "skills_list": {
          const result = await callGatewayTool("skills.status", gatewayOpts, { agentId });
          return jsonResult(result);
        }

        case "skills_install": {
          const skillName = readStringParam(params, "skillName");
          const installId = readStringParam(params, "installId");
          if (!skillName) {
            return jsonResult({ ok: false, error: "skillName is required" });
          }
          if (!installId) {
            return jsonResult({ ok: false, error: "installId is required — call skills_list first to find valid installId values" });
          }
          const result = await callGatewayTool(
            "skills.install",
            gatewayOpts,
            { agentId, skillName, installId },
          );
          return jsonResult(result);
        }

        case "mcp_list": {
          const configResult = await callGatewayTool("config.get", gatewayOpts);
          const config = configResult as { config?: { mcp?: { servers?: Record<string, unknown> } } };
          const servers = config?.config?.mcp?.servers ?? {};
          return jsonResult({ servers });
        }

        case "mcp_add": {
          const name = readStringParam(params, "name");
          if (!name) {
            return jsonResult({ ok: false, error: "name is required" });
          }
          const command = readStringParam(params, "command");
          const url = readStringParam(params, "url");
          if (!command && !url) {
            return jsonResult({ ok: false, error: "either command or url is required" });
          }

          // Build the server entry
          const serverEntry: Record<string, unknown> = {};
          if (command) {
            serverEntry.command = command;
            const rawArgs = params["args"];
            if (Array.isArray(rawArgs)) {
              serverEntry.args = rawArgs;
            }
            const rawEnv = params["env"];
            if (rawEnv && typeof rawEnv === "object" && !Array.isArray(rawEnv)) {
              serverEntry.env = rawEnv;
            }
          }
          if (url) {
            serverEntry.url = url;
          }

          // Get current config hash, then patch
          const snapshot = await callGatewayTool("config.get", gatewayOpts) as {
            hash?: string;
          };
          const baseHash = typeof snapshot?.hash === "string" ? snapshot.hash : undefined;
          if (!baseHash) {
            return jsonResult({ ok: false, error: "could not read config hash; try again" });
          }

          const patch = { mcp: { servers: { [name]: serverEntry } } };
          const result = await callGatewayTool(
            "config.patch",
            gatewayOpts,
            { raw: JSON.stringify(patch), baseHash },
          );
          return jsonResult({ ok: true, server: name, result });
        }

        case "mcp_remove": {
          const name = readStringParam(params, "name");
          if (!name) {
            return jsonResult({ ok: false, error: "name is required" });
          }

          const snapshot = await callGatewayTool("config.get", gatewayOpts) as {
            hash?: string;
            config?: { mcp?: { servers?: Record<string, unknown> } };
          };
          const baseHash = typeof snapshot?.hash === "string" ? snapshot.hash : undefined;
          if (!baseHash) {
            return jsonResult({ ok: false, error: "could not read config hash; try again" });
          }

          const servers = snapshot?.config?.mcp?.servers ?? {};
          if (!(name in servers)) {
            return jsonResult({ ok: false, error: `MCP server "${name}" not found` });
          }

          // Remove by setting to null (JSON Merge Patch semantics: null = delete)
          const patch = { mcp: { servers: { [name]: null } } };
          const result = await callGatewayTool(
            "config.patch",
            gatewayOpts,
            { raw: JSON.stringify(patch), baseHash },
          );
          return jsonResult({ ok: true, removed: name, result });
        }

        default:
          return jsonResult({
            ok: false,
            error: `Unknown action: ${String(action)}. Valid actions: ${SETUP_ACTIONS.join(", ")}`,
          });
      }
    },
  };
}
