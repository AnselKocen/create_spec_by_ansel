# 任意书多邻国式互动学习 app 设计文档

## 一、产品概览

| 维度 | 值 |
|------|-----|
| 产品名称 | {{GAME_NAME}} |
| 来源素材 | {{BOOK_NAME}} |
| 设计粒度 | 可填充玩法框架 |
| 玩法结构 | 线性章节式互动学习：5-7 章，每章 4-6 个轻量互动 + 1 个章节综合应用 |
| 产品类型 | 单本书内的已填充完成学习产品 |
| 核心主题槽位 | `{{CORE_THEME}}`：从本书全文提炼的核心学习主题 |
| 目标体验 | 用户学完后能说“我懂这本书了”，并愿意把通关报告或分享卡发给朋友 |
| 目标用户 | 想系统学一本书但读不下 / 没耐心的人 |
| 明确不服务 | 已读过这本书、主要想做笔记 / 摘录 / 二次创作的人 |
| 交互方式 | 拖拽排序、二选一辨别、文本复述、引用反驳、场景应用、章节综合反馈 |
| 内容规模 | 5-7 个学习章节；每章 3-7 个核心概念；每章 4-6 个互动；每章 1 个综合应用 |
| 图片资产 | 标题页书封意象图、书籍主题吉祥物、全书通关庆祝 CG；不生成章节插图、分享卡背景图或概念意象图 |
| 生图时机 | `first-run-cache` |
| 准确性模式 | `semi-strict`：书内内容必须准确，互动表达可剧本化 |

本 spec 用于把上游流程中用户上传的一本书，转化为一个最终用户可直接打开学习的互动 app。上传、解析、章节切分、互动生成、原文锚点绑定、图片资产计划生成属于构建 / 填充阶段；最终用户进入的是已经填充完成的单本书学习产品，不看到上传文件、输入书名、选择生成参数或点击生成产品的流程。

对错标准的唯一权威是本书自身。产品不引入外部百科、其他书、模型通识或现实世界裁判来判断本书观点是否“正确”；它只判断用户回答是否符合本书原文、结构和论证。

## 二、涉及的 SKILL / 内容文件清单

完整内容文件会与本 spec 一起提供，通常位于项目根目录的 `skills/` 文件夹中。构建产品时，必须读取每个文件的完整内容，并从中提取本 spec 需要的内容。

| 内容文件路径 | 覆盖模块 | 在本产品中的用途 |
|-------------|----------|------------------|
| `skills/{{BOOK_ID}}/full-text.md` | 全书结构化正文 | 章节切分、核心概念抽取、题面生成、标准答案、错答反馈、复述评估、金句来源 |
| `skills/{{BOOK_ID}}/toc.json` | 全书目录和层级 | 章节脉络拖拽的标准顺序、5-7 章学习单元聚合、章节标题来源 |
| `skills/{{BOOK_ID}}/anchor-index.json` | 段落级原文锚点索引 | 所有互动、反馈、引用、金句、综合关评分依据的可追溯 anchor |
| `skills/{{BOOK_ID}}/metadata.json` | 书名、作者、题材、目标读者、估时、语言等元信息 | 视觉风格、吉祥物、章节数量、互动组合、学习节奏和难度推导 |

实现者必须读取每个内容文件的完整内容，不得只依赖摘要、文件名、目录标题或索引说明来生成核心学习内容。每一道互动题、每一段错答反馈、每一个复述评估结果、每一个章节综合关评分依据和每一句通关金句，都必须能追溯到 `full-text.md` 中的原文段落，并填入 `anchor-index.json` 中有效的 anchor ID。

### 内容提取维度

| 提取维度 | 从书中提取什么 | 在本产品中映射到 |
|----------|----------------|------------------|
| 对象 / 概念 | 核心术语、人物、案例、工具、关键名词、重要比喻 | `key_concepts`、概念排序、概念关系图、章节总结 |
| 过程 / 结构 | 目录顺序、论证路径、故事阶段、方法步骤、时间线 | `chapters`、章节脉络拖拽、章节路径地图 |
| 规则 / 论断 | 判断标准、主张、原则、结论、限制条件 | 真伪辨别、反向考核、应用题标准答案 |
| 关系 | 因果、层级、对立、依赖、递进、例证关系 | 概念关系图、应用题场景、章末总结 |
| 冲突 / 误解 | 常见误读、相似但错误的说法、概念混淆、过度简化 | 错误项、错答反馈、反向考核题面 |
| 感受 / 气质 | 书的题材、情绪、时代感、媒介感、表达风格 | UI 风格、吉祥物、生图提示词、粒子氛围 |
| 可验证内容 | 原文段落、定义、引用、目录、案例、必要条件 | `source_anchor`、评分依据、内容验收 |
| 可应用内容 | 方法、框架、可迁移洞见、实践步骤、价值判断 | 章节综合应用、通关报告里的“我学会了什么” |

### 内容使用验收重点

- 实现者需要读取完整内容文件。
- 核心内容应能追溯到文件原文。
- 摘要、文件名和标题只能作为导航，不作为核心内容依据。
- 如果某道题没有足够原文依据，必须删题、改为开放讨论，或要求补充内容，不得臆造标准答案。

## 三、目标用户

| 用户维度 | 描述 |
|----------|------|
| 核心用户 | 想系统学一本书，但被长文本、专业概念、拖延或耐心不足卡住的人 |
| 使用动机 | 想快速建立“我懂这本书”的结构感，而不是做精读笔记 |
| 使用场景 | 通勤、睡前、午休、周末集中学习、朋友推荐一本书后想快速掌握 |
| 设备偏好 | 移动端竖屏优先，桌面端兼容 |
| 体验门槛 | 假设用户没有读过这本书；不要求先理解专业背景 |
| 不适合人群 | 已经读完本书、主要想做摘录、批注、笔记整理或论文引用的人 |

产品语气应像一个轻量陪练，而不是考试系统。它鼓励用户在短章节中持续推进，用反馈、原文锚点和章末总结帮助用户建立理解。

## 四、产品目的

### 核心价值

把任意一本书转化为可完成、可反馈、可分享的阶段式学习体验。用户不是被动阅读摘要，而是在每章中通过排序、辨别、复述、反驳和应用，逐步掌握本书核心结构、关键概念和代表性观点。

本框架的可复用性在于：同一套章节学习机制和互动菜单，可以根据不同书的全文、目录、锚点和题材自动填充为不同的学习产品。

### 成功标准

| 成功标准 | 验收方法 |
|----------|----------|
| 5-7 章能覆盖本书主干结构 | 抽查章节划分，确认每章有目录或原文证据 |
| 每章 4-6 个互动都有书内依据 | 每个互动必须有 `source_anchor` 或等效 anchor 字段 |
| 用户能通过章末总结说清本章核心概念 | 章末总结必须包含 3-5 个核心概念、关系图和原文金句 |
| 互动不是普通选择题堆叠 | 每章至少混合 2 种互动类型，且互动选择匹配章节内容 |
| 对错标准不漂移到外部权威 | 验收时抽查反馈和标准答案，必须回到本书原文 |
| 分享结果有社交表达力 | 通关报告包含书名、掌握概念数、学习战绩、原文金句和分享卡 |

## 五、视觉风格规范

### 整体气质

视觉不锁死“多邻国绿”，也不把所有书都做成同一种卡通界面。多邻国式参考只用于轻量路径、章节解锁、即时反馈、吉祥物陪伴和通关庆祝；画风、色彩、材质和粒子必须从本书题材与气质推导。

构建阶段必须从 `metadata.json` 和 `full-text.md` 中分析：

| 分析项 | 输出 |
|--------|------|
| 书籍题材 | 学术、科普、哲学、历史、商业、自助、文学、小说、科技、传统文化等 |
| 表达气质 | 严谨、温柔、激烈、荒诞、沉思、实用、浪漫、冷静、神秘等 |
| 学习难度 | 入门、进阶、专业、经典文本、轻阅读 |
| 视觉媒介 | 图鉴、手稿、数据卡、绘本、胶片、国潮、赛博、极简等 |
| UI 质感 | 书页、卡片、档案、学习路径、仪表盘、印章、手账、游戏 HUD |
| 动效气质 | 纸屑、墨点、光斑、扫描线、星尘、卡片翻转、路径点亮 |

### 风格基底生成

每本书必须生成一套统一 `STYLE_PROMPT_BASE`：

```text
STYLE_PROMPT_BASE =
媒介 + 情绪 + 题材/时代/文化 + 材质 + 光影 + 构图 + 质量要求 + 禁止文字要求
```

同一本书内所有真实位图资产共享同一 `STYLE_PROMPT_BASE`，再为每张图片追加主体、场景、动作、符号、构图和光影。

### 推荐风格映射

| 书籍题材 | UI / 图片方向 |
|----------|---------------|
| 学术 / 科普 / 专业书 | 知识图鉴、精细线稿、浅底深字、标注清晰、学院感 |
| 哲学 / 历史 / 经典 | 复古手稿、档案纸、印章、墨迹、沉稳衬线标题 |
| 商业 / 管理 / 自助 | 现代数据卡、仪表盘、目标进度、清爽色块 |
| 文学 / 小说 / 童话 | 绘本、胶片、分镜、柔和插画、叙事情绪 |
| 心理 / 自我成长 | 现代极简、柔和留白、温和陪伴感 |
| 科技 / 未来 / 计算机 | 全息 HUD、扫描线、代码雨、霓虹高亮但保证阅读 |
| 中国传统 / 武侠 / 古典 | 国潮、工笔、纹样、卷轴、印章、宣纸纹理 |

### UI 要求

- 标题不能只是普通 `<h1>`，必须有主题化字体效果、描边、阴影、渐变裁切、SVG 装饰或入场动画。
- 主按钮使用大而清晰的点击区域，具备厚度感或主题化材质；hover / active / disabled 状态必须明确。
- 章节路径地图是核心首页视觉之一，用 SVG path 绘制路径，用节点表示未解锁 / 当前 / 已完成状态。
- 卡片、题面、反馈弹窗、原文锚点弹层必须视觉区分，不能全部是默认白色矩形。
- 对错反馈不能只改文字，必须结合图标、颜色、动效和原文锚点。
- 移动端文字不得溢出按钮或卡片；长书名、长章节名必须换行或缩略并保留完整 tooltip / 展开状态。
- 颜色不能被单一色相统治；正确、错误、当前章节、已完成、锁定状态必须有清晰差异。

### 粒子 / 氛围

| 场景 | 粒子 / 氛围 | 数量 | 实现 |
|------|-------------|------|------|
| 资产准备页 | 与书籍风格匹配的轻粒子，如纸屑、墨点、光斑、扫描线、星尘 | 10-20 | SVG / CSS |
| 标题页 | 慢速主题粒子，强化书籍气质 | 12-24 | SVG / CSS |
| 答对 | 高亮脉冲 + 勾图标绘制 | 1-3 | SVG + CSS |
| 答错 | 一次性警示脉冲，不持续恐吓 | 1 | CSS |
| 章节完成 | 轻量撒花、路径节点点亮 | 20-40 | SVG + CSS |
| 全书通关 | 撒花、烟花、连击数字、吉祥物庆祝 | 50-100 | SVG / CSS，可降低动效 |

粒子必须 `pointer-events: none`，不得遮挡核心文字、按钮或拖拽目标。必须支持 `prefers-reduced-motion`：关闭连续背景粒子，保留必要的状态反馈和路径点亮。

### SVG / CSS 结构可视化指南

| 可视化对象 | 推荐技术 | 关键绘制点 |
|------------|----------|------------|
| 章节路径地图 | SVG path + 节点组件 | 贝塞尔曲线路径；节点显示 locked / current / done；已完成路径用 `stroke-dasharray` 点亮 |
| 章节进度环 | SVG circle | 使用 `stroke-dasharray` 表示本章完成度；颜色跟随章节主题 |
| 概念关系图 | SVG nodes + edges | 节点 4-8 个；关系类型用颜色、箭头和虚线编码；hover 展开原文 anchor |
| 答对勾 / 错答提示 | SVG path + CSS 动效 | 勾图标使用描边绘制动画；错答只短时脉冲，不长期污染题面颜色 |
| 锁定 / 解锁 | SVG lock / chain icon | 解锁时路径节点点亮、锁图标消失或断裂 |
| 分享卡 | HTML/CSS/SVG + 可选背景图 | 战绩文字层必须清晰；金句区域预留足够行高 |

### 概念关系图专项要求

概念关系图是章末核心学习可视化，不得降级成装饰图。

| 对象 | 质感 / 绘制方式 |
|------|------------------|
| 概念节点 | 圆角矩形或主题化标签；最小宽度固定；长概念可换行；节点内显示概念名和来源章节角标 |
| 因果连线 | 实线箭头；主色深色；箭头不得压住节点文字 |
| 对立连线 | 双向箭头或红 / 橙警示色；不得与错答反馈色混淆 |
| 层级连线 | 虚线单向箭头；浅主色；表现上位 / 下位概念 |
| 依赖连线 | 单向箭头 + 端点圆点；用于“先理解 A 才能理解 B” |
| 图例 | 固定在右下或底部；移动端折叠为图例按钮 |
| 原文浮层 | hover / tap 节点时显示对应定义或关键原文片段，不改写原文 |

常见画错点：

- 节点之间连线不得大量交叉；需要力导向布局或预设拓扑。
- 连线不得穿过节点文字；起止点必须从节点边缘计算。
- 移动端节点不得小到无法点击；触控目标至少 44px。
- 关系颜色不得和正确 / 错误反馈色语义冲突。
- 概念名过长时不得溢出节点，必须换行或缩略。
- 图例不得遮挡节点或弹层。

## 六、生图策略与资产契约

本产品需要真实位图资产。图片生成是资产闸门，不是可选视觉增强。所有需要真实图片的核心位置，都应通过资产准备页确认图片已经生成、写入 IndexedDB、加载并可展示。required 图片是进入正常图片体验的闸门，不是阻止用户进入产品的死锁；如果任何 required 或 optional 图片生图、URL 转 Blob、load/decode 失败，或准备流程超时 / 用户取消，必须允许用户跳过资产准备页进入明确的 no-image 兜底体验。

### IMAGE_GENERATION_TIMING

```text
IMAGE_GENERATION_TIMING = first-run-cache
```

最终 app 首次启动时先检查 IndexedDB 缓存。cache hit 时读取缓存 Blob、加载并解码；cache miss 时显示主题化资产准备页，调用生图能力生成缺失图片，并逐张写入 IndexedDB。之后刷新或再次打开同一浏览器 / 同一 origin 时，优先读取 IndexedDB 缓存，不重新生成已经准备好的图片。

### 图片资产范围

| 资产 ID 模式 | 数量 | 用途 | required |
|--------------|------|------|----------|
| `book_cover_hero` | 1 | 标题页书封意象图，提供第一眼主题信号 | true |
| `mascot_master` | 1 | 书籍主题吉祥物主形象 | true |
| `finish_celebration_cg` | 1 | 全书通关庆祝图 | false |

本产品只生成以上 3 类真实位图资产。不生成章节插图、分享卡背景图或概念意象图；章节入口、章末回顾、概念关系图和分享卡背景全部由 HTML / SVG / CSS 主题化实现，不登记为真实生图资产。

资产准备页把 required 和 optional 图片纳入同一批准备队列，cache miss 时一起尝试生成并写入 IndexedDB。`book_cover_hero` 和 `mascot_master` 是进入正常图片体验前的 required 图片；`finish_celebration_cg` 是通关页可选增强，失败不阻塞核心学习。任意 required 或 optional 图片失败、超时或用户取消时，都必须允许用户跳过资产准备页进入 no-image 兜底体验；失败资产保持 failed / ready=false，并显示重试入口，不得把失败状态标记成已完成。

### 什么是生图

- 调用真实图像生成模型、工具或 API，输入完整 prompt，获得真实 PNG / WebP / JPG 等位图文件。
- 图片数据可以在最终 app 首次启动时生成，并以 Blob 写入 IndexedDB。
- 用户进入依赖图片的体验时，页面展示的图片必须来自已生成并通过 IndexedDB 缓存准备流程确认可用的位图资产。

### 什么不是生图

- CSS 渐变不是生图。
- SVG path / circle / polygon 不是生图。
- Canvas 绘制不是生图。
- emoji / Unicode 拼贴不是生图。
- 文字描述“这里有图”不是生图。
- CSS / SVG / Canvas 可以用于 UI 和临时失败态，但不能登记为真实图片生成结果。

### 统一画风基底

每本书必须先生成 `STYLE_PROMPT_BASE`，所有图片共享同一基底。每张图片的完整 prompt 必须等于：

```text
STYLE_PROMPT_BASE + 具体主体 + 书籍符号 + 场景 / 姿态 + 光影 + 构图 + 禁止文字要求
```

每张图片 prompt 至少 30 个英文词或等量详细描述。图片内不得生成可读文字、书名、水印、签名或 UI 文案；文字层由 HTML / SVG 绘制。

### Prompt 模板

`book_cover_hero`：

```text
{{STYLE_PROMPT_BASE}}, hero visual for the book "{{BOOK_NAME}}",
symbolic composition evoking {{CORE_THEME}}, important objects and motifs from the book,
clear central visual hierarchy, no readable text, no logo, no watermark,
cinematic but readable atmosphere, 16:9 horizontal, high quality
```

`mascot_master`：

```text
{{STYLE_PROMPT_BASE}}, single friendly learning mascot inspired by {{BOOK_GENRE}} and {{CORE_THEME}},
{{MASCOT_FORM}}, {{MASCOT_PERSONALITY}}, full body standing pose,
welcoming expression, simple silhouette, suitable for UI overlay,
transparent or clean background, no text, 1:1 square, high quality
```

`finish_celebration_cg`：

```text
{{STYLE_PROMPT_BASE}}, celebration scene for finishing the book "{{BOOK_NAME}}",
{{MASCOT_FORM}} mascot celebrating with symbolic objects from {{CORE_THEME}},
confetti and warm light, triumphant but not childish, no readable text,
16:9 horizontal, high quality
```

项目级 `negative_prompt`：

```text
low quality, blurry, distorted anatomy, unreadable text artifacts, watermark, signature, logo, extra text, duplicated mascot, cluttered composition
```

### 静态 IMAGE_ASSET_MANIFEST

实现核心页面前必须先输出并核对静态 `IMAGE_ASSET_MANIFEST`。静态计划层只描述“需要哪些图片、如何生成、缓存键是什么”，不得把未生成图片写成 `status = "generated"`。

每个资产至少包含：

| 字段 | 说明 |
|------|------|
| `id` | 图片唯一 ID |
| `purpose` | 用途说明 |
| `required` | 是否为进入核心体验前必须完成 |
| `plan_status` | 固定为 `required` / `optional`，不得表示已经生成 |
| `initial_runtime_status` | `pending` / `seed_available` |
| `style_prompt_base` | 本书统一画风基底 |
| `prompt` | 该图片完整正向提示词 |
| `negative_prompt` | 项目级短模板 |
| `aspect_ratio` | 16:9 / 4:3 / 1:1 / 9:16 |
| `generation_timing` | `first-run-cache` |
| `cache_key` | `{{book_id}}:{{asset_manifest_version}}:{{asset_id}}:{{prompt_hash}}` |
| `prompt_hash` | `prompt + style_prompt_base + negative_prompt + asset_manifest_version` 的哈希 |
| `seed_source` | `{ "type": "none" }` |
| `storage_driver` | `indexeddb_blob` |
| `safety_requirement` | 如适用，写 `must_pass_before_ready` |

### 运行时 IMAGE_ASSET_RUNTIME_STATE

运行时必须为每张图片维护状态记录：

| 字段 | 说明 |
|------|------|
| `asset_id` | 对应 manifest 中的 ID |
| `cache_key` | 与静态计划一致 |
| `generation_status` | `pending` / `generating` / `generated` / `failed` |
| `cache_status` | `not_checked` / `cache_hit` / `cache_miss` / `cached` / `cache_corrupt` |
| `cached_blob_ref` | IndexedDB store 名与 cache key，不存临时展示地址 |
| `loaded` | 是否已被浏览器加载 |
| `decoded` | 是否已完成解码 |
| `ready` | 生成或缓存成功、加载完成、解码完成且安全状态通过后才为 true |
| `error` | 失败原因 |

`book_cover_hero` 和 `mascot_master` 必须全部 `ready = true` 后才能进入正常图片体验。`finish_celebration_cg` 若失败，`ready` 可以为 false，但必须保留错误状态和用户可见的重试入口。任意图片失败、超时或用户取消资产准备时，用户必须可以进入明确标记的 no-image 兜底体验；失败资产不得标记为 ready。

### IndexedDB 缓存记录

IndexedDB 缓存记录至少包含：

| 字段 | 说明 |
|------|------|
| `cache_key` | 稳定缓存键 |
| `asset_id` | 图片 ID |
| `asset_manifest_version` | 资产清单版本 |
| `prompt_hash` | 提示词哈希 |
| `blob` | 图片 Blob |
| `mime_type` | `image/png` / `image/webp` / `image/jpeg` |
| `created_at` | 首次写入时间 |
| `updated_at` | 最近更新时间 |
| `status` | `cached` / `generating` / `failed` |
| `error` | 失败原因 |

如果生图结果返回 `http://.../__runtime/llm-images/...` 这类 runtime 临时图片 URL，必须在 `fetch` / `imageUrlToFile` / Blob 转换前，把同域 HTTP 临时 URL 规范化为 HTTPS 或同源相对 URL；不得直接 fetch 原始 HTTP 临时 URL。

IndexedDB 是运行时生成图片的持久化位置。页面显示时可以用 `URL.createObjectURL(blob)` 创建本次会话 object URL，但 object URL 不能当作长期存储，页面卸载或图片替换时应释放。localStorage 只能保存轻量进度、版本号、学习状态和图片版本 metadata；不得保存图片、base64、大 data URL、Blob 字符串、object URL 或生成结果。

### 首次启动缓存流程

```text
打开 app
→ 读取 IMAGE_ASSET_MANIFEST
→ 为每张图片计算 / 校验 cache_key
→ 查询 IndexedDB
→ cache hit：读取 Blob → 创建本次会话 object URL → load/decode → ready = true
→ cache miss：设置 generation lock → 调用真实生图能力 → 若返回同域 runtime HTTP 临时 URL，先规范化为 HTTPS 或同源相对 URL → 转 Blob → 写入 IndexedDB → 创建本次会话 object URL → load/decode → ready = true
→ required 图片全部 ready
→ 进入正常图片体验标题页
→ optional 图片若未 ready，保留重试入口和状态提示
→ 任意图片失败 / 超时 / 用户取消：失败资产保持 failed / ready=false，用户可跳过资产准备页进入 no-image 兜底体验
```

cache hit 时不得调用生图工具/API。只有 cache miss、缓存损坏、prompt / 画风基底 / manifest 版本变化，或用户明确点击重新生成时，才允许重新调用。

必须使用生成锁避免重复生图。优先使用 `navigator.locks`；不支持时，用 IndexedDB 中的 `generation_lock` 记录实现。前端不得硬编码私密 API key；若需要云端生图，必须经受控后端或安全代理调用。

### 资产准备页

资产准备页文案示例：

```text
正在为《{{BOOK_NAME}}》准备学习视觉…
```

要求：

- cache hit 时只显示短暂“正在打开《{{BOOK_NAME}}》”，不得显示“正在生成”。
- cache miss 时显示已完成数量 / 总数量、当前图片用途、缓存状态和失败重试入口。
- 页面本身必须有主题化 UI、粒子、进度条和吉祥物占位姿态。
- required 图片失败、超时或用户取消时，资产准备页显示资产 ID、用途、失败原因、重试按钮和“跳过图片继续”入口。跳过后进入 no-image 兜底体验，不得把失败 required 图片标记为 ready。
- optional 图片失败、超时或用户取消时可以进入正常学习流程；通关页的全书庆祝图位置必须显示“图片准备失败，可重试”，不得伪装完成。
- no-image 兜底体验需要隐藏或弱化封面图、吉祥物和通关庆祝图区域，用 HTML / SVG / CSS 主题化界面保持产品可学、可玩、可通关。

### 如果无法生图

必须明确告诉用户：

> 我需要生图能力来生成这些图片，但当前没有可用的生图工具。请提供生图工具/API，或者告诉我如何调用。

在生图能力可用之前，不得交付声称完成的正常图片体验，不得用 CSS / SVG / Canvas / emoji / 文字占位替代真实图片。可以进入明确标记的 no-image 兜底体验，但失败资产必须保持 failed / ready=false，并保留重试入口。

## 七、功能清单

### P0 必做

| 功能 | 解决什么问题 | 输入 | 输出 |
|------|--------------|------|------|
| 资产准备页 | 确保真实图片可用并避免重复生图 | `IMAGE_ASSET_MANIFEST`、IndexedDB 缓存状态 | required 图片 ready 后进入正常图片标题页；失败 / 超时 / 用户取消时进入 no-image 兜底体验 |
| 标题页 | 建立书籍主题和学习入口 | 书封意象图、书名、核心主题、吉祥物；no-image 时使用主题化 SVG/CSS 标题层 | 开始 / 继续学习 |
| 章节路径地图 | 呈现 5-7 章学习路线和进度 | 章节数据、用户进度 | 当前章入口、已完成 / 锁定状态 |
| 章节介绍页 | 说明本章要掌握什么 | 章节目标、核心概念、SVG/CSS 主题化章节卡 | 进入互动序列 |
| 互动序列 | 用轻量互动推进学习 | 4-6 个互动任务 | 即时反馈、原文锚点、进度推进 |
| 概念排序 | 训练本书逻辑顺序或方法步骤 | 概念列表、正确顺序 anchor | 拖拽结果、正误反馈 |
| 复述测试 | 检查用户是否能用自己的话说出核心观点 | 用户输入、原文 anchor、关键点 rubric | AI 高亮差异、遗漏和准确点 |
| 应用题 | 让用户把书中观点用于具体场景 | 场景题、书内原则 anchor | 场景反馈、原文依据 |
| 反向考核 | 训练用户识别并反驳常见误读 | 错误论断、候选原文或输入框 | 有效反驳反馈、原文依据 |
| 章节脉络拖拽 | 帮用户掌握章节结构 | 章节标题 / 段落标题、标准顺序 | 排序反馈 |
| 真伪辨别 | 区分书里观点和相似误读 | 书内观点、相似错误项 | 二选一反馈 |
| 章节综合应用 | 整合本章核心概念 | 综合任务、用户输入 | 开放性 AI 反馈、原文锚点 |
| 章末总结 | 固化本章收获 | 核心概念、金句、关系图 | 本章总结卡、下一章解锁 |
| 全书通关页 | 提供完成感和分享动机 | 学习战绩、掌握概念、金句、可选全书庆祝 CG | 通关报告、分享卡 |
| 分享卡生成 | 让用户愿意发给朋友 | CSS/SVG 主题背景、战绩、书名、金句 | 可保存图片，PNG / JPG 均可 |
| 本地进度保存 | 防止中断丢失 | 章节进度、答题历史、反馈摘要 | localStorage 轻量存档 |

### P1 可选

| 功能 | 说明 |
|------|------|
| 难度模式 | 轻松 / 标准 / 高挑战；影响重答、提示、错题复习和庆祝强度，不影响书内标准答案 |
| 答题回看 | 通关后查看题目、自己的答案、原文依据和复述反馈 |
| 原文阅读模式 | 点击 anchor 后查看相关原文段落，帮助复盘 |
| 重新生成可选图片 | 对全书通关庆祝 CG 提供重试入口 |
| 连续学习徽章 | 对多次打开同一本书或连续学习给轻量徽章，不强制社交排名 |

## 八、用户动线

```text
打开 app
  → 检查 IndexedDB 图片缓存
    → cache hit：读取 Blob、创建本次会话 object URL 并加载 / 解码 → 短暂进入标题页
    → cache miss：资产准备页 → 生成缺失图片 → 写入 IndexedDB → required ready
    → 图片失败 / 超时 / 用户取消：跳过图片继续 → no-image 兜底体验
  → 标题页
    → 看到书名、核心主题、书封意象图、吉祥物
    → 点击开始 / 继续
  → 章节路径地图
    → 查看 5-7 章路径、当前章、已完成章、锁定章
    → 点击当前章
  → 章节介绍页
    → 看到章节目标、3-7 个核心概念和 SVG/CSS 主题化章节卡
    → 开始本章
  → 互动循环 4-6 次
    → 题面 + 操作
    → 答对：高亮 + 简短解释 + 原文 anchor
    → 答错：温和提示 + 原文 anchor + 重答 / 继续
  → 章节综合应用
    → 用户输入或完成场景任务
    → AI 给出开放性反馈和原文依据
  → 章末总结
    → 核心概念回顾
    → 概念关系图
    → 本章金句
    → 解锁下一章
  → 重复直到最后一章
  → 全书通关页
    → 通关动效
    → 掌握概念数、学习战绩、章节高光、原文金句
    → 分享卡预览
    → 保存 PNG / JPG 或截图分享
```

用户动线不得从“上传文件 / 输入内容 / 点击生成”开始。那些动作属于构建 / 填充阶段，不是最终用户体验。

## 九、信息结构

```text
App
├─ AssetPreparationPage
│  ├─ AssetStatusList
│  ├─ ProgressBar
│  ├─ ThemeParticles
│  ├─ RetryPanel
│  └─ SkipToNoImageModeButton
├─ TitlePage
│  ├─ BookCoverHero
│  ├─ BookTitleBlock
│  ├─ CoreThemeLine
│  ├─ MascotIntro
│  ├─ NoImageThemeHeader
│  └─ StartOrContinueButton
├─ ChapterPathPage
│  ├─ SVGPathMap
│  ├─ ChapterNode × 5-7
│  ├─ OverallProgress
│  └─ CurrentChapterHint
├─ ChapterIntroPage
│  ├─ ChapterThemeCard
│  ├─ ChapterGoal
│  ├─ KeyConceptPreview
│  └─ StartChapterButton
├─ InteractionPage
│  ├─ InteractionHeader
│  ├─ QuestionPanel
│  ├─ InteractionBody
│  ├─ FeedbackPanel
│  ├─ AnchorPopup
│  └─ MascotReaction
├─ ChapterIntegrationPage
│  ├─ TaskPrompt
│  ├─ InputOrActionArea
│  ├─ AIFeedbackPanel
│  └─ ContinueButton
├─ ChapterSummaryPage
│  ├─ KeyConceptReview
│  ├─ ConceptRelationGraph
│  ├─ ChapterQuote
│  ├─ UnlockAnimation
│  └─ NextChapterButton
└─ FinishReportPage
   ├─ CelebrationLayer
   ├─ OptionalFinishCelebrationCG
   ├─ ReportStats
   ├─ ChapterHighlights
   ├─ ShareCardPreview
   ├─ SaveShareImageButton
   └─ ReviewOrRestartActions
```

页面之间使用轻量转场，不瞬切。移动端优先保证 InteractionPage、AnchorPopup、ChapterSummaryPage 的可读性和触控可用性。

## 十、数据设计

### 构建阶段填充产物

```typescript
interface BookProductData {
  book_id: string;
  book_name: string;
  author?: string;
  language: string;
  book_genre: BookGenre[];
  core_theme: string;
  one_line_intro: string;
  estimated_minutes: number;

  source_files: ContentSourceFile[];
  style_selection: StyleSelectionResult;
  mascot: MascotProfile;
  chapters: LearningChapter[];
  image_asset_manifest: ImageAssetManifest;
}

interface ContentSourceFile {
  path: string;
  covered_module: string;
  usage_in_product: string;
  checksum?: string;
}

interface StyleSelectionResult {
  selected_baseline: string;
  style_prompt_base: string;
  ui_tokens: {
    background: string;
    surface: string;
    primary: string;
    accent: string;
    success: string;
    warning: string;
    text: string;
  };
  particle_type: string;
}

interface MascotProfile {
  form: string;
  personality: string;
  master_asset_id: "mascot_master";
  bubble_templates: Record<MascotState, string>;
}

type MascotState =
  | "welcome"
  | "chapter_intro"
  | "correct"
  | "incorrect"
  | "chapter_complete"
  | "finish";
```

### 章节与互动

```typescript
interface LearningChapter {
  chapter_id: string;
  chapter_index: number;
  chapter_title: string;
  source_toc_refs: string[];
  chapter_summary: string;
  learning_goal: string;
  key_concepts: KeyConcept[];
  interactions: Interaction[];
  integration_task: IntegrationTask;
  chapter_quote: SourceQuote;
  concept_relations: ConceptRelation[];
  chapter_visual_theme: string;
}

interface KeyConcept {
  concept_id: string;
  name: string;
  short_definition: string;
  definition_anchor: string;
  required_for_chapter_goal: boolean;
}

type InteractionType =
  | "concept_ordering"
  | "recall_test"
  | "application_question"
  | "reverse_examination"
  | "chapter_outline_drag"
  | "truth_discrimination";

interface Interaction {
  interaction_id: string;
  chapter_id: string;
  type: InteractionType;
  prompt: string;
  source_anchor: string;
  difficulty_hint: "easy" | "standard" | "challenge";
  payload: InteractionPayload;
  correct_answer: unknown;
  feedback: FeedbackRule;
}

interface FeedbackRule {
  success_message: string;
  error_message: string;
  explanation_anchor: string;
  reveal_original_text: boolean;
}
```

### 互动 payload

```typescript
type InteractionPayload =
  | ConceptOrderingPayload
  | RecallTestPayload
  | ApplicationQuestionPayload
  | ReverseExaminationPayload
  | ChapterOutlineDragPayload
  | TruthDiscriminationPayload;

interface ConceptOrderingPayload {
  items: { id: string; label: string; source_anchor: string }[];
  correct_order: string[];
  ordering_basis: "logic" | "causal" | "method_step" | "chronology";
}

interface RecallTestPayload {
  source_excerpt_anchor: string;
  required_key_points: { id: string; text: string; anchor: string }[];
  forbidden_misreadings: { text: string; anchor: string }[];
  min_required_points: number;
}

interface ApplicationQuestionPayload {
  scenario: string;
  expected_principles: { concept_id: string; anchor: string }[];
  acceptable_answer_rubric: string[];
}

interface ReverseExaminationPayload {
  false_claim: string;
  valid_refutation_anchors: string[];
  distractor_anchors?: string[];
}

interface ChapterOutlineDragPayload {
  shuffled_items: { id: string; title: string; toc_ref: string }[];
  correct_order: string[];
}

interface TruthDiscriminationPayload {
  candidates: [
    { id: "a" | "b"; text: string; is_from_book: boolean; anchor?: string },
    { id: "a" | "b"; text: string; is_from_book: boolean; anchor?: string }
  ];
  wrong_claim_reason: string;
}
```

### 综合应用与报告

```typescript
interface IntegrationTask {
  task_id: string;
  chapter_id: string;
  prompt: string;
  input_mode: "text" | "multi_step_choice" | "mixed";
  evaluation_rubric: {
    required_concepts: string[];
    source_anchors: string[];
    pass_policy: "open_feedback_not_blocking";
  };
}

interface SourceQuote {
  text: string;
  anchor: string;
  usage: "chapter_quote" | "finish_quote" | "feedback";
}

interface ConceptRelation {
  from_concept_id: string;
  to_concept_id: string;
  relation_type: "causal" | "contrast" | "hierarchy" | "dependency";
  source_anchor: string;
}

interface FinishReport {
  mastered_concept_count: number;
  completed_chapters: number;
  total_interactions: number;
  recall_strengths: string[];
  chapter_highlights: string[];
  finish_quote: SourceQuote;
  finish_celebration_asset_id?: "finish_celebration_cg";
}
```

### 运行时用户状态

```typescript
interface UserProgressState {
  book_id: string;
  current_chapter_id: string;
  unlocked_chapter_ids: string[];
  completed_chapter_ids: string[];
  interaction_results: InteractionResult[];
  integration_results: IntegrationResult[];
  finish_report?: FinishReport;
  updated_at: string;
}

interface InteractionResult {
  interaction_id: string;
  attempts: number;
  is_correct: boolean;
  selected_answer?: unknown;
  recall_feedback_summary?: string;
  viewed_anchor_ids: string[];
}

interface IntegrationResult {
  task_id: string;
  user_input: string;
  ai_feedback: string;
  cited_anchor_ids: string[];
  completed: boolean;
}
```

用户进度可存入 localStorage，但只能保存轻量状态。图片 Blob 必须存入 IndexedDB。

### 图片资产 Schema

```typescript
interface ImageAssetManifest {
  asset_manifest_version: string;
  image_generation_timing: "first-run-cache";
  style_prompt_base: string;
  assets: ImageAssetPlan[];
}

interface ImageAssetPlan {
  id: string;
  purpose: string;
  required: boolean;
  plan_status: "required" | "optional";
  initial_runtime_status: "pending" | "seed_available";
  style_prompt_base: string;
  prompt: string;
  negative_prompt: string;
  aspect_ratio: "16:9" | "4:3" | "1:1" | "9:16";
  generation_timing: "first-run-cache";
  cache_key: string;
  prompt_hash: string;
  seed_source: { type: "none" };
  storage_driver: "indexeddb_blob";
  safety_requirement?: "must_pass_before_ready";
}

interface ImageAssetRuntimeState {
  asset_id: string;
  cache_key: string;
  generation_status: "pending" | "generating" | "generated" | "failed";
  cache_status: "not_checked" | "cache_hit" | "cache_miss" | "cached" | "cache_corrupt";
  cached_blob_ref?: { db: string; store: string; cache_key: string };
  loaded: boolean;
  decoded: boolean;
  ready: boolean;
  error?: string;
}

interface NoImageFallbackState {
  no_image_mode: boolean;
  skipped_from_asset_preparation: boolean;
  skip_reason?: "required_failed" | "optional_failed" | "timeout" | "user_cancelled";
  failed_asset_ids: string[];
  retry_available: boolean;
}

interface IndexedDBImageCacheRecord {
  cache_key: string;
  asset_id: string;
  asset_manifest_version: string;
  prompt_hash: string;
  blob: Blob;
  mime_type: "image/png" | "image/webp" | "image/jpeg";
  created_at: string;
  updated_at: string;
  status: "cached" | "generating" | "failed";
  error?: string;
}
```

## 十一、交互设计

### 全局交互

| 操作 / 状态 | 反馈要求 |
|-------------|----------|
| hover / focus | 可点击对象出现轮廓、轻微抬升、阴影或主题高亮；键盘 focus 必须可见 |
| active | 按钮向下压缩或阴影变薄，给出明确按下感 |
| disabled | 降低对比但保持可读，并说明原因，如“完成前不可进入” |
| loading | 显示具体任务名，不使用空白 spinner |
| success | 颜色点亮 + 勾图标 + 简短说明 + 可继续动作 |
| error | 温和警示色 + 原因 + 原文 anchor / 重试入口 |
| unlock | 路径节点点亮，锁图标消失，下一章按钮出现 |

### 六种互动反馈

| 互动类型 | 操作 | 正确反馈 | 错误 / 不足反馈 |
|----------|------|----------|----------------|
| 概念排序 | 拖拽卡片排序 | 卡片归位、顺序线点亮、解释排序依据 | 标出错位区间，展示相关原文 anchor |
| 复述测试 | 文本输入 | 高亮准确点，列出命中的关键概念 | 高亮遗漏、误解和过度发挥，引用原文对照 |
| 应用题 | 选择或输入方案 | 说明命中的书内原则 | 指出未使用或误用的书内原则 |
| 反向考核 | 选择 / 输入原文反驳 | 标出有效反驳点 | 解释所选段落为什么不足以反驳 |
| 章节脉络拖拽 | 拖拽标题顺序 | 路径线点亮，显示原书结构 | 标出前后关系错误，显示目录依据 |
| 真伪辨别 | 二选一 | 展示正确项原文 anchor | 说明错误项的“相似但错”在哪里 |

### 复述测试 AI 反馈

复述测试和章节综合关可以使用运行时 AI 评估，但必须满足：

- AI 只能基于当前题目绑定的原文 anchor、关键点 rubric 和用户输入进行评估。
- 反馈中必须区分“准确复述”“遗漏关键点”“误解原意”“自行发挥”。
- 不得用外部知识纠正本书；只判断是否符合本书原文。
- 前端不得硬编码模型密钥；必须通过受控后端、本地模型或安全代理调用。
- AI 服务不可用时，必须显示“反馈暂不可用”，保留用户输入和重试入口，不得伪造评估。

## 十二、核心机制约束

### 产品形态约束

本 spec 描述的是最终用户直接打开并学习的已填充完成产品。上传书、解析全文、切分章节、生成互动、生成 prompt、绑定 anchor、生成产品数据，全部属于构建 / 填充阶段，不得作为最终用户界面暴露。资产准备页只负责 IndexedDB 图片缓存检查、缺失图片生成和加载确认，不是用户操作内容生成工具。

### 设计粒度约束

本 spec 是可填充玩法框架。具体书名、章节标题、核心概念、题面、标准答案、错误项、金句、图片 prompt 和视觉主题，均由 `skills/内容文件` 填入。实现时不得把示例书、示例章节或无来源观点写死。

### 书内权威约束

- 所有对错标准仅限本书自身。
- 每道题必须有 `source_anchor` 或等效原文依据。
- 真伪辨别的错误项必须是对本书的相似误读，而不是外部事实判断。
- 反向考核必须能用本书原文反驳，不能要求用户引用外部资料。
- 当本书内容与外部事实冲突时，产品只判断“是否符合本书说法”。

### 互动菜单约束

核心互动只允许使用 6 种候选菜单：

1. 概念排序
2. 复述测试
3. 应用题
4. 反向考核
5. 章节脉络拖拽
6. 真伪辨别

每章从菜单中选择 2-3 种搭配，不要求 6 种全部出现。不得为了炫技新增菜单外核心互动，除非用户明确要求扩展 spec。

### 反“答案暴露”约束

参考趣味测试中的反两极分化精神：题目不能让用户一眼看出“正确答案总是更长 / 更书面 / 更像主流价值”。错误项要像真实误读，两个候选说法表面上都应合理，最终通过原文 anchor 判定。

### 准确性模式

准确性模式为 `semi-strict`：

- 核心概念、论断、目录、引用、案例和标准答案必须严格来自本书。
- 应用题场景、吉祥物文案、章节过渡和通关表达可以剧本化。
- 剧本化表达不得改变本书观点、条件、因果或结论。
- 无法从原文支持的内容不得编造成标准答案。

## 十三、内容 / 章节概览

### 章节生成规则

最终产品应生成 5-7 个学习章节。章节划分优先遵循原书目录；当原书章节数量不合适时，可以按主题聚类、论证链、叙事阶段或方法模块重组。

| 原书情况 | 章节处理 |
|----------|----------|
| 原书 5-7 章 | 尽量一一对应 |
| 原书章节过多 | 聚合为 5-7 个学习单元，保留原章节引用 |
| 原书章节过少 | 按主题、论证阶段或案例组拆分 |
| 无清晰目录 | 从全文中提取 5-7 个主题模块，并记录原文依据 |

### 每章结构

```text
{{CHAPTER_TITLE}}
├─ 学习目标：{{CHAPTER_GOAL}}
├─ 核心概念：{{KEY_CONCEPTS}}，3-7 个
├─ 互动序列：{{INTERACTIONS}}，4-6 个
│  ├─ 从 6 种互动菜单中选 2-3 种
│  └─ 每个互动绑定 source_anchor
├─ 章节综合应用：{{CHAPTER_INTEGRATION_TASK}}
├─ 章末总结：核心概念回顾 + 概念关系图
└─ 章节金句：{{CHAPTER_QUOTE}}，必须来自原文 anchor
```

### 互动组合建议

| 章节特征 | 推荐组合 |
|----------|----------|
| 概念 / 术语密集 | 概念排序 + 真伪辨别 + 复述测试 |
| 论证 / 推理密集 | 章节脉络拖拽 + 反向考核 + 真伪辨别 |
| 方法 / 实践导向 | 应用题 + 概念排序 + 复述测试 |
| 文学 / 叙事类 | 章节脉络拖拽 + 复述测试 + 应用题 |
| 哲学 / 思辨类 | 反向考核 + 真伪辨别 + 复述测试 |
| 商业 / 自助类 | 应用题 + 反向考核 + 概念排序 |

### 通关报告

通关报告至少包含：

- 书名：`{{BOOK_NAME}}`
- 核心主题：`{{CORE_THEME}}`
- 掌握概念数：`{{MASTERED_CONCEPT_COUNT}}`
- 完成章节数：`{{COMPLETED_CHAPTER_COUNT}}`
- 三条章节高光：`{{CHAPTER_HIGHLIGHTS}}`
- 一句原文金句：`{{FINISH_QUOTE}}`
- 全书庆祝图：`finish_celebration_cg`；若准备失败，通关页仍可用 CSS/SVG 庆祝层完成，不得把任意 UI 底板标记为 `finish_celebration_cg` 已完成
- 分享卡背景：由 HTML / SVG / CSS 主题化生成，不使用真实位图生图资产

## 十四、技术约束

| 维度 | 要求 |
|------|------|
| 前端形态 | 单页 Web app；可交付为静态站点或单 HTML，具体由实现环境决定 |
| 响应式 | 移动端竖屏优先，兼容桌面端 |
| 数据来源 | 构建阶段读取 `skills/{{BOOK_ID}}/` 下完整内容文件并生成内嵌产品数据 |
| 图片存储 | 运行时生成图片必须以 Blob 写入 IndexedDB |
| 轻量状态 | localStorage 仅保存进度、版本、状态，不保存图片或大数据 |
| AI 评估 | 复述测试 / 综合应用可调用受控后端或本地模型；前端不得硬编码私密密钥 |
| 生图调用 | 首次 cache miss 时通过安全接口调用真实生图能力 |
| 性能 | 首屏资产准备页可立即显示；核心页面切换 < 300ms；拖拽反馈流畅 |
| 无障碍 | 支持键盘 focus、按钮可读标签、颜色不作为唯一状态信号 |
| 动效降级 | 支持 `prefers-reduced-motion` |
| 重访 | 同一浏览器 / 同一 origin 的 IndexedDB 缓存命中后，刷新或再次打开不得重复生图 |

如果运行时 AI 或生图能力不可用，必须显示明确错误和重试入口，不能伪造反馈或图片结果。

## 十五、开发指引

1. 读取 `skills/{{BOOK_ID}}/full-text.md`、`toc.json`、`anchor-index.json`、`metadata.json` 的完整内容。
2. 验证 `anchor-index.json` 能定位全文段落；如果 anchor 不完整，先生成或修复 anchor，再生成互动。
3. 根据目录和全文结构生成 5-7 个学习章节。
4. 为每章提取 3-7 个核心概念、关系、误解点和可应用内容。
5. 为每章从 6 种互动菜单中选择 2-3 种，生成 4-6 个互动。
6. 为每道互动填入 `source_anchor`、正确答案、错误反馈、解释 anchor。
7. 为复述测试生成关键点 rubric、必要术语、常见误解和原文对照策略。
8. 为章节综合关生成开放性任务，评分依据必须回到本书 anchor。
9. 生成每章概念关系图数据：节点、关系类型、图例和 anchor。
10. 生成通关报告规则：掌握概念数、章节高光、原文金句和分享卡字段。
11. 根据 `metadata.json` 和全文气质生成 `STYLE_PROMPT_BASE`、UI token、粒子类型和吉祥物设定。
12. 生成 `IMAGE_ASSET_MANIFEST`，只包含 `book_cover_hero`、`mascot_master`、`finish_celebration_cg`。
13. 实现资产准备页：检查 IndexedDB，cache hit 只读取 Blob、创建本次会话 object URL 并解码，cache miss 生成缺失图片并写入 IndexedDB；任意图片失败、超时或用户取消时提供“跳过图片继续”入口，进入 no-image 兜底体验。
14. 实现生成锁，避免刷新、双击或多标签页重复调用生图。
15. 实现标题页、章节路径地图、章节介绍、互动页、综合关、章末总结和通关报告。
16. 实现复述测试和综合关的 AI 反馈接口，确保只基于绑定 anchor 和 rubric 评估。
17. 实现分享卡导出；PNG / JPG 均可，文字层必须清晰可读，背景由 HTML / SVG / CSS 生成。
18. 执行自检：内容追溯、生图缓存、交互反馈、响应式、准确性和产品形态。

构建阶段动作不得被做成最终用户主流程。最终用户只看到资产准备页和已经完成的学习产品。

## 十六、验收标准

### 功能验收

- [ ] 最终用户打开产品后直接进入资产准备 / 标题页，不出现上传书或生成产品流程。
- [ ] 产品包含 5-7 章，每章 4-6 个互动 + 1 个章节综合应用。
- [ ] 每章只从 6 种互动菜单中选择 2-3 种搭配。
- [ ] 章节路径地图、章节介绍、互动页、章末总结、通关报告可完整走通。
- [ ] 分享卡可保存为图片，PNG / JPG 均可。

### 随附内容文件验收

- [ ] 已读取完整 `full-text.md`，不是只读摘要或目录。
- [ ] 每道互动、每段反馈、每个综合关、每句金句都有有效 source anchor。
- [ ] 错误项和误读项能追溯到本书内容，不靠外部知识制造判断。
- [ ] 章节划分有目录、原文结构或主题聚类依据。

### 生图验收

- [ ] 标题页书封意象图、书籍主题吉祥物、全书通关庆祝 CG 均由真实生图能力生成。
- [ ] 章节插图、分享卡背景图、概念意象图没有出现在 `IMAGE_ASSET_MANIFEST` 中，也没有被要求调用生图。
- [ ] 每张图片都有完整 prompt、negative prompt、style prompt base、aspect ratio、cache key 和 prompt hash。
- [ ] CSS / SVG / Canvas / emoji / 文字占位没有冒充真实图片。
- [ ] 无法生图时已明确报告，并可进入 no-image 兜底体验；失败资产保持 failed / ready=false，不交付伪图片完成品。

### 首次启动图片缓存验收

- [ ] 首次 cache miss 时显示主题化资产准备页。
- [ ] 只生成缺失图片，生成后写入 IndexedDB。
- [ ] cache hit 时只读取 Blob、创建本次会话 object URL 并加载 / 解码，不调用生图 API。
- [ ] prompt、style base 或 manifest 版本变化时只重生成失效图片。
- [ ] `book_cover_hero` 和 `mascot_master` 全部 ready 前不进入正常图片体验标题页。
- [ ] 任意 required 或 optional 图片失败、URL 转 Blob 失败、load/decode 失败、准备流程超时或用户取消时，用户可跳过资产准备页进入明确的 no-image 兜底体验。
- [ ] no-image 兜底体验中失败资产保持 failed / ready=false，保留错误状态和重试入口。
- [ ] `finish_celebration_cg` 失败不阻塞核心学习流程，但通关页保留失败状态和重试入口。
- [ ] localStorage 未存储图片、base64、大 data URL、Blob 字符串或 object URL。

### 视觉验收

- [ ] 标题不是普通 `<h1>`，具备主题化字体效果或 SVG 装饰。
- [ ] 视觉风格根据书籍题材推导，不统一套用绿色卡通界面。
- [ ] 章节路径、按钮、卡片、反馈弹窗和分享卡均有主题化设计。
- [ ] 粒子不遮挡内容、不拦截点击，并支持 `prefers-reduced-motion`。
- [ ] 移动端长书名、长章节名、长概念名不溢出容器。

### SVG / CSS 可视化验收

- [ ] 章节路径地图用 SVG path 和节点状态表达，不是静态截图。
- [ ] 概念关系图包含节点、连线、关系类型、图例、原文浮层和移动端适配。
- [ ] hover、selected、locked、correct、incorrect、disabled 等状态有明确视觉反馈。
- [ ] 关系图避免连线压字、节点过小、图例遮挡和颜色语义冲突。

### 交互验收

- [ ] 拖拽排序在鼠标和触控上都可用。
- [ ] 复述测试能给出准确点、遗漏点、误解点和原文对照。
- [ ] 错答反馈温和，显示原文 anchor，不把用户卡死在惩罚状态。
- [ ] 章节综合关给开放性反馈，完成后可继续。
- [ ] 键盘 focus、按钮状态和错误重试入口可见。

### 数据验收

- [ ] 构建阶段产品数据和运行时用户进度数据分离。
- [ ] 图片资产具备 `IMAGE_ASSET_MANIFEST`、`IMAGE_ASSET_RUNTIME_STATE` 和 IndexedDB 缓存记录。
- [ ] 所有 source anchor 指向 `anchor-index.json` 中有效 ID。
- [ ] localStorage 只保存轻量状态。

### 响应式验收

- [ ] 375px 宽移动端可完成学习、拖拽、复述、查看 anchor 和分享。
- [ ] 桌面端布局不拉散，章节路径和关系图保持可读。
- [ ] 横竖屏切换后进度和图片状态不丢失。

### 准确性 / 一致性验收

- [ ] 核心概念、论断、引用、目录顺序和标准答案来自本书。
- [ ] 互动剧本化表达没有改变本书观点、条件和因果。
- [ ] 不使用外部权威裁判本书观点。
- [ ] AI 反馈只基于绑定原文 anchor 和 rubric。

### 产品形态验收

- [ ] 最终用户流程从已完成产品开始，不包含上传文件、输入内容、点击生成等工具流程。
- [ ] 内容提取、题目生成、prompt 生成和 anchor 绑定属于构建 / 填充阶段。
- [ ] 资产准备页只用于图片缓存检查、缺失图片生成和加载确认，不是内容生成工具。

### 设计粒度验收

- [ ] spec 定义的是可填充玩法框架，而不是写死某一本书的具体内容。
- [ ] 章节、题面、答案、金句、图片 prompt 等保留槽位和映射规则。
- [ ] 更换不同书籍内容文件后，可以生成不同主题但同结构的学习 app。
