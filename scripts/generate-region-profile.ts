#!/usr/bin/env npx tsx
/**
 * OpenClaw 中国特别版 — 区域配置生成器
 *
 * Scans all extensions, built-in channels, and AI providers then generates
 * a region-specific config profile (config/profiles/china.json5) that disables
 * overseas-only components via plugins.deny + channels.<id>.enabled.
 *
 * Usage:
 *   npx tsx scripts/generate-region-profile.ts
 *   npx tsx scripts/generate-region-profile.ts --non-interactive
 *   npx tsx scripts/generate-region-profile.ts --dry-run
 */

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

// ============================================================================
// Types
// ============================================================================

type Category = "china" | "overseas" | "universal" | "optional";
type ComponentKind = "channel-ext" | "provider-ext" | "tool-ext" | "builtin-channel" | "ai-provider";

interface Component {
  id: string;
  label: string;
  kind: ComponentKind;
  category: Category;
  disabled: boolean; // current toggle state
}

// ============================================================================
// Classification rules
// ============================================================================

const CHANNEL_EXT_RULES: Record<string, Category> = {
  feishu: "china",
  discord: "overseas",
  slack: "overseas",
  telegram: "overseas",
  whatsapp: "overseas",
  signal: "overseas",
  imessage: "overseas",
  googlechat: "overseas",
  line: "overseas",
  bluebubbles: "overseas",
  nostr: "overseas",
  tlon: "overseas",
  twitch: "overseas",
  irc: "optional",
  matrix: "optional",
  mattermost: "optional",
  msteams: "optional",
  "synology-chat": "optional",
  "nextcloud-talk": "optional",
  zalo: "optional",
  zalouser: "optional",
};

const PROVIDER_EXT_RULES: Record<string, Category> = {
  "qwen-portal-auth": "china",
  "minimax-portal-auth": "china",
  "google-gemini-cli-auth": "overseas",
  "copilot-proxy": "overseas",
};

const TOOL_EXT_RULES: Record<string, Category> = {
  diffs: "universal",
  "diagnostics-otel": "universal",
  "llm-task": "universal",
  "memory-core": "universal",
  "memory-lancedb": "universal",
  acpx: "universal",
  lobster: "universal",
  "open-prose": "universal",
  "thread-ownership": "universal",
  "phone-control": "optional",
  "talk-voice": "optional",
  "voice-call": "optional",
  "device-pair": "optional",
};

const AI_PROVIDER_RULES: Record<string, { category: Category; label: string }> = {
  qianfan: { category: "china", label: "百度千帆" },
  minimax: { category: "china", label: "MiniMax" },
  "minimax-portal": { category: "china", label: "MiniMax Portal" },
  moonshot: { category: "china", label: "月之暗面 (Moonshot)" },
  "kimi-coding": { category: "china", label: "Kimi Coding" },
  "qwen-portal": { category: "china", label: "通义千问 (Qwen)" },
  volcengine: { category: "china", label: "火山引擎/豆包" },
  "volcengine-plan": { category: "china", label: "火山引擎 Plan" },
  byteplus: { category: "china", label: "BytePlus" },
  "byteplus-plan": { category: "china", label: "BytePlus Plan" },
  xiaomi: { category: "china", label: "小米 MiMo" },
  kilocode: { category: "china", label: "KiloCode" },

  openai: { category: "overseas", label: "OpenAI" },
  anthropic: { category: "overseas", label: "Anthropic" },
  google: { category: "overseas", label: "Google Gemini" },
  "github-copilot": { category: "overseas", label: "GitHub Copilot" },
  huggingface: { category: "overseas", label: "HuggingFace" },
  together: { category: "overseas", label: "Together AI" },
  openrouter: { category: "overseas", label: "OpenRouter" },
  "vercel-ai-gateway": { category: "overseas", label: "Vercel AI Gateway" },
  "cloudflare-ai-gateway": { category: "overseas", label: "Cloudflare AI Gateway" },
  chutes: { category: "overseas", label: "Chutes" },
  xai: { category: "overseas", label: "xAI (Grok)" },
  venice: { category: "overseas", label: "Venice" },
  zai: { category: "overseas", label: "ZAI" },
  cerebras: { category: "overseas", label: "Cerebras" },
  groq: { category: "overseas", label: "Groq" },
  deepgram: { category: "overseas", label: "Deepgram" },
  voyage: { category: "overseas", label: "Voyage" },
  mistral: { category: "overseas", label: "Mistral" },
  nvidia: { category: "overseas", label: "NVIDIA" },
  litellm: { category: "overseas", label: "LiteLLM" },
  synthetic: { category: "overseas", label: "Synthetic" },
  opencode: { category: "overseas", label: "OpenCode" },

  ollama: { category: "universal", label: "Ollama (本地模型)" },
  vllm: { category: "universal", label: "vLLM (本地/自建)" },
};

// Built-in channels from CHAT_CHANNEL_ORDER
const BUILTIN_CHANNELS = [
  "telegram", "whatsapp", "discord", "irc", "googlechat",
  "slack", "signal", "imessage", "line",
] as const;

const BUILTIN_CHANNEL_LABELS: Record<string, string> = {
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  discord: "Discord",
  irc: "IRC",
  googlechat: "Google Chat",
  slack: "Slack",
  signal: "Signal",
  imessage: "iMessage",
  line: "LINE",
};

// ============================================================================
// Phase 1: Scan
// ============================================================================

function scanExtensions(rootDir: string): Component[] {
  const extDir = path.join(rootDir, "extensions");
  const components: Component[] = [];

  if (!fs.existsSync(extDir)) {
    console.error("extensions/ 目录不存在");
    process.exit(1);
  }

  for (const name of fs.readdirSync(extDir)) {
    const pluginFile = path.join(extDir, name, "openclaw.plugin.json");
    if (!fs.existsSync(pluginFile)) continue;

    const plugin = JSON.parse(fs.readFileSync(pluginFile, "utf-8"));
    const id: string = plugin.id ?? name;

    // Determine kind and category
    if (id in CHANNEL_EXT_RULES) {
      const cat = CHANNEL_EXT_RULES[id]!;
      components.push({
        id,
        label: plugin.name ?? id,
        kind: "channel-ext",
        category: cat,
        disabled: cat === "overseas",
      });
    } else if (id in PROVIDER_EXT_RULES) {
      const cat = PROVIDER_EXT_RULES[id]!;
      components.push({
        id,
        label: plugin.name ?? id,
        kind: "provider-ext",
        category: cat,
        disabled: cat === "overseas",
      });
    } else if (id in TOOL_EXT_RULES) {
      const cat = TOOL_EXT_RULES[id]!;
      components.push({
        id,
        label: plugin.name ?? plugin.description ?? id,
        kind: "tool-ext",
        category: cat,
        disabled: false, // tools default to enabled
      });
    } else {
      // Unknown extension → optional, keep enabled
      components.push({
        id,
        label: plugin.name ?? id,
        kind: "tool-ext",
        category: "optional",
        disabled: false,
      });
    }
  }

  return components;
}

function buildBuiltinChannels(): Component[] {
  return BUILTIN_CHANNELS.map((ch) => {
    // Built-in channels mirror their extension classification
    const cat = CHANNEL_EXT_RULES[ch] ?? "optional";
    return {
      id: ch,
      label: BUILTIN_CHANNEL_LABELS[ch] ?? ch,
      kind: "builtin-channel" as ComponentKind,
      category: cat,
      disabled: cat === "overseas",
    };
  });
}

function buildAIProviders(): Component[] {
  return Object.entries(AI_PROVIDER_RULES).map(([id, { category, label }]) => ({
    id,
    label,
    kind: "ai-provider" as ComponentKind,
    category,
    disabled: category === "overseas",
  }));
}

// ============================================================================
// Phase 2: Merge & deduplicate
// ============================================================================

function buildComponentList(rootDir: string): Component[] {
  const extensions = scanExtensions(rootDir);
  const builtinChannels = buildBuiltinChannels();
  const providers = buildAIProviders();

  // Deduplicate: built-in channels that also have extensions — keep extension,
  // mark it as needing channels.<id>.enabled = false too
  const extIds = new Set(extensions.map((e) => e.id));
  const uniqueBuiltins = builtinChannels.filter((b) => !extIds.has(b.id));

  return [...extensions, ...uniqueBuiltins, ...providers];
}

// ============================================================================
// Phase 3: Interactive menu
// ============================================================================

const CATEGORY_META: Record<Category, { icon: string; title: string; order: number }> = {
  china: { icon: "🟢", title: "中国适用 (推荐保留)", order: 0 },
  overseas: { icon: "🔴", title: "海外专用 (推荐禁用)", order: 1 },
  universal: { icon: "🟡", title: "通用/自建 (推荐保留)", order: 2 },
  optional: { icon: "⚪", title: "可选 (由你决定)", order: 3 },
};

const KIND_LABELS: Record<ComponentKind, string> = {
  "channel-ext": "频道",
  "provider-ext": "提供商扩展",
  "tool-ext": "工具",
  "builtin-channel": "内置频道",
  "ai-provider": "提供商",
};

function printMenu(components: Component[]): void {
  console.clear();
  console.log("╔══════════════════════════════════════════════════════════════════╗");
  console.log("║  OpenClaw 中国特别版 — 区域配置生成器                           ║");
  console.log("╚══════════════════════════════════════════════════════════════════╝");
  console.log();

  const extCount = components.filter((c) => c.kind !== "builtin-channel" && c.kind !== "ai-provider").length;
  const builtinCount = components.filter((c) => c.kind === "builtin-channel").length;
  const providerCount = components.filter((c) => c.kind === "ai-provider").length;
  console.log(`扫描完成: ${extCount} 个扩展, ${builtinCount} 个内置频道, ${providerCount} 个 AI 提供商\n`);

  const groups = new Map<Category, Component[]>();
  for (const c of components) {
    const list = groups.get(c.category) ?? [];
    list.push(c);
    groups.set(c.category, list);
  }

  const sortedCategories = (["china", "overseas", "universal", "optional"] as Category[])
    .filter((cat) => groups.has(cat));

  let idx = 1;
  for (const cat of sortedCategories) {
    const meta = CATEGORY_META[cat];
    console.log(`── ${meta.icon} ${meta.title} ${"─".repeat(Math.max(0, 50 - meta.title.length))}`);

    for (const c of groups.get(cat)!) {
      const status = c.disabled ? "禁用" : "保留";
      const statusColor = c.disabled ? "\x1b[31m" : "\x1b[32m";
      const kindLabel = KIND_LABELS[c.kind];
      const num = String(idx).padStart(3);
      console.log(`  ${num}. ${statusColor}[${status}]\x1b[0m ${c.id.padEnd(28)} ${c.label.padEnd(24)} [${kindLabel}]`);
      idx++;
    }
    console.log();
  }

  console.log("操作: 输入序号切换, [a] 接受生成, [r] 重置默认, [q] 退出");
}

async function interactiveMenu(components: Component[]): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => rl.question(prompt, resolve));

  // Build ordered flat list matching display order
  const ordered = buildOrderedList(components);

  printMenu(ordered);

  while (true) {
    const answer = (await question("> ")).trim().toLowerCase();

    if (answer === "q") {
      rl.close();
      console.log("已退出，未生成配置文件。");
      return false;
    }

    if (answer === "a") {
      rl.close();
      return true;
    }

    if (answer === "r") {
      resetDefaults(ordered);
      printMenu(ordered);
      continue;
    }

    // Try parsing as number
    const num = parseInt(answer, 10);
    if (!isNaN(num) && num >= 1 && num <= ordered.length) {
      const target = ordered[num - 1]!;
      target.disabled = !target.disabled;
      printMenu(ordered);
      continue;
    }

    // Multiple numbers separated by space/comma
    const nums = answer.split(/[\s,]+/).map((s) => parseInt(s, 10)).filter((n) => !isNaN(n));
    if (nums.length > 0 && nums.every((n) => n >= 1 && n <= ordered.length)) {
      for (const n of nums) {
        ordered[n - 1]!.disabled = !ordered[n - 1]!.disabled;
      }
      printMenu(ordered);
      continue;
    }

    console.log("无效输入。输入序号切换状态，a 生成，r 重置，q 退出。");
  }
}

function buildOrderedList(components: Component[]): Component[] {
  const groups = new Map<Category, Component[]>();
  for (const c of components) {
    const list = groups.get(c.category) ?? [];
    list.push(c);
    groups.set(c.category, list);
  }
  const result: Component[] = [];
  for (const cat of ["china", "overseas", "universal", "optional"] as Category[]) {
    if (groups.has(cat)) result.push(...groups.get(cat)!);
  }
  return result;
}

function resetDefaults(components: Component[]): void {
  for (const c of components) {
    c.disabled = c.category === "overseas";
  }
}

// ============================================================================
// Phase 4: Generate config
// ============================================================================

function generateConfig(components: Component[]): string {
  const disabledExts = components
    .filter((c) => c.disabled && (c.kind === "channel-ext" || c.kind === "provider-ext" || c.kind === "tool-ext"))
    .map((c) => c.id);

  // Built-in channels that are disabled need channels.<id>.enabled: false
  // Also, channel extensions that are disabled AND exist in BUILTIN_CHANNELS
  const builtinSet = new Set<string>(BUILTIN_CHANNELS);
  const disabledBuiltinChannels = components
    .filter((c) => c.disabled && (c.kind === "builtin-channel" || (c.kind === "channel-ext" && builtinSet.has(c.id))))
    .map((c) => c.id);
  // Deduplicate
  const uniqueDisabledBuiltins = [...new Set(disabledBuiltinChannels)];

  const disabledProviders = components
    .filter((c) => c.disabled && c.kind === "ai-provider")
    .map((c) => ({ id: c.id, label: c.label }));

  const now = new Date().toISOString();

  let out = `{
  // OpenClaw 中国特别版配置
  // 生成时间: ${now}
  // 使用方法: 在 openclaw.json5 中添加 "$include": "./profiles/china.json5"
`;

  // plugins.deny
  if (disabledExts.length > 0) {
    out += `
  plugins: {
    deny: [
`;
    // Group by kind for readability
    const channelExts = disabledExts.filter((id) => id in CHANNEL_EXT_RULES);
    const providerExts = disabledExts.filter((id) => id in PROVIDER_EXT_RULES);
    const toolExts = disabledExts.filter((id) => !(id in CHANNEL_EXT_RULES) && !(id in PROVIDER_EXT_RULES));

    if (channelExts.length > 0) {
      out += `      // 频道扩展\n`;
      for (const id of channelExts) {
        out += `      "${id}",\n`;
      }
    }
    if (providerExts.length > 0) {
      out += `      // 提供商扩展\n`;
      for (const id of providerExts) {
        out += `      "${id}",\n`;
      }
    }
    if (toolExts.length > 0) {
      out += `      // 工具扩展\n`;
      for (const id of toolExts) {
        out += `      "${id}",\n`;
      }
    }

    out += `    ],
  },
`;
  }

  // channels.<id>.enabled: false
  if (uniqueDisabledBuiltins.length > 0) {
    out += `
  channels: {
`;
    for (const id of uniqueDisabledBuiltins) {
      const label = BUILTIN_CHANNEL_LABELS[id] ?? id;
      out += `    // ${label}\n`;
      out += `    ${id}: { enabled: false },\n`;
    }
    out += `  },
`;
  }

  // Disabled AI providers as comment (informational only — no deny mechanism)
  if (disabledProviders.length > 0) {
    out += `
  // ── 禁用的 AI 提供商（仅供参考，提供商通过环境变量控制） ──
`;
    for (const { id, label } of disabledProviders) {
      out += `  // - ${id} (${label})\n`;
    }
  }

  out += `}\n`;
  return out;
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const nonInteractive = args.includes("--non-interactive");
  const dryRun = args.includes("--dry-run");

  const rootDir = path.resolve(import.meta.dirname ?? __dirname, "..");
  const outputPath = path.join(rootDir, "config", "profiles", "china.json5");

  // Phase 1 & 2: Scan and classify
  const components = buildComponentList(rootDir);

  if (nonInteractive) {
    // Accept all defaults
    console.log("非交互模式：使用默认推荐配置\n");
    const ordered = buildOrderedList(components);
    printSummary(ordered);
  } else {
    // Phase 3: Interactive
    const proceed = await interactiveMenu(components);
    if (!proceed) return;
  }

  // Phase 4: Generate
  const ordered = buildOrderedList(components);
  const config = generateConfig(ordered);

  if (dryRun) {
    console.log("\n── dry-run: 以下为生成的配置文件内容 ──\n");
    console.log(config);
    return;
  }

  // Ensure directory exists
  const profileDir = path.dirname(outputPath);
  fs.mkdirSync(profileDir, { recursive: true });
  fs.writeFileSync(outputPath, config, "utf-8");

  console.log(`\n✅ 配置已写入: ${path.relative(rootDir, outputPath)}`);
  console.log(`   在 openclaw.json5 中添加: "$include": "./profiles/china.json5"`);
}

function printSummary(components: Component[]): void {
  const disabled = components.filter((c) => c.disabled);
  const enabled = components.filter((c) => !c.disabled);
  console.log(`保留: ${enabled.length} 个组件`);
  console.log(`禁用: ${disabled.length} 个组件`);
  if (disabled.length > 0) {
    console.log(`  禁用列表: ${disabled.map((c) => c.id).join(", ")}`);
  }
}

main().catch((err) => {
  console.error("生成失败:", err);
  process.exit(1);
});
