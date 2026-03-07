# OpenClaw 中国用户优化版 — 裁剪分析报告与执行计划

> 生成日期: 2026-03-07
> 分析工具: Manon 知识图谱 (94,784 实体 / 117,744 关系)
> 项目总量: 3,403 源文件 / 612,605 行代码

---

## 一、执行摘要

经过对 OpenClaw 全量代码的知识图谱分析，识别出 **~142,800 行代码 (23.3%)** 属于中国用户绝对或极大概率用不到的功能模块。裁剪后项目将从 612K 行缩减至 ~470K 行，显著降低构建体积、维护成本和安全攻击面。

### 裁剪收益

| 指标 | 裁剪前 | 裁剪后 | 变化 |
|------|--------|--------|------|
| 源码行数 | 612,605 | ~469,800 | -23.3% |
| 源文件数 | 3,403 | ~2,700 | -20.7% |
| 扩展插件数 | 40 | ~12 | -70% |
| npm 依赖 | (需统计) | 显著减少 | 移除 Baileys/LINE SDK/Twilio 等 |

---

## 二、裁剪清单

### 2.1 通信渠道 — 绝对移除 (94,885 行)

中国被墙或完全无用户群的平台。

| 模块 | 文件数 | 行数 | 移除原因 |
|------|--------|------|----------|
| `extensions/telegram/` + `src/telegram/` | 67 | 15,852 | Telegram 在中国被墙 |
| `extensions/discord/` + `src/discord/` | 94 | 24,303 | Discord 在中国被墙 |
| `extensions/whatsapp/` + `src/web/` | 50 | 7,071 | WhatsApp 中国无用户 (含 Baileys 引擎) |
| `extensions/signal/` | 3 | 356 | Signal 在中国被墙 |
| `extensions/imessage/` + `src/imessage/` | 22 | 2,811 | iMessage 在中国不用作 bot 通道 |
| `extensions/bluebubbles/` | 29 | 7,166 | BlueBubbles (iMessage 桥接) |
| `extensions/matrix/` | 64 | 7,515 | Matrix 协议中国极少使用 |
| `extensions/nostr/` | 13 | 3,396 | Nostr 去中心化网络, 中国无用户 |
| `extensions/tlon/` | 27 | 6,222 | Tlon/Urbit 社交网络, 中国无用户 |
| `extensions/twitch/` | 22 | 3,137 | Twitch 已退出中国 |
| `extensions/irc/` | 17 | 2,982 | IRC 在中国几乎无人使用 |
| `extensions/zalo/` + `extensions/zalouser/` | 36 | 6,982 | Zalo 是越南通讯软件 |
| `extensions/line/` + `src/line/` | 33 | 7,092 | LINE 主要在日韩台使用 |
| **小计** | **477** | **94,885** | |

### 2.2 通信渠道 — 极大概率移除 (32,735 行)

中国企业基本不使用的协作平台。

| 模块 | 文件数 | 行数 | 移除原因 |
|------|--------|------|----------|
| `extensions/slack/` + `src/slack/` | 74 | 11,194 | 中国企业用飞书/钉钉, 极少用 Slack |
| `extensions/msteams/` | 54 | 7,910 | MS Teams 中国市占极低 |
| `extensions/googlechat/` | 15 | 2,993 | Google Chat 被墙 |
| `extensions/mattermost/` | 28 | 6,312 | Mattermost 中国几乎无部署 |
| `extensions/synology-chat/` | 9 | 1,390 | 群晖 Chat 极小众 |
| `extensions/nextcloud-talk/` | 19 | 2,936 | Nextcloud Talk 极小众 |
| **小计** | **199** | **32,735** | |

### 2.3 语音通话/电话 (9,741 行)

基于海外电话服务商 (Twilio/Plivo/Telnyx), 中国无法使用。

| 模块 | 文件数 | 行数 | 移除原因 |
|------|--------|------|----------|
| `extensions/voice-call/` | 42 | 9,166 | Twilio/Plivo/Telnyx 中国不可用 |
| `extensions/talk-voice/` | 1 | 154 | 语音通话辅助 |
| `extensions/phone-control/` | 1 | 421 | 电话控制 |
| **小计** | **44** | **9,741** | |

### 2.4 AI 模型提供商 (3,100 行)

中国无法访问或无人使用的海外独立提供商。

| 文件 | 行数 | 移除原因 |
|------|------|----------|
| `src/agents/venice-models.ts` | 709 | Venice AI, 中国无人使用 |
| `src/agents/together-models.ts` | 133 | Together AI, 中国无法访问 |
| `src/agents/huggingface-models.ts` | 230 | HuggingFace Router, 中国访问困难 |
| `src/agents/opencode-zen-models.ts` | 319 | OpenCode Zen, 中国无人使用 |
| `src/agents/synthetic-models.ts` | 196 | Synthetic 提供商 |
| `src/agents/chutes-oauth.ts` | 226 | Chutes AI, 中国无人使用 |
| `src/providers/github-copilot-auth.ts` | 184 | GitHub Copilot OAuth |
| `src/providers/github-copilot-models.ts` | 43 | Copilot 模型目录 |
| `src/providers/github-copilot-token.ts` | 137 | Copilot Token 解析 |
| `extensions/copilot-proxy/` | 154 | Copilot 代理 |
| `extensions/google-gemini-cli-auth/` | 809 | Google Gemini CLI OAuth (被墙) |
| `src/infra/provider-usage.fetch.copilot.ts` | 64 | Copilot 用量追踪 |
| `src/infra/provider-usage.fetch.zai.ts` | 94 | z.ai 用量追踪 |
| **小计** | **~3,100** | |

### 2.5 网络基础设施 (629 行 + 散布引用)

| 文件 | 行数 | 移除原因 |
|------|------|----------|
| `src/infra/tailscale.ts` | 500 | Tailscale VPN 中国不可用 |
| `src/infra/tailnet.ts` | 59 | Tailnet 配置 |
| `src/shared/tailscale-status.ts` | 70 | Tailscale 状态检测 |
| **小计** | **629** | 注: 有 20+ 文件引用 Tailscale, 需逐一清理 |

### 2.6 其他扩展 (1,377 行)

| 模块 | 行数 | 移除原因 |
|------|------|----------|
| `extensions/lobster/` | 363 | Lobster 平台, 中国无用户 |
| `extensions/open-prose/` | 5 | Open Prose, 空壳 |
| `extensions/device-pair/` | 1,009 | 依赖 Tailscale 的设备配对 |
| **小计** | **1,377** | |

### 2.7 UI 层清理 (~1,200 行)

| 文件 | 行数 | 说明 |
|------|------|------|
| `ui/src/ui/views/channels.discord.ts` | 65 | Discord UI |
| `ui/src/ui/views/channels.imessage.ts` | 65 | iMessage UI |
| `ui/src/ui/views/channels.signal.ts` | 69 | Signal UI |
| `ui/src/ui/views/channels.slack.ts` | 65 | Slack UI |
| `ui/src/ui/views/channels.telegram.ts` | 120 | Telegram UI |
| `ui/src/ui/views/channels.whatsapp.ts` | 118 | WhatsApp UI |
| `ui/src/ui/views/channels.googlechat.ts` | 79 | Google Chat UI |
| `ui/src/ui/views/channels.nostr.ts` | 237 | Nostr UI |
| `ui/src/ui/views/channels.nostr-profile-form.ts` | 321 | Nostr 表单 UI |

### 2.8 核心集成代码清理 (~2,500 行)

`src/channels/plugins/` 下各渠道的 onboarding/outbound/normalize 文件:

| 渠道 | onboarding | outbound | normalize | 合计 |
|------|-----------|----------|-----------|------|
| discord | 326 | 147 | 47 | 520 |
| imessage | 180 | 30 | 47 | 257 |
| signal | 244 | 28 | 70 | 342 |
| slack | 362 | 138 | 26 | 526 |
| telegram | 253 | 140 | 44 | 437 |
| whatsapp | 354 | 48 | 25 | 427 |
| **合计** | | | | **2,509** |

---

## 三、应保留的模块

### 3.1 通信渠道
- **飞书 (Feishu)** — `extensions/feishu/` (54 files, 12,250 lines) — 中国企业主流
- **WebChat** — 内置网页聊天, 通用
- **共享基础** — `extensions/shared/`, `src/channels/` 核心框架

### 3.2 AI 模型提供商
| 提供商 | 说明 |
|--------|------|
| Qwen (通义千问) | 阿里, `extensions/qwen-portal-auth/` |
| MiniMax | 国产大模型, `extensions/minimax-portal-auth/` |
| Doubao (豆包) | 字节, `src/agents/doubao-models.ts` |
| BytePlus | 字节国际, `src/agents/byteplus-models.ts` |
| Qianfan (千帆) | 百度, 含 DeepSeek/ERNIE |
| Xiaomi (小米) | 小米大模型 |
| Moonshot/Kimi | 月之暗面 |
| Kimi Coding | `buildKimiCodingProvider` |
| OpenAI 兼容层 | 多数国产模型走此协议 |
| Anthropic Claude | 通过 API 中转可用 |
| Ollama | 本地模型部署, 通用 |
| Kilocode | 已集成 |

### 3.3 核心功能
- Gateway 服务器
- 插件系统 (plugin-sdk, registry, runtime)
- Agent 系统 (pi-embedded-runner, tools, model-selection)
- 浏览器自动化 (Playwright)
- 配置管理 / CLI
- 安全 / Secrets 管理
- UI (保留核心 + 飞书 views)
- TTS (保留 MiniMax/Moonshot provider)
- Memory (LanceDB)

---

## 四、依赖耦合风险评估

### 高耦合 (需谨慎处理)

| 被移除模块 | 核心引用点 | 风险等级 | 处理方式 |
|-----------|-----------|---------|---------|
| Telegram | 20+ 核心文件引用 | **高** | 逐文件清理 import, 删除条件分支 |
| Discord | 20+ 核心文件引用 | **高** | 同上 |
| Slack | 18+ 核心文件引用 | **高** | 同上, 注意 plugin-sdk/slack.ts |
| WhatsApp | 16+ 核心文件引用 | **高** | 含 Baileys 引擎, plugin-sdk 引用 |
| Tailscale | 20+ 核心文件引用 | **高** | 网关配置/安全检查多处依赖 |

### 中耦合

| 被移除模块 | 核心引用点 | 风险等级 | 处理方式 |
|-----------|-----------|---------|---------|
| iMessage | 5 核心文件 | **中** | 较独立, 清理简单 |
| Signal | 4 核心文件 | **中** | 同上 |
| Voice Call | 3 核心文件 | **中** | 主要通过 plugin 注册 |

### 低耦合 (安全移除)

| 被移除模块 | 说明 |
|-----------|------|
| Matrix/Nostr/Tlon/IRC/Twitch | 纯扩展, 通过 plugin 机制注册, 无核心引用 |
| Zalo/LINE | 扩展 + 独立 src 目录, 耦合低 |
| Lobster/Open-Prose | 纯扩展 |
| Venice/Together/HuggingFace 等 | 独立模型文件, 通过配置注册 |
| BlueBubbles/Synology/Nextcloud/Mattermost | 纯扩展 |

---

## 五、执行计划

### 阶段 0: 准备 (预计 0.5 天)

| 步骤 | 操作 | 说明 |
|------|------|------|
| 0.1 | 创建 `china` 分支 | `git checkout -b china` |
| 0.2 | 全量构建验证 | 确保裁剪前 `build` + `test` 全部通过 |
| 0.3 | 记录基线指标 | 文件数、行数、构建时间、包体积 |

### 阶段 1: 低风险扩展移除 (预计 1 天)

按耦合度从低到高, 逐批移除纯扩展。每批后运行构建验证。

| 批次 | 移除目标 | 行数 | 操作 |
|------|---------|------|------|
| 1.1 | `extensions/nostr/` | 3,396 | `rm -rf` + 删除 UI views |
| 1.2 | `extensions/tlon/` | 6,222 | `rm -rf` |
| 1.3 | `extensions/twitch/` | 3,137 | `rm -rf` |
| 1.4 | `extensions/irc/` | 2,982 | `rm -rf` |
| 1.5 | `extensions/matrix/` | 7,515 | `rm -rf` |
| 1.6 | `extensions/zalo/` + `extensions/zalouser/` | 6,982 | `rm -rf` |
| 1.7 | `extensions/lobster/` | 363 | `rm -rf` |
| 1.8 | `extensions/open-prose/` | 5 | `rm -rf` |
| 1.9 | `extensions/synology-chat/` | 1,390 | `rm -rf` |
| 1.10 | `extensions/nextcloud-talk/` | 2,936 | `rm -rf` |
| 1.11 | `extensions/mattermost/` | 6,312 | `rm -rf` |
| 1.12 | `extensions/bluebubbles/` | 7,166 | `rm -rf` |
| **验证** | `npm run build && npm test` | | 确认无编译错误 |
| **提交** | 阶段 1 完成提交 | **~48,406** | |

### 阶段 2: 中风险扩展 + src 独立模块 (预计 1 天)

| 批次 | 移除目标 | 行数 | 操作 |
|------|---------|------|------|
| 2.1 | `extensions/voice-call/` + `extensions/talk-voice/` + `extensions/phone-control/` | 9,741 | `rm -rf` + 清理 plugin-sdk/voice-call.ts |
| 2.2 | `extensions/line/` + `src/line/` | 7,092 | `rm -rf` + 清理 channels/dock.ts 等引用 |
| 2.3 | `extensions/imessage/` + `src/imessage/` | 2,811 | `rm -rf` + 清理 onboarding/outbound/normalize |
| 2.4 | `extensions/signal/` | 356 | `rm -rf` + 清理 onboarding/outbound/normalize |
| 2.5 | `extensions/copilot-proxy/` + `extensions/google-gemini-cli-auth/` | 963 | `rm -rf` |
| 2.6 | `extensions/device-pair/` | 1,009 | `rm -rf` + 清理 plugin-sdk/device-pair.ts |
| 2.7 | 提供商文件 (venice/together/huggingface/opencode-zen/synthetic/chutes) | 1,813 | 删除文件 + 清理 models-config.providers.ts 中的引用 |
| 2.8 | Copilot 提供商 (github-copilot-*.ts) | 428 | 删除文件 + 清理 onboard-auth 引用 |
| **验证** | `npm run build && npm test` | | |
| **提交** | 阶段 2 完成提交 | **~24,213** | |

### 阶段 3: 高耦合渠道移除 (预计 2 天)

这是最复杂的阶段, 每个渠道都有大量核心代码引用。逐个渠道处理。

| 批次 | 移除目标 | 行数 | 关键操作 |
|------|---------|------|---------|
| 3.1 | **WhatsApp** | 7,071 | ① `rm -rf extensions/whatsapp/ src/web/` ② 清理 `src/channels/plugins/{onboarding,outbound,normalize}/whatsapp.ts` ③ 清理 `src/agents/tools/whatsapp-*.ts` ④ 清理 `src/plugin-sdk/whatsapp.ts` ⑤ 清理 `src/plugins/runtime/runtime-whatsapp.ts` ⑥ 从 `ENVELOPE_CHANNELS` 移除 ⑦ 清理 `src/config/types.channels.ts` 和 `src/config/types.ts` 中 WhatsApp 配置 |
| 3.2 | **Telegram** | 15,852 | ① `rm -rf extensions/telegram/ src/telegram/` ② 清理 `src/channels/plugins/` 三目录 ③ 清理 `src/agents/tools/telegram-actions.ts` ④ 清理 `src/auto-reply/reply/telegram-context.ts` ⑤ 清理 `src/cli/deps-send-telegram.runtime.ts` ⑥ 清理所有 20+ 核心引用文件中的 Telegram 条件分支 |
| 3.3 | **Discord** | 24,303 | ① `rm -rf extensions/discord/ src/discord/` ② 清理 `src/agents/tools/discord-actions*.ts` (6 files) ③ 清理 `src/channels/plugins/` 三目录 ④ 清理 `src/cli/deps-send-discord.runtime.ts` ⑤ 清理 `src/config/types.channels.ts` |
| 3.4 | **Slack** | 11,194 | ① `rm -rf extensions/slack/ src/slack/` ② 清理 `src/plugin-sdk/slack*.ts` ③ 清理 `src/channels/plugins/` 三目录 ④ 清理 `src/agents/tools/slack-actions.ts` ⑤ 清理 `src/cli/deps-send-slack.runtime.ts` |
| 3.5 | **Google Chat** | 2,993 | ① `rm -rf extensions/googlechat/` ② 清理 UI view |
| 3.6 | **MS Teams** | 7,910 | ① `rm -rf extensions/msteams/` |
| **验证** | 每个渠道移除后单独 `build` 验证 | | |
| **提交** | 阶段 3 完成提交 | **~69,323** | |

### 阶段 4: Tailscale 清理 + 全局引用修复 (预计 1 天)

| 批次 | 操作 | 说明 |
|------|------|------|
| 4.1 | 移除 Tailscale 模块 | 删除 `src/infra/tailscale.ts`, `src/infra/tailnet.ts`, `src/shared/tailscale-status.ts` |
| 4.2 | 清理 20+ 引用文件 | 逐文件处理: 移除 Tailscale 条件分支, 保留非 Tailscale 的网关逻辑 |
| 4.3 | 清理 `ENVELOPE_CHANNELS` | 从列表中移除已删除渠道 |
| 4.4 | 清理 `CHANNEL_SUBSYSTEM_PREFIXES` | `src/logging/subsystem.ts` 中移除已删除渠道 |
| 4.5 | 清理 `VOICE_BUBBLE_CHANNELS` | `src/tts/tts.ts` 中移除 telegram/whatsapp, 保留 feishu |
| 4.6 | 清理 `PROVIDER_LABELS` / `usageProviders` | `src/infra/provider-usage.shared.ts` 中移除 copilot/zai |
| 4.7 | 清理 UI 渠道视图 | 移除所有已删除渠道的 UI views, 更新 `channels.ts` 主文件 |
| 4.8 | 清理 `src/config/types.channels.ts` | 移除所有已删除渠道的类型定义 |
| 4.9 | 清理 `src/commands/onboard-auth.config-core.ts` | 移除已删除提供商的 apply 函数引用 |
| 4.10 | 清理 `src/agents/models-config.providers.ts` | 移除 venice/together/huggingface 等 provider builder 和 import |
| **验证** | 完整 `build` + `test` | |
| **提交** | 阶段 4 完成提交 | |

### 阶段 5: 依赖清理 + 最终验证 (预计 0.5 天)

| 步骤 | 操作 | 说明 |
|------|------|------|
| 5.1 | 清理 `package.json` | 移除不再需要的 npm 依赖: `@whiskeysockets/baileys`, `@line/bot-sdk`, `discord.js`, `slack-bolt`, `twilio`, `@larksuiteoapi/node-sdk`(保留), etc. |
| 5.2 | 重新安装依赖 | `rm -rf node_modules && npm install` |
| 5.3 | 清理 plugin allowlist | `src/config/plugins-allowlist.ts` 中移除已删除插件 |
| 5.4 | 全量构建 | `npm run build` |
| 5.5 | 全量测试 | `npm test` |
| 5.6 | 人工冒烟测试 | 启动 gateway, 验证飞书 + WebChat + 国产模型正常工作 |
| 5.7 | 记录裁剪后指标 | 对比基线: 文件数、行数、构建时间、包体积 |

---

## 六、关键注意事项

### 6.1 不可直接 rm 的文件

以下核心文件包含多渠道混合逻辑, 需要**编辑**而非删除:

| 文件 | 说明 |
|------|------|
| `src/channels/dock.ts` | 渠道注册中心, 需移除已删除渠道的条目 |
| `src/commands/onboarding/registry.ts` | 引导注册, 需移除已删除渠道 |
| `src/config/types.channels.ts` | 渠道类型定义, 需移除已删除渠道 |
| `src/config/types.ts` | 主配置类型, 含渠道字段 |
| `src/cli/deps.ts` | CLI 依赖注册, 含各渠道 lazy import |
| `src/plugin-sdk/index.ts` | SDK 入口, 需移除已删除渠道导出 |
| `src/plugins/runtime/runtime-channel.ts` | 运行时渠道注册 |
| `src/shared/chat-envelope.ts` | 消息信封, 需更新 ENVELOPE_CHANNELS |
| `src/logging/subsystem.ts` | 日志子系统, 需更新 CHANNEL_SUBSYSTEM_PREFIXES |
| `src/auto-reply/reply/commands-allowlist.ts` | 自动回复白名单 |
| `src/auto-reply/reply/commands-session.ts` | 会话命令 |
| `src/agents/models-config.providers.ts` | 模型提供商配置 (最复杂) |
| `src/commands/onboard-auth.config-core.ts` | 认证配置 (571 行, 多处引用已删除提供商) |
| `ui/src/ui/views/channels.ts` | UI 渠道主视图 |

### 6.2 Tailscale 替换建议

Tailscale 在 OpenClaw 中用于:
- 内网穿透 (expose gateway)
- 设备身份认证 (whois)
- 安全通信 (TLS on tailnet)

中国替代方案:
- **FRP** — 内网穿透
- **ZeroTier** — P2P 组网 (需自建 Planet)
- **WireGuard** — 底层 VPN

建议: 阶段 4 先将 Tailscale 功能 stub 化 (返回空值/disabled), 后续再实现替代方案。

### 6.3 可选: 未来可添加的中国渠道

| 渠道 | 优先级 | 说明 |
|------|--------|------|
| 钉钉 (DingTalk) | P0 | 中国企业 Top 3 办公平台 |
| 企业微信 (WeCom) | P0 | 中国企业 Top 3 办公平台 |
| 微信公众号 (WeChat Official) | P1 | 面向 C 端触达 |

---

## 七、风险与回退

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| 编译错误连锁 | 高 | 中 | 每批次构建验证, 发现问题立即修复 |
| 隐式运行时依赖 | 中 | 高 | plugin 系统动态加载, 需运行时验证 |
| 上游合并冲突 | 高 | 中 | 保持 china 分支定期 rebase, 记录所有修改点 |
| 遗漏引用导致运行时崩溃 | 中 | 高 | 全量测试 + 人工冒烟测试 |

**回退方案**: 每个阶段独立提交, 可按阶段粒度 `git revert`。

---

## 八、工时估算

| 阶段 | 内容 | 预估工时 |
|------|------|---------|
| 阶段 0 | 准备 | 0.5 天 |
| 阶段 1 | 低风险扩展移除 | 1 天 |
| 阶段 2 | 中风险扩展 + 独立模块 | 1 天 |
| 阶段 3 | 高耦合渠道移除 | 2 天 |
| 阶段 4 | Tailscale + 全局引用修复 | 1 天 |
| 阶段 5 | 依赖清理 + 最终验证 | 0.5 天 |
| **合计** | | **6 天** |

> 注: 以上为 Claude Code 辅助执行的估算。人工执行可能需要 2-3 倍时间。
