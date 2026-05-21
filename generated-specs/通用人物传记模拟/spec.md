# 通用人物传记模拟游戏设计文档

---

## 一、产品概览

| 维度 | 值 |
|------|-----|
| 产品名称 | {{GAME_NAME}} |
| 来源素材 | {{BOOK_NAME}} |
| 设计粒度 | 可填充玩法框架 |
| 玩法结构 | 通用人物传记模拟 |
| 产品类型 | 章节式人物人生体验 / 作品主角体验 |
| 核心主题槽位 | {{CORE_THEME}} |
| 目标体验 | 玩家以第二人称进入某位人物的人生、作品弧线或创作轨迹，在关键处做选择，并通过真实/原作反馈理解这个人物为什么成为他/她/它 |
| 交互方式 | 点击推进 + 对话回应 + 关键决策 + 结局回顾 |
| 内容规模 | 默认 5-7 章；每章必须完成一条章内事件链；每章 1 个主要决策；每章 1 张章末 CG |
| 图片资产 | 1 张无文字整体背景图 + 每章 1 张章末 CG |
| 生图时机 | first-run-cache |
| 准确性模式 | 自适应：真实人物 strict；虚构/IP semi-strict；神话传说 semi-strict；原创幻想 fantasy |

本 spec 用于把任意人物或作品内容转化为一款已填充完成的传记模拟游戏。最终用户打开产品后直接体验，不看到上传、解析、生成参数页。内容识别、人物选择、章节填充、知识库补全、图片 prompt 生成属于构建 / 填充阶段。

---

## 二、涉及的 SKILL / 内容文件清单

完整内容文件会与本 spec 一起提供，通常位于项目根目录的 `skills/` 文件夹中。构建产品时，必须读取每个文件的完整内容，并从中提取本 spec 需要的内容。

| 内容文件路径 | 覆盖模块 | 在本产品中的用途 |
|-------------|----------|------------------|
| `{{CONTENT_FILE_PATH}}` | `{{COVERED_MODULE}}` | `{{USAGE_IN_PRODUCT}}` |

实现者必须读取每个内容文件的完整正文，不得只依赖索引、文件名、摘要或标题来生成核心内容。核心章节、关键事件、人物关系、原作选择、引文、图像 prompt、准确性判断都应能追溯到内容文件原文；当内容文件不足以判断人物身份或作品主角时，才允许使用知识库检索进行补全，并把检索结论、依据和置信度写入数据。

### 内容提取维度

| 提取维度 | 在本 spec 中映射到 |
|----------|--------------------|
| 人物身份、时代、地域、职业、物种/阵营/设定身份 | `target_profile`、标题页、人物介绍页、视觉风格、称谓规则 |
| 输入类型：人物传记 / 作品 / 诗文散文 / 虚构角色资料 / 混合内容 | `source_type`、人物识别策略、准确性模式 |
| 人生阶段、作品剧情阶段、创作阶段、角色成长弧线 | `chapters` |
| 关键事件、冲突、选择、代价、转折 | `decision` 场景、反馈、成就 |
| 关系网络：家人、朋友、导师、敌手、同伴、组织 | `characters`、对话场景、关系说明 |
| 原文、台词、名句、史料、作品 canon、创作背景 | 标题 quote、章末感悟、反馈引用、准确性自检 |
| 场景地点、时代物件、服饰、空间、符号 | 背景图 prompt、章末 CG prompt、UI 材质 |
| 人物气质、作品氛围、审美关键词 | `STYLE_PROMPT_BASE`、粒子、配色、动效 |
| 可验证内容：时间、人物关系、事件顺序、设定规则 | strict / semi-strict 自检和验收 |

### 人物识别与作品归属规则

1. 如果内容明确是人物传记、人物资料、访谈、回忆录、年谱或角色档案，体验主角就是该人物。
2. 如果内容是叙事作品，先判断是否存在明确且占绝对中心的主角。
3. 如果明确看得出作品主角是谁，体验主角 = 作品主角。
4. 如果作品主角模糊、多主角并列，或作品显然是诗篇、散文、随笔、论文、评论、歌词、非叙事文本，体验主角 = 作者 / 创作者。
5. 如果仍有多个候选，必须结合完整内容文件和知识库检索选择最适合做传记模拟的人物，并记录：
   - `target_selection_reason`
   - `candidate_targets`
   - `source_evidence`
   - `knowledge_base_evidence`
   - `confidence`
6. 如果知识库不可用，且内容文件也无法判断人物或作品主人，必须停下并要求补充内容，不得臆造主角。

### 内容使用验收重点

- 实现者需要读取完整内容文件。
- 核心内容应能追溯到文件原文或明确记录的知识库证据。
- 摘要、文件名和标题只能作为导航，不作为核心内容依据。
- 内容文件中没有的人物心理、对话和场景细节可以叙事化补全，但不能改变关键事实、原作 canon 或人物核心选择。

---

## 三、目标用户

| 维度 | 描述 |
|------|------|
| 核心用户 | 想通过互动叙事理解人物、作品主角或创作者的人 |
| 使用场景 | 文化阅读、人物学习、IP 角色体验、历史/文学/艺术兴趣探索 |
| 设备偏好 | 桌面浏览器优先，兼容平板和手机浏览器 |
| 知识水平 | 不要求预先了解人物；文本必须给出必要背景 |
| 体验门槛 | 只需要阅读、点击继续、选择回应和做决策 |

本产品适合真实人物、虚构人物、作者型作品、神话传说角色和跨文化人物。最终体验应像一款完整的互动传记，而不是资料卡、百科页或普通文章。

---

## 四、产品目的

### 核心价值

把随附内容文件中的人物、作品或创作资料转化为可体验的人生路径：玩家在关键处做出自己的选择，再通过人物真实选择、原作选择或创作者经历获得理解。

### 成功标准

- 玩家通关后能说清这个人物的核心处境、关键选择、关系网络和精神主题。
- 每章至少有一个具体事件、一个明确冲突和一个能引发比较的决策。
- 决策反馈不是判对错，而是揭示人物为何选择那条路。
- 视觉资产和 UI 氛围能看出该人物/作品的时代、气质和媒介特征。
- 图片生成、缓存、读取、失败处理都有可验收状态。

---

## 五、视觉风格规范

视觉不再固定为古风人物，也不固定背景图 URL、羊皮纸、暖色或单一插画风格。视觉风格必须从人物/作品内容中生成。

### 风格分析流程

构建阶段必须先分析：

| 分析项 | 要求 |
|--------|------|
| 人物类型 | 真实人物、虚构角色、神话人物、作者型人物、现代人物、跨文化人物 |
| 时代与地域 | 古代、近代、现代、未来、架空世界、中国、西方、全球化语境等 |
| 身份与场景 | 文人、将领、科学家、演员、企业家、冒险者、机器人、魔法师、普通人等 |
| 情绪曲线 | 明亮、悲怆、荒诞、热血、孤独、浪漫、悬疑、史诗、冷静、治愈等 |
| 媒介与材质 | 油画、胶片摄影、像素、赛博概念图、漫画分镜、档案视觉、3D、拼贴、版画等 |
| UI 质感 | 档案夹、玻璃 HUD、纸张、金属铭牌、舞台字幕框、仪器面板、织物、石刻、游戏菜单等 |
| 动效气质 | 纸张翻动、扫描线、墨迹扩散、星尘漂浮、发光脉冲、胶片闪烁、像素跳帧等 |

### 画风生成方法

每个项目必须生成一套统一 `STYLE_PROMPT_BASE`：

```text
STYLE_PROMPT_BASE =
媒介 + 情绪 + 时代/文化 + 材质 + 光影 + 构图 + 质量要求 + 禁止文字要求
```

所有真实位图资产共享同一 `STYLE_PROMPT_BASE`，保证整体统一；每张图再追加具体主体、场景、动作、服饰、空间、光影和构图。

### UI 框体固定，设计放开

固定的 UI 框体结构：

- 资产准备页
- 标题页
- 章节过渡页
- 叙事面板
- 对话气泡
- 决策面板
- 反馈页
- 章末感悟页
- 结局评分 / 路线回顾页

UI 视觉必须根据主题变化：

- 面板材质、边框、角标、按钮、进度条、toast、章节编号都要主题化。
- 标题不能只是普通 `<h1>`，必须使用主题化字体效果、描边、阴影、渐变裁切、SVG 装饰或入场动画。
- 按钮必须有明确 hover / active / disabled 状态。
- 对话气泡要区分主角、NPC、旁白，不能全是默认矩形框。
- 决策选项要显得可点击、可比较，并在选择后进入清晰反馈状态。
- 卡片或面板圆角默认不超过 8px，除非主题明确需要更圆润的玩具、童话、Q版或柔软界面。

### 首页粒子与氛围

首页和资产准备页必须有主题化粒子 / 氛围层，不能只是静态背景图上放按钮。

可选粒子类型包括但不限于：

| 粒子 / 氛围 | 适用主题 |
|-------------|----------|
| 花瓣、落叶、纸片 | 文学、怀旧、校园、古典、温柔人物 |
| 尘埃、胶片颗粒、档案碎屑 | 历史、传记、纪录片、调查型人物 |
| 星尘、发光微粒 | 科幻、童话、传奇、神话人物 |
| 代码雨、扫描线、全息噪点 | 科技、赛博、AI、未来人物 |
| 灰烬、火星、烟雾 | 战争、灾难、悲剧、抗争型人物 |
| 舞台光尘、金粉、幕布阴影 | 演员、音乐家、戏剧角色 |
| 像素碎片、UI glitch | 游戏角色、虚拟人物、复古数字主题 |
| 墨点扩散、水纹、雾气 | 东方、诗文、梦境、悬疑、神秘主题 |

约束：

- 粒子数量默认 12-30 个。
- 粒子不得遮挡核心内容，不得拦截点击，必须 `pointer-events: none`。
- 动效要有慢速层次，不要所有粒子同速同向。
- 必须支持 `prefers-reduced-motion`，减少或关闭连续动画。
- 移动端应降低粒子数量和模糊层开销。

### 配色与排版

- 配色遵循 60-30-10 法则，但颜色由人物/作品主题生成，不使用固定古风配色。
- 文本与背景对比度必须 ≥ 4.5:1。
- 正文行高 ≥ 1.6。
- 全站字体不超过 2 种；如使用主题字体，正文仍需保持可读。
- 文本面板必须保证在背景图和 CG 上可读，可使用遮罩、暗角、半透明材质或局部背景模糊。
- 页面切换不能瞬切，过渡时长控制在 200-800ms。

---

## 六、生图策略与资产契约

本产品需要真实位图资产。图片生成是资产闸门，不是可选视觉增强。

### IMAGE_GENERATION_TIMING

```text
IMAGE_GENERATION_TIMING = first-run-cache
```

最终 app 首次启动时必须显示主题化资产准备页，检查 IndexedDB 缓存，生成缺失图片并写入 IndexedDB；之后刷新或再次打开直接读取缓存，不重新生图。

### 图片资产范围

| 资产类型 | 数量 | 用途 | 必需 |
|----------|------|------|------|
| 整体背景图 | 1 张 | 全产品底层氛围背景，不固定 URL，不含任何文字、标题、水印、签名或可读字符 | 是 |
| 章末 CG | 每章 1 张 | 只在玩家选择和真实/原作选择揭示后出现，表现本章章末情感高潮 | 是 |

默认不要求结局 CG。若具体项目需要结局 CG，可作为 P1 可选资产加入 `IMAGE_ASSET_MANIFEST`，但不得影响 P0 体验完成。

### 什么是生图

- 调用真实图像生成模型、工具或 API，输入提示词并获得真实图像文件。
- 图片数据可以在最终 app 首次启动时生成并写入本机缓存。
- 用户进入核心体验时，页面引用的必须是真实生成图像或 IndexedDB 中缓存的真实图像 Blob。

### 什么不是生图

- CSS 渐变不是生图。
- SVG path / circle / polygon 不是生图。
- Canvas 绘制不是生图。
- emoji / Unicode 拼贴不是生图。
- 文字占位不是生图。
- CSS/SVG/Canvas 风格化占位图不能冒充生成图。

### 首次启动缓存流程

```text
打开 app
→ 读取 IMAGE_ASSET_MANIFEST
→ 为每张必需图片计算 / 校验 cache_key
→ 查询 IndexedDB
→ cache hit：Blob → object URL → load/decode → IMAGE_ASSET_RUNTIME_STATE.ready = true
→ cache miss：generation lock → 调用真实生图工具/API → Blob 写入 IndexedDB → load/decode → ready = true
→ 所有必需图片 ready
→ 进入标题页和核心体验
```

资产准备页要求：

- 页面文案主题化，例如“正在准备影像档案”“正在显影人生片段”“正在生成章节画面”。
- cache hit 时只显示短暂“正在载入视觉资产”，不得误导用户以为重新生图。
- cache miss 时显示已完成数量 / 总数量、当前图片用途、失败重试入口。
- 页面本身也要有主题化 UI、粒子、进度条和状态反馈。
- 必需图片未全部 ready 前不得进入标题页。

### IMAGE_ASSET_MANIFEST

实现核心页面前必须先输出并核对静态 `IMAGE_ASSET_MANIFEST`。静态计划层不得把未生成图片写成 `status = "generated"`。

```json
{
  "asset_manifest_version": "1.0.0",
  "image_generation_timing": "first-run-cache",
  "style_prompt_base": "{{STYLE_PROMPT_BASE}}",
  "assets": [
    {
      "id": "global_bg",
      "purpose": "整体背景图，无文字，体现人物/作品主题气质",
      "required": true,
      "plan_status": "required",
      "initial_runtime_status": "pending",
      "style_prompt_base": "{{STYLE_PROMPT_BASE}}",
      "prompt": "{{GLOBAL_BACKGROUND_PROMPT}}",
      "negative_prompt": "text, watermark, logo, signature, unreadable typography, UI, low quality, distorted anatomy",
      "aspect_ratio": "16:9",
      "generation_timing": "first-run-cache",
      "cache_key": "{{PROJECT_ID}}/1.0.0/global_bg/{{PROMPT_HASH}}",
      "prompt_hash": "{{PROMPT_HASH}}",
      "seed_source": { "type": "none" },
      "storage_driver": "indexeddb_blob",
      "child_safety_requirement": "must_pass_before_ready"
    },
    {
      "id": "chapter_cg_{{CH_NUM}}",
      "purpose": "第 {{CH_NUM}} 章关键场景 CG",
      "required": true,
      "plan_status": "required",
      "initial_runtime_status": "pending",
      "style_prompt_base": "{{STYLE_PROMPT_BASE}}",
      "prompt": "{{CHAPTER_CG_PROMPT}}",
      "negative_prompt": "text, watermark, logo, signature, unreadable typography, low quality, extra limbs",
      "aspect_ratio": "16:9",
      "generation_timing": "first-run-cache",
      "cache_key": "{{PROJECT_ID}}/1.0.0/chapter_cg_{{CH_NUM}}/{{PROMPT_HASH}}",
      "prompt_hash": "{{PROMPT_HASH}}",
      "seed_source": { "type": "none" },
      "storage_driver": "indexeddb_blob",
      "child_safety_requirement": "must_pass_before_ready"
    }
  ]
}
```

### IMAGE_ASSET_RUNTIME_STATE

运行时必须为每个必需图片维护状态：

```json
{
  "asset_id": "global_bg",
  "cache_key": "{{CACHE_KEY}}",
  "generation_status": "pending",
  "cache_status": "not_checked",
  "cached_blob_ref": null,
  "loaded": false,
  "decoded": false,
  "ready": false,
  "error": null
}
```

`ready` 只有在以下条件全部满足时才可为 `true`：

- `generation_status = "generated"`
- `cache_status = "cached"` 或 `cache_status = "cache_hit"`
- `cached_blob_ref` 指向 IndexedDB 中的真实 Blob
- `loaded = true`
- `decoded = true`
- 安全检查通过

### IndexedDB 缓存记录

```json
{
  "cache_key": "{{CACHE_KEY}}",
  "asset_id": "{{ASSET_ID}}",
  "asset_manifest_version": "1.0.0",
  "prompt_hash": "{{PROMPT_HASH}}",
  "blob": "{{IMAGE_BLOB}}",
  "mime_type": "image/png",
  "created_at": "{{ISO_TIME}}",
  "updated_at": "{{ISO_TIME}}",
  "status": "cached",
  "error": null
}
```

localStorage 只能保存轻量进度、版本和状态，不得保存图片、base64、大 data URL、Blob 字符串或 object URL。

### 生成锁与失败处理

- 必须使用生成锁，优先 `navigator.locks`；不支持时使用 IndexedDB 中的 `generation_lock` 记录。
- 多标签页或刷新时不得对同一 `cache_key` 并发生图。
- 单张失败可重试；多次失败后保留错误状态和重试入口。
- 必需图片无法生成时必须停留在资产准备页或错误页，说明失败资产 ID、用途、失败原因和已尝试 prompt。
- 无法调用真实生图能力时，必须停下告诉用户，不得用占位图交付。

---

## 七、功能清单

| 优先级 | 功能名称 | 解决什么问题 | 输入 | 输出 |
|--------|----------|-------------|------|------|
| P0 | 首启资产准备 | 核心图片必须真实生成并缓存后才能体验 | 打开 app | 图片缓存检查、缺图生成、ready 后进入标题页 |
| P0 | 标题页 | 建立人物/作品主题与开始入口 | 点击开始 / 继续 | 进入人物介绍页或恢复存档 |
| P0 | 人物介绍页 | 在进入故事前让玩家知道 TA 是谁、生活在哪个年代、最被记住的成就或标签是什么 | 点击“进入 TA 的故事” | 第一章章节过渡 |
| P0 | 章节过渡 | 让玩家知道当前人生阶段、作品阶段或创作阶段 | 点击进入 | 当前章节场景 |
| P0 | 叙事阅读 | 交代事件、环境、人物处境 | 点击继续 | 下一段叙事或互动场景 |
| P0 | 对话互动 | 通过人物关系和语气建立代入感 | 选择 2 个回应之一 | 玩家回应 + NPC 后续 |
| P0 | 关键决策 | 让玩家在人物处境中做选择 | 选择 3 个选项之一 | 决策反馈 |
| P0 | 真实/原作反馈 | 揭示人物真实选择、原作走向或作者经历 | 决策结果 | 解释、事实/原文引用、继续按钮 |
| P0 | 章末 CG 展示 | 在玩家选择并看到主角真实/原作选择后，用真实生成图表现本章事件的情感高潮 | 真实/原作反馈完成 | 章末 CG 渐显，进入章末感悟 |
| P0 | 章末感悟 | 每章形成情感收束 | 自动触发 / 点击继续 | 引文、释义、人物理解 |
| P0 | 结局评分 | 总结玩家与人物选择的相近程度 | 通关 | 得分、评语、关键选择回顾、成就 |
| P1 | 成就系统 | 强化关键选择和理解节点 | 选择人物真实/原作选项 | toast + 结局页徽章 |
| P1 | 路线回看 | 帮助玩家复盘选择与人物真实选择 | 点击回看 | 选择时间线 |
| P1 | 重新开始 | 支持再次体验不同选择 | 点击重新开始 | 清空当前进度，保留图片缓存 |

---

## 八、用户动线

### 图片准备路径

```text
打开 app
→ 读取 IMAGE_ASSET_MANIFEST
→ 检查 IndexedDB
→ cache hit：载入并解码图片
→ cache miss：资产准备页生成缺失图片
→ 所有必需图片 ready
→ 标题页
```

### 核心体验路径

```text
标题页
→ 开始游戏
→ 人物介绍页
→ 章节过渡
→ [叙事阅读 → 对话互动 → 事件推进 → 关键决策 → 真实/原作反馈 → 章末 CG → 章末感悟] × N章
→ 结局评分页
→ 路线回看 / 重新开始
```

### 功能流转关系

| 源功能 | 流向 | 目标功能 | 流转方式 |
|--------|------|----------|----------|
| 资产准备页 | → | 标题页 | 所有必需图片 ready |
| 标题页 | → | 人物介绍页 | 点击开始 |
| 标题页 | → | 当前进度 | 点击继续 |
| 人物介绍页 | → | 章节过渡 | 点击“进入 TA 的故事” |
| 章节过渡 | → | 叙事场景 | 点击进入 |
| 叙事场景 | → | 对话 / 决策 / 下一叙事 | 点击继续 |
| 对话场景 | → | 后续场景 | 选择回应后显示 followup，再继续 |
| 决策场景 | → | 反馈场景 | 点击选项 |
| 反馈场景 | → | 章末 CG / 章末感悟 | 点击继续 |
| 章末感悟 | → | 下一章过渡 | 点击继续 |
| 最后一章 | → | 结局评分 | 自动进入 |
| 结局评分 | → | 标题页 | 点击重新开始 |

最终用户不看到内容上传、知识库搜索、人物识别、prompt 生成等构建阶段流程；这些都属于产品构建和内容填充阶段。

---

## 九、信息结构

### 页面 / 状态结构

```text
App
├── AssetPreparationPage
│   ├── manifest 检查
│   ├── IndexedDB 缓存状态
│   ├── 生成进度
│   └── 错误 / 重试
├── TitlePage
│   ├── 背景图
│   ├── 主题粒子
│   ├── 游戏标题
│   ├── 人物/作品副标题
│   ├── 主题引文
│   └── 开始 / 继续
├── IntroProfilePage
│   ├── 人物姓名 / 称谓
│   ├── 年代 / 世界观 / 出生与活跃时期
│   ├── 身份标签
│   ├── 最出名的作品、事迹、选择或精神标签
│   ├── 100-180 字人物简介
│   └── 进入 TA 的故事
├── ChapterTransition
├── ScenePlayer
│   ├── NarrativeScene
│   ├── DialogueScene
│   ├── DecisionScene
│   ├── FeedbackScene
│   └── ChapterEndingScene
└── FinalSummaryPage
    ├── 得分与评语
    ├── 选择时间线
    ├── 成就
    └── 重新开始
```

### 界面结构

| 界面 | 核心内容 | 交互 |
|------|----------|------|
| 资产准备页 | 主题标题、进度条、当前图片用途、粒子、错误重试 | 自动检查 / 重试 |
| 标题页 | 背景图、人物标题、引文、开始/继续按钮、丰富粒子 | 点击按钮 |
| 人物介绍页 | 人物姓名、年代/世界观、出生或活跃时期、身份标签、最出名事迹或作品、一段简介、“进入 TA 的故事”按钮 | 点击进入 |
| 章节过渡 | 章节名、阶段标签、年代/作品进度、短引文 | 点击进入 |
| 叙事场景 | 叙事文本、事件前因、背景、人物处境、继续按钮；普通叙事中不得提前展示章节 CG | 点击继续 |
| 对话场景 | NPC 气泡、玩家回应、followup | 选择回应 |
| 决策场景 | 处境说明、3 个选择、不可提前暴露后果 | 点击选项 |
| 反馈场景 | 选择理解、人物真实/原作选择、事实/原文依据 | 点击继续 |
| 章末感悟 | 玩家选择后的真实/原作选择余波、章末 CG 渐显、引文、释义、人物阶段回望 | 点击继续 |
| 结局页 | 得分、评语、时间线对照、成就、结语 | 回看 / 重开 |

---

## 十、数据设计

### 存储方案

| 数据类型 | 存储方式 |
|----------|----------|
| 填充后的游戏内容 | JS 静态对象或 JSON |
| 用户进度 | localStorage |
| 图片 Blob | IndexedDB |
| 图片运行时 object URL | 内存临时创建，不持久化 |
| 生成锁 | navigator.locks 或 IndexedDB |

### 构建 / 填充阶段数据

```json
{
  "source_material": {
    "book_name": "{{BOOK_NAME}}",
    "source_type": "biography | narrative_work | poem_or_essay | fictional_character_file | mixed",
    "content_files": [
      {
        "path": "{{CONTENT_FILE_PATH}}",
        "covered_module": "{{COVERED_MODULE}}",
        "usage": "{{USAGE_IN_PRODUCT}}"
      }
    ]
  },
  "target_selection": {
    "target_name": "{{TARGET_NAME}}",
    "target_type": "real_person | fictional_character | mythic_figure | creator",
    "selection_rule": "direct_person | clear_protagonist | author_or_creator | knowledge_base_resolved",
    "candidate_targets": ["{{CANDIDATE_TARGET}}"],
    "target_selection_reason": "{{TARGET_SELECTION_REASON}}",
    "source_evidence": ["{{SOURCE_EVIDENCE}}"],
    "knowledge_base_evidence": ["{{KNOWLEDGE_BASE_EVIDENCE}}"],
    "confidence": 0.0
  },
  "accuracy_mode": "strict | semi-strict | fantasy"
}
```

### 游戏内容 Schema

```json
{
  "meta": {
    "game_title": "{{GAME_TITLE}}",
    "game_subtitle": "{{GAME_SUBTITLE}}",
    "target_name": "{{TARGET_NAME}}",
    "target_display_name": "{{TARGET_DISPLAY_NAME}}",
    "target_type": "{{TARGET_TYPE}}",
    "era_or_world": "{{ERA_OR_WORLD}}",
    "core_theme": "{{CORE_THEME}}",
    "title_quote": "{{TITLE_QUOTE}}",
    "style_keywords": ["{{STYLE_KEYWORD}}"],
    "particle_profile": "{{PARTICLE_PROFILE}}",
    "timeline_label": "{{TIMELINE_LABEL}}",
    "intro_profile": {
      "intro_title": "{{TARGET_DISPLAY_NAME}} 是谁",
      "birth_or_origin": "{{BIRTH_YEAR_PLACE_OR_ORIGIN}}",
      "era_or_world_label": "{{ERA_OR_WORLD_LABEL}}",
      "identity_tags": ["{{IDENTITY_TAG}}"],
      "best_known_for": "{{MOST_FAMOUS_FOR}}",
      "one_paragraph_intro": "{{100_TO_180_CHAR_INTRODUCTION}}",
      "story_entry_button": "进入 {{TARGET_PRONOUN_OR_NAME}} 的故事",
      "source_refs": ["{{SOURCE_REF}}"]
    }
  },
  "overall_story_arc": {
    "story_thesis": "{{THIS_LIFE_IS_ABOUT_WHAT}}",
    "central_question": "{{CENTRAL_LIFE_QUESTION}}",
    "opening_state": "{{TARGET_AT_BEGINNING}}",
    "ending_state": "{{TARGET_AT_END}}",
    "life_arc_summary": "{{FROM_BEGINNING_TO_END_IN_ONE_PARAGRAPH}}",
    "emotional_trajectory": ["{{EMOTIONAL_STAGE_1}}", "{{EMOTIONAL_STAGE_2}}"],
    "major_turning_points": [
      {
        "chapter_id": "ch{{N}}",
        "turning_point": "{{TURNING_POINT}}",
        "why_it_changes_the_life": "{{CAUSE_AND_EFFECT}}",
        "source_refs": ["{{SOURCE_REF}}"]
      }
    ],
    "chapter_chain": [
      {
        "chapter_id": "ch{{N}}",
        "chapter_role": "opening | rising_pressure | turning_point | cost | reckoning | legacy",
        "what_this_chapter_inherits": "{{PREVIOUS_CHAPTER_RESIDUE}}",
        "what_this_chapter_changes": "{{STATE_CHANGE}}",
        "what_this_chapter_leaves_for_next": "{{NEXT_CHAPTER_PRESSURE}}"
      }
    ]
  },
  "characters": [
    {
      "id": "char_{{ID}}",
      "name": "{{CHARACTER_NAME}}",
      "relation_to_target": "{{RELATION}}",
      "appears_in_chapters": ["ch{{N}}"],
      "voice_style": "{{VOICE_STYLE}}",
      "source_evidence": "{{SOURCE_EVIDENCE}}"
    }
  ],
  "chapters": [
    {
      "id": "ch{{N}}",
      "title": "{{CHAPTER_TITLE}}",
      "phase_label": "{{LIFE_OR_STORY_PHASE}}",
      "time_or_work_position": "{{TIME_OR_POSITION}}",
      "core_event": "{{CORE_EVENT}}",
      "narrative_role": "opening | rising_pressure | turning_point | cost | reckoning | legacy",
      "cause_from_previous": "{{HOW_PREVIOUS_CHAPTER_LEADS_HERE}}",
      "chapter_inner_arc": "{{FROM_WHAT_STATE_TO_WHAT_STATE_INSIDE_THIS_CHAPTER}}",
      "emotional_start": "{{EMOTION_AT_OPENING}}",
      "emotional_peak": "{{EMOTION_AT_CG_PEAK}}",
      "emotional_end": "{{EMOTION_AFTER_CHAPTER}}",
      "factual_anchor_events": ["{{FACTUAL_EVENT_OR_CANON_EVENT}}"],
      "relationship_pressure": "{{RELATIONSHIP_OR_SOCIAL_PRESSURE}}",
      "decision_pressure": "{{WHY_THE_DECISION_IS_HARD}}",
      "emotional_tone": "{{TONE}}",
      "cg_asset_id": "chapter_cg_{{N}}",
      "cg_peak_scene_id": "ch{{N}}_end",
      "cg_peak_reason": "{{WHY_THE_POST_CHOICE_CHAPTER_ENDING_IS_THE_EMOTIONAL_CLIMAX}}",
      "ending_residue": "{{WHAT_REMAINS_UNRESOLVED_OR_CHANGED}}",
      "next_chapter_bridge": "{{HOW_THIS_CHAPTER_PUSHES_THE_NEXT}}",
      "scene_beats": [
        {
          "beat_role": "opening_grounding | backstory_context | incident_seed | relationship_or_external_context | event_development | multi_turn_dialogue | decision_pressure | decision | revelation_feedback | chapter_end_cg | chapter_reflection | bridge",
          "purpose": "{{WHY_THIS_BEAT_EXISTS}}",
          "emotional_delta": "{{HOW_EMOTION_CHANGES}}",
          "source_refs": ["{{SOURCE_REF}}"]
        }
      ],
      "scenes": ["{{SCENE_OBJECTS}}"]
    }
  ],
  "achievements": [
    {
      "id": "ach_{{ID}}",
      "name": "{{ACHIEVEMENT_NAME}}",
      "description": "{{ACHIEVEMENT_DESC}}",
      "unlock_condition": {
        "decision_id": "{{DECISION_ID}}",
        "choice_id": "{{CHOICE_ID}}"
      }
    }
  ]
}
```

### Scene Schema

```json
{
  "id": "ch1_n1",
  "type": "narrative",
  "beat_role": "opening_grounding | backstory_context | incident_seed | relationship_or_external_context | event_development | bridge",
  "beat_purpose": "{{WHAT_THIS_SCENE_BUILDS}}",
  "emotional_delta": "{{EMOTIONAL_CHANGE_IN_THIS_SCENE}}",
  "text": "叙事文本，第二人称，80-180 字，含具体地点、动作、关系或感官细节。",
  "source_refs": ["{{SOURCE_REF}}"]
}
```

```json
{
  "id": "ch1_dlg1",
  "type": "dialogue",
  "beat_role": "relationship_or_external_context | multi_turn_dialogue | event_development",
  "beat_purpose": "{{WHAT_RELATION_EXTERNAL_PRESSURE_OR_EVENT_PROGRESS_THIS_DIALOGUE_REVEALS}}",
  "emotional_delta": "{{EMOTIONAL_CHANGE_IN_THIS_SCENE}}",
  "speaker": "{{NPC_NAME}}",
  "speaker_id": "char_{{ID}}",
  "text": "{{NPC_LINE}}",
  "responses": [
    {
      "id": "a",
      "text": "{{PLAYER_RESPONSE_A}}",
      "followup": "{{NPC_FOLLOWUP_A}}"
    },
    {
      "id": "b",
      "text": "{{PLAYER_RESPONSE_B}}",
      "followup": "{{NPC_FOLLOWUP_B}}"
    }
  ],
  "source_refs": ["{{SOURCE_REF}}"]
}
```

```json
{
  "id": "ch1_decision1",
  "type": "decision",
  "beat_role": "decision_pressure",
  "beat_purpose": "{{WHAT_BACKSTORY_EVENT_AND_PRESSURE_MAKE_THIS_DECISION_NECESSARY}}",
  "emotional_delta": "{{EMOTIONAL_STATE_BEFORE_CHOICE}}",
  "context": "{{DECISION_CONTEXT}}",
  "choices": [
    {
      "id": "a",
      "text": "{{CHOICE_TEXT}}",
      "is_authentic_or_canon": true,
      "score": 3,
      "response": "{{FEEDBACK_REVEALING_REAL_OR_CANON_CHOICE}}",
      "achievement": "ach_{{ID}}"
    },
    {
      "id": "b",
      "text": "{{CHOICE_TEXT}}",
      "is_authentic_or_canon": false,
      "score": 1,
      "response": "{{FEEDBACK_REVEALING_REAL_OR_CANON_CHOICE}}",
      "achievement": null
    },
    {
      "id": "c",
      "text": "{{CHOICE_TEXT}}",
      "is_authentic_or_canon": false,
      "score": 0,
      "response": "{{FEEDBACK_REVEALING_REAL_OR_CANON_CHOICE}}",
      "achievement": null
    }
  ],
  "source_refs": ["{{SOURCE_REF}}"]
}
```

```json
{
  "id": "ch1_end",
  "type": "chapter_ending",
  "beat_role": "chapter_end_cg | chapter_reflection | bridge",
  "beat_purpose": "{{WHY_THE_REAL_OR_CANON_CHOICE_REVEAL_LEADS_TO_THIS_CHAPTER_ENDING_IMAGE_AND_REFLECTION}}",
  "emotional_delta": "{{EMOTIONAL_RELEASE_OR_RESIDUE}}",
  "title": "{{ENDING_TITLE}}",
  "quote_lines": ["{{QUOTE_LINE}}"],
  "annotation": "{{QUOTE_SOURCE_AND_MEANING}}",
  "reflection": "{{CHAPTER_REFLECTION}}",
  "cg_asset_id": "chapter_cg_1"
}
```

### 运行时用户进度

```json
{
  "current_chapter_id": "ch1",
  "current_scene_id": "ch1_n1",
  "choices": [
    {
      "decision_id": "{{DECISION_ID}}",
      "choice_id": "{{CHOICE_ID}}",
      "score": 3
    }
  ],
  "unlocked_achievements": ["ach_{{ID}}"],
  "finished": false,
  "updated_at": "{{ISO_TIME}}"
}
```

---

## 十一、交互设计

### 操作映射

| 操作 | 实现方案 | 状态变化 |
|------|----------|----------|
| 开始游戏 | 点击标题页主按钮 | `current_chapter_id = ch1` |
| 继续游戏 | 点击继续按钮 | 从 localStorage 恢复进度 |
| 推进叙事 | 点击继续 | `current_scene_id` 指向下一场景 |
| 选择回应 | 点击 A/B 回应 | 显示玩家气泡和 NPC followup |
| 做出决策 | 点击 3 个选项之一 | 保存 choice、score，进入反馈 |
| 查看反馈 | 点击继续 | 进入下一场景或章末 |
| 章末继续 | 点击继续 | 进入下一章 |
| 重新开始 | 点击按钮 | 清空进度，保留图片缓存 |

### 反馈规范

- hover：按钮位移、描边、阴影、光效或材质变化，不能只变默认蓝色。
- active：有按下感或短暂压缩/亮度变化。
- disabled：降低透明度并禁止点击。
- 选择后：已选项突出，其他选项退场或弱化。
- 屏幕切换：淡入淡出、遮罩滑入、胶片闪烁、纸张翻页、扫描等主题化过渡。
- 成就 toast：主题化小组件滑入，3-5 秒自动消失。
- 错误：资产生成失败必须显示失败资产、原因和重试按钮。

### 文本与选择约束

- 全程默认使用第二人称“你”，但可以根据人物类型调整称谓。
- 决策选项不得提前暴露后果，不写“这会导致……”或“会改变结局……”。
- 3 个选项都要说得通，不设置明显送分答案。
- 反馈不能批判玩家，只比较玩家选择与人物真实/原作选择。
- 真实人物不能编造关键事实；虚构人物不能违反 canon。

### 人物介绍页文案约束

- 人物介绍页必须出现在标题页之后、第一章章节过渡之前。
- 简介长度控制在 100-180 字，写成一段可读的介绍，不写成条目堆叠。
- 必须说明人物的年代 / 世界观 / 活跃时期，以及最出名的身份、作品、事件、选择或精神标签。
- 真实人物必须优先包含出生年代或生卒年；如果确切日期不适合展示，可写时代范围。
- 虚构人物应说明所属作品 / 世界观、身份定位和最核心的角色标签。
- 介绍页可以点明人物最广为人知的成就，但不得剧透后续章节的关键情感高潮。
- 简介必须能追溯到内容文件或知识库证据，不得为了氛围编造人物履历。
- 页面主按钮文案使用“进入 TA 的故事”或按人物称谓改写，例如“进入她的故事”“进入苏轼的故事”。

---

## 十二、核心机制约束

### 产品形态约束

本产品最终交付给用户的是已经完成内容填充的传记模拟游戏。内容识别、知识库搜索、章节填充、图片 prompt 生成、数据构建属于后台填充阶段，不暴露给最终用户。最终用户只体验已经完成的传记模拟游戏。

### 设计粒度约束

本 spec 是“可填充玩法框架”。以下内容由 `skills/内容文件` 填入：

- 体验主角是谁。
- 人物/作品的核心主题。
- 章节标题、阶段、事件、时间或剧情位置。
- 对话人物、关系、台词风格。
- 决策处境、真实/原作选择、反馈内容。
- 引文、注释、章末感悟。
- 视觉关键词、粒子类型、图片 prompt。

### 人物范围约束

不限制为古风人物。任何人物都可行，包括真实人物、虚构人物、历史人物、现代人物、神话人物、IP 角色、作品主角、作者或创作者。

### 作品输入约束

- 明确有主角的叙事作品：优先做主角。
- 主角模糊、多主角并列、诗篇、散文、随笔、论文等非叙事作品：优先做作者 / 创作者。
- 判断需要结合完整内容文件和知识库证据。
- 不能只凭作品标题臆断。

### 选择不随意改写命运

- 故事主线默认按真实人生、原作 canon 或内容文件主线推进。
- 玩家选择用于代入和比较，不随意改变关键事实。
- 反馈的核心是“人物当时/原作中真正如何选择，以及为什么这件事重要”。
- 如果某个虚构作品允许多分支 canon，必须明确分支来源和版本。

### 传记叙事生成约束

传记不是事实条目拼接。构建章节前，必须先生成一条从开始到结束的总体故事弧线，说明这个人物的一生或角色弧线“从什么状态走到什么状态”，以及玩家通关后应理解的核心问题。

#### 总体故事先于章节

生成章节前必须先确定：

- `story_thesis`：这段人生 / 角色弧线到底讲什么。
- `central_question`：贯穿全篇的核心问题，例如“他如何在权力和理想之间选择”“她如何从被观看的人变成创造自己的人”。
- `opening_state`：人物在开端的身份、处境、欲望、缺口。
- `ending_state`：人物在结尾的处境、代价、影响或精神遗产。
- `major_turning_points`：真正改变人物命运的 3-6 个转折点，每个转折点必须有事实或 canon 依据。
- `emotional_trajectory`：整体情绪从哪里开始，如何升高、破裂、回落或沉淀。

如果没有总体故事弧线，不得直接生成章节正文。

#### 章节之间必须承接

每章都必须回答三件事：

1. 本章从上一章继承了什么后果、关系、处境或心理残留。
2. 本章通过哪个真实事件 / canon 事件改变了人物状态。
3. 本章留下什么未完成的压力，把下一章自然推出去。

禁止把章节写成互不相干的生平节点。不能出现“第 1 章少年、第 2 章突然成名、第 3 章突然失败”这种只按时间跳跃、没有因果和情绪接力的结构。

#### 章节内必须循序渐进

每章必须按叙事节拍推进，不能开场直接进入决策，也不能把一章写成百科概述。默认节拍为：

```text
开场处境
→ 事件前因与背景
→ 事件苗头出现
→ 人物关系 / 外部处境进入
→ 多轮对话或互动推动事件发展
→ 事件进一步推进
→ 玩家理解此刻为什么必须选择
→ 玩家选择
→ 真实/原作选择揭示
→ 章末 CG 情感高潮
→ 章末回望
→ 留给下一章的余波
```

实际章节可合并轻量说明性片段，但不得缺少“前因与背景 → 事件苗头 → 关系/外部处境 → 对话或互动推动 → 事件推进 → 选择压力 → 玩家选择 → 真实选择揭示 → 章末 CG → 章末感悟”的基本链条。

#### CG 必须固定在章末

每章 CG 不是装饰图，也不是随机场景图。每张 CG 必须绑定本章 `chapter_ending` 场景，并且只能出现在玩家选择和真实/原作选择揭示之后，作为章末情感高潮。

章末 CG 不得出现在普通叙事场景、章节开头、章节中段或决策之前。普通叙事可以使用 UI、文字、局部符号或非章末 CG 的轻量装饰，但不得提前展示本章 `cg_asset_id`。

CG prompt 必须来自“玩家选择后的真实/原作选择揭示”所带来的情绪和命运后果，至少包含：

- 人物当时的处境。
- 关键地点或象征物。
- 真实/原作选择揭示后的情绪状态。
- 光影和构图如何表现章末高潮。
- 与本章核心事件、选择压力和后续余波的关系。

如果某章 CG 无法说明为什么必须在玩家选择和真实/原作选择揭示后出现，则该章叙事不合格。

#### 真实生平需要剧情设计

真实人物章节必须基于历史生平、作品经历或可验证资料进行剧情设计：

- 从事实中提炼冲突，而不是虚构关键冲突。
- 把事实变成场景：地点、人物、动作、声音、等待、犹豫、误解、代价。
- 把关系变成对话：对话必须服务关系和冲突，不写泛泛寒暄。
- 把选择变成压力：决策前必须让玩家理解为什么每个选项都说得通。
- 把后果变成下一章的处境：人物的选择、失败、成名、失去、迁徙、创作、背叛、和解，都应进入后续章节。

禁止流水账式写法，例如“他经历了许多困难，后来取得成功”。必须写具体事件如何发生，人物当时面对谁、在哪里、为什么难、做了什么，以及这件事怎样改变下一步。

### 决策反馈结构

当玩家选择与人物真实/原作选择不同：

1. 简短理解玩家：说明这个选择为什么也有道理。
2. 揭示人物真实/原作选择：具体写出人物做了什么、说了什么、失去了什么或改变了什么。
3. 给出事实、原文、台词或内容文件依据。

当玩家选择与人物真实/原作选择相同：

1. 告诉玩家“你和人物想到了一起”。
2. 展开这个选择背后的处境、代价和后续影响。
3. 给出来源依据或原作片段。

禁止：

- 编造玩家选择导致的新后果。
- 暗示玩家改变了历史或 canon，除非内容文件本身就是分支作品。
- 用“你错了”“最佳答案”等判卷口吻。
- 只写玩家选择，不揭示人物真实/原作选择。

### 准确性模式约束

| 目标类型 | 准确性模式 | 要求 |
|----------|------------|------|
| 真实人物 / 历史人物 / 当代人物 | strict | 时间线、关系、称谓、事件、引用必须可验证 |
| 虚构人物 / IP 角色 | semi-strict | 核心 canon、关系、剧情顺序和设定必须正确 |
| 神话 / 传说人物 | semi-strict | 必须说明采用版本，不能混淆不同体系 |
| 原创幻想人物 | fantasy | 必须忠实随附内容文件并保持内部一致 |

---

## 十三、内容 / 章节概览

### 总体故事弧线

填充章节前必须先产出总体故事弧线，作为所有章节和场景的上位约束。

| 字段 | 填写要求 |
|------|----------|
| `story_thesis` | 用一句话说明这段人生 / 角色弧线真正讲什么 |
| `central_question` | 一个能贯穿全篇的核心人生问题 |
| `opening_state` | 开端时人物的处境、欲望、缺口和限制 |
| `ending_state` | 结尾时人物的处境、代价、影响或精神遗产 |
| `major_turning_points` | 3-6 个真实 / canon 转折点，按因果顺序排列 |
| `emotional_trajectory` | 全篇情绪曲线，例如“期待 → 受挫 → 抗争 → 失去 → 沉淀” |
| `final_understanding` | 玩家通关后应理解的人物复杂性 |

总体故事必须有叙述感：从开始到结束，让玩家逐步了解这人的一生，而不是看完一组人物资料卡。

### 默认章节结构

| 章 | 内容职责 | 来源映射 |
|----|----------|----------|
| 第 1 章 | 起点：出身、初登场、原作开场或创作缘起 | 人物早期资料 / 作品开端 / 作者背景 |
| 第 2 章 | 第一次关键关系或能力显现 | 关系网络 / 初次冲突 |
| 第 3 章 | 主要冲突升级 | 事件转折 / 作品中段 |
| 第 4 章 | 人物价值选择 | 关键决策 / 代表事件 |
| 第 5 章 | 代价、失败、流放、转型或高潮 | 高压事件 / 情感高潮 |
| 第 6 章 | 余波、总结、 legacy 或结局 | 晚期资料 / 作品结尾 / 创作影响 |

章节数量可在 5-7 章内调整。真实传记不必强行写到晚年；虚构人物可按原作剧情弧线推进；作者型作品可按创作背景、代表作品、人生转折和精神主题组织。

### 章节链设计

每章必须在章节链中承担明确叙事职责。

| 章 | 叙事职责 | 必须回答 |
|----|----------|----------|
| 开端章 | 建立人物的原初处境、欲望和缺口 | 这个人一开始缺什么、想要什么、被什么限制 |
| 上升章 | 让关系、能力、野心或外部压力开始显形 | 哪种力量正在把人物推向转折 |
| 转折章 | 通过重大事件改变人物状态 | 这件事为什么让人生不能回到原点 |
| 代价章 | 展示选择带来的失去、误解、牺牲或孤独 | 人物为自己的道路付出了什么 |
| 高潮章 | 把核心冲突推到最清楚的位置 | 人物最不能逃避的问题是什么 |
| 余波章 | 总结人物影响、遗产、结局或未竟之事 | 玩家最后应如何重新理解这个人 |

如果使用 5 章或 7 章，可合并或拆分职责，但不能缺少“起点 → 转折 → 代价 → 高潮 → 余波”的整体叙述。

每章必须填写：

| 字段 | 用途 |
|------|------|
| `cause_from_previous` | 上一章如何导致本章，不允许只写“时间来到……” |
| `chapter_inner_arc` | 本章内部从什么状态走到什么状态 |
| `factual_anchor_events` | 本章依托的真实 / canon 事件 |
| `relationship_pressure` | 本章最重要的人际、社会或内心压力 |
| `decision_pressure` | 本章决策为什么困难 |
| `cg_peak_scene_id` | 本章 CG 绑定的章末场景，必须在玩家选择和真实/原作选择揭示之后 |
| `ending_residue` | 本章结束后留下的余波 |
| `next_chapter_bridge` | 余波如何推出下一章 |

### 章内叙事节拍

每章不以点击次数或场景数量凑长度，而以叙事功能是否完成来判断是否充分。每章必须形成循序渐进的章内小故事。

| 节拍 | 作用 | 可用场景类型 |
|------|------|--------------|
| 开场处境 | 让玩家知道此刻人物在哪里、处境如何、上一章留下了什么 | narrative |
| 事件前因与背景 | 交代这个事件为什么会发生，不直接跳到选择点 | narrative |
| 事件苗头 | 让玩家看到事情开始变化、问题出现或机会到来 | narrative / dialogue |
| 人物关系 / 外部处境进入 | 让相关人物、组织、时代压力、原作规则或外部环境进入本章 | dialogue / narrative |
| 多轮对话或互动推动 | 通过 2-3 轮对话、争执、试探、劝阻、告别或互动推进事件，不用一句台词代替关系变化 | dialogue |
| 事件进一步推进 | 事件发生新变化，使选择点逐渐变得不可回避 | narrative / dialogue |
| 选择压力形成 | 让玩家理解此刻为什么必须选择，以及每个选项为什么都说得通 | narrative / decision |
| 玩家选择 | 玩家在人物处境中做选择 | decision |
| 真实/原作选择揭示 | 反馈人物真正做了什么，并解释代价 | feedback |
| 章末 CG 情感高潮 | 在真实/原作选择揭示后展示本章最强画面，承接选择后的情绪爆发或沉淀 | chapter_ending |
| 章末回望 | 用引文、台词或感悟收束本章 | chapter_ending |
| 下一章余波 | 明确留下后果、关系变化或未解决问题 | chapter_ending / bridge |

CG 只能出现在“真实/原作选择揭示”之后，作为章末回望的一部分。它必须是本章情感高潮，不得早早出现成普通插图。

### 每章内容规模

- 每章必须完整呈现一条章内事件链，不能只靠 2-4 次点击或几句对话就进入决策和 CG。
- 每章 1 个主要决策。
- 每章 1 张章末 CG。
- 每章至少 1 个对话或关系互动场景。
- 决策前必须完成事件前因、背景、事件苗头、人物关系 / 外部处境、事件推进和选择压力铺垫。
- 决策前至少包含 1 个多轮对话或互动单元；该单元必须有 2-3 轮推进，不能只是 NPC 一句台词加玩家一次点击。
- 叙事和对话穿插，不连续 3 个以上同类型。
- 章末必须有引文 / 台词 / 名句 / 核心句，并给出注释或语境说明。
- 每章必须有 `cause_from_previous` 和 `next_chapter_bridge`，确保章节之间有因果和情绪承接。
- 每章 CG 必须绑定章末 `cg_peak_scene_id`，并说明为什么它必须在玩家选择和真实/原作选择揭示后出现。

### 章节占位表

| 章 | 标题 | 阶段 | 承接上章 | 核心事件 | 决策主题 | CG 高潮 | 推向下章 |
|----|------|------|----------|----------|----------|---------|----------|
| {{CH_NUM}} | {{CHAPTER_TITLE}} | {{LIFE_OR_STORY_PHASE}} | {{CAUSE_FROM_PREVIOUS}} | {{CORE_EVENT}} | {{DECISION_THEME}} | {{CG_PEAK_DESCRIPTION}} | {{NEXT_CHAPTER_BRIDGE}} |

### 关键人物表

| 人物名 | 与体验主角关系 | 出现章节 | 内容依据 |
|--------|----------------|----------|----------|
| {{CHARACTER_NAME}} | {{RELATION_TO_TARGET}} | {{CHAPTER_IDS}} | {{SOURCE_EVIDENCE}} |

---

## 十四、技术约束

| 维度 | 约束 |
|------|------|
| 技术栈 | 纯前端单文件优先：HTML + CSS + JS |
| 部署方式 | 静态文件可直接打开，或静态站点部署 |
| 外部依赖 | 核心体验不依赖重型框架；如使用图标/字体 CDN，必须有 fallback |
| 图片存储 | IndexedDB Blob |
| 进度存储 | localStorage |
| 离线能力 | 图片生成完成并缓存后，应可离线重玩 |
| 性能 | 图片解码完成后再进入体验；移动端降低粒子数量 |
| 响应式 | 支持 ≥1024px 桌面、768px 平板、≤480px 手机 |
| 可访问性 | 文本对比度 ≥ 4.5:1；按钮可键盘聚焦；动画尊重 `prefers-reduced-motion` |
| 密钥安全 | 前端不得硬编码私密 API key；运行时生图必须通过安全后端、本机模型或受控代理 |

如果最终交付为单 HTML，仍必须通过可用的运行时生图能力完成 first-run-cache。没有真实生图能力时不得交付声称完成的产品。

---

## 十五、开发指引

1. 读取本 spec 和所有 `skills/内容文件` 的完整正文。
2. 判断输入类型：人物资料、叙事作品、诗文散文、虚构角色档案、混合内容。
3. 根据人物识别规则确定体验主角；必要时使用知识库检索，记录证据、候选和置信度。
4. 选择准确性模式：真实人物 strict，虚构/IP semi-strict，神话传说 semi-strict，原创幻想 fantasy。
5. 提取人物关系、阶段、事件、冲突、引文、场景、视觉关键词。
6. 生成 `intro_profile`：用 100-180 字介绍人物是谁、生活在哪个年代或世界观、最出名的身份/作品/事件/精神标签，并准备“进入 TA 的故事”按钮文案。
7. 先生成 `overall_story_arc`：确定 `story_thesis`、`central_question`、开端状态、结尾状态、主要转折和整体情绪曲线。
8. 再生成章节链：为每章填写 `cause_from_previous`、`chapter_inner_arc`、`factual_anchor_events`、`decision_pressure`、`ending_residue`、`next_chapter_bridge`。
9. 再生成章内节拍：按“处境 → 前因与背景 → 事件苗头 → 关系/外部处境 → 多轮对话或互动 → 事件推进 → 选择压力 → 玩家选择 → 真实/原作选择揭示 → 章末 CG → 章末感悟”组织场景，不得先写散乱场景再事后拼接。
10. 为每章指定章末 `cg_peak_scene_id` 和 `cg_peak_reason`，确认 CG 只在玩家选择和真实/原作选择揭示后出现。
11. 生成 `target_selection`、`meta`、`characters`、`chapters`、`achievements` 等静态数据。
12. 生成 `STYLE_PROMPT_BASE`，并为 `global_bg` 和每章 `chapter_cg_{{N}}` 写完整 prompt。
13. 生成并核对 `IMAGE_ASSET_MANIFEST`，确保整体背景图 prompt 明确禁止文字、水印、标题和 logo。
14. 实现首启资产准备页、IndexedDB 缓存、生成锁、失败重试和 ready 闸门。
15. 在所有必需图片 ready 后才进入标题页。
16. 实现标题页、人物介绍页、章节过渡、叙事、对话、决策、反馈、章末感悟、结局评分。
17. 实现主题化 UI、丰富首页粒子、hover/active/disabled 状态、屏幕过渡和 `prefers-reduced-motion`。
18. 写入 localStorage 进度，不把图片、Blob、base64 或 object URL 存进 localStorage。
19. 执行功能、内容、叙事、图片、视觉、响应式、准确性和产品形态自检。

开发过程中不得把构建阶段的人物识别、知识库检索、内容解析做成最终用户页面；这些是填充管线职责。

---

## 十六、验收标准

### 功能验收

| 功能 | 验收条件 | 自测结果 |
|------|----------|----------|
| 资产准备页 | 首次缺图时显示主题化准备页，生成并缓存缺失图片 | [ ] 通过 |
| 标题页 | 显示主题背景、人物标题、引文、开始/继续按钮和粒子 | [ ] 通过 |
| 人物介绍页 | 标题页后出现，说明人物年代/世界观、身份、最出名事迹或作品，并提供“进入 TA 的故事”按钮 | [ ] 通过 |
| 章节过渡 | 显示章名、阶段、时间/作品位置，并有过渡动画 | [ ] 通过 |
| 叙事阅读 | 文本逐段或逐字出现，点击继续推进 | [ ] 通过 |
| 对话互动 | NPC 与玩家回应区分明确，2 个回应可选 | [ ] 通过 |
| 关键决策 | 每章 1 个主要决策，3 个选项都合理且不剧透后果 | [ ] 通过 |
| 反馈 | 明确揭示人物真实/原作选择，语气不判卷 | [ ] 通过 |
| 章末 CG | 每章有 1 张真实生成 CG，只在玩家选择和真实/原作选择揭示后作为章末情感高潮展示 | [ ] 通过 |
| 章末感悟 | 有引文/台词/名句、语境说明和阶段回望 | [ ] 通过 |
| 结局评分 | 显示得分、评语、选择回顾、成就和重新开始 | [ ] 通过 |

### 随附内容文件验收

- [ ] 已读取每个 `skills/内容文件` 的完整正文。
- [ ] 人物选择规则有记录，包含人物/作品主角/作者判断依据。
- [ ] 如果使用知识库检索，已记录检索证据和置信度。
- [ ] 章节、事件、关系、引文和反馈能追溯到内容文件或知识库证据。
- [ ] 没有只靠文件名、摘要或标题生成核心内容。

### 叙事生成验收

- [ ] 已生成 `overall_story_arc`，能说明这段人生 / 角色弧线从什么状态走到什么状态。
- [ ] `story_thesis` 和 `central_question` 贯穿所有章节，不是只出现在标题页。
- [ ] 章节之间有 `cause_from_previous` 和 `next_chapter_bridge`，不存在互不相干的生平片段拼盘。
- [ ] 每章都有清晰的 `chapter_inner_arc`，能看出本章内部情绪和处境如何变化。
- [ ] 每章场景遵循“处境 → 前因与背景 → 事件苗头 → 关系/外部处境 → 多轮对话或互动 → 事件推进 → 选择压力 → 玩家选择 → 真实/原作选择揭示 → 章末 CG → 章末感悟”的基本链条。
- [ ] 决策前已经铺设事件前因、背景、事件苗头、人物关系 / 外部处境、事件推进和选择压力。
- [ ] 决策前至少有一个 2-3 轮的多轮对话或互动单元，推动事情走向选择点，不是闲聊或资料说明。
- [ ] 章末 CG 绑定章末 `cg_peak_scene_id`，且 `cg_peak_reason` 能说明为什么它必须在玩家选择和真实/原作选择揭示后出现。
- [ ] 章末 CG 没有出现在章节开头、中段普通叙事或决策之前。
- [ ] 章末不仅总结本章，还留下影响下一章的余波。
- [ ] 全篇读完像一条从开始到结束的人生叙事，而不是百科时间线。

### 生图验收

- [ ] 存在静态 `IMAGE_ASSET_MANIFEST`。
- [ ] 背景图 1 张，且 prompt 明确禁止文字、水印、标题、logo、签名。
- [ ] 每章 1 张章末 CG，且只作为章末 CG 使用。
- [ ] 所有图片共享同一 `STYLE_PROMPT_BASE`。
- [ ] 每张图片有完整 prompt、negative prompt、aspect ratio、cache key、prompt hash。
- [ ] 页面使用的是真实生成图片或 IndexedDB Blob，不是 CSS/SVG/Canvas/emoji/文字占位。
- [ ] 无法生图时产品停止并报告问题，没有伪装完成。

### 首次启动图片缓存验收

- [ ] 首次缺图时显示资产准备页。
- [ ] cache miss 时只生成缺失图片。
- [ ] 生成后以 Blob 写入 IndexedDB。
- [ ] cache hit 时只读取缓存，不调用生图 API。
- [ ] prompt、style base、manifest version 改变时只重生成失效图片。
- [ ] 存在生成锁，避免并发生图。
- [ ] 所有必需图片 `ready = true` 后才进入标题页。
- [ ] localStorage 未保存图片、base64、大 data URL、Blob 字符串或 object URL。

### 视觉验收

- [ ] UI 不是固定古风，也不是默认网页样式。
- [ ] UI 框体结构固定，但材质、边框、按钮、toast、粒子随人物/作品主题变化。
- [ ] 首页和资产准备页有 12-30 个主题化粒子或等效氛围层。
- [ ] 粒子不遮挡文字，不拦截点击，移动端性能可接受。
- [ ] 标题有主题化字体效果或 SVG 装饰。
- [ ] 文本在背景图和 CG 上方可读，对比度 ≥ 4.5:1。
- [ ] 支持 `prefers-reduced-motion`。

### 交互验收

- [ ] 所有按钮有 hover / active / disabled 状态。
- [ ] 屏幕切换有过渡，不瞬切。
- [ ] 选择后有明确已选状态。
- [ ] 成就 toast 能出现并自动消失。
- [ ] 错误状态可读，有重试入口。

### 数据验收

- [ ] `target_selection`、`overall_story_arc`、`meta.intro_profile`、`characters`、`chapters`、`achievements` 字段完整。
- [ ] 所有 ID 引用一致。
- [ ] 每个决策只有 1 个 `is_authentic_or_canon = true`。
- [ ] 每章包含 `cause_from_previous`、`chapter_inner_arc`、`cg_peak_scene_id`、`ending_residue`、`next_chapter_bridge`。
- [ ] 用户进度刷新后可恢复。
- [ ] 图片运行时状态和 IndexedDB 缓存记录字段齐全。

### 响应式验收

- [ ] 桌面端 ≥1024px 布局正常。
- [ ] 平板端 768px 布局自适应。
- [ ] 手机端 ≤480px 核心功能可用，文本不溢出、不重叠。
- [ ] 移动端粒子数量和图片尺寸经过性能控制。

### 准确性 / 一致性验收

- [ ] 真实人物采用 strict，时间线、人物关系、称谓、事件和引用可验证。
- [ ] 虚构/IP 人物采用 semi-strict，核心 canon、关系和剧情顺序正确。
- [ ] 神话传说人物说明采用版本，不混淆设定。
- [ ] fantasy 内容忠实随附内容文件并保持内部一致。
- [ ] 决策反馈不编造玩家选择造成的后果。
- [ ] 反馈明确写出人物真实/原作选择。

### 产品形态验收

- [ ] 最终用户动线从完成品标题页开始，不包含上传/输入/生成参数页。
- [ ] 内容解析、知识库搜索、人物识别、数据填充仅作为构建阶段职责。

### 设计粒度验收

- [ ] 产品概览声明 `设计粒度 | 可填充玩法框架 |`。
- [ ] 主题、章节、人物、图片 prompt 等以槽位、规则、范围和 Schema 表达。
- [ ] spec 可复用于不同人物、作品、时代、画风和准确性模式。
