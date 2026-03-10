# OpenClaw 中国特别优化版开发进度追踪表

> 最后更新: 2026-03-09
> 状态图例: ⏳ 未开始 | 🔄 进行中 | ✅ 已完成 | ⏸️ 暂停 | ❌ 已取消

---

## 项目概述

**OpenClaw 中国版** = 基于 OpenCode 架构的轻量级智能个人助手 + 开放 Agent 生态

### 核心理念

打造轻量、安全、适合中国用户的智能个人助理，用户表达需求，系统自动匹配并调用合适的 Agent

### 技术架构

**基础框架**: OpenCode (已 Fork 并优化)
- 代码规模：1,491 文件 / 25K 行代码
- 已集成 oh-my-openagent 插件（Category-based routing + Agent 编排）
- 已统一 MCP Skill Tool 调用栈（移除 legacy plugin skill tool）
- 已实现 Capability 系统（per-agent 工具可见性控制）

**后端能力**（OpenCode 直接复用）:
- Agent 系统：tools + permissions + prompt + capabilities
- 权限系统：规则链 (allow/deny/ask) + wildcard pattern matching
- Session/LLM 循环：流式处理 + doom loop 检测
- Tool 系统：Zod 校验 + 权限前置过滤
- Subagent：子 session 模式，权限隔离
- MCP 集成：统一调用栈
- Gateway 基础：HTTP + WebSocket + SSE + mDNS

**后端缺失功能**（需从 OpenClaw 移植）:
- **Agent 高级功能**（约 70%）：Elevated + Sandbox + FS 守卫 + LoopDetection 等
- **Gateway 高级功能**（约 85%）：Channels + Nodes + Device Pairing + TLS + Broadcast 等

**前端能力**（OpenCode 直接复用）:
- SolidJS 框架：响应式、高性能
- 会话管理：消息流渲染、工具调用展示
- 多端支持：Web + Desktop (Tauri) 已验证
- 组件库：Kobalte UI

**新增能力**（需开发）:
- Agent Registry：中心化注册表（5-7 天）
- Discovery Engine：智能匹配 + 知识图谱增强（7-10 天）
- Auto Rating：自动评分系统（3-5 天）
- Knowledge Graph：Manon + Lumen 集成（3-5 天）
- Agent 高级功能：Elevated + Sandbox + FS 守卫等（3 周）

### 产品定位

- **对标**：Coze（字节）、Dify
- **差异化**：开放生态 + MCP 原生支持 + 多模型编排 + 自有算力（H200）
- **默认模型**：glm-4.7-fp8（开箱即用）
- **内置 Agent**：代码助手（Manon）+ 文档写作（Lumen）+ 信息搜集 + 数据分析

---

## 开发计划

### Phase 0: 项目初始化（第 1 周）

**目标**: 项目初始化 + 品牌调整

| 任务 ID | 任务名称 | 状态 | 工期 | 备注 |
|---------|---------|------|------|------|
| P0-1 | 技术路线确定 | ✅ | - | 基于 OpenCode 构建 |
| P0-2 | OpenCode Fork 优化 | ✅ | - | 已集成 oh-my-openagent + 统一 MCP 调用栈 |
| P0-3 | 项目初始化 | ⏳ | 2 天 | 品牌调整 + 配置 |
| P0-4 | 开发环境搭建 | ⏳ | 1 天 | 依赖安装 + 构建验证 |

---

### Phase 1: 核心开发（第 2-12 周，11 周）

**目标**: 开发 4 个新模块 + Agent 高级功能移植 + 扩展前端 + 内置 Agent

#### 1.1 后端新增模块（6 周）

| 任务 ID | 任务名称 | 状态 | 工期 | 备注 |
|---------|---------|------|------|------|
| P1-BE-1 | Agent Registry | ⏳ | 5-7 天 | 中心化注册表，存储 Agent 元信息 |
| P1-BE-2 | Discovery Engine | ⏳ | 7-10 天 | 语义搜索 + 能力匹配 + 知识图谱增强 |
| P1-BE-3 | Auto Rating | ⏳ | 3-5 天 | 根据执行结果自动评分 |
| P1-BE-4 | Knowledge Graph | ⏳ | 3-5 天 | Manon (代码) + Lumen (文档) MCP Server |
| P1-BE-5 | Category Resolver | ⏳ | 2-3 天 | 扩展 oh-my-openagent，category → model mapping |
| P1-BE-6 | User System | ⏳ | 3-5 天 | 注册/登录 (JWT) + 用户管理 |

#### 1.2 Agent 高级功能移植（3 周）

| 任务 ID | 任务名称 | 状态 | 优先级 | 工期 | 备注 |
|---------|---------|------|--------|------|------|
| P1-AG-ADV-1 | Elevated 提权系统 | ⏳ | P0 | 3-4 天 | allowFrom 机制，按渠道/用户控制 |
| P1-AG-ADV-2 | ByProvider 工具策略 | ⏳ | P1 | 2-3 天 | 按模型提供商覆盖工具配置 |
| P1-AG-ADV-3 | Exec 工具配置 | ⏳ | P1 | 2 天 | timeout, workspaceOnly 等 |
| P1-AG-ADV-4 | FS 路径守卫 | ⏳ | P0 | 2-3 天 | 文件系统工具路径限制 |
| P1-AG-ADV-5 | LoopDetection | ⏳ | P1 | 2-3 天 | 工具调用循环检测和中断 |
| P1-AG-ADV-6 | Sandbox 完整配置 | ⏳ | P0 | 4-5 天 | network, filesystem, tools 隔离 |
| P1-AG-ADV-7 | MemorySearch 向量搜索 | ⏳ | P2 | 5-7 天 | embedding, chunking, store（可选） |
| P1-AG-ADV-8 | HumanDelay/Heartbeat | ⏳ | P2 | 1-2 天 | 人工延迟和心跳（可选） |
| P1-AG-ADV-9 | Identity/GroupChat | ⏳ | P2 | 2-3 天 | Agent 身份和群聊（可选） |

#### 1.3 前端扩展（2 周）

| 任务 ID | 任务名称 | 状态 | 工期 | 备注 |
|---------|---------|------|------|------|
| P1-FE-1 | 项目初始化 | ⏳ | 1 天 | 基于 OpenCode packages/app |
| P1-FE-2 | 对话页面 | ⏳ | 2 天 | 复用 OpenCode 会话管理 |
| P1-FE-3 | 会话列表 | ⏳ | 1 天 | 复用 OpenCode 组件 |
| P1-FE-4 | Agent Registry 页面 | ⏳ | 3 天 | Agent 列表 + 详情 + 评分 |
| P1-FE-5 | Discovery 可视化 | ⏳ | 2 天 | 匹配过程时间线 |
| P1-FE-6 | 调用历史页面 | ⏳ | 2 天 | Agent 调用链路追踪 |
| P1-FE-7 | 知识图谱展示 | ⏳ | 2 天 | Manon/Lumen 调用可视化 |
| P1-FE-8 | 登录注册 | ⏳ | 1 天 | 登录表单 + Token 管理 |
| P1-FE-9 | 设置页面 | ⏳ | 1 天 | 模型配置、账户设置 |
| P1-FE-10 | 共享逻辑抽取 | ⏳ | 2 天 | @openclaw/shared 包 |

#### 1.4 内置 Agent 开发（2 周）

| 任务 ID | 任务名称 | 状态 | 优先级 | 工期 | 备注 |
|---------|---------|------|--------|------|------|
| P1-AG-1 | 信息搜集 Agent | ⏳ | P1 | 3 天 | Exa/Tavily 搜索 + 网页抓取 |
| P1-AG-2 | 文档写作 Agent | ⏳ | P0 | 3 天 | 基于 Lumen 知识图谱 |
| P1-AG-3 | 代码助手 Agent | ⏳ | P0 | 4 天 | 基于 Manon 知识图谱 |
| P1-AG-4 | 数据分析 Agent | ⏳ | P2 | 3 天 | CSV/Excel 处理（可选） |

#### 1.5 模型对接（1 周）

| 任务 ID | 任务名称 | 状态 | 工期 | 备注 |
|---------|---------|------|------|------|
| P1-ML-1 | 配置 glm-4.7-fp8 | ⏳ | 1 天 | 默认模型 |
| P1-ML-2 | 验证 Qwen tool_use | ⏳ | 1 天 | 用户可选模型 |
| P1-ML-3 | 验证 Kimi tool_use | ⏳ | 1 天 | 用户可选模型 |
| P1-ML-4 | 验证 MiniMax tool_use | ⏳ | 1 天 | 用户可选模型 |
| P1-ML-5 | Category 配置 | ⏳ | 1 天 | Fallback chain |

**实施顺序**:
```
Week 2:    项目初始化 + 模型配置
Week 3:    Agent Registry + Knowledge Graph + 信息搜集 Agent
Week 4-5:  Discovery Engine
Week 6:    代码助手 + 文档写作 Agent
Week 7-8:  Agent 高级功能移植（Elevated + Sandbox + FS 守卫 + LoopDetection）
Week 9:    Agent 高级功能移植（ByProvider + Exec + 可选功能）
Week 10:   Auto Rating + 前端基础（对话页 + 会话列表）
Week 11:   前端扩展（Agent Registry + Discovery + 调用历史）
Week 12:   User System + 登录注册 + 设置页 + 集成测试
```

**里程碑**:
- Week 3: Agent Registry + 知识图谱集成完成
- Week 5: 智能路由端到端可用
- Week 6: 基于知识图谱的核心 Agent 可用
- Week 9: Agent 高级功能移植完成
- Week 12: Phase 1 完整可用

---

### Phase 2: 功能迁移（第 13-21 周，9 周）

**目标**: 迁移 OpenClaw 必要功能 + Gateway 增强 + 开发迁移工具

#### 2.1 Gateway 功能增强（4-5 周）

| 任务 ID | 任务名称 | 状态 | 优先级 | 工期 | 备注 |
|---------|---------|------|--------|------|------|
| P2-GW-1 | Channels 系统 | ⏳ | P0 | 5-7 天 | 多渠道接入（飞书、WhatsApp 等） |
| P2-GW-2 | Nodes Registry | ⏳ | P0 | 3-4 天 | 多端连接管理 + Presence 同步 |
| P2-GW-3 | Device Pairing | ⏳ | P0 | 3-4 天 | 设备配对认证 + Setup Code |
| P2-GW-4 | TLS 支持 | ⏳ | P0 | 2-3 天 | 企业级 TLS/SSL 配置 |
| P2-GW-5 | Broadcast 系统 | ⏳ | P0 | 2-3 天 | 消息广播到所有节点 |
| P2-GW-6 | Auth Rate Limiting | ⏳ | P1 | 2 天 | 认证速率限制 |
| P2-GW-7 | Health Monitor | ⏳ | P1 | 2 天 | 健康检查和监控 |
| P2-GW-8 | Config Reload | ⏳ | P1 | 1-2 天 | 热重载配置 |
| P2-GW-9 | Cron Service | ⏳ | P1 | 2-3 天 | 定时任务调度 |
| P2-GW-10 | Remote Skills | ⏳ | P1 | 2-3 天 | 远程技能同步 |

#### 2.2 OpenClaw 功能迁移（2 周）

| 任务 ID | 任务名称 | 状态 | 工期 | 备注 |
|---------|---------|------|------|------|
| P2-MIG-1 | 飞书渠道迁移 | ⏳ | 3-5 天 | 作为 Extension 移植 |
| P2-MIG-2 | Plugins 系统移植 | ⏳ | 5-7 天 | 简化移植，参考 OpenCode Plugin 接口 |
| P2-MIG-3 | Hooks 系统移植 | ⏳ | 2-3 天 | 扩展 OpenCode 可扩展性 |
| P2-MIG-4 | Extensions 评估 | ⏳ | 3-5 天 | memory-core 等按需移植 |

#### 2.3 迁移工具开发（2 周）

| 任务 ID | 任务名称 | 状态 | 工期 | 备注 |
|---------|---------|------|------|------|
| P2-TOOL-1 | 配置迁移工具 | ⏳ | 2-3 天 | openclaw-migrate config |
| P2-TOOL-2 | 数据迁移工具 | ⏳ | 3-5 天 | 会话历史、Agent 状态转换 |
| P2-TOOL-3 | 迁移 CLI 开发 | ⏳ | 2-3 天 | check/config/sessions/verify 命令 |
| P2-TOOL-4 | 迁移文档编写 | ⏳ | 3-5 天 | 迁移指南 + 常见问题 |

#### 2.4 社区过渡准备（1 周）

| 任务 ID | 任务名称 | 状态 | 工期 | 备注 |
|---------|---------|------|------|------|
| P2-COM-1 | RFC 编写与发布 | ⏳ | 2 天 | 《OpenClaw 中国版架构升级计划》 |
| P2-COM-2 | 迁移指南编写 | ⏳ | 3 天 | 为什么迁移、如何迁移、常见问题 |
| P2-COM-3 | 视频教程制作 | ⏳ | 3 天 | 迁移演示 + 新功能介绍 |
| P2-COM-4 | 开发者文档编写 | ⏳ | 3 天 | 新架构说明 + Plugin/Extension 开发指南 |

---

### Phase 3: Beta 测试与发布（第 22-24 周，3 周）

**目标**: 内测 + 反馈 + 优化 + 正式发布

#### 3.1 Beta 测试（2 周）

| 任务 ID | 任务名称 | 状态 | 备注 |
|---------|---------|------|------|
| P3-BETA-1 | Beta 版本发布 | ⏳ | openclaw-china-beta |
| P3-BETA-2 | 核心用户邀请 | ⏳ | 10-20 个核心用户 |
| P3-BETA-3 | 反馈收集与分析 | ⏳ | Bug 报告 + 功能请求 |
| P3-BETA-4 | 问题修复与优化 | ⏳ | 根据反馈快速迭代 |

#### 3.2 正式发布（1 周）

| 任务 ID | 任务名称 | 状态 | 备注 |
|---------|---------|------|------|
| P3-REL-1 | 发布公告编写 | ⏳ | 博客 + GitHub Release + 社交媒体 |
| P3-REL-2 | 正式版本发布 | ⏳ | v2026.4.0 |
| P3-REL-3 | 社区支持启动 | ⏳ | Discord/微信群实时支持 |
| P3-REL-4 | 旧版本维护计划 | ⏳ | 并行维护 6 个月 |

---

### Phase 4: 多端开发（第 25-33 周，9 周）

**目标**: 移动端 + 桌面端 + 高级功能

#### 4.1 多端开发（5 周）

| 任务 ID | 任务名称 | 状态 | 工期 | 备注 |
|---------|---------|------|------|------|
| P4-APP-1 | 移动端技术评估 | ⏳ | 2-3 天 | Solid Native vs React Native |
| P4-APP-2 | 移动端项目初始化 | ⏳ | 3 天 | 基于评估结果 |
| P4-APP-3 | 移动端核心组件 | ⏳ | 2 周 | 对话页、会话列表 |
| P4-APP-4 | 移动端原生功能 | ⏳ | 1 周 | 推送、生物识别、离线 |
| P4-APP-5 | iOS 上架 | ⏳ | 1 周 | App Store + TestFlight |
| P4-APP-6 | Android 上架 | ⏳ | 3 天 | 应用商店发布 |
| P4-APP-7 | 桌面端适配 | ⏳ | 3 天 | 直接复用 OpenCode Tauri |
| P4-APP-8 | 桌面端打包 | ⏳ | 2 天 | macOS + Windows 安装包 |

#### 4.2 高级功能（4 周）

| 任务 ID | 任务名称 | 状态 | 备注 |
|---------|---------|------|------|
| P4-ADV-1 | Planning-Execution 分离 | ⏳ | 复杂任务分解执行 |
| P4-ADV-2 | Subagent 增强 | ⏳ | 扩展 OpenCode TaskTool |
| P4-ADV-3 | Learning Extractor | ⏳ | 跨任务学习传递 |
| P4-ADV-4 | Agent 记忆系统 | ⏳ | 跨会话记住用户偏好 |
| P4-ADV-5 | Agent 监控面板 | ⏳ | 调用链路追踪、Token 消耗 |

---

### Phase 5: Agent 生态建设（第 34-47 周，14 周）

**目标**: Agent 市场 + 开发者生态 + 生态成熟

#### 5.1 Agent 市场平台（6 周）

| 任务 ID | 任务名称 | 状态 | 备注 |
|---------|---------|------|------|
| P5-MKT-1 | Agent 存储 | ⏳ | 数据库设计 + 版本管理 |
| P5-MKT-2 | 发布/审核 API | ⏳ | 开发者上传 + 平台审核 |
| P5-MKT-3 | 搜索/推荐 | ⏳ | Agent 检索和推荐算法 |
| P5-MKT-4 | 开发者控制台 | ⏳ | 上传 Agent、查看统计 |
| P5-MKT-5 | 评分/评论系统 | ⏳ | 用户反馈和评分 |
| P5-MKT-6 | Agent 分类/标签 | ⏳ | 按功能分类 |

#### 5.2 开发者生态（4 周）

| 任务 ID | 任务名称 | 状态 | 备注 |
|---------|---------|------|------|
| P5-DEV-1 | 开发者注册体系 | ⏳ | 开发者认证、协议签署 |
| P5-DEV-2 | Agent 开发 SDK + CLI | ⏳ | 开发指南 + 示例代码 |
| P5-DEV-3 | Agent 包审核流程 | ⏳ | 自动化检测 + 人工审核 |
| P5-DEV-4 | 开发者激励机制 | ⏳ | 按调用量排名 + 推荐奖励 |
| P5-DEV-5 | 社区论坛 | ⏳ | 开发者交流、问题反馈 |

#### 5.3 生态成熟（4 周）

| 任务 ID | 任务名称 | 状态 | 备注 |
|---------|---------|------|------|
| P5-ECO-1 | Agent 协作机制 | ⏳ | Agent 之间互相调用 |
| P5-ECO-2 | Agent 模拟器 | ⏳ | 本地测试 Agent |
| P5-ECO-3 | 可视化 Agent 编排器 | ⏳ | 拖拽式组合 Agent |
| P5-ECO-4 | Agent 版本管理 | ⏳ | 支持更新、回滚 |
| P5-ECO-5 | Agent 数据隔离 | ⏳ | 独立数据存储空间 |

---

## 里程碑

| 里程碑 | 目标日期 | 标志事件 | 状态 |
|--------|---------|---------|------|
| M0: 项目初始化 | 第 1 周 | OpenCode Fork 优化 + 品牌调整完成 | 🔄 |
| M1: 核心开发完成 | 第 12 周 | 4 个新模块 + Agent 高级功能 + 前端扩展 + 2-3 个内置 Agent | ⏳ |
| M2: 功能迁移完成 | 第 21 周 | Gateway 增强 + 飞书渠道 + Plugins + 迁移工具 | ⏳ |
| M3: 正式发布 | 第 24 周 | v2026.6.0 发布，200+ 内测用户 | ⏳ |
| M4: 多端发布 | 第 33 周 | iOS + Android + Desktop 可下载 | ⏳ |
| M5: 生态成熟 | 第 47 周 | Agent 市场上线，100+ Agent，50+ 开发者 | ⏳ |

---

## 变更记录

| 日期 | 变更内容 | 变更人 |
|------|---------|--------|
| 2026-03-07 | 初始版本创建 | Claude |
| 2026-03-09 | **技术路线确定**: 基于 OpenCode 构建 OpenClaw 中国版 | Claude |
| 2026-03-09 | **OpenCode 现状**: 已 Fork 并优化（oh-my-openagent 已集成，MCP 调用栈已统一） | Claude |
| 2026-03-09 | **Phase 规划**: P0 初始化（1周）+ P1 核心开发（11周）+ P2 功能迁移（9周）+ P3 Beta测试（3周）+ P4 多端开发（9周）+ P5 生态建设（14周） | Claude |
| 2026-03-09 | **总工期**: 47 周（约 11.5 个月） | Claude |
| 2026-03-09 | 文档简化：移除对比分析，直接呈现最终方案和计划安排 | Claude |
| 2026-03-09 | **P0-2 完成**: OpenCode Fork 优化完成（oh-my-openagent 集成 + MCP 统一 + Capability 系统） | Claude |
| 2026-03-09 | **Agent 功能评估**: OpenCode 仅移植 30% OpenClaw agent 功能，补充 9 个高级功能任务（3 周） | Claude |
| 2026-03-09 | **Gateway 功能评估**: OpenCode Server 仅 15% OpenClaw Gateway 功能，补充 10 个增强任务（4-5 周） | Claude |
| 2026-03-09 | **Phase 调整**: P1 从 8 周延长至 11 周，P2 从 5 周延长至 9 周，总工期从 40 周调整至 47 周 | Claude |

---

*本文档将在每个任务完成后更新，记录实际进度和遇到的问题*
