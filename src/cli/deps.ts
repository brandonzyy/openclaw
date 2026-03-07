import type { sendMessageWhatsApp } from "../channels/web/index.js";
import type { sendMessageDiscord } from "../discord/send.js";
import type { OutboundSendDeps } from "../infra/outbound/deliver.js";
import type { sendMessageSlack } from "../slack/send.js";
import type { sendMessageTelegram } from "../telegram/send.js";
import { createOutboundSendDepsFromCliSource } from "./outbound-send-mapping.js";

export type CliDeps = {
  sendMessageWhatsApp: typeof sendMessageWhatsApp;
  sendMessageTelegram: typeof sendMessageTelegram;
  sendMessageDiscord: typeof sendMessageDiscord;
  sendMessageSlack: typeof sendMessageSlack;
};

let whatsappSenderRuntimePromise: Promise<typeof import("./deps-send-whatsapp.runtime.js")> | null =
  null;
let telegramSenderRuntimePromise: Promise<typeof import("./deps-send-telegram.runtime.js")> | null =
  null;
let discordSenderRuntimePromise: Promise<typeof import("./deps-send-discord.runtime.js")> | null =
  null;
let slackSenderRuntimePromise: Promise<typeof import("./deps-send-slack.runtime.js")> | null = null;

function loadWhatsAppSenderRuntime() {
  whatsappSenderRuntimePromise ??= import("./deps-send-whatsapp.runtime.js");
  return whatsappSenderRuntimePromise;
}

function loadTelegramSenderRuntime() {
  telegramSenderRuntimePromise ??= import("./deps-send-telegram.runtime.js");
  return telegramSenderRuntimePromise;
}

function loadDiscordSenderRuntime() {
  discordSenderRuntimePromise ??= import("./deps-send-discord.runtime.js");
  return discordSenderRuntimePromise;
}

function loadSlackSenderRuntime() {
  slackSenderRuntimePromise ??= import("./deps-send-slack.runtime.js");
  return slackSenderRuntimePromise;
}

export function createDefaultDeps(): CliDeps {
  return {
    sendMessageWhatsApp: async (...args) => {
      const { sendMessageWhatsApp } = await loadWhatsAppSenderRuntime();
      return await sendMessageWhatsApp(...args);
    },
    sendMessageTelegram: async (...args) => {
      const { sendMessageTelegram } = await loadTelegramSenderRuntime();
      return await sendMessageTelegram(...args);
    },
    sendMessageDiscord: async (...args) => {
      const { sendMessageDiscord } = await loadDiscordSenderRuntime();
      return await sendMessageDiscord(...args);
    },
    sendMessageSlack: async (...args) => {
      const { sendMessageSlack } = await loadSlackSenderRuntime();
      return await sendMessageSlack(...args);
    },
  };
}

export function createOutboundSendDeps(deps: CliDeps): OutboundSendDeps {
  return createOutboundSendDepsFromCliSource(deps);
}

export { logWebSelfId } from "../web/auth-store.js";
