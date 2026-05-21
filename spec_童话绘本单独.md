# 儿童互动童话绘本游戏设计文档

---

## 一、产品概览

| 维度 | 值 |
|------|-----|
| 产品名称 | {{GAME_NAME}} |
| 来源素材 | {{BOOK_NAME}} |
| 产品类型 | 固定内容儿童互动童话绘本 |
| 目标读者 | 3-10 岁儿童，默认 6-8 岁 |
| 默认安全目标 | `KIDS-6` 内部安全目标，向下兼容儿童友好内容 |
| 绘本长度 | 封面 + 8-12 个内页 + 结尾页 |
| 交互方式 | 点击翻页 + 点一点 / 找一找 / 轻拖拽 / 温和选择 |
| 生图模式 | 必须真实 AI 生图：封面 + 每页插图 |
| 准确性模式 | `fantasy + strict child-safety`，即幻想改写 + 严格儿童安全 |
| 核心主题 | 输入随附内容文件，产出一册带真实插图的儿童安全童话绘本 |
| 目标体验 | 打开成品就是一本已经完成的互动绘本，温柔、安全、有想象力、有道理 |

### 核心设计理念

> **这是一个“输入内容 → 产出带图片童话绘本”的儿童安全改编 spec。**
>
> 实现者读取与本 spec 一起提供的完整内容文件，将其中的主题、角色原型、概念、事件和寓意改编成一册儿童可以阅读的互动童话绘本。最终 HTML 呈现封面、主角、故事页、真实插图、轻互动和结尾道理。

最高优先级：

1. **儿童安全高于一切**：儿童安全高于内容还原、高于剧情刺激、高于事实准确。
2. **内容改编成绘本**：输入是随附内容文件，输出是一册带真实插图的儿童互动童话绘本。
3. **可以大幅童话化**：内容文件中的人物、机构、冲突、概念都可以被转成小动物、精灵、森林、星星、魔法道具或虚构王国。
4. **不适合儿童就改写或阻断**：如果内容文件无法安全改写为儿童绘本，必须停止并告知用户，不能硬编。
5. **不能教坏孩子**：不能把欺骗、霸凌、危险模仿、歧视、报复、绝对服从、过度功利包装成正向结果。

### 绘本准备页（固定模块）

最终 HTML 必须在封面页之前显示一个绘本准备页。它是 P0 功能，不是可选说明页。

准备页只做两件事：

1. 显示一句给家长的轻提示。
2. 显示图片准备进度：先做浏览器持久缓存校验；只有缓存缺失时才生成图片；随后完成加载 / 解码并自动进入封面页。

固定提示文案：

> 本绘本由 AI 生成，内容和画面可能存在不确定性。建议家长先完整玩一遍，再给孩子玩。

实现要求：

- 视觉可以像绘本装订前的准备台、贴纸进度条、小书签进度条或星星进度条。
- 不做“家长预览模式”，不要求家长点击确认试玩。
- 准备页中只保留上方固定提示文案，不再使用“警告”“确认”“我会先试玩”等流程话术。
- 准备页必须先执行 IndexedDB cache lookup。缓存命中时只显示“正在打开绘本”或“正在载入绘本图片”；缓存缺失时才显示“正在生成插图 n / N”。
- 所有封面、内页和结尾页图片的运行时状态都达到 `generated + cached/cache_hit + loaded + decoded + ready` 后，才能进入封面页。
- 进入封面页后，所有绘本页图片必须已经可显示；翻页时不得再出现图片 loading、逐页生成或逐页等待。
- 该模块不能替代儿童安全闸门；它只是额外提醒 AI 生成内容存在不确定性，并保证阅读前图片资产已经准备好。

---

## 二、涉及的 SKILL / 内容文件清单

> **完整内容文件会与本 spec 一起提供，通常位于项目根目录的 `skills/` 文件夹中。构建产品时，必须读取每个文件的完整内容，并从中提取本 spec 需要的内容。**

这些内容文件是本绘本故事、角色、画面、道理和互动点的唯一内容来源。实现者必须从中提取可被儿童安全改编的主题、角色原型、事件关系、知识概念、情绪线索、风险内容和正向寓意，再按照本 spec 的儿童安全规则转译成一册固定绘本。

| 内容文件路径 | 覆盖模块 | 在本产品中的用途 |
|-------------|----------|------------------|
| `{{CONTENT_FILE_PATH}}` | `{{COVERED_MODULE}}` | 提取儿童化核心意义、角色/概念原型、风险内容、故事主题、画面意象、页内互动和结尾道理 |

必须遵守：

- 必须读取每个内容文件的完整正文，不能只看索引摘要。
- 不能只读文件名、标题或目录后自行编造绘本核心内容。
- 不能把内容文件原样复述给儿童，必须经过儿童安全闸门、风险删改和童话转译。
- 内容文件中不适合儿童的部分必须进入 `safety_report` 和 `source_material.discarded_or_rewritten_elements`。
- 如果内容文件为空、缺失或无法读取，必须停下来告知用户，不能凭标题硬编一册绘本。

### 内容文件到绘本的映射

| 从内容文件提取 | 转成绘本中的 |
|---------------|-------------|
| 核心主题 / 核心观点 | 一句话道理、主线目标 |
| 主要人物 / 组织 / 概念 | 小动物、精灵、植物、星星、玩具、云朵等儿童友好角色 |
| 冲突 / 难题 / 变化 | 温和问题、误会、迷路、需要合作完成的小任务 |
| 风险内容 | 删除、弱化、隐喻化、转成求助成人或安全距离外的困难 |
| 关键场景 | 绘本页场景和 AI 插图提示词 |
| 操作性知识 | 不输出步骤，转成安全习惯或寓意 |
| 结论 / 启发 | 结尾页道理 + 亲子讨论问题 |

---

## 三、目标用户

### 核心读者

| 维度 | 描述 |
|------|------|
| 年龄 | 3-10 岁，默认 6-8 岁 |
| 阅读方式 | 儿童独立看图、亲子共读、课堂投屏共读 |
| 阅读时长 | 5-12 分钟读完一册 |
| 心理需求 | 安全感、好奇心、角色认同、温和鼓励 |
| 内容耐受 | 不应出现明显恐怖、成人化、血腥、羞辱、危险模仿 |

### 陪伴用户

| 维度 | 描述 |
|------|------|
| 家长 | 和孩子共读，帮助孩子理解温和道理 |
| 老师 | 用固定绘本做课堂导入、品格教育或轻科普 |
| 编码助手 / 生成模型 | 根据完整内容文件和本 spec 生成最终互动绘本 |

### 年龄分层

| 年龄段 | 每页文本 | 语言特点 | 冲突强度 | 互动方式 | 道理表达 |
|--------|----------|----------|----------|----------|----------|
| 3-5 岁 | 1-2 句 | 具体、重复、押韵感、少抽象词 | 极轻，只能有小误会或小困难 | 点一点、找一找 | 用角色行为和结果表达 |
| 6-8 岁 | 2-4 句 | 完整情节、简单比喻、清楚因果 | 温和冒险、小挫折、快速安抚 | 点击、轻拖拽、二选一 | 结尾明确点题 |
| 9-10 岁 | 3-5 句 | 可有更细腻心理和简单反思 | 允许更复杂情绪，但不能青少年化 | 轻分支、排序、反思问题 | 可以讨论责任、选择和后果 |

---

## 四、产品目的

### 核心价值

这个产品让儿童通过阅读和轻互动，体验一册由 `skills/` 内容安全改编而来的童话绘本，从而把复杂、成人化或抽象的内容转化为孩子能理解、愿意阅读、读后能获得温和道理的故事体验。

### 成功标准

- 打开最终 HTML 后，用户先看到绘本准备页，图片准备完成后进入一册完成的绘本。
- 孩子能在没有惊吓和困惑的情况下读完整本绘本。
- 家长或老师能明确看出绘本传达了什么正向道理。
- `skills/` 中的核心内容已被安全童话化，而不是原样复述。
- 插图风格统一、真实生成、适合儿童绘本。
- 页面阅读节奏像绘本，不像摘要、讲义或问答工具。

---

## 五、视觉风格规范

### 整体气质

视觉必须像真正的儿童绘本：柔软、明亮、温暖、可亲，有纸张感和手绘感。界面只是装订、翻页和小互动的辅助，不能抢走插图和故事主体。

禁止使用：

- 大面积黑色、血红、荧光警告色。
- 恐怖、哥特、惊悚、怪诞、失焦摄影、压迫式阴影。
- 科技工具感的输入面板、参数表、操作控制台。
- 商业 SaaS 风格、仪表盘风格、复杂表单工具风格。

### 绘本画风选择

开发者必须根据内容文件主题选择 1 个统一画风，并写入 `STYLE_PROMPT_BASE`。

| 画风 | 适合内容 | 提示词基底方向 |
|------|----------|----------------|
| 水彩童话 | 情绪、成长、睡前、自然 | `children's watercolor storybook illustration, soft colors, gentle light, hand-painted texture, warm and safe atmosphere` |
| 彩铅绘本 | 生活习惯、校园、家庭、友情 | `colored pencil children's book illustration, soft paper texture, cozy everyday scene, rounded friendly characters` |
| 黏土童话 | 低龄、可爱角色、简单寓言 | `clay toy storybook scene, soft studio lighting, rounded cute characters, warm pastel colors` |
| 森林童话 | 自然、动物、保护环境 | `storybook forest illustration, whimsical animals, lush but gentle nature, soft sunlight, child-friendly composition` |
| 魔法纸艺 | 抽象概念、想象、创意 | `paper cutout fairytale illustration, layered paper texture, magical but gentle, bright soft palette` |
| 蜡笔绘本 | 低龄、日常、情绪安抚 | `crayon children's book illustration, simple rounded shapes, soft paper grain, cheerful gentle palette` |
| 毛毡布偶 | 陪伴、亲情、睡前故事 | `felt craft storybook illustration, soft textile texture, handmade cozy characters, warm nursery lighting` |
| 温柔数字绘本 | 现代童话、轻科普、城市日常 | `soft digital children's book illustration, clean rounded characters, bright but gentle colors, warm storybook lighting` |

### 配色方案
- 配色应该根据主题进行色系设计。
| 用途 | 方向                                                |
|------|---------------------------------------------------|
| 背景 | 根据内容主题决定，如暖白、浅米、浅蓝、浅绿、淡粉，浅紫，浅渐变色，像纸张或天空。必须根据主题进行设计 |
| 主色 | 根据内容主题决定，必须根据主题进行设计                               |
| 强调色 | 温和高亮，不刺眼  ，必须根据主题进行设计                                       |
| 成功反馈 | 柔和色、或者星星、花朵、光点 ，必须根据主题进行设计                        |
| 提示反馈 | 柔和色，轻微摇动、温和文字 ，必须根据主题进行设计                         |

### 排版规范

- 正文字号 18-22px，低龄版本可更大。
- 每页文字短，最多 1-5 句，不能像文章段落。
- 行高 ≥ 1.6。
- 字体使用圆润、清晰、儿童可读的系统字体或安全 fallback。
- 每页文本不得覆盖插图主体。

### UI 元素风格

- 按钮像绘本贴纸、云朵、小木牌、星星标签，不像默认网页按钮。
- 页码可以是小书签、花瓣、星星进度。
- 卡片和弹窗像纸片或翻页，不使用复杂工具面板。
- hover / active 要有轻微放大、柔光、弹性反馈。
- 点击错误或不可交互区域时只给温和提示，不惩罚。

### 粒子与氛围

- 可使用 10-20 个轻量粒子，如星星、萤火虫、花瓣、气泡、纸屑。
- 粒子只用于封面和章节氛围，不遮挡正文和插图。
- 粒子设置 `pointer-events: none`。
- 尊重 `prefers-reduced-motion`，关闭漂浮和闪烁，保留静态装饰。

### SVG / CSS 技巧

- 用 SVG 做页角、书签、花边、云朵、星星、叶子、翻页图标。
- 用 CSS 做翻页过渡、按钮弹性、贴纸阴影、纸张纹理。
- SVG/CSS 可以做 UI 装饰，但不能冒充 AI 生成插图。
- 插图必须是真实生图资产。

---

## 六、生图策略与资产契约

### 最高优先级

> **儿童绘本的封面和每页插图必须由真实 AI 生图模型生成。**
>
> 生图是图片资产闸门，不是可选视觉增强。它可以在构建期完成，也可以在首次运行的缓存准备阶段完成；没有真实插图，本产品不能判定完成。

### 什么是生图

- ✅ 调用生图模型或图像生成 API/工具，输入提示词，获得一张真实的位图文件。
- ✅ 图片数据必须在构建期或首次运行缓存准备阶段获得；进入封面前必须已经写入 IndexedDB、加载并解码，能在最终 HTML 中直接显示。

### 什么不是生图

- ❌ CSS 渐变、box-shadow、border-radius 画出来的图形不是生图。
- ❌ SVG path、circle、polygon 手动描绘的图形不是生图。
- ❌ Canvas 代码绘制的图形不是生图。
- ❌ emoji 或 Unicode 符号拼凑不是生图。
- ❌ 纯文字描述“这里应该有一张图”不是生图。
- ❌ CSS/SVG/Canvas 做一个风格化占位图然后当作图片不是生图。

### 必需图片资产

| 资产 | 数量 | 要求 |
|------|------|------|
| 封面图 | 1 张 | 标题页主视觉，必须包含主角和主要故事场景 |
| 内页插图 | 每页 1 张 | 与该页文本和互动点一致 |
| 结尾页插图 | 1 张 | 温暖收束，展示角色完成成长或获得安慰 |

如果绘本为 10 个内页，则至少需要 12 张真实图片：封面 1 张 + 内页 10 张 + 结尾 1 张。

### 生图流程

1. **确定统一画风基底**
   - 根据内容文件主题选择 `STYLE_PROMPT_BASE`。
   - 所有图片必须共享同一画风基底。

2. **为每张图片编写完整提示词**
   - 完整提示词 = `STYLE_PROMPT_BASE` + 当前页角色 / 场景 / 动作 / 情绪 / 光影 / 构图。
   - 正向 prompt 只描述儿童友好的画面：warm, gentle, child-friendly, cozy, soft colors, friendly characters, peaceful storybook scene。
   - 不得把原内容中的风险情节、成人冲突或危险物件写入正向 prompt。
   - `negative_prompt` 使用固定短模板 ID：`standard_child_safe_negative_prompt_v1`；不要逐页堆叠负面词。

3. **先查缓存，再决定是否调用生图工具/API**
   - 在调用生图工具前，必须先执行 IndexedDB cache lookup。
   - 如果 `storybook_id + asset_manifest_version + asset_id + prompt_hash` 命中，并且 Blob 存在，不得调用生图工具。
   - 只有 cache miss、缓存损坏、版本变更，或用户明确点击“重新生成”时，才允许调用生图工具。
   - 如果需要调用生图工具但当前环境没有可用能力，必须停下来告知用户，不能用 CSS/SVG/Canvas 替代。

4. **持久化图片数据**
   - 每张生成结果必须转成 `Blob` 并写入 IndexedDB。
   - IndexedDB 是运行时生成图片的唯一持久化位置；localStorage 只保存阅读进度和轻量版本信息。
   - 页面显示时可以用 `URL.createObjectURL(blob)` 创建临时 object URL，但 object URL 不能当作长期存储。
   - 如果图片在构建阶段已内嵌为 base64 / data URL，也应在首次打开时写入 IndexedDB，后续刷新优先从 IndexedDB 读取。

### IMAGE_ASSET_MANIFEST

最终数据必须包含 `IMAGE_ASSET_MANIFEST`。它只描述“本绘本需要哪些图片、每张图如何生成、缓存键是什么”，不直接表示当前浏览器里图片是否已经生成完成。

`IMAGE_ASSET_MANIFEST` 是静态资产计划层；图片是否已经生成、缓存、加载、解码，必须写入运行时状态层。

#### 静态资产计划字段

| 字段 | 说明 |
|------|------|
| `id` | 图片唯一 ID，如 `cover`, `page_01`, `ending` |
| `purpose` | 用途：封面 / 第几页 / 结尾 |
| `required` | 必须为 `true`，表示该图片是进入绘本前必须准备的资产 |
| `plan_status` | 固定为 `required`，表示目标清单中必须存在；不得用它表示已经生成 |
| `initial_runtime_status` | 初始运行时状态：`pending` / `seed_available`。首次 cache miss 前通常为 `pending` |
| `style_prompt_base` | 统一画风基底 |
| `prompt` | 完整正向提示词 |
| `negative_prompt` | 固定短模板 ID，如 `standard_child_safe_negative_prompt_v1` |
| `prompt_hash` | 根据 `style_prompt_base + prompt + negative_prompt + asset_manifest_version` 计算的稳定哈希 |
| `aspect_ratio` | 推荐 4:3 或 3:4，根据页面布局决定 |
| `seed_source` | 可选构建期 seed，例如 `{ "type": "none" }`、`prebundled_data_url` 或 `local_asset_path`；first-run-cache 下允许为空或 `none` |
| `cache_key` | IndexedDB 缓存键，建议 `storybook_id:asset_manifest_version:asset_id:prompt_hash` |
| `storage_driver` | 固定为 `indexeddb_blob`，可选 `prebundled_data_url_seed` 只作为首次写入来源 |
| `child_safety_requirement` | 固定为 `must_pass_before_ready` |

静态计划层不得把未生成的图片写成 `status = "generated"`。`pending` 在静态计划中是允许的，但它只能表示“等待准备”，不能放行封面页。

#### 运行时资产状态字段

运行时必须为每个必需图片维护一条 `IMAGE_ASSET_RUNTIME_STATE`：

| 字段 | 说明 |
|------|------|
| `asset_id` | 对应 `IMAGE_ASSET_MANIFEST.assets[].id` |
| `cache_key` | 与静态计划层一致 |
| `generation_status` | `pending` / `generating` / `generated` / `failed` |
| `cache_status` | `not_checked` / `cache_hit` / `cache_miss` / `cached` / `cache_corrupt` |
| `cached_blob_ref` | IndexedDB 中的 Blob 引用信息，如 store 名和 `cache_key`；不存 object URL |
| `loaded` | `true` 表示图片资源已被浏览器加载 |
| `decoded` | `true` 表示图片已完成解码，可立即绘制 |
| `ready` | `generation_status = "generated"`、`cache_status = "cached" 或 "cache_hit"`、`loaded = true`、`decoded = true`、`child_safety_status = "passed"` 时才为 `true` |
| `child_safety_status` | `pending` / `passed` / `failed` |

`placeholder` / `css_fallback` 均不通过。`pending` 只允许出现在准备页完成前；任一必需图片仍为 `pending` 时不得进入封面页。

### 图片预生成与预加载闸门

> **阅读阶段禁止逐页生成图片、逐页等待图片、翻到某页才开始请求图片。**

在进入封面页之前，必须完成所有图片资产的准备：

```text
cache lookup
→ cache hit: Blob → loaded → decoded
→ cache miss: generation lock → generate → Blob → IndexedDB cached → loaded → decoded
全部 ready = true
→ 才能显示封面页
```

实现要求：

- 准备页必须先读取 IndexedDB，按 `cache_key` 查询所有必需图片。
- 如果图片在构建阶段已生成并内嵌为 base64 / data URL，准备页应把它们作为 seed 写入 IndexedDB，再从 IndexedDB 读取。
- 如果 cache hit，准备页只负责创建本次会话的 object URL、加载和解码图片，不得调用生图工具。
- 如果 cache miss，只能生成缺失的图片；已经 cache hit 的图片不得重复生成。
- 生成中的图片必须先写入 IndexedDB 并标记为 `cache_status = "cached"`，再进入加载和解码步骤。
- 进度条应统计所有必需图片：封面图 + 每页插图 + 结尾页插图。
- 任一图片的运行时状态未完成 `generated + cached/cache_hit + loaded + decoded + ready` 时，不得进入封面页。
- 进入封面页后，翻页时不得出现空白图、骨架图、spinner、逐页 loading 文案或图片生成等待。

### 刷新 / 再次打开的快速校验规则

本绘本不是一次性体验。用户刷新页面、关闭后再次打开、或从 localStorage 恢复阅读进度时，必须先做 IndexedDB cache lookup，不得把已经存在的图片资产当作需要重新生成。

必须区分三类状态：

| 状态 | 含义 | 刷新后是否应重新执行 |
|------|------|----------------------|
| `required / pending` | 静态计划中要求必须准备，但当前浏览器还没有确认可用 Blob | 需要继续 cache lookup，必要时生成 |
| `generated` | 运行时状态显示图片已经由真实生图工具生成，或已有构建期 seed 写入 IndexedDB | 不应重新生成 |
| `cached / cache_hit` | 图片 Blob 已写入或命中 IndexedDB，且 `cache_key` 与当前版本匹配 | 不应重新生成 |
| `loaded` | 图片资源在当前浏览器会话中加载成功 | 可以重新快速检查 |
| `decoded` | 图片在当前浏览器会话中解码完成，可立即绘制 | 可以重新快速检查 |

如果 `IMAGE_ASSET_MANIFEST` 和 `IMAGE_ASSET_RUNTIME_STATE` 满足以下条件：

- 每个必需图片都有稳定 `cache_key`。
- 每个必需图片在运行时状态中 `generation_status = "generated"`。
- 每个必需图片在运行时状态中 `cache_status = "cached"` 或 `cache_status = "cache_hit"`。
- 每个必需图片的 `prompt_hash` 与当前页面数据一致。
- IndexedDB 中存在对应 `cache_key` 的 Blob。
- 每个必需图片的 `child_safety_status = "passed"`。
- 当前 `storybook_id`、`asset_manifest_version`、图片 `id` 和提示词版本未发生变化。

则再次打开或刷新页面时必须走快速校验流程：

1. 不调用生图工具，不显示“正在生成图片”“重新生成图片”等文案。
2. 只执行 IndexedDB Blob 读取、object URL 创建、图片 `load + decode` 校验。
3. 准备页可以短暂显示“正在打开绘本”或“正在载入绘本图片”，也可以在校验很快完成时一闪而过。
4. 所有图片校验成功后，如果 localStorage 中存在同一 `storybook_id` 和 `asset_manifest_version` 的有效 `current_page_id`，恢复到用户上次阅读页；如果没有有效进度，则进入封面页。
5. 如果某张图片 cache miss、Blob 损坏、路径失效或解码失败，应标记具体资产 ID 和原因。
6. 只有 cache miss、缓存损坏、版本变更，或用户明确点击“重新生成”时，才允许重新进入生图流程。

刷新恢复后，翻页按钮、互动点、朗读按钮、重新阅读、返回封面等交互必须全部重新绑定并可用。不得出现“图片显示正常但按钮失效 / 互动点失效 / 下一页不能点”的一次性绘本状态。

### IndexedDB 缓存与并发锁

必须使用 IndexedDB 持久化生图结果，不得只依赖普通 HTTP cache、Blob URL、内存变量或 localStorage。

缓存对象至少包含：

| 字段 | 说明 |
|------|------|
| `cache_key` | `storybook_id:asset_manifest_version:asset_id:prompt_hash` |
| `asset_id` | 对应 `IMAGE_ASSET_MANIFEST.assets[].id` |
| `storybook_id` | 当前绘本 ID |
| `asset_manifest_version` | 当前图片清单版本 |
| `prompt_hash` | 当前图片提示词哈希 |
| `blob` | 图片 Blob |
| `mime_type` | 如 `image/png` / `image/webp` |
| `created_at` | 首次写入时间 |
| `updated_at` | 最近更新时间 |
| `status` | `cached` / `generating` / `failed` |

并发要求：

- 生成前必须设置 generation lock，避免刷新、双击、多个标签页同时触发重复生图。
- 优先使用 `navigator.locks`；不支持时，可用 IndexedDB 中的 `generation_lock` 记录实现。
- `generation_lock` 必须包含 `cache_key`、`started_at`、`expires_at` 和 `owner_id`。
- 如果检测到同一 `cache_key` 正在生成，当前页面应等待缓存结果或显示“正在准备插图”，不得并发再次调用生图 API。
- object URL 只用于当前会话显示图片，页面卸载或图片替换时应 `URL.revokeObjectURL()`。

---

## 七、功能清单

P0 为核心体验，P1 为明显提升体验。只做 P0 和 P1。

| 优先级 | 功能名称 | 解决什么问题 | 输入 | 输出 |
|--------|----------|--------------|------|------|
| P0 | 固定绘本阅读 | 图片准备完成后阅读已完成绘本 | 点击开始 | 封面与绘本页 |
| P0 | 内容文件改编 | 让 `skills/` 内容成为绘本故事 | 完整内容文件 | `source_material` + 故事大纲 |
| P0 | 儿童安全闸门 | 防止不适合儿童内容进入绘本 | `source_material` | `KIDS-*` / `NEEDS_REWRITE` / `BLOCKED` |
| P0 | 绘本准备页 | 给家长一句 AI 生成提示，并等待所有图片准备完成 | 打开 HTML | 提示文案 + 图片准备进度条 |
| P0 | 图片缓存 / 预加载闸门 | 避免刷新重复生图和翻页逐页等图 | 图片资产清单 + IndexedDB | 所有图片运行时 `generated + cached/cache_hit + loaded + decoded + ready` |
| P0 | 刷新后快速恢复 | 绘本不能是一次性页面 | 刷新 / 再次打开 | cache hit 不重新生图，读取 IndexedDB 并恢复阅读与互动 |
| P0 | 儿童化转译 | 把复杂内容转成童话 | 内容核心意义 + 风险标签 | 角色、世界、冲突、道理 |
| P0 | 绘本页系统 | 形成完整阅读节奏 | 故事大纲 | 封面 + 8-12 个内页 + 结尾 |
| P0 | 真实插图资产 | 绘本必须有真实主视觉 | 页面提示词 | 真实图片资产 |
| P0 | 轻互动阅读 | 让孩子参与故事 | 点击、拖拽、选择 | 小动画、旁白、下一页 |
| P0 | 道理总结 | 收束故事教育意义 | 完成阅读 | 一句话道理 + 亲子问题 |
| P0 | 本地进度 | 支持继续阅读 | 页面状态 | localStorage 存档 |
| P1 | 朗读按钮 | 帮助低龄儿童共读 | 点击朗读 | 浏览器朗读或预留朗读状态 |
| P1 | 家长说明页 | 让成人理解改编逻辑 | 点击查看 | 简短安全说明和共读建议 |

儿童端只需要呈现阅读体验。内容改编和儿童安全检查属于构建阶段任务；图片生图只允许发生在准备页 cache miss 时，且必须写入 IndexedDB。生图流程不得出现在绘本阅读页中。

---

## 八、用户动线

### 核心路径

```text
绘本准备页
→ 显示家长提示 + 图片准备进度条
→ IndexedDB cache lookup
→ cache hit：读取 Blob + load/decode
→ cache miss：只生成缺失图片 + 写入 IndexedDB + load/decode
→ 所有图片运行时 generated + cached/cache_hit + loaded + decoded + ready
→ 封面页
→ 点击开始
→ 第 1 页：认识主角和安全世界
→ 第 2-4 页：出现温和问题或小目标
→ 第 5-8 页：观察、尝试、求助、合作
→ 后续页：修复、理解、获得温和道理
→ 结尾页：一句话道理 + 亲子讨论问题
→ 重新阅读 / 返回封面
```

### 构建阶段到成品的关系

```text
实现者读取完整内容文件 / skills
→ 提取儿童化核心意义
→ 执行儿童安全闸门
→ 童话化改写风险内容
→ 生成固定故事大纲和页面数据
→ 为封面和每页准备生图提示词、prompt_hash 和 cache_key
→ 实现单个互动绘本 HTML，首屏必须包含绘本准备页和图片准备进度条
→ 用户打开后先看到绘本准备页
→ 准备页先查 IndexedDB，缺图时才生成并缓存
→ 所有图片准备完成后自动进入封面页
→ 用户进入无逐页等待的完整绘本阅读
```

构建阶段流程不暴露给儿童。用户界面只呈现绘本准备页、最终绘本和可选家长说明页；家长说明页为 P1，不影响儿童阅读主流程。

### 功能流转

| 源功能 | 流向 | 目标功能 | 方式 |
|--------|------|----------|------|
| 绘本准备页 | → | 封面页 | 所有图片运行时 `generated + cached/cache_hit + loaded + decoded + ready` 后自动进入 |
| 封面页 | → | 绘本第 1 页 | 点击开始 |
| 绘本页 | → | 当前页互动 | 点击 / 拖拽 / 选择 |
| 当前页互动 | → | 下一页按钮 | 动画完成或提示出现 |
| 绘本页 | → | 上一页 / 下一页 | 翻页按钮 |
| 最后一页 | → | 结尾页 | 点击继续 |
| 结尾页 | → | 封面 / 重新阅读 | 点击按钮 |

---

## 九、信息结构

### 导航结构

```text
绘本准备页（固定）
├── 一句给家长的 AI 生成提示
├── 图片准备进度条
├── 当前状态：生成 / 加载 / 解码
└── 全部 ready 后自动进入封面页

封面页
├── AI 生成封面图
├── 绘本标题
├── 副标题 / 一句话引子
├── 开始阅读
└── 继续阅读（有存档时显示）

绘本阅读页
├── 插图区域
├── 正文区域
├── 轻互动点
├── 页码 / 进度
├── 上一页
└── 下一页

结尾页
├── 温暖收束插图
├── 一句话道理
├── 亲子讨论问题
├── 重新阅读
└── 返回封面

家长说明页（P1）
├── 本绘本从内容文件提取了什么核心意义
├── 删除或弱化了哪些风险内容
└── 共读建议
```

### 界面布局

| 界面 | 核心内容 | 交互方式 |
|------|----------|----------|
| 绘本准备页 | AI 生成不确定性提示 + 图片准备进度条 | 自动进入封面页 |
| 封面页 | 封面图、标题、开始按钮、轻粒子 | 点击开始 |
| 绘本页 | 插图、正文、互动点、页码 | 点击 / 拖拽 / 温和选择 |
| 结尾页 | 收束插图、道理、亲子问题 | 重新阅读 / 返回封面 |
| 家长说明页 | 改编说明、安全说明 | 查看 / 返回 |

### 视口自适应绘本画布

最终 HTML 必须像一册能放进不同屏幕的绘本，而不是固定宽高的长页面截图。以下是布局约束，不要求逐字使用示例 CSS，但必须达到相同适配效果：

- 绘本必须同时适配手机竖屏、平板和桌面浏览器。
- 主布局不得依赖固定像素宽高，例如不能把绘本主体写死为 `width: 860px; height: 1100px;`。
- 绘本主体容器应使用视口自适应约束，例如 `width: min(92vw, 860px)`、`min-height: 100dvh`、`max-height: 100dvh`、`padding: env(safe-area-inset-*)`、`clamp()`、`aspect-ratio` 等方式；具体数值可按设计调整。
- 封面页和阅读页在桌面端必须居中显示，允许有柔和背景和留白，但绘本主体必须是明确视觉焦点，不能让大面积背景把主体显得过小或偏离中心。
- 手机竖屏必须使用单列阅读节奏：插图在上，正文和互动在中，上一页 / 下一页 / 开始等主操作在下方或紧随正文。
- 桌面端可以保持竖向绘本卡片，也可以使用轻量左右分区，但主插图、正文和主操作必须属于同一个绘本画布，不得散落到屏幕远端。
- 插图区域必须使用 `object-fit: contain` 或明确的安全裁切规则，不能因为屏幕比例不同裁掉主角、关键互动物、标题叠加区或重要表情。
- 首屏必须能看到当前页的主要阅读内容和主操作；如果小屏幕内容过多，可以让正文区域或绘本内部滚动，但不得出现横向滚动，不得把主按钮藏到难以发现的位置。
- 底部按钮必须避开手机浏览器安全区域和系统手势区，不能被地址栏、Home indicator 或工具栏遮挡。

---

## 十、数据设计

### 存储方案

| 维度 | 选择 |
|------|------|
| 存储方式 | localStorage |
| 存储内容 | localStorage 只保存阅读进度、已触发互动点、是否看过结尾和轻量版本信息 |
| 图片存储 | 运行时生成图片必须以 Blob 形式存入 IndexedDB；本地资源或 base64 / data URL 只能作为首次写入 IndexedDB 的 seed |
| 多端同步 | 不支持 |
| 外部输入 | 构建阶段读取随附内容文件 / `skills/` |

### 数据关系

| 实体 A | 关系 | 实体 B | 说明 |
|--------|------|--------|------|
| `content_file` | 多对一 | `source_material` | 多个随附内容文件共同构成待改编内容 |
| `source_material` | 一对一 | `safety_report` | 内容必须过儿童安全检查 |
| `source_material` | 一对一 | `adaptation_profile` | 记录儿童化改写策略 |
| `storybook` | 一对多 | `storybook_page` | 一本绘本包含多页 |
| `storybook_page` | 一对一 | `image_asset` | 每页绑定一张真实插图 |
| `image_asset` | 一对一 | `image_asset_runtime_state` | 每张图片在当前浏览器中的生成、缓存、加载和解码状态 |
| `image_asset` | 多对一 | `asset_preparation_state` | 所有图片共同决定准备页进度和是否放行封面 |
| `image_asset` | 一对一 | `browser_asset_cache` | 每张图片在浏览器 IndexedDB 中对应一个持久化 Blob |
| `storybook_page` | 零或一 | `interaction` | 每页最多一个互动 |
| `storybook` | 一对一 | `moral_summary` | 结尾道理和共读问题 |

### 数据 Schema

#### meta.json

```json
{
  "product_title": "绘本标题",
  "product_type": "fixed-interactive-storybook",
  "target_age_band": "6-8",
  "target_safety_goal": "KIDS-6",
  "accuracy_mode": "fantasy + strict child-safety",
  "storybook_category": "品格寓言",
  "storybook_id": "storybook_001",
  "asset_manifest_version": "v1",
  "style_prompt_base": "children's watercolor storybook illustration...",
  "inner_page_count": 10,
  "total_page_count": 12,
  "page_count_note": "inner_page_count 只统计故事内页；total_page_count = 封面 1 + inner_page_count + 结尾 1",
  "image_mode": "required-real-ai-generated-assets",
  "asset_gate": "cache_lookup_then_generate_missing_assets_before_cover",
  "runtime_generation": "cache_miss_only",
  "cache_driver": "indexeddb_blob",
  "cache_key_strategy": "storybook_id:asset_manifest_version:asset_id:prompt_hash"
}
```

#### source_material.json

```json
{
  "id": "source_001",
  "title": "内容文件主题名",
  "content_files": [
    {
      "path": "skills/{{CONTENT_FILE_NAME}}.md",
      "covered_module": "该文件覆盖的内容模块",
      "used_for": "提取儿童化核心意义、角色/概念原型、风险内容、画面意象或结尾道理"
    }
  ],
  "raw_summary_for_developer": "内容大意，仅供开发者理解，不直接展示给儿童",
  "child_safe_core": "适合儿童理解的核心意义",
  "discarded_or_rewritten_elements": [
    {
      "type": "content_risk / value_risk / imitation_risk / age_mismatch / other",
      "original_role": "原内容中的风险作用",
      "rewrite_strategy": "delete / soften / metaphor / fictionalize / block",
      "safe_replacement": "改写后的儿童安全表达"
    }
  ],
  "moral_goal": "孩子读完应该获得的温和道理"
}
```

#### storybook.json

```json
{
  "id": "storybook_001",
  "title": "绘本标题",
  "subtitle": "一句话引子",
  "main_character": {
    "name": "主角名",
    "type": "小动物 / 精灵 / 玩具 / 云朵 / 植物",
    "trait": "孩子能理解的性格特点",
    "source_mapping": "对应内容文件中的哪个概念或角色原型"
  },
  "world": "安全、温暖、童话化的故事世界",
  "core_problem": "温和问题或小目标",
  "moral_summary": {
    "line": "一句话道理",
    "parent_question": "亲子讨论问题"
  }
}
```

#### pages.json

```json
{
  "pages": [
    {
      "id": "page_01",
      "type": "story",
      "text": "适龄正文，短句。",
      "image_id": "page_01_img",
      "image_description": "这一页插图应该画什么",
      "source_mapping": "这一页来自内容文件中的哪个核心意义、事件或概念",
      "interaction": {
        "type": "tap / find / drag / choose / none",
        "target": "可点击或可拖拽对象",
        "success_feedback": "温和反馈",
        "no_punishment": true
      },
      "safety_tags": ["KIDS-6", "gentle_scene"]
    }
  ]
}
```

#### image_asset_manifest.json

```json
{
  "storybook_id": "storybook_001",
  "asset_manifest_version": "v1",
  "assets": [
    {
      "id": "cover",
      "purpose": "cover",
      "required": true,
      "plan_status": "required",
      "initial_runtime_status": "pending",
      "style_prompt_base": "children's watercolor storybook illustration...",
      "prompt": "完整正向提示词",
      "negative_prompt": "standard_child_safe_negative_prompt_v1",
      "prompt_hash": "sha256:...",
      "aspect_ratio": "4:3",
      "seed_source": {
        "type": "none",
        "value": null
      },
      "cache_key": "storybook_001:v1:cover:sha256...",
      "storage_driver": "indexeddb_blob",
      "child_safety_requirement": "must_pass_before_ready"
    }
  ]
}
```

#### image_asset_runtime_state.json

```json
{
  "storybook_id": "storybook_001",
  "asset_manifest_version": "v1",
  "assets": [
    {
      "asset_id": "cover",
      "cache_key": "storybook_001:v1:cover:sha256...",
      "generation_status": "generated",
      "cache_status": "cached",
      "cached_blob_ref": {
        "store_name": "storybook_image_assets",
        "cache_key": "storybook_001:v1:cover:sha256..."
      },
      "loaded": true,
      "decoded": true,
      "ready": true,
      "child_safety_status": "passed"
    }
  ]
}
```

#### asset_preparation_state.json

```json
{
  "storybook_id": "storybook_001",
  "asset_manifest_version": "v1",
  "total_required_assets": 12,
  "planned_required_assets": 12,
  "pending_assets": 0,
  "ready_assets": 12,
  "generated_assets": 12,
  "cached_assets": 12,
  "cache_hit_assets": 12,
  "cache_miss_assets": 0,
  "loaded_assets": 12,
  "decoded_assets": 12,
  "failed_assets": [],
  "generation_locks": [],
  "current_stage": "ready",
  "ready": true,
  "can_enter_cover": true,
  "fast_restore_available": true,
  "last_check_mode": "initial_prepare / fast_restore"
}
```

#### browser_asset_cache / IndexedDB

```json
{
  "store_name": "storybook_image_assets",
  "records": [
    {
      "cache_key": "storybook_001:v1:page_01_img:sha256...",
      "asset_id": "page_01_img",
      "storybook_id": "storybook_001",
      "asset_manifest_version": "v1",
      "prompt_hash": "sha256:...",
      "blob": "IndexedDB Blob",
      "mime_type": "image/png",
      "created_at": "ISO-8601 timestamp",
      "updated_at": "ISO-8601 timestamp",
      "status": "cached"
    }
  ]
}
```

浏览器中的图片缓存以 IndexedDB 为准。普通 HTTP cache、内存变量和 object URL 只能作为会话级辅助，不得作为判断“已有图片”的唯一依据。

#### runtime_progress.json / localStorage

```json
{
  "storybook_id": "storybook_001",
  "asset_manifest_version": "v1",
  "current_page_id": "page_03",
  "visited_page_ids": ["cover", "page_01", "page_02", "page_03"],
  "completed_interaction_ids": ["page_01_tap_leaf"],
  "finished": false,
  "last_read_at": "ISO-8601 timestamp"
}
```

运行时进度只保存页码、互动完成状态、是否读完等轻量数据。不得把图片、base64、Blob 字符串或 object URL 写入 localStorage。刷新恢复时必须先校验 `storybook_id` 和 `asset_manifest_version` 是否匹配；匹配时恢复进度与互动状态，并按 `cache_key` 从 IndexedDB 恢复图片。

---

## 十一、交互设计

### 操作映射

| 操作 | 实现方案 | 说明 |
|------|----------|------|
| 等待绘本准备 | 先查 IndexedDB 缓存；cache miss 才生成缺失图片；随后加载 / 解码全部图片 | 准备完成后进入封面页 |
| 刷新恢复 | 快速校验 IndexedDB 中已有图片 Blob | cache hit 不重新生图，恢复到上次阅读页或封面 |
| 开始阅读 | 点击封面按钮 | 进入第 1 页 |
| 翻页 | 点击上一页 / 下一页 | 有翻页过渡，不瞬切 |
| 点一点 | 点击插图中的安全对象 | 触发小动画或一句旁白 |
| 找一找 | 点击 2-3 个指定物件 | 找到后出现柔光或星星 |
| 轻拖拽 | 拖动安全道具到目标处 | 成功后播放温和反馈 |
| 温和选择 | 二选一或三选一 | 不做失败惩罚，只引导更好的表达 |
| 继续阅读 | 点击下一页 | 保存进度 |
| 重新阅读 | 结尾页点击 | 清除页码进度，保留绘本内容 |

### 交互反馈

| 操作 | 视觉反馈 | 状态变化 |
|------|----------|----------|
| 缓存校验中 | 显示“正在打开绘本”或“正在检查本地插图” | cache_hit_assets / cache_miss_assets 更新 |
| 首次生成中 | 只为 cache miss 资产显示“正在生成插图 n / N” | 设置 generation lock，生成后写入 IndexedDB |
| 快速恢复中 | 显示“正在载入绘本图片” | 读取 IndexedDB Blob，创建 object URL，仅检查 load / decode |
| 准备完成 | 小书签或星星完成动画，自动进入封面页 | can_enter_cover = true |
| 点击开始 | 封面轻微放大，纸页翻开 | 进入第 1 页 |
| 点击互动点 | 星星 / 花瓣 / 柔光出现 | 标记本页互动完成 |
| 点错 | 小幅摇头或温和提示 | 不惩罚 |
| 翻页 | 纸页滑动或淡入淡出 | 更新 currentPage |
| 到达结尾 | 插图变亮，出现道理卡片 | 标记 finished |

### 动效标准

- 翻页过渡 300-700ms。
- 按钮 hover 轻微放大，不超过 1.05。
- 粒子动画周期 ≥ 8s，不能闪烁刺眼。
- 尊重 `prefers-reduced-motion`。
- 所有动效服务阅读和反馈，不制造惊吓。

---

## 十二、核心机制约束

### 约束 1：输入内容产出绘本

- 输入是与本 spec 一起提供的完整内容文件 / `skills/`。
- 输出是一册带真实插图的儿童互动童话绘本。
- 所有故事、图片、互动点、道理都根据内容文件写入数据。
- 儿童端体验以阅读、翻页和轻互动为主。

### 约束 2：儿童安全优先

- 儿童安全高于内容还原。
- 如果内容文件和儿童安全冲突，必须牺牲内容还原。
- 不输出危险操作步骤、成人关系、血腥、恐怖压迫、羞辱或绝对服从价值观。
- 无法安全改写时必须停止，不得强行生成。

### 约束 3：童话化转译

| 原内容对象 | 可转译为 |
|------------|----------|
| 公司 / 组织 | 森林小店、星星工坊、云朵学校 |
| 竞争 / 冲突 | 集市准备、迷路、误会、任务协作 |
| 抽象概念 | 魔法道具、颜色、天气、种子、光 |
| 成人角色 | 动物、精灵、玩具、云朵、树木 |
| 危险事件 | 安全距离外的困难、需要求助的情境 |
| 复杂知识 | 小实验比喻、自然旅程、魔法规则 |

### 约束 4：准确性模式

本产品使用 `fantasy + strict child-safety`：

- 允许幻想改写、拟人化、重构、简化和虚构。
- 不要求保留真实人物、真实时间线、真实机构、真实概念结构。
- 不把事实准确性作为核心验收项。
- 如果包含真实知识点，不能输出明显错误或危险指导。
- 严格执行儿童安全自检。

---

## 十三、内容 / 章节概览

### 绘本结构

| 页段 | 页数 | 功能 | 内容要求 | 插图要求 |
|------|------|------|----------|----------|
| 封面 | 1 | 建立第一印象 | 标题、主角、主要场景 | 主角和世界同框 |
| 开端 | 1-2 | 认识主角和日常 | 世界安全可亲，主角有一个小愿望 | 明亮、温暖、低冲突 |
| 问题 | 3-4 | 出现温和问题 | 小误会、小困难、小目标 | 不能恐怖，情绪可轻微低落 |
| 尝试 | 5-7 | 观察、尝试、求助 | 主角尝试解决，可能犯小错 | 有互动点和可找物件 |
| 修复 | 8-10 | 合作、理解、修复 | 主角学会更好的做法 | 光线变暖，角色关系修复 |
| 结尾 | 1 | 点题 | 一句话道理 + 亲子问题 | 温暖收束，全员安全 |

### 每页内容字段

| 字段 | 说明 |
|------|------|
| `page_id` | 页 ID |
| `story_text` | 适龄正文 |
| `visual_scene` | 插图场景描述 |
| `interaction` | 本页轻互动 |
| `source_mapping` | 这一页来自内容文件中的哪个点 |
| `safety_note` | 本页安全说明 |
| `image_prompt` | 本页生图提示词 |

### 道理设计

允许的道理：

- 遇到困难可以求助。
- 朋友之间可以沟通和道歉。
- 分享会让快乐变多。
- 慢慢来，也可以做好。
- 不懂的事情要问可信任的大人。
- 每个人都可以用自己的节奏成长。

禁止的道理：

- 只有第一名才值得被爱。
- 不听话就会有可怕后果。
- 被欺负要忍着。
- 大人永远是对的。
- 为了成功可以欺骗。
- 勇敢就是不害怕。

---

## 十四、技术约束

| 维度 | 选择 |
|------|------|
| 技术栈 | 单个 HTML 文件，内嵌 CSS + JS + 数据 |
| 外部依赖 | 零依赖；字体可用系统 fallback |
| 生图资产 | 首次 cache miss 时生成，生成结果必须转为 Blob 写入 IndexedDB；cache hit 时禁止调用生图 |
| 离线可用 | cache hit 后可离线阅读；首次 cache miss 需要可用生图能力 |
| 存储 | localStorage 保存轻量阅读进度；IndexedDB 保存图片 Blob |
| 模型调用 | 内容改编发生在构建阶段；图片生图只允许在 IndexedDB cache miss 或用户明确重新生成时触发 |
| 浏览器 | 现代浏览器 |
| 响应式 | 使用视口自适应绘本画布，适配手机竖屏、平板和桌面浏览器 |

性能要求：

- 准备页首屏加载 < 3s；图片准备时间通过进度条展示。
- 刷新或再次打开时必须先查 IndexedDB；cache hit 不得调用生图接口。
- 图片压缩到适合网页展示的大小。
- 移动端点击目标 ≥ 44px。
- 页面正文和按钮在 320px 宽度下不得溢出。
- 页面不得出现横向滚动。
- 封面页、阅读页和结尾页的主操作在常见手机竖屏首屏或绘本内部滚动区内可见。
- 必须至少检查 `320x568`、`390x844`、`768x1024`、`1366x768`、`1920x1080` 五类视口。
- 所有插图必须在进入封面前完成运行时 `generated + cached/cache_hit + loaded + decoded + ready`；阅读阶段禁止懒加载导致的空白页或等待。

---

## 十五、开发指引

收到本 spec 后：

1. 进入 plan 模式，读取所有 `skills/` 内容文件全文。
2. 提取内容文件的核心主题、角色/概念原型、事件关系、风险内容、画面意象和正向寓意。
3. 生成 `source_material.json`，记录内容文件路径、覆盖模块和用途。
4. 执行儿童安全闸门，生成 `safety_report.json`。
5. 若为 `BLOCKED`，停止并报告原因。
6. 若为 `NEEDS_REWRITE`，先改写风险内容，再重新审核。
7. 确定年龄段、绘本分类、统一画风和道理目标。
8. 生成固定故事大纲、`storybook.json` 和 `pages.json`。
9. 为封面、每页和结尾页写完整生图提示词。
10. 输出并核对静态 `IMAGE_ASSET_MANIFEST`，为每张图片计算 `prompt_hash` 和 `cache_key`，并把 `plan_status` 标为 `required`、`initial_runtime_status` 标为 `pending` 或 `seed_available`。
11. 实现图片准备页：显示固定家长提示文案和图片准备进度条。
12. 准备页启动时先执行 IndexedDB cache lookup。
13. 对 cache hit 资产，只读取 Blob、创建 object URL、加载并解码；不得调用生图工具。
14. 对 cache miss 资产，先设置 generation lock，再调用真实生图工具；生成结果必须写入 IndexedDB 后才算完成。
15. 在进入封面页前确认所有必需图片的 `IMAGE_ASSET_RUNTIME_STATE` 均满足 `generation_status = generated`、`cache_status = cached / cache_hit`、`loaded = true`、`decoded = true`、`child_safety_status = passed`、`ready = true`。
16. 实现 HTML/CSS/JS 页面、翻页、互动和存档。
17. 实现刷新 / 再次打开的快速校验：已有图片资产不得重新生图，只读取 IndexedDB Blob 并恢复阅读进度和互动绑定。
18. 确保阅读阶段不再逐页生成、逐页加载或逐页等待图片。
19. 做视口自适应绘本画布适配，检查手机竖屏、平板和桌面浏览器。
20. 执行验收标准自检。

---

## 十六、验收标准

### 随附内容文件验收

| 验收项 | 条件 | 自测结果 |
|--------|------|----------|
| 内容文件读取 | 已读取与本 spec 一起提供的完整内容文件 / `skills/` | 待测 |
| 文件清单 | 已列出内容文件路径、覆盖模块和用途 | 待测 |
| 全文提取 | `source_material` 来自文件全文，不是只看摘要或标题 | 待测 |
| 儿童化映射 | 已从内容文件提取核心意义、角色/概念原型、画面意象和结尾道理 | 待测 |
| 风险记录 | 不适合儿童的内容已进入 `safety_report` / `source_material.discarded_or_rewritten_elements` | 待测 |
| 禁止硬编 | 没有在内容文件缺失或不可读时凭标题编造绘本 | 待测 |

### 绘本成品验收

- [ ] 打开 HTML 后先看到绘本准备页。
- [ ] 绘本准备页包含固定提示：“本绘本由 AI 生成，内容和画面可能存在不确定性。建议家长先完整玩一遍，再给孩子玩。”
- [ ] 绘本准备页显示图片准备进度条。
- [ ] 进度未完成时不能进入封面页。
- [ ] 所有图片运行时 `generated + cached/cache_hit + loaded + decoded + ready` 后才进入绘本封面。
- [ ] 首次 cache miss 时允许生成缺失图片，并写入 IndexedDB。
- [ ] 刷新或再次打开时，如果 IndexedDB 中已有匹配 `cache_key` 的 Blob，不得重新生图。
- [ ] 刷新恢复时只做 IndexedDB 读取、object URL 创建、`load + decode` 校验；如果有有效阅读进度则恢复到上次阅读页，如果没有有效进度则进入封面页。
- [ ] 用户可以按顺序阅读完整绘本。
- [ ] 所有故事页、插图、互动点都已写入本地数据。
- [ ] 绘本有封面、8-12 个内页和结尾页。

### 儿童安全验收

| 验收项 | 条件 | 自测结果 |
|--------|------|----------|
| 儿童安全闸门 | 已生成 `safety_report` | 待测 |
| 最终安全状态 | `final_safety_status` 为 `KIDS-ALL` / `KIDS-6` / `KIDS-9` | 待测 |
| NEEDS_REWRITE 处理 | 所有 `NEEDS_REWRITE` 内容已改写并重新通过 | 待测 |
| BLOCKED 处理 | 无法安全改写时停止，不强行生成 | 待测 |
| 暴力内容 | 无血腥、虐待、真实伤害、报复美化 | 待测 |
| 惊吓内容 | 无恐怖压迫、突然惊吓、噩梦式画面 | 待测 |
| 成人内容 | 无性暗示、裸露、成人关系 | 待测 |
| 危险模仿 | 无危险操作步骤，无鼓励孩子模仿风险行为 | 待测 |
| 价值导向 | 鼓励善意、合作、诚实、求助、修复 | 待测 |

### 生图验收

| 验收项 | 条件 | 自测结果 |
|--------|------|----------|
| IMAGE_ASSET_MANIFEST | 已存在并包含所有必需图片的静态计划，且每张图 `required = true`、`plan_status = required` | 待测 |
| IMAGE_ASSET_RUNTIME_STATE | 已存在并包含所有必需图片的运行时状态 | 待测 |
| 封面图 | 运行时 `generation_status = generated`、`ready = true` | 待测 |
| 每页插图 | 每页 1 张真实生成图片 | 待测 |
| IndexedDB 缓存 | 每张生成图片都有匹配 `cache_key` 的 IndexedDB Blob | 待测 |
| cache hit | 命中缓存时不调用生图 API | 待测 |
| cache miss | 只生成缺失图片，生成后写入 IndexedDB | 待测 |
| generation lock | 多标签页 / 刷新并发时不会重复调用生图 API | 待测 |
| 图片加载 | 所有图片 `loaded = true` | 待测 |
| 图片解码 | 所有图片 `decoded = true` | 待测 |
| 准备闸门 | `asset_preparation_state.ready = true` 后才进入封面 | 待测 |
| 统一画风 | 所有图片共享同一 `STYLE_PROMPT_BASE` | 待测 |
| 提示词卫生 | 正向 prompt 只写儿童友好画面，`negative_prompt` 使用固定短模板 ID，不逐页堆叠负面词 | 待测 |
| 图片引用 | 页面引用真实图片，不是占位 | 待测 |
| 图片存储 | 图片 Blob 存在 IndexedDB 中，localStorage 不存图片数据 | 待测 |
| 禁止伪装 | 无 CSS/SVG/Canvas/emoji 冒充插图 | 待测 |
| 阅读阶段 | 翻页时无图片 loading、空白图、spinner 或逐页生成等待 | 待测 |
| 刷新恢复 | 已有图片资产刷新后不重新生成，只读取 IndexedDB 并快速加载和解码 | 待测 |

### 绘本内容验收

- [ ] 每页文本符合目标年龄段长度。
- [ ] 故事有清晰主角、温和问题、尝试、修复、道理。
- [ ] 不像摘要，不像讲义，不像题库。
- [ ] `skills/` 内容已被儿童化转译，而不是原样复述。
- [ ] 道理温和，不羞辱孩子，不恐吓孩子。
- [ ] 结尾有一句孩子能懂的话和一个亲子讨论问题。

### 交互验收

- [ ] 首次进入绘本前必须出现绘本准备页。
- [ ] 绘本准备页只保留一句家长提示，不设计家长预览确认流程。
- [ ] 绘本准备页自动完成图片准备后进入封面页。
- [ ] 每页最多一个主要互动点。
- [ ] 互动不惩罚、不羞辱、不吓人。
- [ ] 点错有温和提示。
- [ ] 翻页有过渡，不能瞬切。
- [ ] 移动端可点击区域足够大。
- [ ] 支持上一页、下一页、重新阅读。
- [ ] 阅读进度刷新后保留。
- [ ] 刷新恢复后，翻页按钮、互动点、朗读按钮、重新阅读、返回封面等交互仍然可用。
- [ ] 刷新恢复后，不出现图片显示正常但按钮失效、互动点失效或页面卡死。

### UI 视觉验收

- [ ] 标题不是普通 `<h1>`，有绘本式主题设计。
- [ ] 按钮、页码、进度、卡片都经过主题化设计。
- [ ] 插图占主要视觉空间，不被遮挡。
- [ ] 字体清晰，儿童可读。
- [ ] 配色温暖安全，没有大面积恐怖深色或警告红。
- [ ] 粒子或氛围效果不遮挡内容。
- [ ] 支持 `prefers-reduced-motion`。
- [ ] 320px 移动端下无文字溢出和 UI 重叠。

### 响应式画布验收

- [ ] 绘本主体没有使用固定像素宽高作为主布局。
- [ ] 手机竖屏、平板和桌面端都能清楚看到绘本主体，主体居中且是视觉焦点。
- [ ] `320x568`、`390x844`、`768x1024`、`1366x768`、`1920x1080` 视口下均无横向滚动。
- [ ] 封面页、阅读页、结尾页的主操作按钮不会被浏览器工具栏或系统安全区域遮挡。
- [ ] 小屏幕下插图、正文、互动点和翻页按钮不互相遮挡；如内容超高，只允许绘本内部纵向滚动。
- [ ] 桌面端允许背景留白，但绘本主体不能显得过小、偏离中心或像固定截图悬在页面一侧。
- [ ] 插图缩放或裁切后仍保留主角、关键互动物和重要表情。

### 数据验收

- [ ] `meta.json` 字段完整。
- [ ] `source_material.json` 记录了随附内容文件路径、覆盖模块和用途。
- [ ] `source_material.json` 包含儿童化核心意义和删改记录。
- [ ] `safety_report.json` 包含内容描述符和通过状态。
- [ ] `storybook.json` 有主角、世界、道理。
- [ ] `pages.json` 每页有文本、画面描述、图片 ID、互动点。
- [ ] `image_asset_manifest.json` 所有必需图片包含 `required`、`plan_status`、`initial_runtime_status`、`prompt_hash`、`cache_key`、`storage_driver`、`seed_source`。
- [ ] `image_asset_manifest.json` 不把首次运行前的图片硬写成 `status = generated`。
- [ ] `image_asset_runtime_state.json` 所有必需图片状态为 `generation_status = generated`、`cache_status = cached / cache_hit`、`loaded = true`、`decoded = true`、`ready = true`。
- [ ] `asset_preparation_state.json` 存在，且 `ready = true` 才允许进入封面。
- [ ] `browser_asset_cache` / IndexedDB 中存在每个必需图片的 Blob 记录。
- [ ] `storybook_id` 和 `asset_manifest_version` 用于判断刷新恢复是否可复用已有图片资产。
- [ ] localStorage 保存阅读页码、互动完成状态和读完状态，刷新后能恢复。
- [ ] localStorage 只存必要进度，不存图片、base64、Blob 字符串或 object URL。

### 最终判定

以下任一情况出现，判定未完成：

- 打开后不能进入完整绘本阅读流程。
- 进入封面页前没有完成所有必需图片的生成、缓存、加载和解码。
- 阅读阶段出现逐页 loading、空白图、spinner 或翻页后才生成图片。
- 刷新或再次打开时，IndexedDB 中已有匹配缓存的图片仍被当作需要重新生成。
- cache hit 时仍调用生图 API。
- 图片生成后没有写入 IndexedDB，或只存在内存 / object URL / localStorage 中。
- 多标签页、刷新或重复点击导致同一 `cache_key` 并发重复生图。
- 刷新后图片显示正常但翻页、互动点、重新阅读或返回封面失效。
- 没有读取完整 `skills/` 内容文件。
- 没有执行儿童安全闸门。
- 没有绘本准备页和图片准备进度条。
- 儿童不适合内容未删改或未阻断。
- 使用 CSS/SVG/Canvas/emoji 冒充绘本插图。
- 有必需插图的运行时状态不是 `generation_status = generated`、`cache_status = cached / cache_hit`、`loaded = true`、`decoded = true`、`ready = true`。
- 绘本像摘要、讲义或题库，不像儿童绘本。
- 道理包含羞辱、恐吓、绝对服从或过度功利。
- 移动端文字或按钮明显溢出。

只有当随附内容文件、固定绘本形态、儿童安全、真实生图、绘本结构、互动阅读、视觉质量和数据完整性全部通过，才能标记为完成。
