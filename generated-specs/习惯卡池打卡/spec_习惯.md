# 习惯卡池打卡产品规格

## 一、产品概览

| 维度 | 值 |
|------|-----|
| 产品名称 | {{GAME_NAME}} |
| 来源素材 | {{BOOK_NAME}} |
| 设计粒度 | 可填充玩法框架 |
| 玩法结构 | 抽卡式习惯养成打卡 |
| 产品类型 | 习惯卡池 / 日历打卡 / 奖励收集 |
| 核心主题槽位 | `{{CORE_SELF_MANAGEMENT_THEME}}` |
| 目标体验 | 用户每天从内容文件提炼出的习惯卡池中抽取一张可执行行动，完成后记录心情、备注、连续天数和完成率，并解锁图片、徽章、卡背或收藏奖励 |
| 交互方式 | 点击、抽卡翻转、打卡表单、日历查看、图册收藏 |
| 内容规模 | 默认 40-50 张习惯卡；内容不足时保底 24-36 张；内容丰富时最多 60 张 |
| 奖励规模 | 类别奖励图、里程碑奖励图、稀有习惯奖励图、成就徽章、卡背主题 |
| 生图时机 | first-run-cache |
| 准确性模式 | semi-strict |
| 存储方式 | localStorage 保存进度；IndexedDB 保存图片缓存 |
| 推荐交付形态 | 单页 HTML 产品，内嵌 CSS/JS/SVG，必要真实图片通过 IndexedDB 缓存 Blob 读取并绑定 |

本 spec 定义的是一个可填充成品框架。后续管线读取 `skills/内容文件` 后，把不同输入内容抽象成可执行习惯卡、动态类别、奖励体系、视觉风格和图片提示词。最终用户看到的是已完成的习惯抽卡打卡产品，不会看到上传文件、解析文件或生成习惯的后台过程。

核心设计理念：这不是待办清单，也不是严肃自律仪表盘。产品的核心是“从内容中抽到今日一张小行动”，用抽卡期待感降低开始门槛，用日历记录建立连续性，用奖励图册让每次完成都留下可回看的反馈。

## 二、涉及的 SKILL / 内容文件清单

完整内容文件会与本 spec 一起提供，通常位于项目根目录的 `skills/` 文件夹中。构建产品时，必须读取每个文件的完整内容，并从中提取本 spec 需要的内容。

| 内容文件路径 | 覆盖模块 | 在本产品中的用途 |
|-------------|----------|------------------|
| `{{CONTENT_FILE_PATH}}` | `{{COVERED_MODULE}}` | `{{USAGE_IN_PRODUCT}}` |
| `skills/{{BOOK_OR_TOPIC_FILE}}.md` | `{{SOURCE_CONTENT_MODULE}}` | 提炼习惯卡名称、每日最小行动、分类线索、打卡提示、视觉意象和奖励主题 |

内容使用验收重点：

- 实现者必须读取每个内容文件的完整内容，不能只依赖文件名、目录索引、摘要或标题。
- 习惯卡名称和每日行动建议必须能追溯到内容文件中的观点、方法、步骤、案例或价值判断。
- 分类可以由内容文件直接给出，也可以由实现者根据内容聚类生成，但不能脱离内容气质。
- 奖励名称、成就文案、卡背主题和视觉隐喻可以创作发挥，但必须与内容文件的主题、情绪或方法论有内在联系。
- 若内容文件并不直接讲习惯养成，必须抽象为普通人可执行的观察、记录、反思、整理、沟通、学习、休息、尝试或复盘行为。

| 提取维度 | 在本 spec 中映射到 |
|----------|--------------------|
| 反复出现的建议、原则、价值观 | 习惯卡名称、坚持理由、类别标签 |
| 可执行动作、步骤、练习、提醒 | 每日最小行动、打卡提示 |
| 场景、对象、关系、问题 | 适用场景、最佳执行时间、卡片筛选标签 |
| 风险、禁忌、边界、注意点 | 温和提醒、低风险替代表述、准确性自检 |
| 情绪、节奏、审美、隐喻 | UI 氛围、奖励图片主题、粒子和动效 |
| 章节结构或内容分组 | 习惯类别、奖励系列、图册分区 |
| 可验证内容 | semi-strict 自检、健康建议边界、内容溯源 |

## 三、目标用户

| 维度 | 描述 |
|------|------|
| 核心用户 | 想从一本书、一组笔记、一套课程或一批内容里获得每日可行动建议的普通用户 |
| 使用场景 | 早晨抽取今日习惯、午间补打卡、睡前记录心情和备注、月底回看完成率 |
| 使用频率 | 每日 1-3 分钟，长期重复使用 |
| 设备偏好 | 手机优先，兼容桌面浏览器 |
| 知识门槛 | 无专业门槛；习惯行动应适合大多数普通用户 |
| 情绪需求 | 需要低压力、温和、有收集动力的自我管理体验 |
| 避免对象 | 不应设计成医疗建议工具、心理治疗工具、强惩罚自律工具或赌博式抽奖产品 |

## 四、产品目的

### 核心价值

把复杂、松散或不一定直接面向行动的内容文件，转化成 40-50 张普通人每天能执行的小习惯卡，让用户通过抽卡、打卡、日历和奖励图册，把内容长期带回自己的生活。

### 成功标准

- 用户每天能在 10 秒内完成抽卡，并理解今天要做的最小行动。
- 每张习惯卡都具体、低门槛、可当天完成，避免宏大口号。
- 用户完成打卡后能记录心情和备注，并在日历中回看当天完成内容。
- 连续天数、7 日完成率、30 日完成率和全部完成率计算正确。
- 奖励系统能让用户看到可收藏的反馈，包括图片奖励、徽章、卡背或图册进度。
- 不同内容文件进入后，产品能动态生成不同习惯类别、奖励主题和画风，而不是套同一批固定卡片。
- 自我管理和健康建议保持温和、合理、低风险，不承诺医疗或人生结果。

## 五、视觉风格规范

视觉风格必须由内容文件和习惯卡类别共同决定。最终产品应兼具“卡池游戏的期待感”和“习惯工具的清爽感”：抽卡和奖励揭示有仪式感，日历和统计界面清晰耐用。

### 动态画风生成方法

实现者必须在读取内容文件后生成 `STYLE_SELECTION_RESULT`，再确定统一 `STYLE_PROMPT_BASE`。选择时不要固定成单一画风，而是根据内容文件的主题、行动类型、情绪气质和目标用户动态组合。

| 维度 | 可组合方向 |
|------|------------|
| 媒介 | 水彩、油画、版画、彩铅、拼贴、3D、像素、矢量、摄影、纸雕、胶片、墨绘、信息图 |
| 情绪 | 清爽、温柔、坚定、安静、热烈、神秘、复古、未来感、治愈、专注、轻盈、庄重 |
| 内容气质 | 生活方式、健康管理、职场效率、情绪整理、学习成长、哲学思辨、自然观察、人物经验、文化传统 |
| 材质 | 手账纸、玻璃、金属、木纹、织物、便签、胶片颗粒、发光晶体、陶瓷、宣纸、贴纸 |
| 构图 | 卡片头像式、宽幅场景、贴纸组合、图鉴版式、日历插画、徽章中心构图、任务卡构图 |
| UI 质感 | 生活手账、精致卡牌、轻游戏 HUD、清爽仪表盘、收藏图册、玻璃拟态、复古票券 |
| 动效气质 | 纸张翻动、星尘、光点、贴纸弹跳、墨迹扩散、进度环发光、卡牌翻转、日历点亮 |

### 画风候选库

以下是可动态选择或混合的方向，不是封闭菜单：

| 画风方向 | 英文提示词基底示例 | 适合内容 |
|----------|--------------------|----------|
| 清爽生活手账风 | `fresh lifestyle journal illustration, soft daylight, neat stationery, gentle pastel accents, calm everyday atmosphere` | 普通生活习惯、轻量自我管理 |
| 水彩晨间日记风 | `watercolor morning journal, soft pigments, paper texture, airy composition, gentle reflective mood` | 情绪照顾、阅读、反思 |
| 复古票券收藏风 | `vintage ticket collage, retro print texture, warm ink, collectible stamps, nostalgic achievement design` | 打卡里程碑、成长路径 |
| 玻璃拟态健康仪表盘 | `clean glassmorphism wellness dashboard, translucent panels, soft gradients, crisp iconography, calm modern lighting` | 睡眠、饮水、运动、节律 |
| 扁平矢量信息图 | `flat vector infographic illustration, clean geometric shapes, balanced layout, modern productivity palette` | 效率方法、学习计划、工作习惯 |
| 纸雕贴纸拼贴风 | `paper cutout sticker collage, layered craft paper, playful shapes, soft shadows, cheerful but tidy composition` | 低压力习惯、亲和体验 |
| 新艺术植物装饰风 | `art nouveau botanical poster, flowing ornamental lines, elegant plants, refined color harmony, decorative frame` | 长期生长、自然、身体感受 |
| 像素任务卡风 | `pixel art daily quest card, crisp 16-bit edges, limited palette, collectible game reward icon` | 游戏化任务、成就收集 |
| 复古未来个人终端 | `retro futurist personal terminal, soft neon grid, clean sci-fi panels, focused productivity interface` | 科技效率、专注系统 |
| 胶片摄影生活风 | `cinematic lifestyle photography illustration, film grain, warm natural light, quiet everyday scene, realistic mood` | 城市日常、个人观察 |
| 柔和 3D 小物风 | `soft 3D clay object, rounded forms, studio lighting, collectible reward item, minimal background` | 奖励物件、卡背、徽章 |
| 极简禅意线条风 | `minimal zen line art, elegant continuous lines, calm negative space, muted ink tones, quiet composition` | 冥想、整理、呼吸 |
| 国潮手账风 | `modern guochao journal illustration, Chinese decorative motifs, refined ink accents, contemporary color palette` | 中文传统、节气、身体调养 |
| 博物志图鉴风 | `scientific natural history plate, precise linework, soft paper texture, labeled specimen composition` | 自然观察、知识抽象 |
| 梦幻星图风 | `dreamy star map illustration, luminous constellations, deep soft night palette, gentle aspirational mood` | 愿望、长期计划、里程碑 |
| 明亮运动徽章风 | `bright athletic badge illustration, dynamic shapes, crisp highlights, energetic but friendly wellness reward` | 运动、体能、行动力 |
| 暖色厨房便签风 | `warm kitchen note illustration, cozy textures, handwritten label feeling, everyday wellness ritual` | 饮食、饮水、生活节律 |
| 黑白手绘工作流风 | `black and white sketchnote workflow, hand-drawn arrows, tidy planning diagrams, focused desk atmosphere` | 工作方法、复盘、计划 |
| 柔光书桌阅读风 | `soft desk reading illustration, warm lamp light, books and notes, quiet reflective composition` | 阅读、学习、笔记 |
| 城市晨跑海报风 | `vintage urban morning poster, simplified city shapes, sunrise light, motivational but calm composition` | 户外、行动、晨间习惯 |

### 选择规则

- 内容偏健康、自律、睡眠、运动：优先清爽生活手账、玻璃拟态健康仪表盘、明亮运动徽章。
- 内容偏情绪、反思、阅读：优先水彩晨间日记、胶片摄影生活、极简禅意线条。
- 内容偏效率、学习、工作流：优先扁平矢量信息图、复古未来个人终端、黑白手绘工作流。
- 内容偏文化、自然、哲学：优先国潮手账、博物志图鉴、新艺术植物装饰、极简禅意线条。
- 若内容混合，允许不同习惯类别拥有子风格，但所有真实图片必须共享同一 `STYLE_PROMPT_BASE`，避免奖励图册割裂。

### UI 要求

- 标题不能只是普通 `<h1>`。必须使用主题化字体效果，如 `text-shadow`、`background-clip: text`、描边、柔光、贴纸层或 SVG 装饰。
- 抽卡页必须有卡背、翻转、稀有度光效和结果揭示，不得只是点击按钮后显示文本。
- 习惯卡要像可收藏卡片：卡名、每日最小行动、耗时、稀有度、类别和提示语层次清楚。
- 日历页要清晰耐用：月视图、完成点、心情标记、连续天数和完成率不能被装饰遮挡。
- 奖励图册要像收藏册：已解锁图片、未解锁剪影、成就徽章和卡背主题应有统一陈列。
- 卡片、面板和按钮的圆角不超过 8px，除非动态画风明确需要贴纸、纸雕或 3D 小物风。
- 文本必须适配移动端，按钮和卡片内最长词不得溢出。

### SVG / CSS 技巧

- SVG 可用于卡背纹样、类别图标、日历完成标记、进度环、徽章边框、未解锁剪影。
- CSS 可用于卡牌翻转、抽卡光效、日历点亮、奖励揭示、按钮 hover/active、卡片稀有度边框。
- 未解锁奖励可用剪影、封套、雾化、盖章、马赛克等主题化设计，但不能把这些当作真实生图奖励。
- 抽卡结果和奖励揭示需要 300-900ms 的过渡，不能瞬切。

### 粒子 / 氛围设计

粒子根据画风动态选择，数量通常 10-30 个，不遮挡内容，`pointer-events: none`。

| 粒子类型 | 适合场景 |
|----------|----------|
| 纸屑 / 便签碎片 | 打卡成功、奖励揭示 |
| 星尘 / 光点 | 里程碑、连续天数 |
| 花瓣 / 叶片 | 自然、生长、温柔内容 |
| 胶片尘埃 | 生活观察、日记风 |
| 像素粒子 | 游戏化任务卡 |
| 墨迹扩散 | 国潮、禅意、文化内容 |
| 几何碎片 | 效率、信息图、未来终端 |

必须尊重 `prefers-reduced-motion`：系统要求减少动态时，关闭大幅翻转、背景漂移和密集粒子，仅保留轻微透明度变化。

## 六、生图策略与资产契约

本产品需要真实位图资产，生图是资产闸门，不是可选视觉增强。

`IMAGE_GENERATION_TIMING = first-run-cache`

本 spec 不设置构建期预置图片例外。标题页背景、默认卡背、奖励图册封面、类别奖励、连续打卡里程碑图、稀有习惯奖励图和月度回顾图，均在最终 app 首次启动时按需生成并写入 IndexedDB。用户刷新或下次打开时，若 `cache_key` 命中且图片能正常 load/decode，只读取本地缓存，不再调用生图工具/API。

只有以下情况才允许重新调用生图：图片缓存缺失、缓存损坏、prompt / 统一画风基底 / 资产清单版本 / spec 版本变化，或用户在设置中明确触发重新生成。除此之外，后续进入产品必须复用 IndexedDB 中已经缓存的真实图片 Blob。

### 什么是生图

- 调用真实图像生成模型、工具或 API，输入完整提示词，获得一张真实位图文件或位图数据。
- 本 spec 中的图片由最终 app 首次启动时生成后写入本机 IndexedDB 缓存。
- 用户正式进入依赖图片的体验时，页面引用的必须是真实生成图片。

### 什么不是生图

- CSS 渐变不是生图。
- SVG path、circle、polygon 不是生图。
- Canvas 绘制不是生图。
- Emoji/Unicode 不是生图。
- 文字占位不是生图。
- 用 CSS/SVG/Canvas 做风格化占位图再当作图片，不通过验收。

### first-run-cache 资产范围

| 资产 id | 数量建议 | 用途 | required |
|---------|----------|------|----------|
| `cover_bg` | 1 | 标题页背景 | true |
| `default_card_back_{{N}}` | 1-3 | 默认抽卡卡背 | true |
| `reward_album_cover` | 1 | 奖励图册封面或空状态 | false |
| `category_reward_{{CATEGORY_ID}}` | 每个习惯类别 1 张 | 类别完成奖励 | true |
| `streak_reward_3` / `7` / `14` / `30` | 4 张起 | 连续打卡里程碑 | true |
| `rare_habit_reward_{{HABIT_ID}}` | 若干 | rare / epic 习惯完成奖励 | false |
| `monthly_summary_{{STYLE_ID}}` | 1-3 张 | 30 日或月度回顾奖励 | false |

首次启动缓存流程：

```text
打开 app
→ 读取 IMAGE_ASSET_MANIFEST
→ 为每张图片计算 / 校验 cache_key
→ 查询 IndexedDB
→ cache hit：读取 Blob → 创建临时 object URL → load/decode → IMAGE_ASSET_RUNTIME_STATE.ready = true
→ cache miss：显示资产准备页 → generation lock → 调用真实生图 → Blob 写入 IndexedDB → load/decode → ready = true
→ 所有 required 图片 ready 后进入标题页和核心体验
→ optional 图片可在后台继续生成，已缓存后下次直接读取
```

资产准备页必须主题化，显示已完成数量 / 总数量、当前图片用途、失败原因和重试入口，不能是空白 loading 页。cache hit 时只能显示短暂“正在载入图片 / 正在打开今日卡池”的轻量状态，不显示完整生成进度，不误导用户以为正在重新生图。

### 统一画风基底

所有图片必须共享同一个 `STYLE_PROMPT_BASE`。完整 prompt = `STYLE_PROMPT_BASE` + 该图片的主体、场景、构图、动作、情绪、光影、用途说明。每张图的 prompt 至少 30 个英文词或等量详细中文描述，并写入 `IMAGE_ASSET_MANIFEST`。

### IMAGE_ASSET_MANIFEST

开发者在写核心页面前必须先输出并核对 `IMAGE_ASSET_MANIFEST`。每张图片至少包含：

| 字段 | 说明 |
|------|------|
| `id` | 图片唯一 ID |
| `purpose` | 图片用途 |
| `required` | 是否为进入核心体验前必须完成 |
| `plan_status` | 固定为 `required` / `optional`，不得表示已经生成 |
| `initial_runtime_status` | 本 spec 默认为 `pending` |
| `style_prompt_base` | 本项目统一画风基底 |
| `prompt` | 完整正向提示词 |
| `negative_prompt` | 项目级短模板或简洁排除项，如 text、logo、watermark、foreground clutter |
| `aspect_ratio` | 目标比例，如 16:9、4:3、1:1、3:4 |
| `generation_timing` | 固定为 `first-run-cache` |
| `cache_key` | 首次启动缓存使用的稳定键 |
| `prompt_hash` | prompt + style prompt base + negative prompt + asset manifest version 的哈希 |
| `seed_source` | 本 spec 默认 `{ "type": "none" }` |
| `storage_driver` | 固定为 `indexeddb_blob` |
| `child_safety_requirement` | 如适用，写 `must_pass_before_ready` |

静态 `IMAGE_ASSET_MANIFEST` 只描述资产计划，不表示当前浏览器里图片已经可用。不得在静态计划里用 `status = generated` / `cached` 放行体验；`placeholder`、`css_fallback`、`svg_fallback` 均不通过验收。

### IMAGE_ASSET_RUNTIME_STATE

运行时必须为每张 required 图片维护一条 `IMAGE_ASSET_RUNTIME_STATE`。每条至少包含：

| 字段 | 说明 |
|------|------|
| `asset_id` | 对应 `IMAGE_ASSET_MANIFEST.assets[].id` |
| `cache_key` | 与静态计划一致 |
| `generation_status` | `pending` / `generating` / `generated` / `failed` |
| `cache_status` | `not_checked` / `cache_hit` / `cache_miss` / `cached` / `cache_corrupt` |
| `cached_blob_ref` | IndexedDB 中的 Blob 引用信息，不存 object URL |
| `loaded` | 是否已被浏览器加载 |
| `decoded` | 是否已完成解码，可立即绘制 |
| `ready` | `generation_status = generated`、`cache_status = cached/cache_hit`、`loaded = true`、`decoded = true` 且安全状态通过时才为 `true` |
| `error` | 失败原因，成功时为空 |

进入标题页和核心体验前，每个 required 图片都必须有 `IMAGE_ASSET_RUNTIME_STATE.ready = true`。optional 图片可以延迟生成，但对应图册位置必须显示清楚的等待状态，不能冒充已生成奖励。

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

### 缓存策略

- 图片 Blob 必须优先存入 IndexedDB。
- localStorage 只保存少量 metadata、版本号、用户进度和完成状态，不存图片、base64、大 data URL、Blob 字符串或 object URL。
- `cache_key = project_id + asset_manifest_version + asset_id + prompt_hash`。
- 当 prompt、画风基底、资产清单版本或 spec 版本变化时，只重新生成失效图片。
- cache hit 时不得调用生图工具/API；只能读取 IndexedDB Blob、创建临时 object URL、load/decode，并更新运行时状态。
- cache miss、缓存损坏或版本变化时，只生成缺失 / 失效图片，生成后必须写入 IndexedDB，再执行 load/decode。
- 必须使用生成锁，避免刷新、双击或多个标签页同时触发同一图片重复生图；优先使用 `navigator.locks`，不支持时用 IndexedDB 中的 `generation_lock` 记录实现。
- 必需图片多次生成失败时，停留在资产准备页或错误页，说明失败资产 ID、用途、失败原因和已尝试 prompt。

### 无法生图时

如果当前实现环境没有可用生图工具，必须停止并告诉用户：

> 我需要生图能力来生成这些图片，但当前没有可用的生图工具。请提供生图工具/API，或者告诉我如何调用。

在生图能力可用之前，不得交付声称完成的最终成品。

## 七、功能清单

| 优先级 | 功能名称 | 解决什么问题 | 输入 | 输出 |
|--------|----------|-------------|------|------|
| P0 | 资产准备页 | first-run-cache 生图策略下确保 required 图片可用 | `IMAGE_ASSET_MANIFEST`、IndexedDB 缓存状态 | cache hit 快速载入、cache miss 生成进度、运行时 ready 状态 |
| P0 | 标题页 / 今日入口 | 给用户每日回访入口 | 点击开始 / 继续 | 今日抽卡页 |
| P0 | 每日抽卡 | 把习惯选择变成轻量期待 | 点击抽卡 | 今日主卡 |
| P0 | 有限换抽 | 避免用户抽到当天明显不适合的行动 | 点击换抽，消耗次数 | 新习惯卡 |
| P0 | 习惯卡详情 | 让用户知道今天具体做什么 | 抽中的 `habit_id` | 卡名、最小行动、耗时、理由、提示 |
| P0 | 打卡记录 | 记录完成、心情和备注 | 完成按钮、心情、备注 | 当日记录 |
| P0 | 日历记录 | 让用户回看长期进度 | 月份、日期点击 | 每日完成状态、心情、备注 |
| P0 | 连续天数 / 完成率 | 反馈长期坚持 | daily records | 当前 streak、最佳 streak、7/30 日完成率 |
| P0 | 即时奖励 | 让每次完成有反馈 | 完成打卡 | 翻卡、粒子、鼓励语、积分或能量 |
| P0 | 图片奖励解锁 | 让里程碑可收藏 | 完成规则触发 | 真实图片奖励 |
| P0 | 奖励图册 | 保存和回看奖励 | 已解锁奖励 | 图册、未解锁状态 |
| P1 | 加练卡 | 用户有余力时多做 1-2 张 | 点击抽加练卡 | 额外 habit card |
| P1 | 卡池图鉴 | 查看已抽、已完成、未解锁习惯 | 卡池数据、进度 | 卡片列表和筛选 |
| P1 | 类别筛选 | 帮助用户理解习惯结构 | 类别选择 | 分类后的习惯卡 |
| P1 | 月度回顾 | 汇总 30 日体验 | 月份 | 完成率、常见心情、代表奖励图 |
| P1 | 数据重置 / 导出 | 用户管理本地记录 | 点击确认 | 清空或导出 JSON |

## 八、用户动线

### 首次打开

```text
打开 app → 检查图片缓存 → cache hit 快速载入并进入标题页 / cache miss 显示资产准备页 → required 图片生成并写入 IndexedDB → required 图片 ready → 标题页 → 今日抽卡
```

### 每日核心路径

```text
标题页 → 今日抽卡 → 翻卡展示习惯 → 接受或有限换抽 → 查看习惯详情 → 完成行动 → 打卡记录心情和备注 → 奖励揭示 → 日历更新 → 返回今日状态
```

### 回看路径

```text
标题页 → 日历页 → 点击日期 → 查看当天习惯、心情、备注和奖励 → 返回月视图
```

### 收藏路径

```text
标题页 → 奖励图册 → 查看已解锁图片 / 徽章 / 卡背 → 查看未解锁提示 → 返回今日抽卡
```

### 回归路径

```text
断签后打开 → 标题页显示温和回归文案 → 抽取今日一张 → 完成后重新开始 streak
```

断签不出现惩罚、羞辱或夸张损失提示。

## 九、信息结构

| 页面 / 状态 | 主要内容 | 主要交互 |
|-------------|----------|----------|
| 资产准备页 | 生图进度、当前资产用途、失败重试 | 等待、重试、查看错误 |
| 标题页 | 产品标题、今日日期、当前连续天数、开始按钮 | 开始、继续、进入日历/图册 |
| 今日抽卡页 | 卡背、抽卡按钮、换抽次数、稀有度提示 | 抽卡、换抽、接受 |
| 习惯卡详情页 | 卡名、行动、耗时、类别、理由、提示 | 开始行动、稍后提醒、打卡 |
| 打卡页 | 完成确认、心情选择、备注输入 | 提交、取消、编辑备注 |
| 奖励揭示页 | 即时反馈、图片奖励、徽章、卡背 | 收下奖励、查看图册 |
| 日历页 | 月视图、每日完成点、心情标记、完成率 | 切月、点日期、查看详情 |
| 日期详情页 | 当天习惯、心情、备注、奖励 | 编辑备注、返回 |
| 卡池图鉴 | 习惯卡列表、类别、完成次数、未解锁态 | 筛选、查看详情 |
| 奖励图册 | 图片奖励、徽章、卡背、未解锁剪影 | 查看大图、筛选系列 |
| 月度回顾页 | 完成率、常见心情、代表习惯、奖励总结 | 切换月份、返回 |
| 设置页 | 数据导出、数据重置、动态效果开关 | 导出、确认重置、切换设置 |

## 十、数据设计

### 构建 / 填充阶段数据

```json
{
  "spec_version": "1.0.0",
  "source_material": "{{BOOK_NAME}}",
  "content_files": [
    {
      "path": "{{CONTENT_FILE_PATH}}",
      "covered_module": "{{COVERED_MODULE}}",
      "read_full_content": true
    }
  ],
  "style_selection": {
    "style_id": "{{STYLE_ID}}",
    "style_prompt_base": "{{STYLE_PROMPT_BASE}}",
    "selection_reason": "{{WHY_THIS_STYLE_MATCHES_CONTENT}}",
    "particle_style": "{{PARTICLE_STYLE}}"
  },
  "habit_categories": ["{{HABIT_CATEGORY}}"],
  "habit_cards": ["{{HABIT_CARD}}"],
  "reward_rules": ["{{REWARD_RULE}}"],
  "image_asset_manifest": ["{{IMAGE_ASSET}}"]
}
```

### 习惯卡 Schema

```json
{
  "habit_id": "habit_001",
  "habit_name": "{{HABIT_NAME}}",
  "category": "{{CATEGORY_ID}}",
  "daily_micro_action": "{{DAILY_MICRO_ACTION}}",
  "why_it_matters": "{{CONTENT_BASED_REASON}}",
  "estimated_time": "3min",
  "difficulty": "easy",
  "rarity": "common",
  "best_moment": "morning",
  "checkin_prompt": "{{CHECKIN_PROMPT}}",
  "gentle_note": "{{LOW_RISK_NOTE}}",
  "source_trace": {
    "file_path": "{{CONTENT_FILE_PATH}}",
    "section": "{{SOURCE_SECTION}}",
    "evidence_summary": "{{EVIDENCE_SUMMARY}}"
  }
}
```

### 习惯类别 Schema

```json
{
  "category_id": "category_001",
  "category_name": "{{CATEGORY_NAME}}",
  "description": "{{CATEGORY_DESCRIPTION}}",
  "theme_keywords": ["{{KEYWORD}}"],
  "reward_asset_id": "category_reward_001",
  "habit_count": 0
}
```

### 奖励规则 Schema

```json
{
  "reward_id": "reward_001",
  "reward_type": "image",
  "trigger_type": "streak",
  "trigger_value": 7,
  "title": "{{REWARD_TITLE}}",
  "description": "{{REWARD_DESCRIPTION}}",
  "asset_id": "streak_reward_7",
  "required_asset": true
}
```

### 静态图片资产计划 Schema

```json
{
  "asset_manifest_version": "1.0.0",
  "assets": [
    {
      "id": "cover_bg",
      "purpose": "title page background",
      "required": true,
      "plan_status": "required",
      "initial_runtime_status": "pending",
      "style_prompt_base": "{{STYLE_PROMPT_BASE}}",
      "prompt": "{{FULL_IMAGE_PROMPT_AT_LEAST_30_WORDS}}",
      "negative_prompt": "text, logo, watermark, foreground clutter",
      "aspect_ratio": "16:9",
      "generation_timing": "first-run-cache",
      "cache_key": "{{PROJECT_ID}}_{{ASSET_MANIFEST_VERSION}}_{{ASSET_ID}}_{{PROMPT_HASH}}",
      "prompt_hash": "{{PROMPT_HASH}}",
      "seed_source": {
        "type": "none"
      },
      "storage_driver": "indexeddb_blob",
      "child_safety_requirement": "must_pass_before_ready"
    }
  ]
}
```

### 运行时图片状态 Schema

```json
{
  "asset_id": "cover_bg",
  "cache_key": "{{PROJECT_ID}}_{{ASSET_MANIFEST_VERSION}}_{{ASSET_ID}}_{{PROMPT_HASH}}",
  "generation_status": "pending",
  "cache_status": "not_checked",
  "cached_blob_ref": null,
  "loaded": false,
  "decoded": false,
  "ready": false,
  "error": null
}
```

`IMAGE_ASSET_MANIFEST` 是静态计划，不能用 `generated` 或 `cached` 表示图片已经可用；`IMAGE_ASSET_RUNTIME_STATE.ready = true` 才允许进入依赖 required 图片的体验。

### 运行时用户数据

```json
{
  "profile": {
    "created_at": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "motion_preference": "system"
  },
  "daily_records": {
    "YYYY-MM-DD": {
      "drawn_cards": ["habit_001"],
      "accepted_cards": ["habit_001"],
      "completed_cards": ["habit_001"],
      "mood": "calm",
      "note": "{{USER_NOTE}}",
      "rewards_unlocked": ["reward_001"],
      "created_at": "YYYY-MM-DDTHH:mm:ss.sssZ",
      "updated_at": "YYYY-MM-DDTHH:mm:ss.sssZ"
    }
  },
  "draw_state": {
    "date": "YYYY-MM-DD",
    "rerolls_used": 0,
    "bonus_draws_used": 0
  },
  "streak": {
    "current": 0,
    "best": 0,
    "last_completed_date": null
  },
  "completion_rate": {
    "seven_day": 0,
    "thirty_day": 0,
    "all_time": 0
  },
  "unlocked_rewards": ["reward_001"],
  "completed_habit_counts": {
    "habit_001": 1
  }
}
```

### 图片缓存记录 Schema

```json
{
  "asset_id": "category_reward_001",
  "asset_manifest_version": "1.0.0",
  "cache_key": "{{PROJECT_ID}}_{{ASSET_MANIFEST_VERSION}}_{{ASSET_ID}}_{{PROMPT_HASH}}",
  "prompt_hash": "{{PROMPT_HASH}}",
  "blob": "{{IMAGE_BLOB}}",
  "mime_type": "image/png",
  "status": "cached",
  "created_at": "YYYY-MM-DDTHH:mm:ss.sssZ",
  "updated_at": "YYYY-MM-DDTHH:mm:ss.sssZ",
  "error": null
}
```

localStorage 负责运行时轻量 JSON；IndexedDB 负责图片 Blob 和缓存记录。页面显示时可以创建临时 object URL，但 object URL 不能作为长期存储值写入 localStorage。

## 十一、交互设计

| 操作 | 状态变化 | 反馈 |
|------|----------|------|
| 点击抽卡 | `idle → drawing → revealed` | 卡背翻转、洗牌动效、稀有度边框点亮 |
| 点击换抽 | 当前卡进入 discarded，本日换抽次数 +1 | 卡片滑出，新卡翻入，显示剩余换抽次数 |
| 接受习惯 | 今日 accepted_cards 增加 | 卡片固定到今日栏，按钮转为“完成后打卡” |
| 提交打卡 | daily_records 写入完成卡、心情和备注 | 完成粒子、奖励判定、日历点亮 |
| 解锁图片奖励 | unlocked_rewards 增加 | 奖励图从模糊到清晰，显示收藏成功 |
| 点击日历日期 | 打开日期详情 | 日期格高亮，详情面板滑入 |
| 编辑备注 | daily_records 更新 note | 保存成功轻提示 |
| 切换月份 | calendar view 更新 | 月份标题过渡，完成点重新排布 |
| 查看图册 | 打开奖励列表 | 已解锁图正常显示，未解锁图为主题化剪影 |
| 重置数据 | 清空本地进度 | 二次确认，完成后回到标题页 |

错误状态：

- 图片缓存失败：显示失败资产、原因和重试按钮。
- localStorage 写入失败：提示用户浏览器存储不可用，并允许导出当前数据。
- IndexedDB 不可用：提示无法完成图片缓存，不能把 required 图片标记为通过。
- 内容文件填充不足：构建阶段报告可生成卡片数量和缺口，不得用无来源习惯补齐。

## 十二、核心机制约束

### 产品形态约束

本 spec 描述的是最终用户直接打开并体验的已填充完成产品。内容读取、习惯提炼、分类生成和图片 prompt 生成属于构建 / 填充阶段，不得作为最终用户界面暴露。最终用户只体验已填充完成的抽卡、打卡、日历和奖励系统。

### 设计粒度约束

本 spec 是可填充玩法框架。习惯名称、行动建议、分类、奖励主题、图片 prompt 和视觉风格由 `skills/内容文件` 填入。除用户明确指定外，不提前写死某一本书、某套课程或某一批固定习惯。

### 习惯提炼约束

- 习惯卡名称和每日行动建议必须来自内容文件的观点、方法、步骤或案例抽象。
- 每日行动必须低门槛、可当天完成，推荐 1-15 分钟。
- 不得要求极端节食、过度运动、睡眠剥夺、停止用药、替代诊疗或其他高风险行为。
- 若内容文件不适合健康建议，转为观察、记录、整理、反思、沟通、学习、尝试或复盘。
- 每张习惯卡必须有 `source_trace`，说明内容依据。

### 抽卡约束

- 每天默认 1 张主卡。
- 用户可额外抽 1-2 张加练卡。
- 每天允许 1-3 次有限换抽，具体次数可由实现者根据 UI 节奏决定。
- 换抽不惩罚用户，不出现损失厌恶或强迫性设计。
- 稀有度只表达仪式感：`common` 为基础低门槛，`rare` 为稍有挑战，`epic` 为特殊主题或周末挑战。

### 日历约束

- 月视图必须能展示每天是否完成、完成数量或状态强弱。
- 日期详情必须展示当天完成习惯、心情、备注和奖励。
- 连续天数按自然日计算；断签后不羞辱用户。
- 完成率至少包含 7 日、30 日和全部时间。

### 奖励约束

- 奖励不宣称治疗、减肥、焦虑改善、疾病改善等确定结果。
- 图片奖励必须来自真实生图结果。
- 徽章可使用 SVG/CSS，但如果标记为图片奖励，必须走真实生图。
- 奖励文案应肯定行动本身，而不是夸大效果。

### 准确性模式约束

准确性模式为 `semi-strict`：

- 核心健康和自我管理建议必须合理、温和、低风险。
- 允许叙事化、游戏化和视觉隐喻。
- 不允许改变内容文件中的关键因果和核心建议。
- 不允许从无关内容硬编医学、心理或营养结论。

## 十三、内容 / 章节概览

本产品没有线性章节，而是由四组内容模块构成。

### 习惯卡池

| 模块 | 数量 | 生成规则 |
|------|------|----------|
| 基础习惯卡 | 24-36 张 | 内容不足时保底，覆盖最清晰的行动建议 |
| 标准习惯卡 | 40-50 张 | 默认目标规模，覆盖主要主题、类别和难度 |
| 扩展习惯卡 | 最多 60 张 | 内容丰富时增加，但不得稀释质量 |

每张卡使用占位字段：

```text
{{HABIT_NAME}}
{{DAILY_MICRO_ACTION}}
{{CATEGORY_NAME}}
{{ESTIMATED_TIME}}
{{CHECKIN_PROMPT}}
{{SOURCE_TRACE}}
```

### 习惯类别

类别由内容文件动态生成，建议 4-8 类。示例类别仅为结构提示：

| 类别槽位 | 说明 |
|----------|------|
| `{{BODY_RHYTHM_CATEGORY}}` | 睡眠、饮水、呼吸、运动等身体节律 |
| `{{MIND_REFLECTION_CATEGORY}}` | 记录、复盘、情绪观察、阅读反思 |
| `{{FOCUS_ACTION_CATEGORY}}` | 专注、计划、工作流、学习 |
| `{{RELATION_COMMUNICATION_CATEGORY}}` | 沟通、边界、表达、协作 |
| `{{ENVIRONMENT_ORDER_CATEGORY}}` | 整理、清洁、环境提示 |
| `{{CREATIVE_EXPERIMENT_CATEGORY}}` | 尝试、观察、创作、微挑战 |

实际类别名称必须根据内容文件生成。

### 奖励系列

| 奖励系列 | 触发条件 | 内容来源 |
|----------|----------|----------|
| 类别奖励 | 某类别完成次数达到阈值 | 类别主题 + 内容气质 |
| 连续天数奖励 | 3 / 7 / 14 / 30 天 | 日历进度 |
| 稀有卡奖励 | 完成 rare / epic 卡 | 习惯卡主题 |
| 月度回顾奖励 | 月度完成率或代表心情 | 用户运行时数据 |
| 卡背主题 | 完成特定系列 | 类别视觉关键词 |

### 日历记录

日历按自然月展示，日期详情展示当天完整记录。用户能通过日历理解自己不是“有没有完美坚持”，而是“在哪些天做了哪些小行动”。

## 十四、技术约束

- 推荐实现为单页 HTML，内嵌 CSS、JS、SVG，可离线运行。
- 不依赖外部 UI 框架；如使用图像生成 API，前端不得硬编码私密 API key。
- localStorage 保存轻量用户进度；IndexedDB 保存图片 Blob 和缓存 metadata。
- 所有时间计算使用本地日期，避免 UTC 导致打卡跨日错误。
- 移动端优先，适配 360px 宽度到桌面宽屏。
- 交互控件触摸目标不小于 44px。
- 核心 UI 在无图片 optional 资产时仍可进入，但 required 图片缺失时必须走资产准备页。
- 动画目标 30fps 以上；粒子数量控制在 10-30 个。
- 尊重 `prefers-reduced-motion`。
- 若浏览器不支持 IndexedDB，必须提示图片缓存不可用并阻止依赖 required 图片的完成状态。
- 内容提取和图片 prompt 生成逻辑都不作为最终用户主流程出现；最终用户只会看到首次启动图片资产准备页和完成后的习惯打卡体验。

## 十五、开发指引

1. 读取完整 `skills/内容文件`，建立内容来源表，不得只看摘要或标题。
2. 从内容中提取建议、步骤、观点、场景、边界和情绪气质。
3. 生成 40-50 张习惯卡；内容不足时生成 24-36 张并报告原因；内容丰富时最多 60 张。
4. 为每张习惯卡写入 `source_trace`，确保习惯名和行动建议可追溯。
5. 根据内容聚类生成 4-8 个习惯类别。
6. 生成动态画风选择结果：`STYLE_SELECTION_RESULT` 和统一 `STYLE_PROMPT_BASE`。
7. 生成 `IMAGE_ASSET_MANIFEST`，所有真实位图资产的 `generation_timing` 均为 `first-run-cache`。
8. 实现 `IMAGE_ASSET_RUNTIME_STATE` 和 IndexedDB 缓存记录，确保静态计划、运行时 ready 状态和缓存 Blob 分层清楚。
9. 实现首次启动资产准备页，检查 IndexedDB 缓存；cache hit 只 load/decode，不调用生图；cache miss 才生成缺失 required 图片并写入 IndexedDB。
10. 实现标题页、抽卡页、习惯详情、打卡页、奖励揭示、日历、图册、设置页。
11. 实现抽卡平衡：默认主卡、加练卡、有限换抽、稀有度反馈、类别去重。
12. 实现 daily records、streak、completion rate、unlocked rewards、image cache records。
13. 实现 semi-strict 自检：移除高风险健康建议和无来源行动。
14. 执行响应式、动画、缓存、数据恢复和验收测试。

## 十六、验收标准

### 功能验收

- 用户能从标题页进入今日抽卡。
- 每天默认可抽 1 张主卡，并能有限换抽。
- 用户能完成打卡，记录心情和备注。
- 日历能显示当天完成状态，点击日期能查看习惯、心情、备注和奖励。
- 连续天数、最佳连续天数、7 日完成率、30 日完成率和全部完成率计算正确。
- 奖励图册能展示已解锁和未解锁奖励。

### 随附内容文件验收

- 实现者读取了每个内容文件的完整内容。
- 习惯卡名称和每日行动建议能追溯到内容文件。
- 分类、奖励主题和画风选择能说明与内容文件的关系。
- 未从内容文件获得依据的习惯不得伪装成已提取内容。

### 生图验收

- `IMAGE_GENERATION_TIMING` 明确为 `first-run-cache`。
- `IMAGE_ASSET_MANIFEST` 字段完整，包含 `plan_status`、`initial_runtime_status`、`seed_source`、`storage_driver`、`prompt_hash` 和 `cache_key`。
- `IMAGE_ASSET_RUNTIME_STATE` 字段完整，required 图片在用户进入核心体验前全部 `ready = true`。
- IndexedDB 缓存记录包含 `asset_id`、`asset_manifest_version`、`cache_key`、`prompt_hash`、`blob`、`mime_type`、`status`、`created_at`、`updated_at` 和 `error`。
- 页面引用真实位图 Blob 生成的 object URL 或等效缓存读取结果。
- CSS/SVG/Canvas/emoji/文字占位未被当作真实生图奖励。
- 生图失败时显示资产 ID、用途、原因和重试入口；必需图片失败时不得标记完成。

### 首次启动图片缓存验收

- 首次缺图时显示主题化资产准备页。
- 图片生成后写入 IndexedDB。
- 刷新或下次打开时直接读取缓存；在 `cache_key` 命中且 Blob 可 load/decode 时，不得调用生图工具/API。
- prompt、画风基底或 spec 版本变化时只重生成失效图片。
- 同一图片生成时必须有生成锁，刷新、双击或多标签页不得并发重复调用生图。
- optional 图片缺失时有清楚等待状态，不影响不依赖该图片的页面。

### 视觉验收

- 标题不是普通 `<h1>`，具备主题化字体和装饰。
- 抽卡、打卡、日历、图册视觉风格统一。
- 画风由内容动态选择，不固定套用同一主题。
- 卡片、按钮、面板、未解锁态和奖励揭示均有主题化设计。
- 粒子和动效不遮挡核心内容，支持 `prefers-reduced-motion`。
- 移动端文字不溢出、不重叠。

### 交互验收

- 抽卡、换抽、接受、打卡、奖励揭示、日历切换都有明确反馈。
- 屏幕切换不能瞬切。
- hover、active、disabled、loading、success、error 状态完整。
- 断签文案温和，不制造羞辱或强迫感。

### 数据验收

- localStorage 数据结构包含 daily records、draw state、streak、completion rate、unlocked rewards。
- IndexedDB 图片缓存记录包含 asset_id、asset_manifest_version、cache_key、prompt_hash、blob、mime_type、status、created_at、updated_at、error。
- localStorage 不保存图片、base64、大 data URL、Blob 字符串或 object URL。
- 日期计算按本地自然日执行。
- 数据重置需要二次确认。
- 数据导出结果能包含用户记录和奖励解锁状态。

### 响应式验收

- 360px 宽度下可完整抽卡、打卡、查看日历和奖励。
- 桌面端不出现过宽文本行或卡片稀疏失衡。
- 触摸目标不小于 44px。
- 低性能设备上粒子和动画不明显卡顿。

### 准确性 / 一致性验收

- 健康和自我管理建议温和、低风险、可执行。
- 不承诺治疗、减肥、疾病改善、心理疗效或确定人生结果。
- 不生成极端节食、过度运动、睡眠剥夺、停止用药、替代诊疗等高风险行为。
- 如果内容文件不适合直接习惯化，已抽象成观察、记录、反思、整理、沟通、学习、休息等通用行为。

### 产品形态验收

- 最终用户流程从已完成产品开始，不包含上传文件、输入内容、点击生成等工具流程。
- 内容提取、分类和 prompt 生成均属于构建 / 填充阶段。
- 资产准备页只用于首次启动图片缓存，不是用户操作内容生成工具。

### 设计粒度验收

- spec 定义的是可填充玩法框架，而不是单本书的一次性固定实例。
- 习惯卡、类别、奖励、画风和图片 prompt 主要通过槽位、规则和 Schema 表达。
- 不同内容文件能复用同一玩法结构生成不同习惯卡池和视觉体验。
