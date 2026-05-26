# 儿童互动童话绘本游戏设计文档（服务器共享生图版）

---

## 一、产品概览

| 维度 | 值 |
|------|-----|
| 产品名称 | {{GAME_NAME}} |
| 来源素材 | {{BOOK_NAME}} |
| 设计粒度 | 可填充玩法框架 |
| 产品类型 | 固定内容儿童互动童话绘本 |
| 目标读者 | 3-10 岁儿童，默认 6-8 岁 |
| 默认安全目标 | `KIDS-6` 内部安全目标，向下兼容儿童友好内容 |
| 绘本长度 | 封面 + 8-12 个内页 + 结尾页 |
| 交互方式 | 点击翻页 + 点一点 / 找一找 / 轻拖拽 / 温和选择 |
| 生图模式 | legacy runtime 共享首次生成缓存：缺图时生成并写入同一游戏版本的共享资产记录，之后所有用户读取同一批共享图片 |
| 准确性模式 | `fantasy + strict child-safety`，即幻想改写 + 严格儿童安全 |
| 核心主题 | 输入随附内容文件，产出一册带真实插图的儿童安全童话绘本 |
| 目标体验 | 打开成品就是一本已经完成的互动绘本，温柔、安全、有想象力、有道理 |

### 核心设计理念

> **这是一个“输入内容 → 产出带图片童话绘本”的儿童安全改编 spec。**
>
> 实现者读取与本 spec 一起提供的完整内容文件，将其中的主题、角色原型、概念、事件和寓意改编成一册儿童可以阅读的互动童话绘本。最终前端入口页面呈现封面、主角、故事页、真实插图、轻互动和结尾道理。

最高优先级：

1. **儿童安全高于一切**：儿童安全高于内容还原、高于剧情刺激、高于事实准确。
2. **内容改编成绘本**：输入是随附内容文件，输出是一册带真实插图的儿童互动童话绘本。
3. **可以大幅童话化**：内容文件中的人物、机构、冲突、概念都可以被转成小动物、精灵、森林、星星、魔法道具或虚构王国。
4. **不适合儿童就改写或阻断**：如果内容文件无法安全改写为儿童绘本，必须停止并告知用户，不能硬编。
5. **不能教坏孩子**：不能把欺骗、霸凌、危险模仿、歧视、报复、绝对服从、过度功利包装成正向结果。

### 绘本准备页（条件模块）

最终前端入口页面必须实现绘本准备页，但它不是每次进入都显示的固定首屏。它是服务器共享图片缺失时才出现的条件页。

进入产品前必须先执行一次不可见的共享资产状态检查：

1. 如果所有必需图片的共享资产记录都不为空，并且对应图片可访问、版本匹配，则不显示绘本准备页，直接进入封面页或有效阅读进度页。
2. 如果任一必需图片的共享资产记录为空，或图片不存在、损坏、URL 不可访问、版本不匹配，则显示绘本准备页，并只为缺失或失效图片触发生图。

准备页只做三件事：

1. 显示一句给家长的轻提示。
2. 显示缺失图片的准备进度：只生成共享资产记录为空或失效的图片；随后返回图片 URL / 资源引用，客户端完成加载 / 解码。
3. 当所有必需图片都达到 `server_ready / server_hit + loaded + decoded + ready` 后，显示“开始游玩”按钮；用户点击后才进入封面页。

固定提示文案：

> 本绘本由 AI 生成，内容和画面可能存在不确定性。建议家长先完整玩一遍，再给孩子玩。

实现要求：

- 视觉可以像绘本装订前的准备台、贴纸进度条、小书签进度条或星星进度条。
- 不做“家长预览模式”，不要求家长点击确认试玩。
- 准备页中只保留上方固定提示文案，不再使用“警告”“确认”“我会先试玩”等流程话术。
- 是否显示准备页必须由共享资产状态决定，不以当前用户浏览器是否有本地图片作为判断依据。
- 共享资产全量命中时不得显示准备页，也不得显示“正在生成插图”“正在准备插图”等文案。
- 只有共享资产缺失、共享记录为空或资源失效时，才显示准备页和“正在生成插图 n / N”。
- 所有封面、内页和结尾页图片的运行时状态都达到 `server_ready / server_hit + loaded + decoded + ready` 后，准备页必须显示“开始游玩”按钮。
- “开始游玩”按钮是缺图分支进入封面页的唯一入口；未点击前不得自动跳转到封面页。
- “开始游玩”按钮点击后进入封面页；如果有有效阅读进度，可以按产品策略进入上次阅读页，但必须保证用户主动点击。
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

- 打开前端入口页面后，系统先做服务器共享图片资产检查；若图片文件全量存在则直接进入绘本，若有缺失才显示绘本准备页并生成缺失图片。
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
> 生图是图片资产闸门，不是可选视觉增强。本 spec 使用 legacy runtime 共享首次生成缓存：任意用户第一次打开该游戏时，如果当前游戏版本尚无共享图片资产，运行时生成缺失图片并写入同一批共享资产记录；之后所有用户打开同一游戏版本时，都读取这批已经共享的图片，不再按用户、设备或浏览器重复生图。

`IMAGE_GENERATION_TIMING = server-shared-cache`

### 实现边界：必须走 legacy runtime 共享资产管线

本模式的目标是“同一游戏版本的图片跨用户共享”，不是“每个浏览器本地缓存一次”。在 PDF2App legacy runtime 项目中，稳定 share 的优先实现路径必须是现有 runtime 共享资产能力：`runtime_share.js` / `runtime_api_client.js` + 显式业务层 `share.js`。不得自行幻想不存在的固定 HTTP endpoint、服务器文件夹或 SDK 方法。

准备页文案中出现“服务器正在保存 / 服务器已有插图”不算完成；必须真的写入当前运行环境提供的共享资产记录，并能让另一个浏览器 / 另一个设备用同一 `server_asset_key` 读到同一张图片。

最低实现要求：

- 必须有共享资产状态读取能力，优先通过 `share.js` 包装 `runtime_share.js` 实现；普通服务器项目可以用数据库 / 对象存储 / 文件索引实现等效能力。
- 必须有共享资产写入能力，能把真实生图结果写入当前游戏版本的稳定共享资产记录；本 spec 不指定具体 SDK 方法名、HTTP 路由或 Runtime API。
- 必须有稳定可读取的共享图片 URL / 资源引用。生成完成后，另一台设备打开同一 app，应先命中共享资产记录并读取图片，而不是重新调用生图。
- 如果当前运行环境只有浏览器本地 IndexedDB / localStorage / 内存，没有任何跨用户共享写入能力，则必须停止并报告，不得退回到每个浏览器自己生成和缓存。

该模式的核心目标：

- 图片资产属于“游戏版本”，不属于某个浏览器用户。
- `user_id` 不得进入图片资产缓存键，除非用户明确要求每个用户看到个性化图片。
- 图片共享位置 / 共享记录必须由 runtime share 层和 `IMAGE_ASSET_MANIFEST` 确定，不得由前端、用户会话、浏览器缓存或临时运行目录临时决定。
- 是否需要生图由共享资产记录决定，不由当前浏览器的 `localStorage`、IndexedDB、HTTP cache 或内存状态决定。
- 浏览器本地缓存只允许作为加载加速；它不能作为“图片已经生成完成”的唯一依据。
- 如果部署环境没有 legacy runtime 共享资产能力、可写服务器目录、数据库或对象存储中的任一种跨用户持久化能力，则不能使用本模式；实现者必须停止并告知用户，或改为构建期真实生图打包。

### 最终 HTML 与 JS 分层（强制）

最终 HTML 必须保留 legacy runtime 项目的固定基础入口，并生成清晰的业务分层。推荐加载顺序如下；如文件名调整，职责必须等价：

```html
<script src="js/runtime_share.js"></script>
<script src="js/runtime_api_client.js"></script>
<script src="js/storybook.js?v=1"></script>
<script src="js/assets.js?v=1"></script>
<script src="js/share.js?v=1"></script>
<script src="js/prep.js?v=1"></script>
<script src="js/reader.js?v=1"></script>
<script src="js/app.js?v=1"></script>
```

职责边界：

- `storybook.js`：只放已经儿童安全改编后的绘本数据、页面文本、互动配置。
- `assets.js`：只放 `IMAGE_ASSET_MANIFEST`、稳定 `asset_id`、`prompt_hash`、`server_asset_key`、完整生图 prompt 和比例；不得在这里读写 localStorage / IndexedDB。
- `share.js`：唯一负责跨用户共享图片资产读写。它必须包装当前项目已有的 `runtime_share.js` / 共享资产能力，按稳定 `server_asset_key` 查询、写入、更新状态，并暴露“查共享资产、写共享资产、等锁、读取 URL”的业务函数。
- `prep.js`：如果单独存在，只负责缺图分支的准备页状态、进度和调用 `share.js` 写入共享资产；它必须在 `share.js` 之后加载。
- `reader.js` / `book.js`：只负责绘本渲染、翻页、互动和图片解码后的展示；不得直接调用生图，不得直接决定是否需要生成图片。
- `app.js`：只负责启动流程编排：读取 manifest → 调用 `share.js` 查共享资产 → 缺失时触发生图 → 每张成功后立刻写共享资产 → 全部 ready 后进入绘本。

`share.js` 必须早于 `prep.js`、`book.js`、`reader.js` 和任何会把生图结果转成 Blob / File 的模块加载。不得出现 `prep.js` 先执行、`share.js` 后加载，导致图片准备逻辑绕过共享写入层。

禁止把跨用户共享逻辑压成一个只管本地缓存的 `asset_manager.js`。如果项目仍使用 `asset_manager.js` 这个文件名，它必须只是组合层，内部仍要有等价的显式 share adapter 职责；不得只检查 IndexedDB 后决定生图。

共享资产 key 必须稳定：

```text
server_asset_key = storybook_id + "/" + asset_manifest_version + "/" + asset_id + "/" + prompt_hash
```

`server_asset_key`、`cache_key`、共享记录路径和图片 URL 中禁止出现 `userId`、session id、浏览器 id、时间戳、随机数、临时 runtime 图片 URL 或设备信息。

### 共享图片资产位置契约（legacy runtime 优先）

这是本模式的核心约束。实现者必须明确“共享资产记录在哪里、如何按稳定 key 查询、如何写入、如何读取 URL”，不能让每个用户打开时各自决定图片放在哪里。

在 PDF2App legacy runtime 项目中，优先使用 `share.js` 包装 `runtime_share.js` 管理共享资产记录；此时下表中的 `storage_path` 可以理解为 runtime shared asset 的稳定对象 key / 共享记录位置，`public_url` 可以理解为 runtime shared asset 返回的可读取图片 URL。不得为了满足字段名而自行编造不存在的 `/generated-assets` 后端。

只有在普通 Web 服务端或对象存储项目中，才使用真实服务器目录 / bucket 作为下面字段的物理实现。

必须定义以下常量或等效配置：

| 配置项 | 示例 | 要求 |
|--------|------|------|
| `SHARED_ASSET_DRIVER` | `legacy_runtime_share` / `object_storage` / `server_filesystem` | 默认优先 `legacy_runtime_share`；不得退回浏览器本地缓存 |
| `SHARED_ASSET_NAMESPACE` | `storybook/{storybook_id}/{asset_manifest_version}` | 单个绘本版本的共享命名空间 |
| `SERVER_IMAGE_ASSET_ROOT` | `/var/www/app/public/generated-assets` | 仅普通服务端文件模式需要；legacy runtime 模式可为空或映射为共享对象前缀 |
| `PUBLIC_IMAGE_ASSET_BASE_URL` | `/generated-assets` 或 runtime shared URL | 前端可访问的图片 URL 前缀或 runtime share 返回的稳定 URL |
| `STORYBOOK_ASSET_DIR` | `${SERVER_IMAGE_ASSET_ROOT}/${storybook_id}/${asset_manifest_version}` | 普通文件模式的固定图片目录；legacy runtime 模式等价为共享对象 key 前缀 |
| `STORYBOOK_PUBLIC_URL_BASE` | `${PUBLIC_IMAGE_ASSET_BASE_URL}/${storybook_id}/${asset_manifest_version}` | 普通文件模式的固定公开 URL 前缀；legacy runtime 模式由 shared record 返回 |

普通文件模式的 localhost 开发默认使用项目内可写目录，不使用 `/var/www` 占位路径。下文出现的 `/var/www/app/public/generated-assets` 只表示普通服务端生产部署示例，不得照搬为 PDF2App legacy runtime 的默认路径：

```text
PROJECT_ROOT=<当前项目根目录>
SERVER_IMAGE_ASSET_ROOT={PROJECT_ROOT}/public/generated-assets
PUBLIC_IMAGE_ASSET_BASE_URL=/generated-assets
STORYBOOK_ASSET_DIR={PROJECT_ROOT}/public/generated-assets/{storybook_id}/{asset_manifest_version}
STORYBOOK_PUBLIC_URL_BASE=/generated-assets/{storybook_id}/{asset_manifest_version}
```

如果项目使用其他框架，也必须选择一个“跨用户可写、跨用户可读取”的等效共享位置，并在实现中显式配置。不得只生成 `public_url` 字符串而没有对应共享资产记录。

每张图片的共享资产位置必须由静态清单确定：

```text
asset_file_name = {asset_id}_{prompt_hash_short}.{ext}
shared_object_key = {SHARED_ASSET_NAMESPACE}/{asset_file_name}
storage_path = {STORYBOOK_ASSET_DIR}/{asset_file_name} 或 shared_object_key
public_url = {STORYBOOK_PUBLIC_URL_BASE}/{asset_file_name} 或 shared record 返回的稳定图片 URL
```

普通文件模式示例：

```text
SERVER_IMAGE_ASSET_ROOT=/var/www/app/public/generated-assets
PUBLIC_IMAGE_ASSET_BASE_URL=/generated-assets
storybook_id=storybook_001
asset_manifest_version=v1
asset_id=page_01_img
prompt_hash_short=3f2a91c8

storage_path=/var/www/app/public/generated-assets/storybook_001/v1/page_01_img_3f2a91c8.webp
public_url=/generated-assets/storybook_001/v1/page_01_img_3f2a91c8.webp
```

必须遵守：

- `server_asset_key` 和 `shared_object_key` 必须在生成前就能根据 `IMAGE_ASSET_MANIFEST` 算出；普通文件模式下 `storage_path` 和 `public_url` 也必须可预先计算。
- 判断是否需要生图时，必须先通过 `share.js` / 共享资产记录检查固定 `server_asset_key` 是否存在、可读、MIME 正确、版本和 `prompt_hash` 是否匹配；普通文件模式下还要检查真实 `storage_path`。
- 如果固定 `storage_path` 已存在且资产记录有效，任何用户打开都只能读取同一个 `public_url`，不得再次生图。
- 如果固定 `storage_path` 为空、缺失、损坏或版本不匹配，只能由服务端为该固定路径生成一次，并写入同一个位置。
- 生成过程必须使用共享资产锁；普通文件模式下先写临时文件，例如 `{asset_file_name}.tmp-{task_id}`，生成和安全校验完成后再原子替换 / rename 到最终 `storage_path`，避免用户读到半张图。
- `user_id`、session id、浏览器 id、IP、时间戳随机目录不得出现在 `STORYBOOK_ASSET_DIR`、`storage_path`、`public_url`、`server_asset_key` 或 `cache_key` 中。
- 如果需要对象存储，`storage_path` 等价为 object key，但仍必须遵守同样的目录结构：`generated-assets/{storybook_id}/{asset_manifest_version}/{asset_file_name}`。
- 如果既不能写入 legacy runtime shared asset，也不能写入服务器文件目录或对象存储，必须报错停止，不得退回到“每个用户浏览器自己生成一份”。

### 最小共享资产契约

实现者必须提供等效的共享资产函数 / 服务端能力，不要求路径名称完全相同。这里的名称是职责说明，不是要求照抄的 API 端点：

| 共享资产能力 | 职责 | 硬约束 |
|---|---|---|
| 资产状态检查 | `share.js` 按 `IMAGE_ASSET_MANIFEST` 计算每张图的 `server_asset_key` / `shared_object_key`，查询 runtime shared asset 或等效共享记录，确认图片存在、可读、MIME 正确、版本和 `prompt_hash` 匹配 | 不得只查前端状态、manifest、localStorage、IndexedDB、HTTP cache 或内存变量 |
| 缺失图片准备 | 只为 `missing_or_invalid_shared_assets` 准备缺失 / 失效图片，设置共享 generation lock，并写入同一个 `server_asset_key` 对应的共享记录 | 每张图生成成功后必须立刻写入共享资产记录；不得等整批全部成功后才保存 |
| 共享图片读取 | 读取已生成图片的稳定 URL / 资源引用；普通文件模式可对应 `/generated-assets/{storybook_id}/{asset_manifest_version}/{asset_file_name}` | 必须返回真实图片；刷新、换浏览器、换设备后仍可访问 |

生图调用方式使用自然语言约束，不固定为任何 SDK、类名、HTTP endpoint 或 Runtime API。实现者必须使用当前运行环境中已经验证可用、能成功返回真实图片结果的生图能力。

禁止假设任何未经当前环境验证的生图调用方式一定存在，包括固定 SDK 方法、运行时客户端类名、HTTP method、endpoint 或平台私有 API。

生图能力只需要满足：

1. 输入本 spec 生成的完整 prompt、统一 `STYLE_PROMPT_BASE`、`negative_prompt` 和目标比例。
2. 返回真实图片 bytes、Blob、文件路径或可下载图片 URL。
3. 生成结果能被 `share.js` / 等效服务端共享写入流程接收，并写入稳定 `server_asset_key` 对应的共享记录。
4. 写入完成后，稳定图片 URL / 资源引用可直接读取真实图片。

如果可用生图能力返回 `404`、`405`、`501`、`unsupported method`、`not implemented` 或类似错误，必须停止并报告“当前环境没有可用生图接口或调用方式不匹配”，不得循环显示准备页，不得伪造图片，不得退回 IndexedDB 主存储。

如果生图能力返回 `524`、timeout、origin timeout 或类似超时错误，必须把它视为“某一张图片生成失败 / 超时”，不得让整个启动流程崩溃后从第 1 张重新开始。已经成功生成并写入共享资产记录的图片必须保留；下一次打开只重试缺失或失败的 `asset_id`。

如果生图结果返回 `http://.../__runtime/llm-images/...` 这类 runtime 临时图片 URL，它只能作为本次生成结果的临时来源。实现者必须在任何 `fetch`、`imageUrlToFile`、Blob / File 转换或共享写入前，把同域 HTTP 临时 URL 规范化为 HTTPS 或同源相对 URL；不得直接 `fetch` 原始 HTTP 临时 URL，否则 HTTPS 页面会触发 Mixed Content 拦截。不得把这个 URL 持久化为最终 `public_url`、`server_asset_key`、`cache_key` 或 shared record。最终记录必须指向 `share.js` 写入后的共享资产 URL / 资源引用。

### runtime 临时图 URL 规范化（硬约束）

在 PDF2App legacy runtime 中，生图能力可能返回与当前页面同域但协议为 `http:` 的临时图片地址，例如：

```text
http://{current-host}/__runtime/llm-images/{image_id}.png
```

如果当前页面是 `https:`，任何模块都不得直接 `fetch` 这个原始地址。必须先执行等价于以下逻辑的规范化：

```js
function normalizeRuntimeImageUrl(rawUrl) {
  const url = new URL(rawUrl, window.location.href);
  const sameHost = url.host === window.location.host;
  const runtimeImage = url.pathname.startsWith("/__runtime/llm-images/");

  if (sameHost && runtimeImage) {
    return url.pathname + url.search + url.hash;
  }

  if (window.location.protocol === "https:" && url.protocol === "http:" && sameHost) {
    url.protocol = "https:";
  }

  return url.href;
}
```

实现要求：

- `imageUrlToFile`、`urlToBlob`、`fetchGeneratedImage` 或任何等价函数必须先调用上述规范化逻辑，再执行 `fetch`。
- 对同域 `/__runtime/llm-images/`，优先转成同源相对路径，例如 `/__runtime/llm-images/xxx.png`，让浏览器使用当前 HTTPS origin 请求。
- `assets.js` 不应独立持有绕过 `share.js` 的生图结果写入逻辑；如果它提供 `imageUrlToFile` 这类工具函数，该函数必须只负责安全转换，并由 `share.js` / `prep.js` 调用完成共享写入。
- Mixed Content、`Failed to fetch`、`net::ERR_NAME_NOT_RESOLVED` 发生时，必须标记当前 `asset_id` 为转换 / 写入失败，并保留已成功写入 shared record 的图片；不得从第 1 张整批重来。

生图结果的写入链路必须满足以下任一方式：

1. 生图结果在服务端获得，服务端拿到图片 bytes / 文件结果后直接写入 `storage_path`。
2. 如果生图结果先出现在前端，前端必须把真实图片 Blob / bytes 交给 `share.js` 共享写入流程，由 runtime shared asset 或等效服务端存储写入稳定共享记录；在共享记录存在且图片 URL 可读取之前，不得把图片标记为 `server_ready`。

### 加载与存储（硬约束）

这组规则用于防止实现者把“服务器共享生图”误写成“每个浏览器自己存一份图”。它的优先级高于一般性能优化和浏览器缓存策略。

| 约束 | 规则 |
|---|---|
| 外部依赖 | legacy runtime 固定基础依赖可以沿用平台入口，例如 DaisyUI / Tailwind browser / App Insight / `pdf2app-embed.js` / `runtime_share.js` / `runtime_api_client.js`。除此之外，前端框架、字体、UI 装饰资源不新增外链 CDN；应内嵌打包或走同源 / 本地 `assets/`。AI 生成插图不走用户本地 `assets/`，必须走 `share.js` 返回的稳定共享图片 URL / 资源引用。 |
| 图片主存储 | AI 生成图片 Blob 一律由 `share.js` 写入 legacy runtime shared asset、对象存储或服务器共享目录；禁止把首次生成结果只写入浏览器 IndexedDB、localStorage、内存、Blob URL、前端源码目录或用户会话目录。 |
| IndexedDB | IndexedDB 只能作为当前浏览器的二级加载缓存：它可以缓存从稳定共享图片 URL 拉取到的副本，但不能参与“共享资产是否已有图”的判断。IndexedDB 为空时也必须先查 `share.js` / shared record；如果 shared hit，不得重新生图。 |
| localStorage | localStorage 只保存阅读进度、互动状态和轻量版本信息；禁止保存图片、base64、大 data URL、Blob 字符串、object URL 或图片生成结果。 |
| 生成写入 | 真实生图能力产出的图片数据必须逐张交给 `share.js` 写入共享资产记录；普通文件模式下再做临时文件和原子替换。前端不得把“收到生成 Blob 后存 IndexedDB”作为唯一持久化路径。 |
| HTML 体积 | 禁止把生成后的大图以 base64 / data URL 形式塞进前端入口页面；页面只能引用稳定共享图片 URL / 资源引用，或使用浏览器二级缓存加速已确认的共享图片。 |

### 什么是生图

- ✅ 使用当前环境中已经验证可用的真实生图能力，输入提示词，获得一张真实的位图文件、图片 bytes、Blob 或可下载图片 URL。
- ✅ 图片数据必须由 `share.js` 写入 legacy runtime shared asset、服务器文件夹、S3 / R2 / OSS 等对象存储或等效跨用户持久化存储。
- ✅ 图片必须有稳定的共享资产记录和可访问 URL / 资源引用；进入封面前，客户端必须已经拿到这些资源，并完成 `load + decode`。
- ✅ 如果多个用户同时第一次打开同一游戏版本，只允许一个共享生成任务实际调用生图模型，其他用户等待同一批共享结果。

### 什么不是生图

- ❌ CSS 渐变、box-shadow、border-radius 画出来的图形不是生图。
- ❌ SVG path、circle、polygon 手动描绘的图形不是生图。
- ❌ Canvas 代码绘制的图形不是生图。
- ❌ emoji 或 Unicode 符号拼凑不是生图。
- ❌ 纯文字描述“这里应该有一张图”不是生图。
- ❌ CSS/SVG/Canvas 做一个风格化占位图然后当作图片不是生图。
- ❌ 只把图片写入某个用户自己的浏览器 IndexedDB，不算完成本 spec 的共享资产策略。
- ❌ 按 `user_id` 为每个用户单独生成一套相同用途的图片，不符合本 spec 的默认共享策略。

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

3. **先查固定共享资产记录，再决定是否显示准备页和使用生图能力**
   - 客户端启动后必须先通过 `share.js` 请求共享资产状态；这个检查可以是不可见启动检查，不等于显示准备页。
   - `share.js` 必须按 `storybook_id + asset_manifest_version + asset_id + prompt_hash` 计算固定 `server_asset_key` / `shared_object_key`，再检查 runtime shared asset 或等效共享记录。
   - 如果所有共享资产命中、共享记录不为空、图片可读取、版本匹配、儿童安全状态通过，不得显示准备页，不得使用生图能力。
   - 只有共享资产缺失、共享记录为空、图片损坏、版本变更、提示词哈希变化，或管理员明确触发重新生成时，才允许显示准备页并使用当前环境已验证可用的真实生图能力。
   - 如果当前环境没有可用生图能力，或调用方式返回 404 / 405 / 501 / unsupported method / not implemented，必须停下来告知用户，不能用 CSS/SVG/Canvas 替代，不能循环准备页。

4. **持久化图片数据到共享资产存储**
   - 每张生成结果必须写入 `server_asset_key` 对应的固定共享位置，推荐优先使用 legacy runtime shared asset，普通服务端项目可使用对象存储或服务器可写目录。
   - 共享记录必须记录资产的 `server_asset_key`、`shared_object_key`、`public_url`、`prompt_hash`、`mime_type`、文件大小、状态和时间戳。
   - 不得把图片写到用户专属目录、请求临时目录、浏览器缓存、前端工程源码目录或不可被所有用户读取的位置。
   - 浏览器可以使用普通 HTTP cache 或可选 IndexedDB 加速图片读取，但浏览器本地缓存不能替代共享资产记录。
   - `localStorage` 只保存阅读进度和轻量版本信息，不得保存图片、base64、大 data URL、Blob 字符串或 object URL。
   - 如果共享资产存储不可写、不可读或 URL 不可访问，本产品不能判定完成。

### IMAGE_ASSET_MANIFEST

最终数据必须包含 `IMAGE_ASSET_MANIFEST`。它只描述“本绘本需要哪些图片、每张图如何生成、共享资产键是什么”，不直接表示当前浏览器里图片是否已经加载完成。

`IMAGE_ASSET_MANIFEST` 是静态资产计划层；图片是否已经写入 shared record、是否有共享 URL、当前浏览器是否已经加载 / 解码，必须写入运行时状态层和共享资产记录层。

#### 静态资产计划字段

| 字段 | 说明 |
|------|------|
| `id` | 图片唯一 ID，如 `cover`, `page_01`, `ending` |
| `purpose` | 用途：封面 / 第几页 / 结尾 |
| `required` | 必须为 `true`，表示该图片是进入绘本前必须准备的资产 |
| `plan_status` | 固定为 `required`，表示目标清单中必须存在；不得用它表示已经生成 |
| `initial_runtime_status` | 初始运行时状态：`pending` / `seed_available`。首次 shared miss 前通常为 `pending` |
| `generation_timing` | 固定为 `server-shared-cache` |
| `style_prompt_base` | 统一画风基底 |
| `prompt` | 完整正向提示词 |
| `negative_prompt` | 固定短模板 ID，如 `standard_child_safe_negative_prompt_v1` |
| `prompt_hash` | 根据 `style_prompt_base + prompt + negative_prompt + asset_manifest_version` 计算的稳定哈希 |
| `aspect_ratio` | 推荐 4:3 或 3:4，根据页面布局决定 |
| `server_asset_key` | 共享资产键，建议 `storybook_id/asset_manifest_version/asset_id/prompt_hash` |
| `cache_key` | 兼容字段，值应与 `server_asset_key` 语义一致；不得包含 `user_id` |
| `storage_driver` | `legacy_runtime_share` / `server_filesystem` / `object_storage` / `cdn_backed_object_storage` |
| `shared_object_key` | 共享资产对象 key，legacy runtime 模式下由 `SHARED_ASSET_NAMESPACE + asset_file_name` 生成 |
| `asset_file_name` | 固定文件名，如 `page_01_img_3f2a91c8.webp`，由 `asset_id + prompt_hash_short + ext` 生成 |
| `storage_root` | legacy runtime 模式可为 `runtime_shared_asset`；普通文件模式为服务端图片根目录或对象存储 bucket 前缀 |
| `storage_dir` | legacy runtime 模式可为 `SHARED_ASSET_NAMESPACE`；普通文件模式为当前绘本版本目录 |
| `storage_path` | legacy runtime 模式可为 `shared_object_key`；普通文件模式为完整服务器文件路径或对象 key |
| `public_url_base` | legacy runtime 模式可为 `runtime_shared_asset_url`；普通文件模式为当前绘本版本公开 URL 前缀 |
| `public_url` | `share.js` 返回 / 确认的稳定图片 URL 或资源引用；生成前可以为空，但 ready 前必须非空且可读取真实图片 |
| `seed_source` | 可选构建期 seed，例如 `{ "type": "none" }`、`prebundled_server_file` 或 `object_storage_url` |
| `child_safety_requirement` | 固定为 `must_pass_before_ready` |

静态计划层不得把未生成的图片写成 `status = "generated"`。`pending` 在静态计划中是允许的，但它只能表示“等待服务器准备”，不能放行封面页。

#### 运行时资产状态字段

运行时必须为每个必需图片维护一条 `IMAGE_ASSET_RUNTIME_STATE`：

| 字段 | 说明 |
|------|------|
| `asset_id` | 对应 `IMAGE_ASSET_MANIFEST.assets[].id` |
| `server_asset_key` | 与静态计划层一致 |
| `public_url` | `share.js` / 共享资产层返回或确认的图片 URL；不得因用户、会话或浏览器不同而变化 |
| `server_file_location_status` | `empty` / `present` / `invalid`，由 `shared_object_key`、`public_url` 和实际图片可访问性共同决定 |
| `generation_status` | `pending` / `generating` / `generated` / `failed` |
| `server_asset_status` | `not_checked` / `server_hit` / `server_miss` / `server_generating` / `server_ready` / `server_corrupt` / `failed` |
| `client_cache_status` | `not_required` / `not_checked` / `browser_cache_hit` / `browser_cache_miss` / `client_cached`，仅作加载加速参考 |
| `loaded` | `true` 表示图片资源已被浏览器加载 |
| `decoded` | `true` 表示图片已完成解码，可立即绘制 |
| `ready` | `generation_status = "generated"`、`server_asset_status` 为 `server_ready` 或 `server_hit`、`public_url` 可访问、`loaded = true`、`decoded = true`、`child_safety_status = "passed"` 时才为 `true` |
| `child_safety_status` | `pending` / `passed` / `failed` |

`server_hit` 表示本次启动检查发现固定共享资产已经存在且可访问；`server_ready` 表示共享资产记录或刚完成的生成结果已经可被读取。二者都可以放行阅读，但不得把二者相加当成两套图片数量。

`placeholder` / `css_fallback` 均不通过。`pending` 只允许出现在不可见启动资产检查或缺图准备页完成前；任一必需图片仍为 `pending` 时不得进入封面页。

### 服务器共享图片准备与预加载闸门

> **阅读阶段禁止逐页生成图片、逐页等待图片、翻到某页才开始请求图片。**

在进入封面页之前，必须完成所有图片资产的共享状态检查和客户端加载 / 解码。准备页只在缺图分支显示：

```text
client opens app
→ app.js calls share.js to request shared asset status
→ share.js computes fixed server_asset_key/shared_object_key for every required asset

Branch A: all required shared records present and images valid
→ skip preparation page
→ return stable image URL / resource list
→ client load/decode
→ 全部 ready = true
→ 直接显示封面页 / 有效阅读进度页

Branch B: any required shared record empty or image invalid
→ show preparation page
→ shared generation lock
→ generate only missing/invalid assets
→ write each successful result to shared asset record immediately
→ safety check passed
→ record stable image URL / resource reference
→ client receives all image URLs / resource references
→ client load/decode
→ 全部 ready = true
→ 显示“开始游玩”按钮
→ 用户点击“开始游玩”
→ 显示封面页 / 有效阅读进度页
```

实现要求：

- 客户端启动时必须先由 `app.js` 调用 `share.js` 请求共享资产状态，`share.js` 按 `server_asset_key` 计算固定 `shared_object_key` 后查询所有必需图片。
- 如果共享资产全量存在，客户端不得显示准备页，只接收 URL / 资源引用、加载并解码图片，不得触发生图能力。
- 如果共享资产缺失，只能生成缺失的图片；已经 `server_ready` 且共享记录有效的图片不得重复生成。
- 生成中的图片必须设置共享 generation lock；每张图片生成并安全校验通过后，必须立刻写入同一 `server_asset_key` 对应的共享资产记录，并返回稳定 URL / 资源引用给客户端加载和解码。普通文件模式下才需要临时文件和原子替换。
- 准备页进度条只在缺图分支出现，并统计缺失 / 失效图片数量；可以同时显示总必需图片数。
- 任一图片的运行时状态未达到 `generation_status = generated`、`server_asset_status = server_ready / server_hit`、`loaded = true`、`decoded = true`、`ready = true` 时，不得显示“开始游玩”按钮，也不得进入封面页。
- 全部图片 ready 后，准备页必须停留在完成状态并显示“开始游玩”按钮，不得自动跳转。
- 进入封面页后，翻页时不得出现空白图、骨架图、spinner、逐页 loading 文案或图片生成等待。

### 刷新 / 再次打开 / 新用户打开的快速校验规则

本绘本不是一次性体验。任意用户刷新页面、关闭后再次打开，或另一个新用户第一次打开时，都必须先请求共享资产状态，不得因为当前浏览器没有本地图片而重新生图。

必须区分三类状态：

| 状态 | 含义 | 刷新后是否应重新执行 |
|------|------|----------------------|
| `required / pending` | 静态计划中要求必须准备，但 shared record 还没有确认共享资产可用 | 需要继续请求共享资产状态，必要时生成缺失图片 |
| `generated` | 共享资产记录显示图片已经由真实生图工具生成，或已有构建期 seed 写入共享存储 | 不应重新生成 |
| `server_ready / server_hit` | 图片文件或资源已存在于共享资产存储，且 `server_asset_key` 与当前版本匹配 | 不应重新生成 |
| `loaded` | 图片资源在当前浏览器会话中加载成功 | 可以重新快速检查 |
| `decoded` | 图片在当前浏览器会话中解码完成，可立即绘制 | 可以重新快速检查 |

如果 `IMAGE_ASSET_MANIFEST` 和 `IMAGE_ASSET_RUNTIME_STATE` 满足以下条件：

- 每个必需图片都有稳定 `server_asset_key`。
- 每个必需图片在运行时状态中 `generation_status = "generated"`。
- 每个必需图片在运行时状态中 `server_asset_status = "server_ready"` 或 `server_asset_status = "server_hit"`。
- 每个必需图片的 `prompt_hash` 与当前页面数据一致。
- 共享资产存储中存在对应 `server_asset_key` 的文件 / 对象 / 资源记录。
- `share.js` 返回的稳定 URL / 资源引用可访问。
- 每个必需图片的 `child_safety_status = "passed"`。
- 当前 `storybook_id`、`asset_manifest_version`、图片 `id` 和提示词版本未发生变化。

则再次打开或刷新页面时必须走快速校验流程：

1. 不触发生图能力，不显示“正在生成图片”“重新生成图片”等文案。
2. 只请求共享资产状态、接收稳定 URL / 资源引用、执行图片 `load + decode` 校验。
3. 当共享资产全量命中时，不得显示准备页；可以使用不可见启动检查，或直接进入封面 / 有效阅读进度页。
4. 所有图片校验成功后，如果 localStorage 中存在同一 `storybook_id` 和 `asset_manifest_version` 的有效 `current_page_id`，恢复到用户上次阅读页；如果没有有效进度，则进入封面页。
5. 如果某张图片 `server_miss`、共享记录为空、资源损坏、URL 失效或解码失败，应标记具体资产 ID 和原因，并显示准备页或错误状态。
6. 只有共享资产缺失、共享记录为空、资产损坏、版本变更、提示词哈希变化，或管理员明确重新生成时，才允许重新进入生图流程。

刷新恢复后，翻页按钮、互动点、朗读按钮、重新阅读、返回封面等交互必须全部重新绑定并可用。不得出现“图片显示正常但按钮失效 / 互动点失效 / 下一页不能点”的一次性绘本状态。

### 共享资产缓存与并发锁

必须使用 legacy runtime shared asset、共享资产存储或等效跨用户持久化能力保存生图结果，不得只依赖某个用户浏览器的 IndexedDB、普通 HTTP cache、Blob URL、内存变量或 localStorage。

缓存对象至少包含：

| 字段 | 说明 |
|------|------|
| `server_asset_key` | `storybook_id/asset_manifest_version/asset_id/prompt_hash` |
| `asset_id` | 对应 `IMAGE_ASSET_MANIFEST.assets[].id` |
| `storybook_id` | 当前绘本 ID |
| `asset_manifest_version` | 当前图片清单版本 |
| `prompt_hash` | 当前图片提示词哈希 |
| `storage_driver` | `legacy_runtime_share` / `server_filesystem` / `object_storage` / `cdn_backed_object_storage` |
| `shared_object_key` | 共享资产对象 key，legacy runtime 模式必须存在 |
| `storage_path` | legacy runtime 模式可等于 `shared_object_key`；普通文件模式为服务器文件路径或对象存储 key |
| `public_url` | 客户端可访问的稳定图片 URL / 资源引用 |
| `mime_type` | 如 `image/png` / `image/webp` |
| `byte_size` | 文件大小 |
| `created_at` | 首次写入时间 |
| `updated_at` | 最近更新时间 |
| `status` | `ready` / `generating` / `failed` / `corrupt` |
| `generated_by_task_id` | 最近一次生成任务 ID |

并发要求：

- 生成前必须设置跨用户 generation lock，避免多个用户、多个浏览器、刷新或多标签页同时触发重复生图。
- 锁粒度应至少覆盖 `storybook_id + asset_manifest_version + asset_id + prompt_hash`；也可以为整本绘本设置批量生成锁。
- `generation_lock` 必须存于 legacy runtime shared record、服务端数据库、Redis、文件锁或对象存储锁记录中，不能只存在某个浏览器。
- `generation_lock` 必须包含 `server_asset_key`、`started_at`、`expires_at`、`owner_task_id` 和 `status`。
- 如果检测到同一 `server_asset_key` 正在生成，后来的客户端应轮询 / SSE 等待同一结果，显示“正在准备插图”，不得再次触发生图能力。
- 如果锁过期或生成任务失败，服务端必须把失败原因写入资产状态，并允许安全重试；不得让准备页无限等待。
- 客户端可使用浏览器 HTTP cache 或可选 IndexedDB 作为二级缓存，但每次打开仍必须先校验 `asset_manifest_version` 和共享资产状态；本地二级缓存不能触发生图决策。

---

## 七、功能清单

P0 为核心体验，P1 为明显提升体验。只做 P0 和 P1。

| 优先级 | 功能名称 | 解决什么问题 | 输入 | 输出 |
|--------|----------|--------------|------|------|
| P0 | 固定绘本阅读 | 图片准备完成后阅读已完成绘本 | 点击开始 | 封面与绘本页 |
| P0 | 内容文件改编 | 让 `skills/` 内容成为绘本故事 | 完整内容文件 | `source_material` + 故事大纲 |
| P0 | 儿童安全闸门 | 防止不适合儿童内容进入绘本 | `source_material` | `KIDS-*` / `NEEDS_REWRITE` / `BLOCKED` |
| P0 | 条件绘本准备页 | 只在共享图片资产缺失或失效时显示家长提示和准备进度 | 共享资产状态 | 提示文案 + 缺失图片准备进度条 |
| P0 | 图片缓存 / 预加载闸门 | 避免刷新重复生图和翻页逐页等图 | 图片资产清单 + 共享资产状态 | 所有图片运行时 `generated + server_ready / server_hit + loaded + decoded + ready` |
| P0 | 刷新后快速恢复 | 绘本不能是一次性页面 | 刷新 / 再次打开 / 新用户打开 | shared hit 不重新生图，获取共享图片 URL 并恢复阅读与互动 |
| P0 | 儿童化转译 | 把复杂内容转成童话 | 内容核心意义 + 风险标签 | 角色、世界、冲突、道理 |
| P0 | 绘本页系统 | 形成完整阅读节奏 | 故事大纲 | 封面 + 8-12 个内页 + 结尾 |
| P0 | 真实插图资产 | 绘本必须有真实主视觉 | 页面提示词 | 真实图片资产 |
| P0 | 轻互动阅读 | 让孩子参与故事 | 点击、拖拽、选择 | 小动画、旁白、下一页 |
| P0 | 道理总结 | 收束故事教育意义 | 完成阅读 | 一句话道理 + 亲子问题 |
| P0 | 本地进度 | 支持继续阅读 | 页面状态 | localStorage 存档 |
| P0 | 共享图片资产 | 让所有用户共享同一游戏版本的图片 | `IMAGE_ASSET_MANIFEST` + `share.js` 共享资产层 | 共享图片 URL / 资源引用 |
| P1 | 朗读按钮 | 帮助低龄儿童共读 | 点击朗读 | 浏览器朗读或预留朗读状态 |
| P1 | 家长说明页 | 让成人理解改编逻辑 | 点击查看 | 简短安全说明和共读建议 |

儿童端只需要呈现阅读体验。内容改编和儿童安全检查属于构建阶段任务；图片生图只允许在共享资产缺失时触发，且必须写入 `share.js` 管理的共享资产记录。生图流程不得出现在绘本阅读页中。

---

## 八、用户动线

### 核心路径

```text
打开前端入口页面
→ 不可见启动检查：请求共享资产状态
→ 全部必需共享图片资产有效：不显示准备页，获取图片 URL / 资源引用 + load/decode
→ 任一必需共享记录为空或资源失效：显示绘本准备页
→ 缺图分支：显示家长提示 + 图片准备进度条
→ shared miss：只生成缺失图片 + 写入共享资产记录 + 返回 URL / 资源引用 + load/decode
→ 所有图片运行时 generated + server_ready / server_hit + loaded + decoded + ready
→ 准备页显示“开始游玩”按钮
→ 点击“开始游玩”
→ 封面页或有效阅读进度页
→ 点击封面“开始阅读”
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
→ 为封面和每页准备生图提示词、prompt_hash 和 server_asset_key
→ 实现前端互动绘本入口 + `share.js` 共享资产层 + 条件绘本准备页
→ 用户打开后先做不可见共享资产检查
→ 共享图片资产全量存在时直接进入封面页或有效阅读进度页
→ 共享资产缺图或资源失效时才显示准备页，并生成缺失图片
→ 所有图片准备完成后显示“开始游玩”按钮
→ 用户点击“开始游玩”后进入封面页
→ 用户进入无逐页等待的完整绘本阅读
```

构建阶段流程不暴露给儿童。用户界面只呈现必要时的绘本准备页、最终绘本和可选家长说明页；家长说明页为 P1，不影响儿童阅读主流程。

### 功能流转

| 源功能 | 流向 | 目标功能 | 方式 |
|--------|------|----------|------|
| 不可见资产检查 | → | 封面页 / 有效阅读进度页 | 所有共享图片资产全量存在且客户端 `load + decode` 成功 |
| 不可见资产检查 | → | 绘本准备页 | 任一必需共享记录为空、图片缺失、损坏或 URL 不可访问 |
| 绘本准备页 | → | 开始游玩按钮 | 缺失图片生成完成，且所有图片运行时 `generated + server_ready / server_hit + loaded + decoded + ready` |
| 开始游玩按钮 | → | 封面页 / 有效阅读进度页 | 用户主动点击 |
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
启动资产检查（不可见状态）
├── 请求共享资产状态
├── 全部必需共享图片资产有效：直接进入封面页 / 有效阅读进度页
└── 任一必需共享记录为空或资源失效：进入绘本准备页

绘本准备页（条件显示）
├── 一句给家长的 AI 生成提示
├── 缺失图片准备进度条
├── 当前状态：生成 / 加载 / 解码
└── 全部 ready 后显示“开始游玩”按钮

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
| 启动资产检查 | 不显示 UI；通过 `share.js` 请求共享资产状态 | 全量命中时直接进入封面 / 有效阅读进度 |
| 绘本准备页 | 仅缺图时显示 AI 生成不确定性提示 + 缺失图片准备进度条 + 完成后的“开始游玩”按钮 | 缺图生成完成后点击“开始游玩”进入封面页 |
| 封面页 | 封面图、标题、开始按钮、轻粒子 | 点击开始 |
| 绘本页 | 插图、正文、互动点、页码 | 点击 / 拖拽 / 温和选择 |
| 结尾页 | 收束插图、道理、亲子问题 | 重新阅读 / 返回封面 |
| 家长说明页 | 改编说明、安全说明 | 查看 / 返回 |

### 视口自适应绘本画布

最终前端页面必须像一册能放进不同屏幕的绘本，而不是固定宽高的长页面截图。以下是布局约束，不要求逐字使用示例 CSS，但必须达到相同适配效果：

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
| 用户进度存储 | localStorage |
| 存储内容 | localStorage 只保存阅读进度、已触发互动点、是否看过结尾和轻量版本信息 |
| 图片主存储 | legacy runtime shared asset、共享资产存储、S3 / R2 / OSS 或等效对象存储 |
| 图片客户端缓存 | 浏览器 HTTP cache 或可选 IndexedDB 只能作为二级加载加速，不参与是否生图的决策 |
| 多端同步 | 不支持 |
| 外部输入 | 构建阶段读取随附内容文件 / `skills/` |
| 共享资产要求 | 必须有跨用户可写共享资产存储、资产状态记录和全局生成锁 |

### 数据关系

| 实体 A | 关系 | 实体 B | 说明 |
|--------|------|--------|------|
| `content_file` | 多对一 | `source_material` | 多个随附内容文件共同构成待改编内容 |
| `source_material` | 一对一 | `safety_report` | 内容必须过儿童安全检查 |
| `source_material` | 一对一 | `adaptation_profile` | 记录儿童化改写策略 |
| `storybook` | 一对多 | `storybook_page` | 一本绘本包含多页 |
| `storybook_page` | 一对一 | `image_asset` | 每页绑定一张真实插图 |
| `image_asset` | 一对一 | `server_image_asset_record` | 每张图片在共享存储中的状态、路径和 URL |
| `image_asset` | 一对一 | `image_asset_runtime_state` | 每张图片在当前浏览器中的服务器状态、加载和解码状态 |
| `image_asset` | 多对一 | `asset_preparation_state` | 所有图片共同决定准备页进度和是否放行封面 |
| `image_asset` | 零或一 | `client_asset_cache` | 可选浏览器二级缓存，仅用于加速，不作为生图依据 |
| `server_image_asset_record` | 零或一 | `generation_lock` | 防止多用户同时生成同一张图 |
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
  "image_generation_timing": "server-shared-cache",
  "asset_gate": "silent_server_asset_lookup_skip_preparation_when_all_files_exist",
  "runtime_generation": "server_miss_only",
  "server_asset_driver": "legacy_runtime_share_or_object_storage_or_server_filesystem",
  "shared_asset_driver": "legacy_runtime_share",
  "shared_asset_namespace": "storybook/storybook_001/v1",
  "client_cache_role": "optional_load_acceleration_only",
  "server_asset_key_strategy": "storybook_id/asset_manifest_version/asset_id/prompt_hash",
  "server_image_asset_root": null,
  "public_image_asset_base_url": "runtime_shared_asset_url",
  "storybook_asset_dir_template": "storybook/{storybook_id}/{asset_manifest_version}",
  "storybook_public_url_base_template": "runtime_shared_asset_url",
  "asset_file_name_template": "{asset_id}_{prompt_hash_short}.webp"
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
      "generation_timing": "server-shared-cache",
      "seed_source": {
        "type": "none",
        "value": null
      },
      "server_asset_key": "storybook_001/v1/cover/sha256...",
      "cache_key": "storybook_001/v1/cover/sha256...",
      "storage_driver": "legacy_runtime_share",
      "shared_object_key": "storybook/storybook_001/v1/cover_3f2a91c8.webp",
      "asset_file_name": "cover_3f2a91c8.webp",
      "storage_root": "runtime_shared_asset",
      "storage_dir": "storybook/storybook_001/v1",
      "storage_path": "storybook/storybook_001/v1/cover_3f2a91c8.webp",
      "public_url_base": "runtime_shared_asset_url",
      "public_url": "stable_shared_asset_url_returned_by_share_js",
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
      "server_asset_key": "storybook_001/v1/cover/sha256...",
      "shared_object_key": "storybook/storybook_001/v1/cover_3f2a91c8.webp",
      "public_url": "stable_shared_asset_url_returned_by_share_js",
      "storage_path": "storybook/storybook_001/v1/cover_3f2a91c8.webp",
      "server_file_location_status": "present",
      "generation_status": "generated",
      "server_asset_status": "server_ready",
      "client_cache_status": "not_required",
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
  "server_ready_or_hit_assets": 12,
  "server_ready_assets": 0,
  "server_hit_assets": 12,
  "server_miss_assets": 0,
  "missing_or_invalid_shared_assets": [],
  "loaded_assets": 12,
  "decoded_assets": 12,
  "failed_assets": [],
  "generation_locks": [],
  "current_stage": "ready",
  "should_show_preparation_page": false,
  "can_show_start_play_button": false,
  "start_play_clicked": false,
  "entry_gate": "skip_preparation_page",
  "requires_start_play_click": false,
  "ready": true,
  "can_enter_cover": true,
  "fast_restore_available": true,
  "last_check_mode": "server_fast_restore"
}
```

上面的 `asset_preparation_state` 示例表示共享资产全量命中的快速进入分支，所以 `should_show_preparation_page = false`、`requires_start_play_click = false`、`can_show_start_play_button = false` 仍然可以与 `can_enter_cover = true` 同时成立。缺图分支必须把 `requires_start_play_click` 设为 `true`；在用户点击“开始游玩”之前，`can_enter_cover` 必须保持 `false`。

#### server_image_asset_records.json / shared record 索引

```json
{
  "table_name": "shared_storybook_image_assets",
  "records": [
    {
      "server_asset_key": "storybook_001/v1/page_01_img/sha256...",
      "asset_id": "page_01_img",
      "storybook_id": "storybook_001",
      "asset_manifest_version": "v1",
      "prompt_hash": "sha256:...",
      "storage_driver": "legacy_runtime_share",
      "shared_object_key": "storybook/storybook_001/v1/page_01_img_3f2a91c8.webp",
      "asset_file_name": "page_01_img_3f2a91c8.webp",
      "storage_root": "runtime_shared_asset",
      "storage_dir": "storybook/storybook_001/v1",
      "storage_path": "storybook/storybook_001/v1/page_01_img_3f2a91c8.webp",
      "public_url_base": "runtime_shared_asset_url",
      "public_url": "stable_shared_asset_url_returned_by_share_js",
      "server_file_location_status": "present",
      "mime_type": "image/webp",
      "byte_size": 345678,
      "created_at": "ISO-8601 timestamp",
      "updated_at": "ISO-8601 timestamp",
      "status": "ready",
      "child_safety_status": "passed",
      "generated_by_task_id": "task_001"
    }
  ]
}
```

共享资产记录是判断图片是否已经生成的唯一依据。普通 HTTP cache、浏览器 IndexedDB、内存变量和 object URL 只能作为会话级或客户端加载加速，不得作为判断“已有共享图片”的依据。

#### generation_locks.json / 共享锁记录

```json
{
  "locks": [
    {
      "server_asset_key": "storybook_001/v1/page_01_img/sha256...",
      "storybook_id": "storybook_001",
      "asset_manifest_version": "v1",
      "asset_id": "page_01_img",
      "owner_task_id": "task_001",
      "status": "generating",
      "started_at": "ISO-8601 timestamp",
      "expires_at": "ISO-8601 timestamp",
      "last_heartbeat_at": "ISO-8601 timestamp"
    }
  ]
}
```

共享锁记录必须能跨用户、跨浏览器、跨标签页生效。锁只能在生成成功、生成失败或安全超时后释放。

#### shared_asset_status_response.json / 共享资产状态读取返回

`share.js` 必须提供等效资产状态能力和缺失图片准备能力。接口路径、HTTP method、SDK 或函数名由当前项目框架决定，本 spec 不指定固定端点；实现前必须确认该框架中对应调用方式真实可用。

状态读取必须由 `share.js` 计算稳定 `server_asset_key` / `shared_object_key`，并返回同一绘本版本的共享图片状态；不得根据当前用户返回不同目录、不同 key 或不同临时 URL。

```json
{
  "storybook_id": "storybook_001",
  "asset_manifest_version": "v1",
  "shared_asset_driver": "legacy_runtime_share",
  "shared_asset_namespace": "storybook/storybook_001/v1",
  "all_assets_ready": true,
  "should_show_preparation_page": false,
  "assets": [
    {
      "asset_id": "page_01_img",
      "server_asset_key": "storybook_001/v1/page_01_img/sha256...",
      "shared_object_key": "storybook/storybook_001/v1/page_01_img_3f2a91c8.webp",
      "asset_file_name": "page_01_img_3f2a91c8.webp",
      "storage_path": "storybook/storybook_001/v1/page_01_img_3f2a91c8.webp",
      "public_url": "stable_shared_asset_url_returned_by_share_js",
      "server_file_location_status": "present",
      "server_asset_status": "server_hit",
      "needs_generation": false
    }
  ],
  "missing_or_invalid_shared_assets": []
}
```

如果 `needs_generation = false`，前端只能读取 `share.js` 返回的稳定 URL / 资源引用，不得调用生图。只有 `missing_or_invalid_shared_assets` 非空时，才允许生成缺失图片。

普通服务器文件模式可以额外返回 `server_image_asset_root`、`public_image_asset_base_url` 和真实 `storage_path`；legacy runtime 模式不得为了凑字段而制造不存在的后端路径。

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

运行时进度只保存页码、互动完成状态、是否读完等轻量数据。不得把图片、base64、Blob 字符串或 object URL 写入 localStorage。刷新恢复时必须先校验 `storybook_id` 和 `asset_manifest_version` 是否匹配；匹配时恢复进度与互动状态，并从 `share.js` 重新获取稳定图片 URL / 资源引用。

---

## 十一、交互设计

### 操作映射

| 操作 | 实现方案 | 说明 |
|------|----------|------|
| 启动资产检查 | 不显示 UI，先查共享资产状态 | 全量命中时跳过准备页 |
| 等待绘本准备 | 只在 shared miss / 共享记录为空 / 资源失效时显示；缺失图片生成并写入共享资产后客户端加载 / 解码全部图片 | 准备完成后显示“开始游玩”按钮 |
| 开始游玩 | 点击准备页完成状态中的“开始游玩”按钮 | 进入封面页或有效阅读进度页 |
| 刷新恢复 | 快速校验共享资产状态并获取图片 URL / 资源引用 | shared hit 不重新生图，恢复到上次阅读页或封面 |
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
| 共享资产全量命中 | 不显示准备页，直接进入封面或有效阅读进度 | should_show_preparation_page = false |
| 共享资产缺失 | 显示“正在准备插图”与缺失图片进度 | should_show_preparation_page = true |
| 首次生成中 | 只为 shared miss 资产显示“正在生成插图 n / N” | 设置共享 generation lock，生成后逐张写入共享资产记录 |
| 快速恢复中 | 显示“正在载入绘本图片” | 接收共享图片 URL / 资源引用，仅检查 load / decode |
| 准备完成 | 小书签或星星完成动画，显示“开始游玩”按钮 | can_show_start_play_button = true |
| 点击开始游玩 | 按钮轻微放大，纸页打开 | 进入封面页或有效阅读进度页 |
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
| 技术栈 | legacy runtime 前端 HTML/CSS/JS + `runtime_share.js` / `runtime_api_client.js` + 显式 `assets.js` / `share.js` / `reader.js` / `app.js` 分层；不得只有纯前端本地缓存 |
| 外部依赖 | legacy runtime 固定基础依赖可沿用平台入口；除此之外，前端框架、字体和 UI 装饰资源不新增外链 CDN，应内嵌打包或走同源 / 本地 `assets/`；生图调用不得假设某个未经验证的固定 Runtime API / SDK 一定存在 |
| 生图资产 | 首次 shared miss 时生成缺失图片，生成结果必须逐张写入 `share.js` 管理的共享资产记录；shared hit 时禁止调用生图 |
| 离线可用 | 已加载页面和浏览器 HTTP cache 可辅助短时离线；共享图片主来源仍是 `share.js` 返回的稳定图片 URL / 资源引用 |
| 存储 | localStorage 只保存轻量阅读进度；legacy runtime shared asset / 对象存储 / 服务器共享目录保存图片文件或资源记录；IndexedDB 只能作为浏览器二级加载缓存，不能作为图片主存储或生图判断依据 |
| 共享资产位置 | 必须配置 `SHARED_ASSET_DRIVER`、`SHARED_ASSET_NAMESPACE`、稳定 `server_asset_key`；普通文件模式才需要 `SERVER_IMAGE_ASSET_ROOT` 和 `PUBLIC_IMAGE_ASSET_BASE_URL` |
| 模型调用 | 内容改编发生在构建阶段；图片生图只允许在共享资产缺失、损坏、版本变化或管理员明确重新生成时触发 |
| 浏览器 | 现代浏览器 |
| 响应式 | 使用视口自适应绘本画布，适配手机竖屏、平板和桌面浏览器 |

性能要求：

- 共享图片资产全量存在时不得显示准备页；封面页或有效阅读进度页应尽快出现。
- 只有缺图分支才显示准备页；准备页首屏加载 < 3s，图片准备时间通过进度条展示。
- 刷新、再次打开或新用户打开时必须先查 `share.js` / shared record；shared hit 不得调用生图接口。
- 图片压缩到适合网页展示的大小。
- 移动端点击目标 ≥ 44px。
- 页面正文和按钮在 320px 宽度下不得溢出。
- 页面不得出现横向滚动。
- 封面页、阅读页和结尾页的主操作在常见手机竖屏首屏或绘本内部滚动区内可见。
- 必须至少检查 `320x568`、`390x844`、`768x1024`、`1366x768`、`1920x1080` 五类视口。
- 所有插图必须在进入封面前完成运行时 `generated + server_ready / server_hit + loaded + decoded + ready`；阅读阶段禁止懒加载导致的空白页或等待。

---

## 十五、开发指引

收到本 spec 后：

1. 先制定实现计划，读取所有 `skills/` 内容文件全文。
2. 提取内容文件的核心主题、角色/概念原型、事件关系、风险内容、画面意象和正向寓意。
3. 生成 `source_material.json`，记录内容文件路径、覆盖模块和用途。
4. 执行儿童安全闸门，生成 `safety_report.json`。
5. 若为 `BLOCKED`，停止并报告原因。
6. 若为 `NEEDS_REWRITE`，先改写风险内容，再重新审核。
7. 确定年龄段、绘本分类、统一画风和道理目标。
8. 生成固定故事大纲、`storybook.json` 和 `pages.json`。
9. 为封面、每页和结尾页写完整生图提示词。
10. 输出并核对静态 `IMAGE_ASSET_MANIFEST`，为每张图片计算 `prompt_hash` 和 `server_asset_key`，并把 `generation_timing` 标为 `server-shared-cache`。
11. 按成功版 legacy runtime 结构实现最终 HTML：依次加载 `runtime_share.js`、`runtime_api_client.js`、`storybook.js`、`assets.js`、`share.js`、`prep.js`（如存在）、`reader.js` / `book.js`、`app.js`；如果文件名不同，职责必须等价。任何准备页、生图结果转换或共享写入模块都必须在 `share.js` 之后加载。
12. 在 `assets.js` 输出并核对静态 `IMAGE_ASSET_MANIFEST`，为每个资产计算固定 `asset_file_name`、`shared_object_key`、`server_asset_key` 和可读取 URL 字段；普通文件模式再计算 `storage_path` 和 `public_url`。
13. 在 `share.js` 实现共享资产状态读取：按 `server_asset_key` 查询 runtime shared asset 或等效共享记录，返回稳定图片 URL / 资源引用、`needs_generation` 和 `missing_or_invalid_shared_assets`；该逻辑不得用前端状态、IndexedDB 或 localStorage 代替。
14. 在 `share.js` 或等效共享层实现 generation lock：同一 `server_asset_key` 同时只能有一个生成任务。
15. 实现不可见启动资产检查：打开页面后由 `app.js` 调用 `share.js` 检查每个必需图片的共享记录是否存在、URL 是否可读、版本是否匹配。
16. 实现条件图片准备页：只有任一必需图片共享记录缺失、文件位置为空、资源损坏或 URL 不可访问时，才显示固定家长提示文案和缺失图片准备进度条。
17. 对 shared hit 且资源有效的资产，不显示准备页，只接收稳定 URL / 资源引用、加载并解码；不得触发生图能力。
18. 对 shared miss、共享记录为空或资源失效的资产，由 `share.js` 准备流程设置 generation lock，再使用当前环境已验证可用的真实生图能力获得图片结果；每张图片成功后必须立刻写入共享资产记录，再返回稳定 URL / 资源引用。若生图返回 `http://当前域名/__runtime/llm-images/...`，必须先规范化为 HTTPS / 同源相对 URL，再 fetch 成 Blob / File 并交给 `share.js` 写入。若第 N 张超时或失败，前 N-1 张已写入的共享资产必须保留，下次只重试失败 / 缺失项。如果图片 Blob 先出现在前端，也必须交给 `share.js` 写入流程，不能停留在 object URL、内存或 IndexedDB。不得假设任意固定 SDK、运行时客户端方法或 endpoint 必然可用；遇到 404 / 405 / 501 / unsupported method 时必须停止并报告。
19. 在准备页显示“开始游玩”按钮前，确认所有必需图片的 `IMAGE_ASSET_RUNTIME_STATE` 均满足 `generation_status = generated`、`server_asset_status = server_ready / server_hit`、`public_url` 可访问、`loaded = true`、`decoded = true`、`child_safety_status = passed`、`ready = true`。
20. 实现准备页完成状态：隐藏生成中状态，显示“开始游玩”按钮；用户点击后进入封面页或有效阅读进度页。
21. 实现 HTML/CSS/JS 页面、翻页、互动和存档。
22. 实现刷新 / 再次打开 / 新用户打开的快速校验：已有服务器共享图片资产不得重新生图，只重新获取 URL、加载解码并恢复阅读进度和互动绑定。
23. 确保阅读阶段不再逐页生成、逐页加载或逐页等待图片。
24. 做视口自适应绘本画布适配，检查手机竖屏、平板和桌面浏览器。
25. 执行验收标准自检。

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

- [ ] 打开前端入口页面后先执行不可见共享资产检查。
- [ ] 当所有必需图片共享记录非空、图片有效、URL / 资源引用可访问时，不显示绘本准备页，直接进入封面页或有效阅读进度页。
- [ ] 当任一必需图片共享记录为空、文件缺失、损坏或 URL 不可访问时，显示绘本准备页。
- [ ] 缺图分支的绘本准备页包含固定提示：“本绘本由 AI 生成，内容和画面可能存在不确定性。建议家长先完整玩一遍，再给孩子玩。”
- [ ] 缺图分支的绘本准备页显示缺失图片准备进度条。
- [ ] 缺图分支进度未完成时不能进入封面页。
- [ ] 缺图分支所有图片 ready 后，绘本准备页显示“开始游玩”按钮。
- [ ] 缺图分支不得在生成完成后自动跳转；必须由用户点击“开始游玩”进入封面页或有效阅读进度页。
- [ ] 所有图片运行时 `generated + server_ready / server_hit + loaded + decoded + ready` 后才进入绘本封面。
- [ ] 首次 shared miss 时允许生成缺失图片，并通过 `share.js` 写入共享资产记录。
- [ ] 刷新、再次打开或新用户打开时，如果共享资产层已有匹配 `server_asset_key` 的资产，不得重新生图。
- [ ] 刷新恢复时只做共享资产状态校验、获取稳定 URL / 资源引用、`load + decode` 校验；如果有有效阅读进度则恢复到上次阅读页，如果没有有效进度则进入封面页。
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
| 共享资产分层 | 最终 HTML 包含或等价实现 `runtime_share.js`、`runtime_api_client.js`、`assets.js`、`share.js`、`prep.js`（如存在）、`reader.js` / `book.js`、`app.js` 分层；`share.js` 必须早于准备页和生图结果转换模块加载；不得只有一个只管本地缓存的 `asset_manager.js` | 待测 |
| 共享资产记录 | 每张生成图片都有匹配 `server_asset_key` 的 shared record、非空共享资源引用和可读取图片 URL | 待测 |
| 非纯本地缓存 | 交付物包含 legacy runtime shared asset / 对象存储 / 服务器共享目录之一；不得只有单 HTML + IndexedDB 模拟共享状态 | 待测 |
| legacy runtime 写入 | 使用 PDF2App legacy runtime 时，本地和部署环境都能通过 `share.js` 查询到同一 `server_asset_key` 的共享图片记录 | 待测 |
| 普通文件模式写入 | 仅当项目选择 `server_filesystem` 时，生成后 `public/generated-assets/{storybook_id}/{asset_manifest_version}/` 下能看到对应 `.webp` 文件 | 待测 |
| 固定写入位置 | 每张图片的 `shared_object_key` / `storage_path` 由 `SHARED_ASSET_NAMESPACE + asset_file_name` 或等效固定公式确定 | 待测 |
| 固定读取 URL | 每张图片的读取 URL / 资源引用由 shared record 返回，且同一 `server_asset_key` 在不同用户上保持一致 | 待测 |
| 直接访问 URL | 每个稳定图片 URL 直接访问或经 shared reader 读取时返回真实图片 MIME，如 `image/webp` / `image/png`，不得返回 HTML / 404 / 空文件 | 待测 |
| 禁止用户目录 | `storage_path`、`public_url`、`server_asset_key` 均不包含 `user_id`、session id、浏览器 id、IP 或随机用户目录 | 待测 |
| 状态读取 | `share.js` 返回固定 `server_asset_key`、稳定 URL / 资源引用、`needs_generation` 和 `missing_or_invalid_shared_assets` | 待测 |
| 状态读取真实查共享记录 | `share.js` 必须检查 runtime shared asset / 对象存储 / 文件记录；清空 IndexedDB 和 localStorage 后，若共享资产存在仍应返回 `needs_generation = false` | 待测 |
| shared hit | 命中共享资产时不触发生图能力 | 待测 |
| shared miss | 只生成缺失图片，生成后逐张写入共享资产记录 | 待测 |
| generation lock | 多用户 / 多标签页 / 刷新并发时不会重复触发生图能力 | 待测 |
| 524 超时续跑 | 某一张图片生成 524 / timeout 后，已经成功写入共享资产的图片不丢失；下次只重试失败 / 缺失项 | 待测 |
| 临时 URL 处理 | `http://.../__runtime/llm-images/...` 只能作为临时生成结果来源；fetch / `imageUrlToFile` 前必须转成 HTTPS 或同源相对 URL；不得持久化为最终 shared record / `public_url` / `cache_key` | 待测 |
| 加载与存储硬约束 | legacy runtime 固定基础依赖可沿用；生成插图从 `share.js` 返回的稳定共享 URL / 资源引用读取，主存储为 shared asset | 待测 |
| IndexedDB 角色 | IndexedDB 只作为浏览器二级缓存；IndexedDB 为空时若 shared hit，不得重新生图 | 待测 |
| 禁止前端主存储 | 首次生成结果不得只写入 IndexedDB、localStorage、内存、Blob URL、前端源码目录或用户会话目录 | 待测 |
| 禁止大图内嵌 | 生成插图不得以 base64 / data URL 形式塞进前端入口页面作为主交付 | 待测 |
| 图片加载 | 所有图片 `loaded = true` | 待测 |
| 图片解码 | 所有图片 `decoded = true` | 待测 |
| 准备闸门 | `asset_preparation_state.ready = true` 后才允许显示进入入口；缺图分支还必须点击“开始游玩” | 待测 |
| 统一画风 | 所有图片共享同一 `STYLE_PROMPT_BASE` | 待测 |
| 提示词卫生 | 正向 prompt 只写儿童友好画面，`negative_prompt` 使用固定短模板 ID，不逐页堆叠负面词 | 待测 |
| 图片引用 | 页面引用真实图片，不是占位 | 待测 |
| 图片存储 | 图片文件 / 对象存在 legacy runtime shared asset 或等效共享资产存储中，localStorage 不存图片数据 | 待测 |
| 禁止伪装 | 无 CSS/SVG/Canvas/emoji 冒充插图 | 待测 |
| 阅读阶段 | 翻页时无图片 loading、空白图、spinner 或逐页生成等待 | 待测 |
| 刷新恢复 | 已有服务器共享图片资产刷新后不重新生成，只获取 URL 并快速加载和解码 | 待测 |
| 新用户共享 | 新用户首次打开同一游戏版本时，若服务器已有图片资产，不重新生图 | 待测 |

### 绘本内容验收

- [ ] 每页文本符合目标年龄段长度。
- [ ] 故事有清晰主角、温和问题、尝试、修复、道理。
- [ ] 不像摘要，不像讲义，不像题库。
- [ ] `skills/` 内容已被儿童化转译，而不是原样复述。
- [ ] 道理温和，不羞辱孩子，不恐吓孩子。
- [ ] 结尾有一句孩子能懂的话和一个亲子讨论问题。

### 交互验收

- [ ] 首次进入绘本前必须执行共享资产检查。
- [ ] 共享图片资产全量存在时不得出现绘本准备页。
- [ ] 只有缺图分支才出现绘本准备页。
- [ ] 缺图分支的绘本准备页只保留一句家长提示，不设计家长预览确认流程。
- [ ] 缺图分支的绘本准备页完成图片准备后显示“开始游玩”按钮。
- [ ] 点击“开始游玩”后进入封面页或有效阅读进度页。
- [ ] 首次生成完成后，刷新页面不得再次出现“正在生成插图 1 / N”。
- [ ] 清空 IndexedDB / localStorage 后刷新，若共享图片资产仍存在，仍然走 shared hit，不重新生图。
- [ ] 直接访问或经 shared reader 读取任一稳定图片 URL / 资源引用，返回真实图片，而不是入口 HTML。
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
- [ ] `image_asset_manifest.json` 所有必需图片包含 `required`、`plan_status`、`initial_runtime_status`、`prompt_hash`、`server_asset_key`、`generation_timing`、`storage_driver`、`seed_source`。
- [ ] `image_asset_manifest.json` 所有必需图片包含 `asset_file_name`、`shared_object_key`、`server_asset_key`、稳定 URL / 资源引用；普通文件模式还包含 `storage_root`、`storage_dir`、`storage_path`、`public_url_base`、`public_url`。
- [ ] `image_asset_manifest.json` 不把首次运行前的图片硬写成 `status = generated`。
- [ ] `image_asset_runtime_state.json` 所有必需图片状态为 `generation_status = generated`、`server_asset_status = server_ready / server_hit`、`public_url` 可访问、`loaded = true`、`decoded = true`、`ready = true`。
- [ ] `image_asset_runtime_state.json` 为每个必需图片记录 `server_file_location_status`，全量命中时均为 `present`。
- [ ] `asset_preparation_state.json` 存在，且 `ready = true` 是进入封面的必要条件。
- [ ] `asset_preparation_state.json` 包含 `should_show_preparation_page`，并在共享图片资产全量存在时为 `false`。
- [ ] `asset_preparation_state.json` 包含 `can_show_start_play_button`，并只在缺图分支所有图片 ready 后为 `true`。
- [ ] 缺图分支必须记录 `start_play_clicked` 或等效用户点击状态；进入封面页前该状态必须为 `true`。
- [ ] `asset_preparation_state.json` 包含 `missing_or_invalid_shared_assets`，能列出共享记录缺失、文件位置为空或资源失效的资产。
- [ ] shared asset records 中存在每个必需图片的共享资产记录。
- [ ] shared asset records 中每个 `shared_object_key` / `storage_path` 都指向同一绘本版本共享命名空间，而不是用户目录、session 目录或临时目录。
- [ ] `generation_locks` 能防止同一 `server_asset_key` 被并发重复生成。
- [ ] `storybook_id` 和 `asset_manifest_version` 用于判断刷新恢复是否可复用已有图片资产。
- [ ] localStorage 保存阅读页码、互动完成状态和读完状态，刷新后能恢复。
- [ ] localStorage 只存必要进度，不存图片、base64、Blob 字符串或 object URL。

### 最终判定

以下任一情况出现，判定未完成：

- 打开后不能进入完整绘本阅读流程。
- 进入封面页前没有完成所有必需图片的生成、共享资产写入、加载和解码。
- 共享图片资产全量存在时仍显示绘本准备页。
- 任一必需图片共享记录为空或失效时没有显示绘本准备页，也没有触发缺失图片生成。
- 缺图分支图片生成完成后没有显示“开始游玩”按钮。
- 缺图分支图片生成完成后未经用户点击“开始游玩”就自动跳转。
- 阅读阶段出现逐页 loading、空白图、spinner 或翻页后才生成图片。
- 刷新、再次打开或新用户打开时，共享资产层中已有匹配 `server_asset_key` 的图片仍被当作需要重新生成。
- shared hit / server hit 时仍触发生图能力。
- 图片生成后没有写入共享资产存储，或只存在某个用户浏览器、内存 / object URL / localStorage 中。
- 图片生成后只写入 `asset_manager.js` 管理的 IndexedDB，本项目没有显式 `share.js` / 等效共享资产适配层。
- 将 `http://.../__runtime/llm-images/...` 临时 URL 当作最终共享资产 URL 或 key 持久化。
- 在 HTTPS 页面中直接 `fetch` 原始 `http://.../__runtime/llm-images/...` 临时 URL，导致 Mixed Content、`Failed to fetch` 或 `net::ERR_NAME_NOT_RESOLVED`，且没有先转为 HTTPS / 同源相对 URL。
- `prep.js`、`book.js`、`reader.js` 或任何生图结果转换模块早于 `share.js` 加载，导致准备流程绕过共享资产写入层。
- 某一张图片 524 / timeout 后丢弃已成功生成的图片，导致刷新又从第 1 张重新生成。
- 图片首次生成结果只写入 IndexedDB，或把 IndexedDB 是否有图作为是否需要生图的判断依据。
- 生成插图以 base64 / data URL 形式塞进前端入口页面，替代服务器共享 `public_url`。
- 图片生成后写入了用户专属目录、session 目录、临时目录或前端不可稳定访问的位置。
- `storage_path` 或 `public_url` 中包含 `user_id`、session id、浏览器 id、IP 或每次请求变化的随机目录。
- 多用户、多标签页、刷新或重复点击导致同一 `server_asset_key` 并发重复生图。
- 刷新后图片显示正常但翻页、互动点、重新阅读或返回封面失效。
- 没有读取完整 `skills/` 内容文件。
- 没有执行儿童安全闸门。
- 缺图分支没有绘本准备页和图片准备进度条。
- 儿童不适合内容未删改或未阻断。
- 使用 CSS/SVG/Canvas/emoji 冒充绘本插图。
- 有必需插图的运行时状态不是 `generation_status = generated`、`server_asset_status = server_ready / server_hit`、`public_url` 可访问、`loaded = true`、`decoded = true`、`ready = true`。
- 绘本像摘要、讲义或题库，不像儿童绘本。
- 道理包含羞辱、恐吓、绝对服从或过度功利。
- 移动端文字或按钮明显溢出。

只有当随附内容文件、固定绘本形态、儿童安全、真实生图、绘本结构、互动阅读、视觉质量和数据完整性全部通过，才能标记为完成。
