# OpenClaw 中国特别优化版开发进度追踪表

> 最后更新: 2026-03-09
> 状态图例: ⏳ 未开始 | 🔄 进行中 | ✅ 已完成 | ⏸️ 暂停 | ❌ 已取消

---

## 项目概述

**OpenClaw 中国版** = 基于 OpenClaw 架构的轻量级智能个人助手 + 开放 Agent 生态

**核心理念**：打造轻量、安全、适合中国用户的智能个人助理，用户表达需求，系统自动匹配并调用合适的 Agent

### 产品定位

- **对标**：Coze（字节）、Dify
- **差异化**：开放生态 + MCP 原生支持 + 多模型编排 + 自有算力（H200）
- **默认模型**：glm-4.7-fp8（开箱即用）
- **内置 Agent**：代码助手（Manon）+ 文档写作（Lumen）+ 信息搜集 + 数据分析

### 技术架构

**基础框架**: OpenClaw (生产环境验证 + 已完成代码瘦身)
- 代码规模：~2,700 文件 / ~470K 行代码（已从 612K 行优化至 470K 行）
- 核心业务逻辑：auto-reply 系统（180 文件）
- 企业级功能：secrets、security、browser
- **记忆系统**：91 文件 / 18K+ 行，向量搜索 + FTS + 会话记忆（MEMORY.md + memory/*.md）
- 多渠道接入：飞书（Feishu）+ WebChat
- Gateway：193 文件，企业级网关

**需要增强的能力**（20%）:
- oh-my-openagent：Category-based routing + Agent 编排
- Capability 系统：Per-agent 工具可见性控制
- MCP 统一调用栈：统一 MCP Skill Tool
- 前端 SolidJS：多端支持（Web + Desktop + Mobile）
- Agent Registry：中心化注册表
- Discovery Engine：智能匹配 + 知识图谱增强
- Auto Rating：自动评分系统
- Knowledge Graph：Manon + Lumen 集成

---

## 开发规范

### 核心原则

**TDD 驱动开发**：
- 所有新功能必须先写测试，后写实现
- 测试覆盖率要求：核心模块 ≥ 80%，工具函数 ≥ 90%
- 每个 PR 必须包含对应的测试用例
- 禁止提交未通过测试的代码

**Manon 知识图谱强制使用**：
- 修改任何现有代码前，必须使用 `manon_graph` 查询调用关系
- 重构模块前，必须使用 `manon_search` 了解模块职责和依赖
- 删除代码前，必须使用 `manon_impact` 评估影响范围
- 每次改动后，使用 `manon_code_health` 验证代码健康度未下降

**代码质量要求**：
- TypeScript 严格模式，禁止使用 `any`（除非有充分理由并注释说明）
- 所有公共 API 必须有 JSDoc 注释
- 复杂逻辑必须有行内注释说明意图
- 遵循现有代码风格，使用项目配置的 ESLint/Prettier

**变更管理**：
- 每个功能独立分支开发，命名规范：`feature/P{phase}-{task-id}-{description}`
- Commit 信息遵循 Conventional Commits 规范
- PR 标题格式：`[P{phase}] {task-id}: {description}`
- 每个 PR 必须关联对应的任务 ID

### 开发流程

**1. 需求分析阶段**：
```bash
# 使用 Manon 了解相关模块
manon_search "相关功能关键词"
manon_graph "核心类或函数" --depth 2

# 阅读相关代码和测试
# 确认技术方案和接口设计
```

**2. 测试编写阶段**：
```typescript
// 先写测试用例，明确预期行为
describe('NewFeature', () => {
  it('should handle basic case', () => {
    // Arrange
    // Act
    // Assert
  });

  it('should handle edge cases', () => {
    // ...
  });
});
```

**3. 实现阶段**：
```bash
# 实现功能，确保测试通过
npm test -- --watch

# 使用 Manon 验证改动影响
manon_impact HEAD
manon_code_health
```

**4. 代码审查阶段**：
- 自查清单：
  - [ ] 所有测试通过
  - [ ] 代码覆盖率达标
  - [ ] 使用 Manon 验证无意外影响
  - [ ] 代码健康度未下降
  - [ ] 文档已更新
  - [ ] Commit 信息规范

**5. 集成验证阶段**：
```bash
# 完整构建和测试
npm run build
npm test
npm run lint

# 端到端测试（如适用）
npm run test:e2e
```

### 特殊场景规范

**重构现有代码**：
1. 使用 `manon_graph` 绘制完整调用图
2. 识别所有调用方和被调用方
3. 先写回归测试覆盖现有行为
4. 小步重构，每步都确保测试通过
5. 使用 `manon_impact` 验证影响范围

**集成 OpenCode 功能**：
1. 在 OpenCode 仓库中使用 Manon 分析源模块
2. 在 OpenClaw 仓库中使用 Manon 分析目标位置
3. 识别接口差异和依赖冲突
4. 编写适配层测试
5. 逐步迁移，保持双向兼容

**性能优化**：
1. 先写性能基准测试
2. 使用 profiler 定位瓶颈
3. 优化后对比基准测试
4. 确保功能测试仍然通过

**安全修复**：
1. 先写复现漏洞的测试（标记为 skip）
2. 修复漏洞
3. 取消 skip，确保测试通过
4. 添加回归测试防止再次引入

### 禁止事项

- ❌ 未经 Manon 分析直接修改核心模块
- ❌ 跳过测试直接提交代码
- ❌ 使用 `git commit --no-verify` 绕过 hooks
- ❌ 在 PR 中混合多个不相关的改动
- ❌ 直接在 main 分支提交代码
- ❌ 删除现有测试以"修复"失败
- ❌ 提交包含 `console.log` 的调试代码
- ❌ 硬编码敏感信息（API key、密码等）

---

## 开发计划

### Phase 0: 架构增强（第 1-9 周，9 周）

**目标**: 移植 OpenCode 优势功能 + 品牌调整

#### 0.1 oh-my-openagent 集成（2-3 周）

| 任务 ID | 任务名称 | 状态 | 工期 | 备注 |
|---------|---------|------|------|------|
| P0-OMO-1 | Category 系统集成 | ⏳ | 3 天 | Category-based routing |
| P0-OMO-2 | Agent 编排集成 | ⏳ | 3 天 | Dynamic agent prompt builder |
| P0-OMO-3 | 模型 Fallback 链 | ⏳ | 2 天 | Category → model mapping |
| P0-OMO-4 | Subagent 增强 | ⏳ | 2 天 | 扩展 OpenClaw TaskTool |
| P0-OMO-5 | 配置迁移 | ⏳ | 2 天 | 兼容 OpenClaw 配置格式 |
| P0-OMO-6 | 测试验证 | ⏳ | 2 天 | 端到端测试 |

#### 0.2 Capability 系统集成（1-2 周）

| 任务 ID | 任务名称 | 状态 | 工期 | 备注 |
|---------|---------|------|------|------|
| P0-CAP-1 | Capability Registry | ⏳ | 2 天 | 统一能力注册表 |
| P0-CAP-2 | Tag 系统 | ⏳ | 1 天 | core, edit, search, delegation 等 |
| P0-CAP-3 | Resolver 集成 | ⏳ | 2 天 | Tag/ID/MCP 过滤逻辑 |
| P0-CAP-4 | Agent 配置扩展 | ⏳ | 2 天 | Agent.capabilities 字段 |
| P0-CAP-5 | 权限系统兼容 | ⏳ | 2 天 | 与 OpenClaw 权限系统整合 |

#### 0.3 MCP 统一调用栈（1 周）

| 任务 ID | 任务名称 | 状态 | 工期 | 备注 |
|---------|---------|------|------|------|
| P0-MCP-1 | Skill Tool 统一 | ⏳ | 2 天 | 移除 legacy plugin skill tool |
| P0-MCP-2 | MCP Server 管理 | ⏳ | 2 天 | 统一 MCP 服务器管理 |
| P0-MCP-3 | Tool Registry 整合 | ⏳ | 1 天 | 统一工具注册 |

#### 0.4 前端 SolidJS 适配（2-3 周）

| 任务 ID | 任务名称 | 状态 | 工期 | 备注 |
|---------|---------|------|------|------|
| P0-FE-1 | 技术栈评估 | ⏳ | 1 天 | SolidJS vs 保留 Lit |
| P0-FE-2 | 核心组件迁移 | ⏳ | 5 天 | 对话页、会话列表 |
| P0-FE-3 | Gateway 集成 | ⏳ | 3 天 | WebSocket + SSE |
| P0-FE-4 | 状态管理 | ⏳ | 2 天 | SolidJS 响应式 |
| P0-FE-5 | UI 组件库 | ⏳ | 3 天 | Kobalte UI 集成 |
| P0-FE-6 | Tauri 桌面端 | ⏳ | 2 天 | 桌面应用打包 |

#### 0.5 品牌调整（1 周）

| 任务 ID | 任务名称 | 状态 | 工期 | 备注 |
|---------|---------|------|------|------|
| P0-BR-1 | 品牌命名确定 | ⏳ | 1 天 | OpenClaw 中国版 |
| P0-BR-2 | Logo 设计 | ⏳ | 2 天 | 视觉识别系统 |
| P0-BR-3 | 配置调整 | ⏳ | 2 天 | 默认配置、文案 |
| P0-BR-4 | 文档更新 | ⏳ | 2 天 | README、用户指南 |

**实施顺序**:
```
Week 1-2:  oh-my-openagent 集成
Week 3:    Capability 系统集成
Week 4:    MCP 统一调用栈
Week 5-7:  前端 SolidJS 适配
Week 8:    品牌调整
Week 9:    集成测试 + Bug 修复
```

---

### Phase 1: 核心功能开发（第 10-17 周，8 周）

**目标**: 开发 4 个新模块 + 内置 Agent

#### 1.1 后端新增模块（6 周）

| 任务 ID | 任务名称 | 状态 | 工期 | 备注 |
|---------|---------|------|------|------|
| P1-BE-1 | Agent Registry | ⏳ | 5-7 天 | 中心化注册表，存储 Agent 元信息 |
| P1-BE-2 | Discovery Engine | ⏳ | 7-10 天 | 语义搜索 + 能力匹配 + 知识图谱增强 |
| P1-BE-3 | Auto Rating | ⏳ | 3-5 天 | 根据执行结果自动评分 |
| P1-BE-4 | Knowledge Graph | ⏳ | 3-5 天 | Manon (代码) + Lumen (文档) MCP Server |
| P1-BE-5 | User System | ⏳ | 3-5 天 | 注册/登录 (JWT) + 用户管理 |

#### 1.2 前端扩展（2 周）

| 任务 ID | 任务名称 | 状态 | 工期 | 备注 |
|---------|---------|------|------|------|
| P1-FE-1 | Agent Registry 页面 | ⏳ | 3 天 | Agent 列表 + 详情 + 评分 |
| P1-FE-2 | Discovery 可视化 | ⏳ | 2 天 | 匹配过程时间线 |
| P1-FE-3 | 调用历史页面 | ⏳ | 2 天 | Agent 调用链路追踪 |
| P1-FE-4 | 知识图谱展示 | ⏳ | 2 天 | Manon/Lumen 调用可视化 |
| P1-FE-5 | 登录注册 | ⏳ | 1 天 | 登录表单 + Token 管理 |
| P1-FE-6 | 设置页面 | ⏳ | 1 天 | 模型配置、账户设置 |

#### 1.3 内置 Agent 开发（2 周）

| 任务 ID | 任务名称 | 状态 | 优先级 | 工期 | 备注 |
|---------|---------|------|--------|------|------|
| P1-AG-1 | 信息搜集 Agent | ⏳ | P1 | 3 天 | Exa/Tavily 搜索 + 网页抓取 |
| P1-AG-2 | 文档写作 Agent | ⏳ | P0 | 3 天 | 基于 Lumen 知识图谱 |
| P1-AG-3 | 代码助手 Agent | ⏳ | P0 | 4 天 | 基于 Manon 知识图谱 |
| P1-AG-4 | 数据分析 Agent | ⏳ | P2 | 3 天 | CSV/Excel 处理（可选） |

#### 1.4 模型对接（1 周）

| 任务 ID | 任务名称 | 状态 | 工期 | 备注 |
|---------|---------|------|------|------|
| P1-ML-1 | 配置 glm-4.7-fp8 | ⏳ | 1 天 | 默认模型 |
| P1-ML-2 | 验证 Qwen tool_use | ⏳ | 1 天 | 用户可选模型 |
| P1-ML-3 | 验证 Kimi tool_use | ⏳ | 1 天 | 用户可选模型 |
| P1-ML-4 | 验证 MiniMax tool_use | ⏳ | 1 天 | 用户可选模型 |
| P1-ML-5 | Category 配置 | ⏳ | 1 天 | Fallback chain |

**实施顺序**:
```
Week 10:   Agent Registry + Knowledge Graph
Week 11-12: Discovery Engine
Week 13:   代码助手 + 文档写作 Agent
Week 14:   Auto Rating + 信息搜集 Agent
Week 15:   User System + 模型对接
Week 16:   前端扩展（Agent Registry + Discovery）
Week 17:   前端扩展（调用历史 + 知识图谱 + 登录）+ 集成测试
```

---

### Phase 2: Beta 测试与发布（第 18-20 周，3 周）

**目标**: 内测 + 反馈 + 优化 + 正式发布

#### 2.1 Beta 测试（2 周）

| 任务 ID | 任务名称 | 状态 | 备注 |
|---------|---------|------|------|
| P2-BETA-1 | Beta 版本发布 | ⏳ | openclaw-china-beta |
| P2-BETA-2 | 核心用户邀请 | ⏳ | 10-20 个核心用户 |
| P2-BETA-3 | 反馈收集与分析 | ⏳ | Bug 报告 + 功能请求 |
| P2-BETA-4 | 问题修复与优化 | ⏳ | 根据反馈快速迭代 |

#### 2.2 正式发布（1 周）

| 任务 ID | 任务名称 | 状态 | 备注 |
|---------|---------|------|------|
| P2-REL-1 | 发布公告编写 | ⏳ | 博客 + GitHub Release + 社交媒体 |
| P2-REL-2 | 正式版本发布 | ⏳ | v2026.5.0 |
| P2-REL-3 | 社区支持启动 | ⏳ | Discord/微信群实时支持 |
| P2-REL-4 | 监控告警配置 | ⏳ | 生产环境监控 |

---

### Phase 3: 多端开发（第 21-29 周，9 周）

**目标**: 移动端 + 桌面端优化 + 高级功能

#### 3.1 多端开发（5 周）

| 任务 ID | 任务名称 | 状态 | 工期 | 备注 |
|---------|---------|------|------|------|
| P3-APP-1 | 移动端技术评估 | ⏳ | 2-3 天 | Solid Native vs React Native |
| P3-APP-2 | 移动端项目初始化 | ⏳ | 3 天 | 基于评估结果 |
| P3-APP-3 | 移动端核心组件 | ⏳ | 2 周 | 对话页、会话列表 |
| P3-APP-4 | 移动端原生功能 | ⏳ | 1 周 | 推送、生物识别、离线 |
| P3-APP-5 | iOS 上架 | ⏳ | 1 周 | App Store + TestFlight |
| P3-APP-6 | Android 上架 | ⏳ | 3 天 | 应用商店发布 |
| P3-APP-7 | 桌面端优化 | ⏳ | 3 天 | Tauri 性能优化 |
| P3-APP-8 | 桌面端打包 | ⏳ | 2 天 | macOS + Windows 安装包 |

#### 3.2 高级功能（4 周）

| 任务 ID | 任务名称 | 状态 | 备注 |
|---------|---------|------|------|
| P3-ADV-1 | Planning-Execution 分离 | ⏳ | 复杂任务分解执行 |
| P3-ADV-2 | Subagent 增强 | ⏳ | 扩展 TaskTool |
| P3-ADV-3 | Learning Extractor | ⏳ | 跨任务学习传递 |
| P3-ADV-4 | Agent 监控面板 | ⏳ | 调用链路追踪、Token 消耗 |

---

### Phase 4: Agent 生态建设（第 30-43 周，14 周）

**目标**: Agent 市场 + 开发者生态 + 生态成熟

#### 4.1 Agent 市场平台（6 周）

| 任务 ID | 任务名称 | 状态 | 备注 |
|---------|---------|------|------|
| P4-MKT-1 | Agent 存储 | ⏳ | 数据库设计 + 版本管理 |
| P4-MKT-2 | 发布/审核 API | ⏳ | 开发者上传 + 平台审核 |
| P4-MKT-3 | 搜索/推荐 | ⏳ | Agent 检索和推荐算法 |
| P4-MKT-4 | 开发者控制台 | ⏳ | 上传 Agent、查看统计 |
| P4-MKT-5 | 评分/评论系统 | ⏳ | 用户反馈和评分 |
| P4-MKT-6 | Agent 分类/标签 | ⏳ | 按功能分类 |

#### 4.2 开发者生态（4 周）

| 任务 ID | 任务名称 | 状态 | 备注 |
|---------|---------|------|------|
| P4-DEV-1 | 开发者注册体系 | ⏳ | 开发者认证、协议签署 |
| P4-DEV-2 | Agent 开发 SDK + CLI | ⏳ | 开发指南 + 示例代码 |
| P4-DEV-3 | Agent 包审核流程 | ⏳ | 自动化检测 + 人工审核 |
| P4-DEV-4 | 开发者激励机制 | ⏳ | 按调用量排名 + 推荐奖励 |
| P4-DEV-5 | 社区论坛 | ⏳ | 开发者交流、问题反馈 |

#### 4.3 生态成熟（4 周）

| 任务 ID | 任务名称 | 状态 | 备注 |
|---------|---------|------|------|
| P4-ECO-1 | Agent 协作机制 | ⏳ | Agent 之间互相调用 |
| P4-ECO-2 | Agent 模拟器 | ⏳ | 本地测试 Agent |
| P4-ECO-3 | 可视化 Agent 编排器 | ⏳ | 拖拽式组合 Agent |
| P4-ECO-4 | Agent 版本管理 | ⏳ | 支持更新、回滚 |
| P4-ECO-5 | Agent 数据隔离 | ⏳ | 独立数据存储空间 |

---

## 里程碑

| 里程碑 | 目标日期 | 标志事件 | 状态 |
|--------|---------|---------|------|
| M-1: 代码瘦身完成 | 已完成 | 移除海外渠道，代码从 612K 行缩减至 470K 行 | ✅ |
| M0: 架构增强完成 | 第 9 周 | oh-my-openagent + Capability + MCP + SolidJS 集成完成 | ⏳ |
| M1: 核心功能完成 | 第 17 周 | 4 个新模块 + 前端扩展 + 2-3 个内置 Agent | ⏳ |
| M2: 正式发布 | 第 20 周 | v2026.5.0 发布，200+ 内测用户 | ⏳ |
| M3: 多端发布 | 第 29 周 | iOS + Android + Desktop 可下载 | ⏳ |
| M4: 生态成熟 | 第 43 周 | Agent 市场上线，100+ Agent，50+ 开发者 | ⏳ |

---

## 变更记录

| 日期 | 变更内容 | 变更人 |
|------|---------|--------|
| 2026-03-07 | 初始版本创建 | Claude |
| 2026-03-07~09 | **代码瘦身完成**: 移除海外渠道和扩展，代码从 612K 行缩减至 470K 行 | Zack |
| 2026-03-09 | **文档精简**: 移除技术选型分析和对比过程，只保留最终执行计划 | Claude |

---

*本文档将在每个任务完成后更新，记录实际进度和遇到的问题*
