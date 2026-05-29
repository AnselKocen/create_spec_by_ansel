# 生图约束模块

最终 spec 必须包含“生图策略与资产契约”章节。

如果本产品明确不需要任何真实位图资产，该章节必须写清“不需要真实生图资产”的范围，并说明核心视觉由 SVG/Canvas/CSS/HTML 实现。

如果本产品需要任何真实位图资产，最终 spec 必须包含以下强约束。根据玩法结构和产品方向替换“CG / 插图 / 人格形象 / 背景图 / 封面图”等资产名称。

## 默认生图时机

只要最终产品需要真实位图资产，默认使用：

```text
IMAGE_GENERATION_TIMING = first-run-cache
```

也就是：

```text
打开 app
→ 资产准备页
→ 检查 IMAGE_ASSET_MANIFEST
→ IndexedDB cache lookup
→ cache hit：读取 IndexedDB Blob + 创建本次会话 object URL + load/decode
→ cache miss：显示生成进度，调用真实生图工具/API，取得图片数据并转成 Blob，写入 IndexedDB，再创建 object URL + load/decode
→ 所有必需图片 ready
→ 进入正常图片体验
→ 如果图片生成 / URL 转 Blob / load / decode 失败：记录失败资产，允许用户跳过资产准备页进入无图片体验
→ 之后刷新 / 再打开只读 IndexedDB Blob，不重新生图
```

除非用户明确要求某些图片必须在构建期生成，或产品确实需要“首屏立即有图且不能等待”，否则不要默认选择 `build-time`。如果只有少数核心图需要构建期生成，其他图片仍应使用 `hybrid` 中的首启缓存分支。

生成 spec 的访谈阶段必须先问清：

- 哪些部分需要真实生图：标题页背景、章节插图、角色立绘、图鉴条目、卡牌图、结局 CG、封面、UI 纹理等。
- 每类图片的大致数量、比例、是否为进入正常图片体验前必需。
- 是否有少数图片必须 `build-time` 预置；如果用户没有明确要求，默认 `first-run-cache`。
- 对 `generator-tool`：区分“工具自身 UI / 示例资产”和“用户输入后生成的结果图”。前者默认首启缓存，后者按生成任务运行并缓存到历史记录。

## 什么是“生图”

- ✅ 调用生图模型或图像生成 API/工具，输入提示词，获得一张真实的图像文件。
- ✅ 图片数据可以在构建期获得并嵌入，也可以在最终 app 首次启动时生成并写入本机缓存。
- ✅ 用户正式进入依赖这些图片的游戏 / 产品体验时，页面引用的必须是真实生成图像的 Blob 读取结果：优先从 IndexedDB 取出 Blob，再用 `URL.createObjectURL(blob)` 创建本次会话 object URL 后加载 / 解码。

## 什么不是“生图”

- ❌ 用 CSS 渐变、box-shadow、border-radius 画出来的图形不是生图。
- ❌ 用 SVG path、circle、polygon 手动描绘的图形不是生图。
- ❌ 用 Canvas 代码绘制的图形不是生图。
- ❌ 用 emoji 或 Unicode 符号拼凑不是生图。
- ❌ 用纯文字描述“这里应该有一张图”不是生图。
- ❌ 用 CSS/SVG/Canvas 做一个“风格化占位图”然后当作图片不是生图。

## 生图资产策略

最终 spec 必须声明 `IMAGE_GENERATION_TIMING`，值可为：

| 值 | 含义 | 适用场景 |
|----|------|----------|
| `first-run-cache` | 默认。app 首次启动时生成缺失图片，转 Blob 写入 IndexedDB，本机之后读取 IndexedDB Blob、创建 object URL、load/decode | 大多数需要真实图片的 spec |
| `build-time` | 构建 / 实现阶段生成并写入最终交付物 | 用户明确要求打开即有图、演示交付、少量固定核心图 |
| `hybrid` | 部分核心图构建期生成，其他图片首次启动缓存 | 标题背景必须立即可见，但图鉴/章节/结局图可首启准备 |

无论哪种策略，最终产品展示的图片都必须来自真实生图结果。

`build-time` 也必须给出完整 `IMAGE_ASSET_MANIFEST`。如果构建期图片以 base64 / data URL / 本地资源形式预置，最终 app 首次打开时仍应把这些图片作为 `seed_source` 写入 IndexedDB，后续刷新优先从 IndexedDB 读取。

## 共同生图流程

1. **确定统一画风基底**
   - 根据产品主题选择一套 `STYLE_PROMPT_BASE`。
   - 同一产品里的所有图片必须共享这套基底，保证画风统一。

2. **为每张图片编写完整提示词**
   - 完整提示词 = `STYLE_PROMPT_BASE` + 该图片的具体主体/场景/服装/动作/氛围/光影/构图。
   - 每张图的提示词至少 30 个英文词或等量详细描述。
   - 提示词必须写入数据 Schema，不能只在开发过程里临时存在。
   - `negative_prompt` 应使用简洁、稳定的项目级模板或短字段，不要逐页堆叠大量负面词，避免提示词把画面带偏。

3. **实际调用生图工具/API**
   - 构建期生图使用实现环境中的生图工具/API。
   - 首次启动生图使用最终 app 可安全调用的生图能力，例如本地代理、本机模型、受控后端或用户已配置的安全接口。
   - 前端不得硬编码私密 API key。
   - cache hit 时不得调用生图工具/API；只有 cache miss、缓存损坏、版本变更，或用户明确重新生成时才允许调用。
   - 如果生图能力返回 URL，而不是 Blob / bytes，必须先确认该 URL 在当前页面环境中可读取为真实图片 Blob，并通过 MIME、load、decode 校验；校验成功后才能写入 IndexedDB。URL 不可读取、返回非图片、转 Blob 失败或解码失败时，必须把对应资产标记为 `failed`，不得把该 URL 当作已生成图片或缓存结果。

4. **绑定和持久化图片数据**
   - 首次启动生图时，图片必须以 Blob 写入 IndexedDB，并在后续进入时从 IndexedDB 读取 Blob、创建 object URL、加载并解码。
   - localStorage 只保存轻量 metadata、版本号、阅读/游戏进度或完成状态，不得保存图片、base64、大 data URL、Blob 字符串或 object URL。
   - 页面显示时必须从 IndexedDB Blob 创建临时 object URL：`URL.createObjectURL(blob)`。object URL 只能用于当前会话，不能当作长期存储；页面卸载或图片替换时应 `URL.revokeObjectURL()`。
   - 普通 HTTP cache、Blob URL、内存变量都不能作为判断“已有图片”的唯一依据；浏览器持久缓存以 IndexedDB Blob 记录为准。
   - 如果最终交付物要求单个 HTML 文件，仍必须先生成真实图片；如果选择 `build-time`，可把真实图片转换为 base64 / data URL 内嵌；如果选择 `first-run-cache`，则必须保证最终 app 有安全可用的运行时生图能力。

## 首次启动生图缓存流程

当 `IMAGE_GENERATION_TIMING` 为 `first-run-cache` 或 `hybrid` 时，最终 app 必须包含一个主题化资产准备页。正常图片体验中，凡是必需图片没有 ready，用户不得进入依赖这些图片的核心体验；但如果生图失败或图片转换失败，必须允许用户跳过资产准备页进入明确标记的无图片体验。

固定流程：

```text
打开 app
→ 读取 IMAGE_ASSET_MANIFEST
→ 为每张必需图片计算 / 校验 cache_key
→ 查询 IndexedDB
→ cache hit：Blob → object URL → load/decode → IMAGE_ASSET_RUNTIME_STATE.ready = true
→ cache miss：generation lock → 调用真实生图 → 取得图片数据并转 Blob → 写入 IndexedDB → object URL → load/decode → ready = true
→ 所有必需图片 ready
→ 进入正常图片体验
→ 失败分支：资产标记 failed → 显示失败原因和重试入口 → 用户可选择继续无图片体验
```

资产准备页要求：

- 页面标题表达为“正在生成图片 / 正在准备插图 / 正在准备视觉资产”等主题化文案。
- cache hit 时只显示短暂的“正在载入图片 / 正在打开作品”等轻量状态，不显示完整生成进度，不误导用户以为正在重新生图。
- cache miss 时显示生成进度：已完成数量 / 总数量、当前图片用途、简短状态。
- 保持产品主题 UI：主题面板、粒子、进度条、轻动效等，不做成空白 loading 页。
- 必需图片完成前不进入正常图片体验；如果进入无图片体验，必须清楚标记当前为降级状态，并保留重试入口。
- 可选图片可以后台继续生成，但对应页面需要有清楚的等待状态。

图片预生成与预加载闸门：

- 进入正常图片体验前，所有 `required = true` 的图片必须完成 `generated + cached/cache_hit + loaded + decoded + ready`。
- 核心阅读 / 游戏 / 学习阶段不得逐页生成 required 图片、不得翻到某页才请求 required 图片、不得让用户在核心流程中等待 required 图片加载。
- 如果某张图片会在首屏、章节入口、核心页面或必经结局中展示，它必须被列为 required，不得用 optional 绕过准备闸门。
- optional 图片可以不阻塞核心体验，但必须有明确运行时状态、失败原因和重试入口；不得用 CSS / SVG / Canvas 占位伪装成真实生图结果。
- 无图片体验是失败降级，不是生图成功：不得把 CSS / SVG / Canvas / emoji / 文字底图登记为生成图，也不得把失败资产标记为 ready。界面应隐藏或弱化依赖图片的区域，用文本、布局、颜色和已有 SVG/CSS UI 保持可玩 / 可读，并允许用户稍后重试生图。

缓存策略要求：

- 必须优先使用 IndexedDB 存储图片 Blob 和 manifest metadata。
- 每张图片必须有稳定 `cache_key`，建议由 `project_id / product_id + asset_manifest_version + asset_id + prompt_hash` 组成。
- 当 prompt、画风基底、资产清单版本或 spec 版本变化时，cache key 随之变化，只重新生成失效图片。
- 必须使用生成锁，避免刷新、双击、多个标签页同时触发同一图片重复生图。优先使用 `navigator.locks`；不支持时，可用 IndexedDB 中的 `generation_lock` 记录实现。
- 如果检测到同一 `cache_key` 正在生成，当前页面应等待缓存结果或显示“正在准备图片”，不得并发再次调用生图 API。
- 刷新或再次打开时必须先做 IndexedDB cache lookup；若 Blob 命中且 prompt / manifest 版本一致，只允许执行 Blob 读取、object URL 创建、load/decode 快速校验，不得重新进入生图流程。

失败处理要求：

- 单张失败时显示原因，保留错误状态和重试入口，并说明缺失的资产 ID / 用途。
- 如果必需图片无法生成，不能把最终图片体验标记为完成；但必须提供“跳过图片继续”入口，让用户离开资产准备页进入无图片体验。无图片体验必须保留失败状态、重试入口和必要说明。

## 生图资产闸门

最终 spec 中必须要求开发者在写核心页面前先输出并核对静态 `IMAGE_ASSET_MANIFEST`，并在运行时维护 `IMAGE_ASSET_RUNTIME_STATE` 和 IndexedDB 缓存记录。

### 静态资产计划：IMAGE_ASSET_MANIFEST

`IMAGE_ASSET_MANIFEST` 只描述“需要哪些图片、如何生成、缓存键是什么”，不直接表示当前浏览器中图片是否已经生成完成。每张图片至少包含：

| 字段 | 说明 |
|------|------|
| `id` | 图片唯一 ID，如 `global_bg` / `ending_cg_1` |
| `purpose` | 图片用途，如标题页背景、章节 CG、人格形象 |
| `required` | 是否为进入正常图片体验前必须完成 |
| `plan_status` | 固定为 `required` / `optional`，不得用它表示已经生成 |
| `initial_runtime_status` | `pending` / `seed_available` |
| `style_prompt_base` | 本项目统一画风基底 |
| `prompt` | 该图片的完整正向提示词 |
| `negative_prompt` | 项目级短模板或简洁排除项 |
| `aspect_ratio` | 目标比例，如 16:9 / 4:3 / 1:1 |
| `generation_timing` | `first-run-cache` / `build-time` / `hybrid` |
| `cache_key` | 首次启动缓存使用的稳定键 |
| `prompt_hash` | prompt + style prompt base + negative prompt + asset manifest version 的版本哈希 |
| `seed_source` | 可选构建期 seed，例如 `{ "type": "none" }`、`prebundled_data_url` 或 `local_asset_path`；`first-run-cache` 下允许为空或 `none` |
| `storage_driver` | 固定为 `indexeddb_blob`，构建期 seed 只作为首次写入来源 |
| `child_safety_requirement` | 如适用，写 `must_pass_before_ready` |

静态计划层不得把未生成的图片写成 `status = "generated"`。`pending` 在静态计划中是允许的，但它只能表示“等待准备”，不能放行核心体验。

### 运行时资产状态：IMAGE_ASSET_RUNTIME_STATE

运行时必须为每个必需图片维护一条状态记录。每条至少包含：

| 字段 | 说明 |
|------|------|
| `asset_id` | 对应 `IMAGE_ASSET_MANIFEST.assets[].id` |
| `cache_key` | 与静态计划层一致 |
| `generation_status` | `pending` / `generating` / `generated` / `failed` |
| `cache_status` | `not_checked` / `cache_hit` / `cache_miss` / `cached` / `cache_corrupt` |
| `cached_blob_ref` | IndexedDB 中的 Blob 引用信息，如 store 名和 `cache_key`；不存 object URL |
| `loaded` | 是否已被浏览器加载 |
| `decoded` | 是否已完成解码，可立即绘制 |
| `ready` | `generation_status = generated`、`cache_status = cached/cache_hit`、`loaded = true`、`decoded = true` 且安全状态通过时才为 `true` |
| `error` | 失败原因，成功时为空 |

### IndexedDB 缓存记录

缓存记录至少包含：

| 字段 | 说明 |
|------|------|
| `cache_key` | 稳定缓存键 |
| `asset_id` | 图片 ID |
| `asset_manifest_version` | 资产清单版本 |
| `prompt_hash` | 提示词哈希 |
| `blob` | 图片 Blob |
| `mime_type` | 如 `image/png` / `image/webp` |
| `created_at` | 首次写入时间 |
| `updated_at` | 最近更新时间 |
| `status` | `cached` / `generating` / `failed` |
| `error` | 失败原因，成功时为空 |

生成闸门必须满足：

- 进入正常图片体验前，每个必需图片都必须有 `IMAGE_ASSET_RUNTIME_STATE.ready = true`；进入无图片体验时，失败图片保持 `failed` / `ready = false`，不得伪装成已生成。
- cache hit 时不得调用生图 API，只能读取 IndexedDB Blob、创建 object URL、load/decode。
- cache miss 时只生成缺失图片，生成后必须写入 IndexedDB，再执行 load/decode。
- 如果生图返回 URL，必须先确认该 URL 可读取为图片 Blob 并通过 MIME、load、decode 校验；校验失败时不得写入成功缓存，不得设置 ready。
- 每个 `cached_blob_ref` 必须指向本机缓存中的真实图片 Blob。
- 页面展示层使用从 IndexedDB Blob 创建的 object URL，或构建期真实图片 seed 写入 IndexedDB 后再读取出的 Blob。
- 开发者必须确认最终页面引用的是这些真实图片，而不是 CSS/SVG/Canvas/emoji/文字占位。
- 如果图片生成失败，必须记录失败的资产 ID、失败原因和已尝试提示词；提供重试入口，用户选择重试时应调整提示词或生成参数；同时允许用户继续无图片体验或稍后重试。
- 在必需图片资产未通过闸门前，不得把正常图片体验标记为完成；无图片体验必须作为明确降级状态验收。

## 如果无法生图

必须明确告诉用户：

> 我需要生图能力来生成这些图片，但当前没有可用的生图工具。请提供生图工具/API，或者告诉我如何调用。

在生图能力可用之前，不得交付声称完成的图片体验。可以交付明确标记的无图片体验，但不可用 CSS/SVG/Canvas/emoji 冒充生图结果，也不可以把“待生图”占位当作通过验收。

## 常见资产清单

- 恐怖叙事：标题页背景图 + 每章至少 1 张 CG + 结局 CG。
- 图鉴收集：封面背景图 + 每个图鉴条目 1 张插图。
- 人格测试：每种人格 1 张人物形象图。
- 传记模拟：标题页背景图 + 每章关键场景 CG + 每个结局 CG。
- 物理/化学：通常只需要标题页/全局背景图，核心可视化用 SVG/Canvas 实现，不用生图替代。
