# 生物互动模拟学习游戏 spec

## 一、产品概览

| 维度 | 值 |
|------|-----|
| 产品名称 | {{GAME_NAME}} |
| 来源素材 | {{BOOK_NAME}} |
| 设计粒度 | 可填充玩法框架 |
| 玩法结构 | 层级缩放生命系统模拟器 + 参数实验 + 多题型诊断反馈 |
| 产品类型 | 生物 SVG/Canvas 参数模拟学习游戏 |
| 学科范围 | 分子生物、细胞生物、植物生理、人体系统、遗传发育、生态系统、实验探究 |
| 核心主题槽位 | {{CORE_BIOLOGY_THEME}} |
| 目标体验 | 让用户在分子、细胞、器官、个体、遗传和生态尺度之间缩放，通过高精度结构图和动态机制模拟理解生命系统 |
| 交互方式 | 点击推进、滑块调参、结构点选、拖拽标注、过程排序、机制匹配、曲线判读、遗传推算、异常诊断 |
| 内容规模 | 5-7 章；每章 3-4 个知识点；总题量 20-25 题；每章 3 个成就 |
| 准确性模式 | strict |
| 生图范围 | 标题页 / 全局背景图需要真实位图生图；核心生命结构图、机制图、遗传图、器官系统图和生态网络必须用 SVG/Canvas/HTML 实现 |
| UI 风格策略 | 默认 `bio-atlas-light` 明亮生物图谱；可按内容选择 `microscope-fluorescence`、`botanical-field`、`medical-clinical`、`genetics-notebook`、`ecosystem-diorama` 等预设 |
| IMAGE_GENERATION_TIMING | first-run-cache |
| 运行与存储 | 纯前端单文件；进度使用 localStorage；背景图片 Blob 使用 IndexedDB 缓存 |

### 核心设计理念

**生命结构、机制过程、参数实验和答题反馈必须是同一个可视化场景的不同状态，不得拼成“文字讲解 + 静态图 + 选择题”的普通课件。**

每个知识点对应一个高精度 SVG / Canvas 生命机制可视化场景。这个场景贯穿：

```text
结构/机制讲解 → 参数实验探索 → 多题型答题/诊断 → 同场景反馈演示
```

如果去掉细胞剖面、器官系统、遗传图谱、生态网络、曲线图、粒子流动和动态反馈后只剩文字与题目，本产品即判定未完成。

### 层级缩放原则

本产品默认围绕生命尺度递进：

```text
分子 → 细胞 → 组织/器官 → 个体稳态 → 遗传发育 → 种群/生态系统
```

用户应能在不同尺度之间理解“结构如何产生功能”“变量如何影响过程”“局部机制如何改变整体结果”。

### 产品形态说明

本 spec 描述的是已完成内容填充的生物互动学习游戏。构建阶段会读取随附 `skills/内容文件`，提取具体生物知识、结构图谱、实验变量、曲线数据、遗传材料、生态关系、题目依据和视觉主题，填入本 spec 定义的数据结构。最终用户打开的是已经完成的生物互动学习游戏，不需要上传文件、输入内容或操作生成器。

## 二、涉及的 SKILL / 内容文件清单

完整内容文件会与本 spec 一起提供，通常位于项目根目录的 `skills/` 文件夹中。构建产品时，必须读取每个文件的完整内容，并从中提取本 spec 需要的内容。

| 内容文件路径 | 覆盖模块 | 在本产品中的用途 |
|-------------|----------|------------------|
| `{{CONTENT_FILE_PATH}}` | `{{COVERED_MODULE}}` | `{{USAGE_IN_PRODUCT}}` |
| `skills/{{BIOLOGY_KNOWLEDGE_FILE}}` | `{{BIOLOGY_MODULE}}` | 提取章节、知识点、生命结构、机制过程、变量关系、题目依据 |
| `skills/{{BIOLOGY_EXPERIMENT_FILE}}` | `{{EXPERIMENT_MODULE}}` | 提取实验材料、变量、对照组、现象、曲线、结论和诊断题材料 |
| `skills/{{BIOLOGY_CASE_FILE}}` | `{{CASE_MODULE}}` | 提取真实生命现象、疾病/稳态案例、遗传案例、生态关系或综合情境 |

### 内容使用验收重点

- 实现者必须读取每个内容文件的完整正文。
- 核心结构、机制路径、实验结论、遗传概率、生态关系、题目答案和解析必须能追溯到内容文件原文或明确可核验的生物知识。
- 文件名、目录、摘要和索引只能作为导航，不能作为核心内容依据。
- 不得凭空编造真实实验结论、遗传规律、人体机制、生态关系或题目答案。
- 如果内容文件暂未提供，必须保留本节占位符和提取契约，等待下一步实现时替换。

### 内容提取维度

| 提取维度 | 在本 spec 中映射到 |
|----------|--------------------|
| 生命结构：分子、细胞器、细胞、组织、器官、系统、个体、种群、生态节点 | SVG 结构图、可点击对象、图层、标注、章节主题、题目热区 |
| 结构-功能关系：细胞器功能、器官协同、反馈调节、信号传递、能量流、物质循环 | 机制路径、匹配题、诊断依据、反馈演示 |
| 生命过程：扩散、渗透、酶促反应、光合作用、呼吸作用、免疫、神经传导、遗传、演替等 | 动态 SVG/Canvas 动画、时间轴状态、参数实验 |
| 生物规则：遗传定律、稳态调节、酶活性规律、生态平衡、能量传递效率等 | 参数响应规则、题目答案、自检项 |
| 实验材料：自变量、因变量、对照组、实验现象、数据曲线、结论 | 参数面板、实验诊断题、曲线判读、数据 Schema |
| 可操作变量：温度、pH、浓度、光照、氧气、激素、基因型、种群数量等 | 滑块、开关、时间轴、预测题、模拟反馈 |
| 可验证事实：结构名称、结构位置、功能、代谢路径、遗传概率、生态关系、实验结论 | strict 准确性验收、题目正确答案、解析依据 |
| 视觉主题：显微染色、医学图谱、生态场景、实验室氛围 | 背景图 prompt、UI 气质、粒子类型、章节过渡 |

### 内容文件到章节的映射原则

- 章节按生命尺度、机制递进或内容文件的专题结构组织，不强行照搬文件目录。
- 每个知识点必须能生成一个可操作或可诊断的可视化场景，而不是只有文字定义。
- 每个章节至少包含 3 个可操作或可判读的生命变量。
- 题目干扰项必须来自真实常见误解，例如把主动运输/协助扩散混淆、把酶失活当成酶消失、把显隐性关系和性状比例简单化、把食物网影响理解成单向线性关系。

## 三、目标用户

| 用户维度 | 描述 |
|----------|------|
| 核心用户 | 多年龄层通用，可通过内容文件填充为小学科普、初中生物、高中生物、成人通识或综合学习版本 |
| 知识水平 | 从零基础到进阶均可；具体术语密度、结构复杂度、实验数据精度由内容文件决定 |
| 使用场景 | 课堂演示、自主学习、章节复习、实验变量理解、结构识别训练、机制诊断训练 |
| 设备偏好 | 桌面浏览器和平板优先；手机端必须可完成核心学习与答题 |
| 学习目标 | 通过结构图、机制动画、实验曲线和参数模拟建立生命系统的层级感、因果感和诊断能力 |

### 难度分层

本框架默认支持 `基础 / 进阶 / 综合` 三档难度：

| 难度 | 内容特征 | 交互复杂度 |
|------|----------|------------|
| 基础 | 强调结构识别、功能对应和直观现象 | 少量滑块、结构点选、3 选 1 |
| 进阶 | 引入变量控制、曲线判读、机制匹配和遗传推算 | 多图层、拖拽标注、过程排序 |
| 综合 | 跨尺度系统分析、稳态诊断、生态网络预测、实验设计判断 | 多变量调参、异常诊断、网络预测 |

## 四、产品目的

### 核心价值

本产品让用户通过亲手调整生命变量，观察细胞、器官、遗传和生态系统如何响应，从而理解生物结构与功能、过程与调节、局部与整体之间的关系。

### 成功标准

- 用户能通过调参观察说出至少一个生命机制链，例如“温度升高到适宜范围 → 酶活性增强 → 反应速率提高；过高温度 → 酶空间结构破坏 → 活性下降”。
- 用户能在细胞结构图、器官系统图、遗传图谱、曲线图、生态网络中完成判读，而不是只背诵文字结论。
- 每个知识点的讲解、探索、答题、反馈都共用同一个可视化场景。
- 用户完成章节后能在章末总结中看到本章核心结构、关键变量、机制路径和常见误区。
- 产品填充不同生物内容后，仍能保持同一套高质量交互结构和 strict 准确性验收。

### 不做什么

- 不做纯文字讲义。
- 不做只有选择题的题库。
- 不用 AI 生图或静态位图代替核心生物结构图、机制图或实验图表。
- 不为酷炫动效牺牲生命机制、实验结论、结构位置或遗传概率的正确性。

## 五、视觉风格规范

### 整体气质

视觉方向为：**可变生命科学视觉系统：明亮生物图谱为默认，按生命尺度和内容主题切换多套 UI 风格，并始终保留清晰的生物语义色彩**。

用户打开页面时，应首先感到这是一个可操作、可判读、颜色丰富但秩序清楚的生命系统学习工作台，而不是单一深色蓝绿实验室。前景始终是可操作的结构图、机制路径、实验曲线、遗传图谱、生态网络和动态粒子；背景通过真实生图获得，并根据 `UI_STYLE_PRESET` 匹配不同风格。

默认风格为 `bio-atlas-light`：明亮生物图谱 + 结构机制工作台 + 多彩生命语义图层。深色显微荧光或实验室风格仅作为特定章节预设，不得作为唯一默认。

### UI 风格预设

最终实现必须在构建 / 填充阶段选择一个初始 `UI_STYLE_PRESET`，并可选地在设置中允许最终用户切换。无论使用哪种风格，生物结构、机制变量、实验曲线、遗传概率和生态关系的颜色编码、图例、单位和可读性优先级都高于装饰风格。

| 预设 ID | 风格名称 | 适合内容 | 背景 / 表面 | 面板和控件 | 氛围动效 |
|---------|----------|----------|-------------|------------|----------|
| `bio-atlas-light` | 明亮生物图谱 + 结构机制工作台 | 通用生物、课堂学习、综合复习、结构识别 | 暖白、浅灰图谱纸、淡青、浅薄荷绿 | 白色 / 浅灰半透明面板、细线分隔、清晰图例 | 轻微显微粒子、结构图层淡入、曲线绘制 |
| `microscope-fluorescence` | 显微荧光暗场 | 分子、细胞、膜运输、神经信号、免疫识别 | 深靛蓝、紫黑、荧光青绿、低亮背景 | 深色半透明面板、微光边缘、荧光焦点提示 | 显微粒子漂移、膜波纹、脉冲信号 |
| `botanical-field` | 植物 / 野外观察台 | 植物生理、生态调查、光合作用、蒸腾 | 叶绿、土壤褐、暖白纸面、自然光 | 标本标签、观察记录卡、自然色按钮 | 光斑、叶脉流动、水分粒子、风动纹理 |
| `medical-clinical` | 医学白底图谱 + 稳态仪表 | 人体系统、循环呼吸、内分泌、免疫、诊断题 | 医学白、浅蓝灰、淡红蓝、洁净表面 | 临床图谱面板、紧凑数值仪表、清晰状态标签 | 血流粒子、心率脉冲、负反馈曲线 |
| `genetics-notebook` | 遗传实验记录本 + 数据网格 | 遗传推算、家系图、DNA 表达、实验设计 | 米白纸面、淡紫、浅蓝、石墨灰网格 | 方格纸、谱系卡、概率条和表格控件 | Punnett 方格填充、比例条增长、DNA 位点高亮 |
| `ecosystem-diorama` | 生态展箱 + 自然能量流 | 食物网、种群曲线、物质循环、生态系统 | 草地绿、天空蓝、水域蓝、土壤褐、暖白 | 地景式面板、节点图例、曲线小窗 | 能量粒子沿食物网流动、种群曲线延迟响应 |

### 风格选择规则

- 默认选择 `bio-atlas-light`，除非内容文件明确更适合显微暗场、野外生态、医学临床、遗传数据或生态展箱。
- 分子 / 细胞、膜运输、神经和免疫章节可优先 `microscope-fluorescence`，但要保证标注和图例可读。
- 植物生理、生态调查、自然环境案例优先 `botanical-field` 或 `ecosystem-diorama`。
- 人体系统、稳态调节、疾病/异常诊断优先 `medical-clinical`。
- 遗传推算、家系图、DNA 表达和实验设计优先 `genetics-notebook`。
- 同一产品可以使用一个全局预设，也可以让章节继承全局预设并按章节主题色轻微变化；不得每页随机换风格导致体验割裂。

### 视觉层级

| 层级 | 内容 | 实现要求 |
|------|------|----------|
| 背景层 | AI 生成的生命科学背景图，风格由 `UI_STYLE_PRESET` 决定 | 固定铺满视口，不能遮挡 UI |
| 调和层 | 中性亮/暗遮罩、轻纸纹或实验台表面层 | 提升前景可读性，不污染结构编码色 |
| 氛围层 | 显微粒子、DNA 螺旋线、脉冲信号、叶脉流、水分粒子、生态能量粒子 | `pointer-events: none`，不得影响操作 |
| 主 UI 层 | 章节、题目、参数面板、图例、按钮 | 高对比度、清晰分组、响应式 |
| 核心可视化层 | SVG 结构图、器官系统、遗传图谱、生态网络、Canvas 粒子 | 判读优先，所有编码有生物含义 |
| 反馈层 | 正误反馈、路径高亮、异常诊断、成就 toast | 不遮挡关键结构，出现后可关闭或自动消退 |

### 背景系统

- 背景图必须由真实生图模型或图像生成 API/工具生成。
- 背景图方向必须来自当前 `UI_STYLE_PRESET` 的画风基底，例如明亮生物图谱、显微荧光暗场、植物野外观察台、医学白底图谱、遗传记录本或生态展箱；不得固定写死为深色生命科学实验室。
- 背景图固定铺满视口：`background-size: cover; background-position: center; background-attachment: fixed`。
- 背景图上方叠加中性调和层：明亮预设可用 `rgba(255,255,255,0.24)`、`rgba(248,250,246,0.18)` 或轻纸纹；深色显微预设可用 `rgba(0,0,0,0.28-0.42)`。
- 调和层不得带强色相，避免污染细胞器、血氧、神经信号、遗传概率和生态节点颜色。
- 核心页面如果背景过于活跃，必须增加浅色或深色工作台底板，保证结构、题目和图例可读。

### 标题设计

- 游戏标题不能只是普通 `<h1>`。
- 标题应使用主题化字体效果：DNA 螺旋切线、显微荧光边缘、细胞膜纹理、脉冲描边、`text-shadow`、`background-clip: text` 等。
- 标题入场动画顺序：背景载入 → 显微粒子/信号线出现 → 主标题上浮淡入 → 副标题淡入 → 按钮出现。
- 标题特效不能导致文字不可读；文字主体必须有稳定基色，特效仅作增强。

### UI 面板风格

- 面板风格由 `UI_STYLE_PRESET` 决定，不默认深色蓝绿实验室。
- `bio-atlas-light` 使用浅色图谱纸面板、细灰线、淡青/薄荷强调和清晰阴影。
- `microscope-fluorescence` 使用深色半透明面板、微光边缘和荧光焦点提示。
- `botanical-field` 使用暖白观察记录卡、标本标签、自然色按钮和轻纸纹。
- `medical-clinical` 使用洁净白/浅蓝灰面板、紧凑数值仪表和临床状态标签。
- `genetics-notebook` 使用方格纸、表格控件、谱系卡和概率条。
- `ecosystem-diorama` 使用自然地景式面板、节点图例和曲线小窗。
- 页面区块不做大面积浮夸卡片堆叠；核心是结构/机制工作台。
- 图例面板、参数面板、题目面板和反馈面板必须视觉区分。
- 卡片圆角 4-8px，保持精密仪器感；儿童科普版本可在内容文件要求下略柔和。
- 所有按钮必须有 hover、active、disabled 和 selected 状态。
- 图例、单位、颜色编码必须清晰，不得为了风格模糊掉结构或变量含义。

### 配色规范

本产品需要多样的生物语义色彩系统。丰富性主要用于结构、机制、曲线、生态网络和实验变量；UI 底色可以明亮或深色，但必须保持克制，避免变成花哨的通用科幻页面。

#### UI 基础色

| 用途 | 方向 | 说明 |
|------|------|------|
| 背景/表面 | 暖白、浅灰图谱纸、淡青、浅薄荷绿、医学白、米白方格纸、自然绿褐；深色显微预设可用深靛蓝、紫黑、炭灰 | 与背景图融合，给结构图留出对比；深色不是默认 |
| 面板分隔 | 低透明冷灰、纸面灰、淡青灰、浅蓝灰、暗紫灰 | 用于边框、分割线、次级容器 |
| 文字/标注 | 深墨绿、炭灰、医学蓝黑、冷白、浅暖白 | 对比度 ≥ 4.5:1；标注不得被彩色结构吞掉 |
| 交互强调 | 荧光青、琥珀、生命绿、珊瑚红、显微紫、医学蓝、生态绿 | 用于按钮、当前章节、可交互提示，不作为随意装饰 |
| 正确/错误 | 清晰绿色 / 温和红色 | 反馈专用，不与生物编码冲突 |

#### 生物专题色板

| 专题 | 色彩方向 | 生物含义 |
|------|----------|----------|
| 细胞结构 | 细胞膜青绿、细胞核紫、线粒体橙、叶绿体绿、内质网蓝、囊泡粉紫 | 细胞器区分、结构定位 |
| 分子/酶促 | 底物蓝、酶紫、产物绿、ATP 金黄、抑制剂红橙 | 反应物、催化、能量和调控 |
| 植物生理 | 叶绿体绿、光照金黄、水分蓝、CO₂ 青、糖类琥珀 | 光合作用、蒸腾、物质运输 |
| 血液/循环 | 动脉红、静脉蓝、血氧亮红、二氧化碳蓝紫、血糖琥珀 | 气体运输、循环状态、稳态变量 |
| 神经信号 | 电信号黄白、突触青、神经元紫蓝、抑制信号蓝灰 | 兴奋传导、突触传递、反馈调节 |
| 免疫 | 病原体红紫、抗体金黄、吞噬细胞青绿、炎症橙 | 识别、攻击、清除、免疫状态 |
| 遗传 | DNA 青紫、显性琥珀、隐性蓝、突变玫红、表型绿 | 基因型/表型、概率、突变 |
| 生态系统 | 生产者绿、消费者橙/褐、分解者紫灰、能量流金黄、物质循环蓝绿 | 食物网、能量流、生态循环 |
| 实验曲线 | 自变量青、因变量黄、对照组灰白、实验组高亮色 | 实验分析、变量比较、曲线判读 |

#### 章节主题色策略

每章可以有自己的主题色，使章节体验有变化，但不能改变生物编码的基础语义。

| 章节方向 | 推荐主题色 | 使用方式 |
|----------|------------|----------|
| 分子与生化反应 | 酶紫 + ATP 金黄 + 底物蓝 | 用于酶促、代谢、能量变化 |
| 细胞结构与运输 | 膜青绿 + 核紫 + 粒子蓝 | 用于细胞剖面、跨膜运输、细胞器 |
| 植物与光合作用 | 叶绿体绿 + 光照金黄 + 水分蓝 | 用于叶片、气孔、光合曲线 |
| 人体系统与稳态 | 医学红蓝 + 仪表青 + 激素琥珀 | 用于血流、气体交换、负反馈 |
| 遗传与发育 | DNA 青紫 + 概率蓝 + 表型绿 | 用于染色体、家系图、Punnett 方格 |
| 生态系统 | 生产者绿 + 能量金 + 消费者橙 | 用于食物网、种群曲线、能量流 |

#### 防止画面变花的约束

- 同一核心可视化中，最多允许 2-3 个强色系同时作为注意力焦点；其余结构必须降低饱和度、透明度或转为灰阶/线框。
- 生物编码色优先级高于 UI 装饰色。按钮、边框、光效不得抢过主结构和关键变量。
- 每种颜色必须能在图例中说明含义，不得出现“只是好看”的结构色块。
- 如果同一页面同时出现血氧、炎症风险、突变和错误反馈，必须使用不同色相、纹理、符号或位置编码，不能全部用红色。
- 正误反馈色只在反馈层短时出现，不得永久改变结构或变量本身的颜色语义。
- 色盲可访问性：关键图层不能只靠红绿区分，必须辅以纹理、线型、符号、数值或标注。

同一画面中，颜色必须先服务生物编码，其次才服务章节气质，最后才服务 UI 氛围。

### 氛围粒子与动效

标题页必须实现生物主题氛围效果：

- 显微粒子：低透明小粒子缓慢漂移。
- DNA 螺旋线：极低透明度螺旋线或轨迹。
- 脉冲信号：短暂光点沿神经/数据线移动。
- 细胞膜波纹：柔和边缘脉动。
- 生态能量流：少量金色粒子沿网络线流动。

粒子约束：

- 数量通常 10-30 个，核心页面可更低。
- 粒子不得遮挡结构、题目、图例或参数读数。
- 必须设置 `pointer-events: none`。
- 必须尊重 `prefers-reduced-motion`：关闭漂移动画或改为静态低透明纹理。

### SVG / Canvas 可视化风格

SVG 是本产品的最高优先级核心资产，不是插图装饰。

#### SVG 必须承担的内容

| 可视化对象 | SVG 要求 |
|------------|----------|
| 细胞剖面 | 细胞膜、细胞核、线粒体、叶绿体、内质网、高尔基体、核糖体、液泡等分层清楚 |
| 细胞膜运输 | 通道蛋白、载体蛋白、主动运输泵、囊泡、浓度梯度、ATP 参与 |
| 分子机制 | 酶-底物结合、DNA → RNA → 蛋白质、信号通路、代谢路径 |
| 组织 / 器官系统 | 呼吸、循环、消化、神经、内分泌、泌尿、免疫等系统结构与流动 |
| 植物结构 | 叶片横切、气孔、维管束、根尖、花结构、蒸腾路径 |
| 遗传图谱 | Punnett 方格、染色体、基因位点、家系图、表型比例条 |
| 生态网络 | 食物链、食物网、能量金字塔、物质循环、种群曲线 |
| 实验图表 | 对照组、实验组、变量、曲线、数据点、误差范围 |
| 题目热区 | 结构点选、异常区域、拖拽锚点、诊断目标，必须有 hover/selected 状态 |

#### SVG 质量硬约束

- 每个知识点至少有一个 SVG 或 SVG + Canvas 混合核心可视化。
- 同一知识点四阶段共用同一可视化，通过 `vis_state` 切换状态。
- 所有 SVG 图层需要有语义化分组，例如 `base-structure`、`organelle-layer`、`molecule-layer`、`flow-layer`、`labels-layer`、`interaction-layer`、`feedback-layer`。
- 关键生命变量必须有可解释的视觉编码：颜色、线宽、透明度、粒子密度、流速、曲线高度、节点大小、箭头方向。
- 结构图必须有图例，图例说明颜色/符号/单位，不得只靠用户猜。
- 标注必须有避让策略：不遮挡关键结构、曲线、题目热区；必要时使用引线和锚点。
- 动态标注平滑移动，不跳变。
- 可交互对象必须有 hover、active、selected、locked、correct、incorrect 状态。
- 结构简化必须服务教学，不能导致结构位置、功能或机制错误。
- 手机端 SVG 必须可缩放、可平移或重排，核心标注不能被裁切。

#### 生物可视化原语速查

本节定义生物场景中常见图形元素的绘制工具和质感方向。开发者根据知识点内容组合使用，不得只画几个彩色圆圈代替生命结构。

| 要画的东西 | 推荐技术 | 为什么 | 关键绘制点 |
|------------|----------|--------|------------|
| 细胞膜 / 双层膜 | SVG path + offset path + gradient + clipPath | 膜结构需要半透明、可开合、可承载通道蛋白 | 双层边界、膜内外区分、流动性纹理、通道嵌入膜上 |
| 细胞器 | SVG symbol/use + radialGradient + filter | 结构可复用，便于标注和状态高亮 | 核、线粒体、叶绿体等形态要可辨；不能全部画成普通圆 |
| 分子/离子粒子 | Canvas 粒子 + SVG 图例 | 数量多、需要随机运动和浓度变化 | 粒子大小/颜色区分物质；速度映射温度或浓度梯度 |
| 蛋白/酶结构 | SVG path + blob 形态 + active-site 标记 | 需要表达结合位点和构象变化 | 活性位点高亮；底物进入/离开路径清楚 |
| 跨膜运输 | SVG 通道/载体 + Canvas 粒子 | 骨架要精确，粒子要连续运动 | 通道开合、载体翻转、主动运输 ATP 消耗必须可见 |
| 血管/气体交换 | SVG 管腔 + clipPath + Canvas 血细胞流 | 需要血管结构和流体动态混合 | 红细胞沿管腔路径运动；氧气/二氧化碳粒子方向明确 |
| 神经元/突触 | SVG path + marker + 脉冲动画 | 神经纤维和信号方向需精确 | 动作电位沿轴突传播；突触递质释放和回收可见 |
| 遗传图谱 | SVG grid/tree + HTML/SVG 表格 | 方格、家系图、比例需要清晰排版 | Punnett 方格对齐；家系符号标准；比例条可读 |
| 生态网络 | SVG nodes/links + force-like layout / fixed layout | 节点、边、能量方向需要可点击 | 节点大小映射数量；箭头表达能量流方向；扰动后边/节点响应 |
| 实验曲线 | SVG axis + path + data points | 曲线判读依赖坐标、单位和趋势 | 自变量/因变量轴清楚；对照组和实验组线型区分 |
| 题目热区 | SVG transparent path + data-id + focus ring | 结构点选/异常诊断需要稳定命中区域 | 热区可略大于可见结构；hover 显示结构名；选中态不破坏原编码色 |
| 参数面板/图例 | HTML/CSS + SVG swatch | DOM 更适合读数、控件和图例 | 每种结构色、粒子、曲线、箭头都有标签和单位 |

#### 生物 SVG/CSS 质感配方

| 视觉对象 | 具体做法 |
|----------|----------|
| 细胞膜 | 用两条半透明曲线路径形成双层膜，中间夹低透明脂质纹理；膜边缘用柔和高光；膜内外区域通过浅色 tint 区分 |
| 细胞核 | `radialGradient` 形成球体感，核膜用双层描边，核仁用较深小圆；染色质可用低透明曲线纹理，不要把核画成纯色圆 |
| 线粒体 | 椭圆外膜 + 内部嵴状曲线；外膜用橙/红褐渐变，嵴用较亮细线；能量输出可用小 ATP 粒子从附近出现 |
| 叶绿体 | 椭圆体 + 类囊体堆叠短线/小圆盘；绿色渐变，光照时局部高亮；产物粒子从叶绿体流出 |
| 内质网/高尔基体 | 使用连续弯曲 path 或多层扁平囊状结构；边缘半透明；囊泡用小圆沿路径移动 |
| 通道蛋白 | 跨膜柱状或门型结构，开合用 transform scale/rotate；打开时粒子按浓度梯度穿过，关闭时粒子被挡住 |
| 载体蛋白 | 两态 path 或 group 切换，表现“朝外结合 → 翻转 → 朝内释放”；主动运输时同步显示 ATP 消耗 |
| 酶-底物 | 酶用不规则 blob path，活性位点用凹槽或高亮缺口；底物形状与位点互补；结合后有轻微吸附/锁定动画 |
| 血管与血流 | 管壁用双层 path，内腔用 clipPath；红细胞用扁椭圆，沿 path 移动时有轻微旋转；血氧高时红色更亮 |
| 神经信号 | 神经纤维用柔和紫蓝线，信号用黄色/白色脉冲沿 path 移动；突触处用粒子从突触前膜释放到突触后膜 |
| 抗体/病原体 | 病原体可用带刺外形但避免恐怖化；抗体用 Y 形 SVG symbol；结合时显示短暂锁定和高亮 |
| DNA/染色体 | DNA 用双螺旋曲线和横向碱基短线；染色体用 X 形或棒状结构，基因位点用小刻度标注；不得只作为背景装饰 |
| 食物网 | 节点用不同形状或颜色区分生产者/消费者/分解者；能量流用箭头线，线宽映射能量量级；扰动节点短时脉冲 |
| 实验曲线 | 对照组使用灰白或虚线，实验组使用主题高亮；数据点小圆可 hover 显示值；趋势变化用 path 插值 |

#### 生物动效模式

- **膜运输**：粒子按浓度梯度随机运动，通道开放时粒子穿过；主动运输粒子可逆浓度梯度移动，但必须同步显示 ATP 消耗。
- **渗透变化**：细胞轮廓通过 scale/path morph 缓慢膨胀或皱缩，水分子粒子方向与渗透压差一致。
- **酶促反应**：底物靠近活性位点、短暂停留、产物分离；温度/pH 改变时碰撞频率和酶构象稳定性同步变化。
- **光合作用**：光粒子进入叶绿体，CO₂ 和水进入，氧气/糖类产物粒子流出；光照强度改变时粒子密度连续变化。
- **血液循环**：红细胞沿血管 path 流动，血氧变化用红色明度和氧粒子数量表达；流速与心率参数联动。
- **神经传导**：电位脉冲沿轴突移动，突触处释放递质粒子；刺激频率升高时脉冲间距变短。
- **免疫清除**：免疫细胞追踪病原体，接触后吞噬或抗体结合；病原体数量曲线同步下降。
- **遗传推算**：Punnett 方格逐格填充，表型比例条平滑增长；不得用随机闪烁代替概率计算。
- **生态扰动**：某节点数量变化后，连接边亮度/宽度和相关种群曲线延迟响应，体现生态网络的连锁变化。
- **参数变化**：连续变量必须插值过渡，曲线、粒子密度、节点大小和数值读数同步更新。

#### 生物标注与图例原则

- 结构名称、功能、变量、单位必须贴近目标结构，并用细引线和小锚点连接。
- 标注不得遮挡膜通道、活性位点、突触、血管交换面、遗传比例、生态关键节点等判读位置。
- 多标注冲突时，优先保留题目相关标注，次要标注折叠为 hover 展开或侧栏列表。
- 图例必须解释结构颜色、粒子类型、箭头方向、曲线线型、节点大小、反馈色和单位。
- 数值和单位使用等宽字体，单位紧跟数值，例如 `37 °C`、`pH 7`、`90 mg/dL`、`75 bpm`。
- 答题阶段可以隐藏答案性标注，但不能隐藏完成判读所需的坐标轴、结构边界、图例、单位和题目条件。

#### 生物交互态视觉暗示

| 状态 | 视觉表现 |
|------|----------|
| hover 结构 | 结构外轮廓加亮，显示名称和功能 tooltip；不得把结构填成反馈色 |
| hover 粒子/路径 | 对应路径短时高亮，粒子速度略降便于观察，tooltip 显示物质名或信号名 |
| dragging 标注/节点 | 显示可吸附锚点、虚线辅助线和当前目标；错误锚点不强吸附 |
| adjusting 参数 | 相关结构、曲线和粒子实时响应，非相关图层降噪 |
| selected 结构 | 使用外环、角标或斜纹表示选择，不直接覆盖原结构色 |
| locked 答题态 | 非题目相关控件降 opacity，核心结构和必要图例保留；cursor 改为 default |
| correct | 反馈层短时绿色描边/路径高亮，并播放正确机制动画 |
| incorrect | 先用温和红色短时标出错误选择，再回到原结构色并演示正确机制 |
| disabled | 控件和图层开关降饱和，保留可读标签，不误导为未加载 |

#### 生物常见画错点

- 细胞膜不能画成普通实心圆；双层膜、内外环境和膜蛋白必须能区分。
- 细胞器不能无层级漂浮；位置、大小和与机制的关系必须服务知识点。
- 线粒体、叶绿体、细胞核不能只靠文字标注区分，形态特征必须可见。
- DNA 螺旋不能只做背景装饰；涉及遗传机制时必须参与信息流或位点标注。
- 主动运输不能画成顺浓度梯度的普通扩散；必须体现能量消耗或逆梯度。
- 酶失活不能画成酶“消失”；应表现构象改变或活性位点失配。
- 血氧、炎症、突变、错误反馈不能全部用同一种红色表达。
- 遗传概率不能用随机动画代替；比例必须由基因型规则计算并可解释。
- 食物网箭头方向必须表达能量流方向，不能画成随意关系线。
- Canvas 粒子不得遮挡结构名、曲线轴、题目热区和关键图例。
- 答题反馈不能永久改写结构原始编码色，否则会破坏后续判读。

#### Canvas 适用范围

Canvas 用于大量粒子或连续场变化：

- 分子随机运动、扩散、渗透。
- 红细胞流动、氧气/二氧化碳运输。
- 神经信号传播、电位波。
- 病原体扩散、免疫细胞追踪和吞噬。
- 生态种群粒子、能量流、物质循环。
- 花粉传播、种子扩散、细胞分裂动画。

SVG 与 Canvas 可以混用：SVG 负责结构、路径、标注、坐标、图例和交互热区；Canvas 负责粒子、流动、扩散和连续动态。

### 动效标准

- UI 过渡时长 200-800ms。
- 章节过渡 1.5-3s，可使用显微镜对焦、细胞缩放、DNA 展开、信号脉冲、生态网络点亮等效果。
- 参数变化必须使用插值过渡，不能硬切换。
- 可视化动画使用 `requestAnimationFrame`，目标 ≥ 30fps。
- 可视化动画应支持暂停/重播。
- 动效必须服务理解、反馈或氛围，不允许无意义闪烁。
- `prefers-reduced-motion` 下关闭装饰性动画，保留核心生命过程演示的必要版本。

## 六、生图策略与资产契约

本产品需要真实位图生图资产，但范围仅限标题页 / 全局背景图。核心生命结构图、机制图、遗传图、器官系统图、生态网络、曲线图、题目热区和实验图表必须由 SVG / Canvas / HTML 实现，不得用 AI 图片、截图或静态位图替代。

### IMAGE_GENERATION_TIMING

```text
IMAGE_GENERATION_TIMING = first-run-cache
```

固定流程：

```text
打开 app
→ 读取 IMAGE_ASSET_MANIFEST
→ IndexedDB cache lookup
→ cache hit：读取 Blob + load/decode
→ cache miss：显示主题化资产准备页，调用真实生图工具/API 生成背景图
→ 将背景图 Blob 写入 IndexedDB
→ load/decode 完成
→ IMAGE_ASSET_RUNTIME_STATE.ready = true
→ 进入标题页 / 核心体验
→ 之后刷新或再次打开只读缓存，不重新生图
```

没有 build-time 例外。除非用户后续明确要求，本项目不预置构建期图片。

### 什么是生图

- 调用真实图像生成模型、图像生成 API、本地模型或受控后端服务，输入提示词，得到真实图像文件。
- 生成结果可以作为 Blob 写入 IndexedDB。
- 页面展示的背景必须来自真实生成图像或 IndexedDB 中缓存的真实图像 Blob。

### 什么不是生图

- CSS 渐变、box-shadow、filter、border-radius 不是生图。
- SVG path、circle、polygon、pattern、filter 不是生图。
- Canvas 代码绘制不是生图。
- Emoji / Unicode 不是生图。
- 文字提示“这里应有背景图”不是生图。
- 风格化占位图不是生图。

### 背景图统一画风基底

背景图画风由 `UI_STYLE_PRESET` 和内容文件主题共同决定。默认预设为 `bio-atlas-light`，实现时必须从下列基底中选择，不得固定使用单一深色实验室 prompt。

```text
STYLE_PROMPT_BASE_BY_PRESET =

bio-atlas-light:
bright biology atlas learning workbench, clean anatomical and cellular diagrams as abstract non-readable panels, soft daylight, pale paper surface, subtle microscope glass textures, precise scientific visualization mood, rich but calm biological color accents, high detail, wide background composition, no people, no readable text

microscope-fluorescence:
dark-field microscopy inspired biology workspace, glowing cellular structures, subtle fluorescent particles, translucent membrane forms, precise life science visualization mood, deep indigo and violet background with cyan-green highlights, high detail, wide background composition, no people, no readable text

botanical-field:
modern botanical field study table, plant physiology diagrams as abstract non-readable sheets, leaf samples, soft natural daylight, green and earth-tone surfaces, water movement and vein pattern atmosphere, scientific but warm, high detail, wide background composition, no people, no readable text

medical-clinical:
clean medical biology atlas workspace, anatomical panels as abstract non-readable displays, clinical white and pale blue surfaces, subtle vital sign curves, precise organ system visualization mood, calm professional lighting, high detail, wide background composition, no people, no readable text

genetics-notebook:
genetics lab notebook workspace, Punnett grid and pedigree inspired abstract non-readable diagrams, DNA strand visual motifs, pale paper, graphite grid lines, soft violet and blue accents, precise data visualization mood, high detail, wide background composition, no people, no readable text

ecosystem-diorama:
ecology learning diorama workspace, miniature ecosystem model, abstract food web and population curve panels with no readable text, natural greens, water blue, soil brown, warm daylight, energy flow atmosphere, high detail, wide background composition, no people, no readable text
```

项目级 negative prompt：

```text
people, readable text, watermark, logo, distorted anatomy, grotesque body horror, inaccurate medical labels, blurry diagrams, low resolution, cartoonish clutter, overexposed, messy composition, one-note dark blue laboratory unless microscope-fluorescence is selected
```

### 静态资产计划：IMAGE_ASSET_MANIFEST

最终实现必须先输出并核对静态 `IMAGE_ASSET_MANIFEST`。它只描述“需要哪些图片、如何生成、缓存键是什么”，不表示当前浏览器中图片已经生成完成。

```json
{
  "asset_manifest_version": "bio-bg-v1",
  "image_generation_timing": "first-run-cache",
  "ui_style_preset": "{{UI_STYLE_PRESET}}",
  "style_prompt_base": "{{SELECTED_STYLE_PROMPT_BASE_FROM_UI_STYLE_PRESET}}",
  "assets": [
    {
      "id": "global_biology_style_bg",
      "purpose": "标题页 / 全局背景图",
      "required": true,
      "plan_status": "required",
      "initial_runtime_status": "pending",
      "ui_style_preset": "{{UI_STYLE_PRESET}}",
      "style_prompt_base": "{{SELECTED_STYLE_PROMPT_BASE_FROM_UI_STYLE_PRESET}}",
      "prompt": "{{SELECTED_STYLE_PROMPT_BASE_FROM_UI_STYLE_PRESET}}, foreground contains abstract biological system visualization panels, cellular or organ or ecosystem motifs matched to the selected preset, clean open space for UI overlays, no readable text, high detail environmental concept art",
      "negative_prompt": "people, readable text, watermark, logo, distorted anatomy, grotesque body horror, inaccurate medical labels, blurry diagrams, low resolution, cartoonish clutter, overexposed, messy composition, one-note dark blue laboratory unless microscope-fluorescence is selected",
      "aspect_ratio": "16:9",
      "generation_timing": "first-run-cache",
      "cache_key": "{{PROJECT_ID}}/bio-bg-v1/{{UI_STYLE_PRESET}}/global_biology_style_bg/{{PROMPT_HASH}}",
      "prompt_hash": "{{PROMPT_HASH}}",
      "seed_source": { "type": "none" },
      "storage_driver": "indexeddb_blob",
      "child_safety_requirement": "must_pass_before_ready"
    }
  ]
}
```

字段要求：

| 字段 | 要求 |
|------|------|
| `id` | 图片唯一 ID |
| `purpose` | 图片用途 |
| `required` | 是否为进入核心体验前必须完成 |
| `plan_status` | 固定为 `required` / `optional`，不得表示已生成 |
| `initial_runtime_status` | `pending` / `seed_available` |
| `ui_style_preset` | 当前背景图绑定的 UI 风格预设 |
| `style_prompt_base` | 项目统一画风基底 |
| `prompt` | 每张图完整正向提示词 |
| `negative_prompt` | 项目级简洁负向提示词 |
| `aspect_ratio` | 目标比例 |
| `generation_timing` | `first-run-cache` |
| `cache_key` | 稳定缓存键 |
| `prompt_hash` | prompt + style base + negative prompt + `ui_style_preset` + manifest version 的版本哈希 |
| `seed_source` | `first-run-cache` 默认 `{ "type": "none" }` |
| `storage_driver` | 固定 `indexeddb_blob` |

静态计划不得把未生成图片写成 `status = "generated"`。

### 运行时资产状态：IMAGE_ASSET_RUNTIME_STATE

运行时必须为每个必需图片维护状态记录：

```json
{
  "asset_id": "global_biology_style_bg",
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

字段要求：

| 字段 | 说明 |
|------|------|
| `asset_id` | 对应 manifest asset ID |
| `cache_key` | 与静态计划一致 |
| `generation_status` | `pending` / `generating` / `generated` / `failed` |
| `cache_status` | `not_checked` / `cache_hit` / `cache_miss` / `cached` / `cache_corrupt` |
| `cached_blob_ref` | IndexedDB 中 Blob 引用信息，不存 object URL |
| `loaded` | 图片是否已被浏览器加载 |
| `decoded` | 是否已完成解码 |
| `ready` | 必须在 generated/cache_hit、loaded、decoded、安全状态通过时才为 true |
| `error` | 失败原因 |

### IndexedDB 缓存记录

```json
{
  "cache_key": "{{CACHE_KEY}}",
  "asset_id": "global_biology_style_bg",
  "asset_manifest_version": "bio-bg-v1",
  "prompt_hash": "{{PROMPT_HASH}}",
  "blob": "{{IMAGE_BLOB}}",
  "mime_type": "image/png",
  "created_at": "{{ISO_TIMESTAMP}}",
  "updated_at": "{{ISO_TIMESTAMP}}",
  "status": "cached",
  "error": null
}
```

要求：

- IndexedDB 必须存 Blob，不得把图片、base64、大 data URL、Blob 字符串或 object URL 放入 localStorage。
- 页面显示时可以用 `URL.createObjectURL(blob)` 创建临时 object URL，但 object URL 不得长期存储。
- `cache_key` 建议由 `project_id + asset_manifest_version + asset_id + prompt_hash` 组成。
- prompt、画风基底、负向提示词、资产清单版本变化时，cache key 必须变化，只重生成失效图片。

### 资产准备页

当缓存缺失时，最终 app 必须显示主题化资产准备页：

- 标题可用“正在准备生命科学视觉资产”或“正在准备 {{UI_STYLE_PRESET}} 背景”。
- 显示已完成数量 / 总数量、当前资产用途、生成状态。
- 资产准备页的临时视觉应匹配当前 UI 风格：明亮预设使用浅色图谱纸、DNA 线稿或结构图层；显微荧光预设可使用深色底和 SVG DNA / 显微粒子临时氛围。不得把临时 CSS/SVG 视觉当作最终背景图。
- 必需图片未 ready 前不得进入标题页或核心体验。
- cache hit 时只显示短暂“正在载入视觉资产”，不得误导用户以为重新生图。

### 生成锁与失败处理

- 必须使用生成锁，优先 `navigator.locks`；不支持时使用 IndexedDB `generation_lock` 记录。
- 多标签页或刷新时，不得对同一 cache key 并发重复调用生图 API。
- 单张失败可重试并显示失败原因。
- 连续失败后停留在资产准备错误页，报告资产 ID、用途、失败原因和已尝试 prompt。
- 如果当前实现环境没有可用生图能力，必须停下并告知用户，不得用 CSS/SVG/Canvas/emoji 冒充背景图。

## 七、功能清单

### P0 功能

| 优先级 | 功能名称 | 解决什么问题 | 输入 | 输出 |
|--------|----------|--------------|------|------|
| P0 | 首次启动背景图缓存 | 需要真实背景图且避免重复生成 | 打开 app | IndexedDB cache hit 或生成并缓存背景图 |
| P0 | 标题页 | 建立沉浸式生命科学入口 | 点击开始/继续 | 进入章节主页 |
| P0 | 章节主页 | 用户需要看到生命尺度路径和解锁进度 | 点击章节 | 进入当前章节或回看已完成章节 |
| P0 | 知识点四阶段闭环 | 保证学、探、答、看在同一生命机制场景中完成 | 点击/调参/答题 | 动态结构图 + 解析 + 进度推进 |
| P0 | 高精度 SVG 生物可视化 | 建立结构识别、机制理解和实验判读能力 | 内容文件填充的知识点与参数 | 结构图、机制路径、曲线、网络、标注 |
| P0 | 参数实验探索 | 用户需要亲手改变生命变量 | 滑块、时间轴、图层开关、基因型选择、节点调节 | SVG/Canvas 实时响应、数值面板同步 |
| P0 | 多题型诊断 | 生物学习需要结构识别、实验分析、遗传推算和机制诊断 | 选择、点选、拖拽、排序、匹配、推算 | 锁定答案、进入反馈演示 |
| P0 | 查看反馈 | 正误都要回到生命机制本身解释 | 作答结果 | 正确机制或错误后果的可视化演示 |
| P0 | 章末总结 | 巩固本章核心结构、变量、机制和误区 | 自动触发 | 知识卡片、机制回顾、成就展示 |
| P0 | 成就系统 | 用鼓励性成就替代冷冰冰分数 | 首次作答、探索行为 | toast、成就墙、章节成就 |
| P0 | 存档续学 | 用户离开后继续 | 自动保存/继续学习 | localStorage 恢复进度 |
| P0 | strict 准确性自检 | 防止结构、机制、实验、遗传和生态错误 | 内容填充结果 | 自检记录和修正要求 |

### P1 功能

| 优先级 | 功能名称 | 解决什么问题 | 输入 | 输出 |
|--------|----------|--------------|------|------|
| P1 | 尺度缩放模式 | 帮助用户理解分子到系统的层级关系 | 缩放/点击层级 | 局部结构与整体系统切换 |
| P1 | 回放与慢放 | 复杂生命过程需要反复观察 | 播放/暂停/慢放 | 时间轴回放 |
| P1 | 错题回看 | 用户需要复盘误区 | 点击错题/章节回看 | 错题场景和正确反馈 |
| P1 | 隐藏标注挑战 | 提升结构识别训练强度 | 切换挑战模式 | 隐藏部分标签后作答 |
| P1 | UI 风格预设切换 | 用户或教师可能需要明亮图谱、显微荧光、植物野外、医学白底、遗传数据或生态展箱等不同视觉气质 | 设置中选择预设 | 页面表面、背景、面板和氛围动效切换；生物编码色不变 |
| P1 | 探索彩蛋 | 奖励好奇心 | 极端但合理参数组合 | 创意成就或额外解释 |

## 八、用户动线

### 首次启动路径

```text
打开 app
→ 读取 IMAGE_ASSET_MANIFEST
→ 检查 IndexedDB 缓存
→ cache miss：资产准备页生成背景图并缓存
→ cache hit：读取 Blob 并解码
→ 背景图 ready
→ 标题页
```

### 核心学习路径

```text
标题页
→ 章节主页
→ 选择当前可进入章节
→ 章节过渡
→ [知识点闭环：结构/机制讲解 → 参数实验探索 → 多题型答题/诊断 → 同场景反馈演示] × 3-4
→ 章末总结 + 成就
→ 返回章节主页并解锁下一章
→ 全部章节完成
→ 通关总结 + 成就墙
```

### 回看路径

```text
标题页 / 章节主页
→ 已完成章节
→ 选择知识点回看
→ 查看讲解、探索、题目反馈
→ 返回章节主页
```

### 答题失败路径

```text
答题 / 诊断
→ 答错
→ 同一 SVG 场景先演示错误判断会导致的机制后果
→ 再演示正确路径或正确结构
→ 温和解析
→ 可重试本题
→ 重试结果不改变首次作答成就判定
```

## 九、信息结构

### 导航结构

```text
资产准备页
└── 背景图缓存 ready → 标题页

标题页
├── 开始学习 → 章节主页
└── 继续学习 → 章节主页（有存档时显示）

章节主页
├── 章节列表
│   ├── 已完成章节 → 回看
│   ├── 当前章节 → 进入学习
│   └── 未解锁章节 → 锁定
├── 总进度
└── 成就入口

章节学习
├── 章节过渡
├── 知识点 1
│   ├── 结构/机制讲解
│   ├── 参数实验探索
│   ├── 多题型答题/诊断
│   └── 同场景反馈演示
├── 知识点 2...
└── 章末总结

通关页
├── 成就墙
├── 各章一句话回顾
├── 关键机制/结构回顾
└── 重新开始 / 回看章节
```

### 页面布局

| 页面/状态 | 核心内容 | 交互方式 |
|-----------|----------|----------|
| 资产准备页 | 主题化生成进度、当前资产用途、错误重试 | 自动生成/重试 |
| 标题页 | AI 背景图、主题标题、开始/继续、氛围粒子 | 点击 |
| 章节主页 | 章节卡、生命尺度、解锁状态、进度、成就入口 | 点击章节 |
| 章节过渡 | 章标题、核心结构/变量预告、显微缩放或信号脉冲动效 | 点击进入 |
| 讲解阶段 | 中央 SVG/Canvas 生命机制场景、同步讲解、图例 | 点击继续/播放 |
| 探索阶段 | 可调参数面板、图层开关、结构/曲线实时响应 | 滑动、拖拽、切换 |
| 答题/诊断阶段 | 锁定场景、题干、多题型交互区 | 选择、点选、拖拽、排序、推算 |
| 反馈演示 | 同场景动态演示、正误高亮、机制解析 | 继续/重试 |
| 章末总结 | 结构卡、机制路径、变量关系、常见误区、成就 | 继续/回看 |
| 通关页 | 成就墙、章节回顾、关键机制回顾 | 回看/重开 |

### 核心工作台布局

桌面端推荐：

```text
左侧：章节/生命尺度进度
中间：SVG/Canvas 生命机制主区域
右侧：参数面板 / 图例 / 图层控制
底部：讲解、题目或反馈面板
```

移动端推荐：

```text
顶部：章节进度
中部：可缩放 SVG/Canvas 主区域
下部：折叠式参数 / 图例 / 题目面板
```

## 十、数据设计

### 存储分层

| 层级 | 内容 | 存储位置 |
|------|------|----------|
| 构建/填充阶段数据 | 从内容文件提取出的章节、知识点、生命结构、机制过程、实验变量、题目、可视化配置 | 内嵌 JSON / JS 常量 |
| 运行时进度数据 | 当前章节、答题记录、成就、回看状态、设置 | localStorage |
| 图片资产静态计划 | `IMAGE_ASSET_MANIFEST` | 内嵌 JSON / JS 常量 |
| 图片运行时状态 | `IMAGE_ASSET_RUNTIME_STATE` | 内存 + 轻量状态记录 |
| 图片 Blob 缓存 | 背景图真实生成结果 | IndexedDB |

localStorage 不得保存图片、base64、大 data URL、Blob 字符串或 object URL。

### 数据关系

| 实体 A | 关系 | 实体 B | 说明 |
|--------|------|--------|------|
| `source_material` | 一对多 | `content_file` | 每个内容文件必须被读取并追踪用途 |
| `chapter` | 一对多 | `knowledge_point` | 每章 3-4 个知识点 |
| `knowledge_point` | 一对一 | `bio_visualization` | 每个知识点绑定一个生命机制场景 |
| `bio_visualization` | 一对多 | `vis_state` | 四阶段共用可视化，以状态切换 |
| `knowledge_point` | 一对少 | `question` | 每个知识点 1-2 道题 |
| `question` | 一对多 | `answer_interaction` | 不同题型有不同交互数据 |
| `chapter` | 一对多 | `achievement` | 每章 3 个成就 |
| `visual_style_preset` | 一对多 | `chapter_theme_palette` | 全局 UI 风格可叠加章节主题色 |
| `image_asset_manifest` | 一对多 | `image_asset_runtime_state` | 静态计划对应运行时状态 |

### meta.json

```json
{
  "subject": "生物",
  "topic": "{{CORE_BIOLOGY_THEME}}",
  "game_title": "{{GAME_NAME}}",
  "game_subtitle": "{{GAME_SUBTITLE}}",
  "title_tagline": "{{TITLE_TAGLINE}}",
  "ui_style_preset": "bio-atlas-light / microscope-fluorescence / botanical-field / medical-clinical / genetics-notebook / ecosystem-diorama",
  "chapter_theme_palette": "{{CHAPTER_THEME_PALETTE}}",
  "difficulty": "基础/进阶/综合",
  "product_delivery": "completed_learning_game",
  "accuracy_mode": "strict",
  "image_generation_timing": "first-run-cache",
  "closing_message": "{{CLOSING_MESSAGE}}"
}
```

### visual_style.json

```json
{
  "selected_ui_style_preset": "{{UI_STYLE_PRESET}}",
  "available_presets": [
    "bio-atlas-light",
    "microscope-fluorescence",
    "botanical-field",
    "medical-clinical",
    "genetics-notebook",
    "ecosystem-diorama"
  ],
  "style_selection_reason": "{{WHY_THIS_PRESET_MATCHES_CONTENT}}",
  "surface_tokens": {
    "page_background": "{{PAGE_BACKGROUND_COLOR}}",
    "panel_background": "{{PANEL_BACKGROUND_COLOR}}",
    "panel_border": "{{PANEL_BORDER_COLOR}}",
    "text_primary": "{{TEXT_PRIMARY_COLOR}}",
    "text_secondary": "{{TEXT_SECONDARY_COLOR}}",
    "interactive_accent": "{{INTERACTIVE_ACCENT_COLOR}}"
  },
  "chapter_theme_palettes": [
    {
      "chapter_id": "ch1",
      "scale": "{{BIOLOGICAL_SCALE}}",
      "theme": "{{CHAPTER_THEME}}",
      "accent_colors": ["{{ACCENT_COLOR}}"],
      "bio_semantic_palette_overrides": "{{ONLY_IF_BIOLOGICAL_MEANING_REQUIRES_IT}}"
    }
  ],
  "constraints": [
    "biological semantic colors override decorative UI colors",
    "deep fluorescent dominance is allowed only when microscope-fluorescence is selected",
    "all structure colors, curve colors, particles, arrows, and node sizes must be explained by legend or labels"
  ]
}
```

### source_material.json

```json
{
  "content_files": [
    {
      "path": "{{CONTENT_FILE_PATH}}",
      "covered_module": "{{COVERED_MODULE}}",
      "read_full_text": true,
      "usage_in_product": "{{USAGE_IN_PRODUCT}}",
      "traceable_items": ["{{TRACEABLE_ITEM_ID}}"]
    }
  ],
  "extraction_summary": {
    "life_structures": ["{{LIFE_STRUCTURE}}"],
    "mechanisms": ["{{BIO_MECHANISM}}"],
    "rules": ["{{BIO_RULE}}"],
    "experiments": ["{{EXPERIMENT_ITEM}}"],
    "data_series": ["{{DATA_SERIES}}"],
    "case_contexts": ["{{CASE_CONTEXT}}"]
  }
}
```

### chapters.json

```json
{
  "chapters": [
    {
      "id": "ch1",
      "title": "{{CHAPTER_TITLE}}",
      "subtitle": "{{CHAPTER_SUBTITLE}}",
      "scale": "molecule / cell / tissue / organ_system / organism / genetics / ecology",
      "concept_preview": "{{CONCEPT_PREVIEW}}",
      "source_refs": ["{{CONTENT_FILE_PATH}}#{{SECTION_OR_ANCHOR}}"],
      "knowledge_points": [
        {
          "id": "ch1_kp1",
          "title": "{{KNOWLEDGE_POINT_TITLE}}",
          "core_concept": "{{CORE_CONCEPT}}",
          "accuracy_requirements": ["{{ACCURACY_REQUIREMENT}}"],
          "bio_visualization": {
            "id": "vis_ch1_kp1",
            "type": "svg 或 svg_canvas_hybrid",
            "perspective": "2d / cutaway / network / chart / pseudo_3d",
            "description": "{{VISUALIZATION_DESCRIPTION}}",
            "svg_layers": [
              {
                "id": "base-structure",
                "purpose": "基础结构轮廓",
                "required": true,
                "encoding": "{{BASE_STRUCTURE_ENCODING}}"
              },
              {
                "id": "molecule-layer",
                "purpose": "分子 / 物质 / 信号",
                "required": false,
                "encoding": "{{MOLECULE_ENCODING}}"
              },
              {
                "id": "flow-layer",
                "purpose": "血流 / 气体 / 能量 / 物质流",
                "required": false,
                "encoding": "{{FLOW_ENCODING}}"
              },
              {
                "id": "interaction-layer",
                "purpose": "点选 / 拖拽 / 诊断热区",
                "required": true,
                "encoding": "{{INTERACTION_ENCODING}}"
              },
              {
                "id": "labels-layer",
                "purpose": "结构名 / 变量 / 单位 / 图例",
                "required": true,
                "encoding": "{{LABEL_RULE}}"
              },
              {
                "id": "feedback-layer",
                "purpose": "正误高亮 / 机制反馈",
                "required": true,
                "encoding": "{{FEEDBACK_ENCODING}}"
              }
            ],
            "canvas_layers": [
              {
                "id": "particle-field",
                "purpose": "分子扩散 / 血流 / 信号 / 病原体 / 能量流等连续粒子",
                "required": false,
                "performance_target": ">=30fps"
              }
            ],
            "key_elements": ["{{KEY_BIO_ELEMENT}}"],
            "legend_items": [
              {
                "id": "{{LEGEND_ITEM_ID}}",
                "label": "{{LEGEND_LABEL}}",
                "unit": "{{UNIT}}",
                "visual_encoding": "{{VISUAL_ENCODING}}"
              }
            ],
            "interactive_params": [
              {
                "name": "{{PARAM_NAME}}",
                "label": "{{PARAM_LABEL}}",
                "type": "slider / toggle / drag_point / timeline / genotype_picker / network_node / layer_switch",
                "min": 0,
                "max": 100,
                "default": 50,
                "unit": "{{UNIT}}",
                "validity_rule": "{{BIOLOGICAL_VALIDITY_RULE}}"
              }
            ],
            "response_description": "{{HOW_VISUALIZATION_RESPONDS_TO_PARAMS}}",
            "creative_trigger": "{{EXPLORE_TRIGGER_FOR_CREATIVE_ACHIEVEMENT}}"
          },
          "phases": {
            "explain": [
              {
                "text": "{{EXPLAIN_TEXT_60_120_CHARS}}",
                "vis_state": "{{EXPLAIN_VIS_STATE}}"
              }
            ],
            "explore": {
              "guide_text": "{{EXPLORE_GUIDE_TEXT}}",
              "vis_state": "{{OPEN_INTERACTION_VIS_STATE}}"
            },
            "questions": [
              {
                "id": "q_ch1_kp1_1",
                "type": "single_choice / structure_point_select / drag_label / process_order / mechanism_match / curve_reading / genetics_calculation / ecology_network_prediction / anomaly_diagnosis",
                "text": "{{QUESTION_TEXT}}",
                "vis_state": "{{QUESTION_LOCKED_VIS_STATE}}",
                "answer_schema": "{{ANSWER_SCHEMA_BY_TYPE}}",
                "options": [
                  {
                    "id": "a",
                    "text": "{{OPTION_TEXT}}",
                    "is_correct": true,
                    "common_misconception": "{{MISCONCEPTION_IF_FALSE}}",
                    "feedback": "{{FEEDBACK_TEXT}}",
                    "feedback_vis_state": "{{FEEDBACK_VIS_STATE}}"
                  }
                ],
                "source_ref": "{{CONTENT_FILE_PATH}}#{{SECTION_OR_ANCHOR}}"
              }
            ]
          }
        }
      ],
      "summary": {
        "title": "{{SUMMARY_TITLE}}",
        "core_structures": ["{{CORE_STRUCTURE}}"],
        "core_variables": ["{{CORE_VARIABLE}}"],
        "mechanism_paths": ["{{MECHANISM_PATH}}"],
        "common_misconceptions": ["{{COMMON_MISCONCEPTION}}"],
        "key_points": ["{{KEY_POINT}}"],
        "insight": "{{CHAPTER_INSIGHT}}"
      }
    }
  ]
}
```

### achievements.json

```json
{
  "achievements": [
    {
      "id": "ach_ch1_perfect",
      "type": "perfect",
      "chapter": "ch1",
      "name": "{{PERFECT_ACHIEVEMENT_NAME}}",
      "description": "{{PERFECT_ACHIEVEMENT_DESCRIPTION}}",
      "unlock_condition": { "type": "all_correct", "chapter": "ch1" }
    },
    {
      "id": "ach_ch1_fail",
      "type": "fail",
      "chapter": "ch1",
      "name": "{{FAIL_ACHIEVEMENT_NAME}}",
      "description": "{{GENTLE_FAIL_DESCRIPTION}}",
      "unlock_condition": { "type": "all_wrong", "chapter": "ch1" }
    },
    {
      "id": "ach_ch1_creative",
      "type": "creative",
      "chapter": "ch1",
      "name": "{{CREATIVE_ACHIEVEMENT_NAME}}",
      "description": "{{CREATIVE_ACHIEVEMENT_DESCRIPTION}}",
      "unlock_condition": {
        "type": "explore_trigger",
        "knowledge_point": "ch1_kp1",
        "trigger": "{{CREATIVE_TRIGGER}}"
      }
    }
  ]
}
```

### runtime_progress.json

```json
{
  "current_chapter": "ch1",
  "current_knowledge_point": "ch1_kp1",
  "phase": "explain / explore / question / feedback / summary",
  "completed_chapters": [],
  "first_answers": {
    "q_ch1_kp1_1": {
      "answered": true,
      "is_correct": false,
      "answer_payload": "{{ANSWER_PAYLOAD}}",
      "answered_at": "{{ISO_TIMESTAMP}}"
    }
  },
  "unlocked_achievements": [],
  "settings": {
    "reduced_motion": false,
    "show_labels": true,
    "ui_style_preset": "{{CURRENT_UI_STYLE_PRESET}}"
  }
}
```

## 十一、交互设计

### 操作映射

| 操作 | 实现方案 | 状态变化 |
|------|----------|----------|
| 开始学习 | 点击标题页按钮 | 进入章节主页 |
| 进入章节 | 点击当前解锁章节 | 播放章节过渡 |
| 推进讲解 | 点击继续或动画播放完成后自动显示按钮 | 进入下一讲解段或探索阶段 |
| 调整浓度、pH、光照、心率等参数 | 滑块、双向滑块、时间轴、节点调节 | 可视化实时响应，不改变答题状态 |
| 切换图层 | 图层开关或标签页 | 结构/机制图层显示隐藏，图例同步更新 |
| 结构点选 | 点击 SVG 热区 | 记录选择，显示选中态 |
| 拖拽标注 | 拖动标签到锚点 | 吸附、错位提示、提交后判定 |
| 过程排序 | 拖拽阶段卡片或时间轴节点 | 记录顺序 |
| 机制匹配 | 拖拽或点击连线 | 记录配对关系 |
| 遗传推算 | 选择亲本基因型、填充比例或选择结果 | 记录推算结果 |
| 异常诊断 | 选择异常结构、变量或机制原因 | 记录诊断路径 |
| 答题提交 | 点击提交或完成操作后自动提交 | 锁定答案，进入反馈 |
| 答错重试 | 点击重试 | 保留首次答案记录，回到题目 |
| 存档 | 每次状态变化自动保存 | 写入 localStorage |

### 交互反馈

| 状态 | 反馈要求 |
|------|----------|
| hover 结构热区 | 细描边、低透明填充、浮动标签；不得遮挡邻近结构 |
| selected 结构热区 | 明确高亮并保持图例可读 |
| 参数拖动中 | 对应结构、曲线、粒子或网络实时更新；数值面板平滑变化 |
| 参数超出有效范围 | 控件限制或显示生物合理性说明 |
| 答对 | 正确结构/路径高亮，关键机制播放，成功色反馈 |
| 答错 | 错误路径短暂演示，再切回正确机制；文案温和 |
| 成就解锁 | toast 从顶部或侧边出现，3s 后消退，可在成就墙查看 |
| 图层加载/切换 | 200-500ms 淡入，避免瞬切 |
| 动画暂停 | 显示暂停态和当前变量读数 |

### 多题型交互细则

| 题型 | 交互细则 | 判定方式 |
|------|----------|----------|
| 3 选 1 | 三个选项固定，正确答案仅 1 个 | `selected_option_id === correct_option_id` |
| 结构点选 | SVG 热区有唯一或多个正确结构 | 点击结构 ID 与答案集合匹配 |
| 拖拽标注 | 标签吸附到锚点，提交后判定 | label-anchor 映射全部或部分正确 |
| 过程排序 | 拖拽阶段卡片排序 | 序列完全一致或按局部得分 |
| 机制匹配 | 结构-功能、变量-结果、激素-作用等配对 | 配对关系与答案表一致 |
| 曲线判读 | 用户判断曲线峰值、趋势、变量关系或实验结论 | 选项或多字段判定 |
| 遗传推算 | 用户给出表型比例、基因型概率或家系判断 | 概率/比例/关系与答案一致 |
| 生态网络预测 | 调整节点后预测种群、能量流或稳定性变化 | 预测方向或范围与模拟结果一致 |
| 异常诊断 | 根据异常现象判断结构、变量或调节环节 | 诊断目标和原因链匹配 |

## 十二、核心机制约束

### 产品形态约束

- 读取内容文件、提取知识、生成章节、编制题目、生成背景图资产计划属于构建或资产准备流程。
- 最终用户体验从已完成产品入口开始，不能把上传文件、输入内容、生成产品作为最终用户主流程。
- 背景图首次启动生成是视觉资产准备流程，不是用户可操作的生成器玩法。

### 设计粒度约束

- 本 spec 是“可填充玩法框架”，不是单个写死的生物章节实例。
- 具体章节名、知识点、结构图、实验变量、题目、图例、成就名和解析由 `skills/内容文件` 填充。
- 本 spec 负责定义内容如何提取、映射、组织、交互、表现和验收。

### UI 风格预设约束

- 最终实现必须选择并记录 `UI_STYLE_PRESET`，默认使用 `bio-atlas-light`。
- `UI_STYLE_PRESET` 只控制页面表面、背景图方向、面板质感、标题氛围和装饰动效；不得改变生物结构、机制变量、实验曲线、遗传概率或生态关系的含义。
- 如果实现运行时风格切换，切换只影响 UI token、背景资产和装饰氛围；题目答案、结构图层、参数规则和机制反馈不得变化。
- 深色显微荧光风只能作为 `microscope-fluorescence` 的明确选择，不得让所有风格都退化成同一套深蓝实验室界面。

### strict 准确性约束

必须严格正确：

- 结构名称、结构位置、结构功能。
- 细胞器、组织、器官和系统之间的结构-功能关系。
- 代谢路径、生理调节、稳态反馈、免疫反应、神经传导等机制。
- 实验变量、对照组、曲线趋势、实验结论。
- 遗传概率、基因型/表型关系、家系图判断。
- 生态关系、能量流、物质循环、种群变化。
- 参数范围和单位。

不得：

- 虚构真实实验结论。
- 将示意性动画当作精确数据而不说明。
- 为视觉效果改变生命机制。
- 用随机干扰项替代真实常见误区。
- 让 AI 图片替代可验证的生物结构图或机制图。

### 内容文件映射约束

- 每章必须能追踪到至少一个内容文件来源。
- 每个知识点必须包含 `source_ref`。
- 每道题必须明确来源依据或可核验规则。
- 内容文件提取时优先抽取结构、功能、过程、规则、实验变量、数据、可操作变量和可验证结论。

### 知识点四阶段闭环规则

每个知识点必须走完：

1. 讲解：同一可视化按预设 `vis_state` 演示。
2. 探索：开放参数，用户观察变化。
3. 答题/诊断：锁定场景或隐藏标注，完成生命机制判断。
4. 反馈：同一场景演示正确过程和误区。

禁止每个阶段各造一个不相关图。

### 高精度 SVG 约束

- 结构图、机制图、曲线图、遗传图和生态网络必须可维护、可交互、可缩放。
- 图层、图例、标注、热区必须分层组织。
- 颜色、线宽、透明度、箭头、粒子密度、曲线、节点大小都有明确生物含义。
- 题目不能让用户在无法辨认的结构图上猜答案。
- 结构简化必须服务教学，不能导致结构位置、功能或机制错误。

### 成就系统规则

每章 3 个成就：

| 类型 | 触发条件 | 风格 |
|------|----------|------|
| 全对成就 | 本章所有题首次答对 | 研究员/诊断师/观察员风格 |
| 全错成就 | 本章所有题首次答错 | 轻微调侃但不伤人 |
| 创意成就 | 探索阶段触发特殊但合理参数组合 | 奖励好奇心 |

规则：

- 成就名 6 字以内优先，描述 30-50 字。
- 全对/全错基于首次作答。
- 重试不重复触发成就。
- 创意成就由生物内容决定，例如把 pH 调到极端导致酶活性骤降、让食物网失衡、让血糖反馈系统出现异常波动。
- 不显示分数、百分比或等级。

## 十三、内容 / 章节概览

### 默认章节结构

实际章节由内容文件决定。若内容文件没有明确结构，可使用以下生命尺度递进：

| 章 | 章节方向 | 核心可视化 | 典型参数 |
|----|----------|------------|----------|
| 1 | 分子与生化反应 | 酶促反应、代谢路径、分子碰撞 | 温度、pH、底物浓度、酶浓度 |
| 2 | 细胞结构与运输 | 细胞剖面、细胞膜运输、细胞器协同 | 浓度、膜通透性、ATP、通道蛋白 |
| 3 | 植物生理与能量转换 | 光合作用、蒸腾、物质运输 | 光照、CO₂、水分、气孔开度 |
| 4 | 人体系统与稳态 | 呼吸、循环、血糖、体温、内分泌 | 心率、血氧、血糖、激素水平 |
| 5 | 遗传与发育 | DNA、染色体、家系图、Punnett 方格 | 基因型、显隐性、突变率、样本量 |
| 6 | 免疫 / 神经 / 调节专题 | 信号传递、免疫应答、反馈调节 | 刺激强度、病原体数量、抗体、神经信号 |
| 7 | 生态系统与综合生命系统 | 食物网、能量流、物质循环、种群曲线 | 种群数量、资源量、捕食压力、环境变化 |

### 生物可视化场景速查

#### 分子与生化

- 酶促反应：酶-底物结合、活性位点、温度/pH 对速率影响。
- 扩散与渗透：浓度梯度、半透膜、水分子移动、细胞体积变化。
- 代谢路径：反应物、中间产物、ATP、反馈抑制。

#### 细胞结构

- 动植物细胞对比：细胞壁、叶绿体、液泡、中心体等差异。
- 细胞器协同：核糖体、内质网、高尔基体、囊泡、细胞膜分泌路径。
- 跨膜运输：自由扩散、协助扩散、主动运输、胞吞胞吐。

#### 植物生理

- 光合作用：光照、CO₂、水分、叶绿体、产氧量、糖类生成。
- 蒸腾作用：气孔开度、温度、湿度、运输路径。
- 维管束运输：导管、筛管、水分与有机物方向。

#### 人体系统与稳态

- 呼吸与循环：肺泡气体交换、血红蛋白、血氧变化。
- 血糖调节：胰岛素、胰高血糖素、负反馈曲线。
- 体温调节：产热、散热、汗腺、血管舒缩。
- 消化吸收：酶、营养物质、吸收路径。

#### 神经与免疫

- 神经传导：动作电位、突触、递质、兴奋/抑制。
- 免疫应答：病原体识别、吞噬、抗体、记忆细胞。
- 疫苗原理：抗原呈递、免疫记忆、二次应答曲线。

#### 遗传与发育

- Punnett 方格：亲本基因型、子代表型比例。
- 家系图：显性/隐性、伴性遗传、携带者判断。
- DNA 表达：转录、翻译、蛋白质合成。
- 突变：碱基变化、蛋白质影响、表型变化。

#### 生态系统

- 食物链/食物网：生产者、消费者、分解者。
- 能量流：能量逐级递减、生态金字塔。
- 物质循环：碳循环、氮循环、水循环。
- 种群变化：捕食-被捕食、资源限制、环境扰动。

### 每章内容规模

- 每章 3-4 个知识点。
- 每个知识点 1 个核心可视化。
- 每个知识点 1 道主问题，复杂知识点可 2 道。
- 每章 1 个总结。
- 每章 3 个成就。
- 全书总题量 20-25 题。

## 十四、技术约束

| 维度 | 约束 |
|------|------|
| 技术栈 | 单文件 HTML + CSS + JavaScript + 内嵌 SVG/Canvas |
| 部署方式 | 静态文件，可直接打开 |
| 外部依赖 | 默认零依赖；如使用字体 CDN 必须有 fallback |
| 生图调用 | 首次启动通过安全后端、本地代理、本地模型或用户配置的安全接口调用；前端不得硬编码私密 API key |
| 图片缓存 | IndexedDB Blob |
| 进度缓存 | localStorage 仅存轻量进度 |
| 性能 | 首屏 UI < 2s；核心动画 ≥ 30fps；SVG 操作不卡顿 |
| 响应式 | 桌面、平板、手机可用；移动端核心可视化可缩放 |
| 无障碍 | 键盘可操作主要按钮；颜色编码配合文字/图例；减少动画模式可用 |
| 数据安全 | 不在前端写入私密 API key；不把内容文件路径或调试信息暴露成用户必须理解的界面 |

### SVG 性能约束

- 复杂结构图应合理分层，避免单个 SVG 节点过多导致卡顿。
- 动态变化优先更新 transform、opacity、stroke-dashoffset、path 参数或少量数据点，不要全量重建 DOM。
- 大量粒子使用 Canvas，不用数百个 SVG circle 硬撑。
- 图层开关应改变 group 可见性，避免销毁重建。
- 移动端可降低非核心粒子密度，但不得删除核心结构信息。

## 十五、开发指引

收到本 spec 后，下一步实现模型必须按以下顺序执行：

1. 读取本 spec 全文，确认最终用户体验是已完成内容填充的生物互动学习游戏。
2. 读取所有 `skills/内容文件` 的完整正文，建立 `source_material.json`。
3. 从内容文件中提取生命结构、功能关系、机制过程、生物规则、实验变量、数据、题目依据和可验证结论。
4. 根据内容递进生成 5-7 章，每章 3-4 个知识点。
5. 根据内容文件、目标用户和章节尺度选择 `UI_STYLE_PRESET`，默认 `bio-atlas-light`；如选择 `microscope-fluorescence`，必须说明为何需要深色显微荧光氛围。
6. 为每个知识点设计一个可复用的 SVG 或 SVG + Canvas 生命机制可视化场景。
7. 为每个可视化定义图层、图例、参数、状态、题型和反馈演示。
8. 先建立 `IMAGE_ASSET_MANIFEST`，按 `UI_STYLE_PRESET` 为全局背景图写完整 prompt、negative prompt、cache key 和 prompt hash。
9. 实现首次启动图片缓存流程：查 IndexedDB，cache miss 时调用真实生图能力，写入 Blob，cache hit 不调用生图。
10. 实现标题页、章节主页、章节过渡、知识点四阶段闭环、章末总结和通关成就墙。
11. 实现多题型：3 选 1、结构点选、拖拽标注、过程排序、机制匹配、曲线判读、遗传推算、生态网络预测、异常诊断。
12. 实现 localStorage 进度与 IndexedDB 图片缓存，严格区分两者。
13. 对每章执行 strict 准确性自检，修正结构、机制、实验、遗传、生态、单位和题目错误。
14. 对 SVG/CSS 绘制指南执行专项自检，确认生物可视化原语、质感配方、动效模式、标注/图例、交互态、常见画错点均已落实。
15. 对照验收标准全量自测。

### 开发时禁止

- 禁止只读内容文件摘要后自行编造章节。
- 禁止用静态图片代替核心 SVG/Canvas 生物可视化。
- 禁止把 CSS/SVG/Canvas 背景冒充为 AI 生图背景。
- 禁止在前端硬编码私密模型/API key。
- 禁止用纯文字“正确/错误”代替反馈演示。
- 禁止为了节省实现跳过探索阶段或多题型。
- 禁止把所有 UI 风格都做成同一套深蓝 / 蓝绿生命科学实验室界面。

## 十六、验收标准

### 功能验收

| 功能 | 验收条件 | 自测结果 |
|------|----------|----------|
| 资产准备 | 首次缺图时显示主题化资产准备页，生成背景图并写入 IndexedDB | [ ] 通过 |
| 缓存复用 | 刷新或再次打开时 cache hit 只读缓存，不重新调用生图 API | [ ] 通过 |
| 标题页 | 真实生成背景图、主题标题、开始/继续按钮、氛围粒子完整 | [ ] 通过 |
| 章节主页 | 显示章节解锁状态、生命尺度、进度、已完成回看 | [ ] 通过 |
| 四阶段闭环 | 每个知识点包含讲解、探索、答题/诊断、反馈 | [ ] 通过 |
| 参数实验 | 参数变化实时影响结构、曲线、粒子或网络状态 | [ ] 通过 |
| 多题型 | 至少实现 3 选 1、结构点选、拖拽标注、过程排序、机制匹配、曲线判读、遗传推算、生态网络预测、异常诊断中的多种题型 | [ ] 通过 |
| 反馈演示 | 答对答错都回到同一生命机制场景演示 | [ ] 通过 |
| 章末总结 | 展示核心结构、变量、机制路径、常见误区和成就 | [ ] 通过 |
| 成就系统 | 每章 3 个成就，触发逻辑正确，toast 与成就墙可用 | [ ] 通过 |
| 存档续学 | localStorage 恢复章节、题目、成就和设置 | [ ] 通过 |

### 随附内容文件验收

- [ ] 已读取每个内容文件完整正文。
- [ ] 每章有内容文件来源追踪。
- [ ] 每个知识点有 `source_ref`。
- [ ] 每道题的答案和解析可追溯到内容文件或可核验生物知识。
- [ ] 没有只凭文件名、索引、摘要生成核心内容。
- [ ] 内容槽位可被不同生物主题复用。

### 生图验收

- [ ] 背景图由真实生图模型/API/工具生成。
- [ ] CSS 渐变、SVG、Canvas、emoji、文字占位没有被当作生图。
- [ ] `IMAGE_ASSET_MANIFEST` 包含 asset id、purpose、required、plan_status、`ui_style_preset`、style prompt base、full prompt、negative prompt、aspect ratio、generation timing、prompt hash、cache key、seed source、storage driver。
- [ ] 背景图 prompt 与 `UI_STYLE_PRESET` 匹配，不把未选择显微荧光预设的产品生成成单一深蓝实验室背景。
- [ ] `IMAGE_ASSET_RUNTIME_STATE` 维护 generation_status、cache_status、cached_blob_ref、loaded、decoded、ready 和 error。
- [ ] IndexedDB 缓存记录包含 Blob、cache_key、asset_id、prompt_hash、manifest version、时间戳、状态和错误。
- [ ] 必需背景图 `ready = true` 前不得进入标题页。
- [ ] 无法生图时停下报告，不交付伪完成品。

### 首次启动图片缓存验收

- [ ] 首次缺图时显示资产准备页。
- [ ] 只生成 cache miss 图片。
- [ ] 生成后图片 Blob 写入 IndexedDB。
- [ ] 刷新或再次进入 cache hit 时不调用生图 API。
- [ ] prompt、negative prompt、style base 或 manifest version 变化时只重生成失效图片。
- [ ] 使用生成锁避免并发重复生成。
- [ ] 必需图片 loaded、decoded 且 ready 后才进入核心体验。

### SVG / Canvas 可视化验收

- [ ] 每个知识点至少有一个核心 SVG 或 SVG + Canvas 混合可视化。
- [ ] 四阶段共用同一可视化，通过 `vis_state` 切换。
- [ ] SVG 有语义化图层：基础结构、分子、流动、标注、交互、反馈等。
- [ ] 已按“生物可视化原语速查”选择 SVG / Canvas / HTML/CSS 分工，不是用普通圆形堆出结构图。
- [ ] 已落实生物 SVG/CSS 质感配方：细胞膜、细胞器、通道蛋白、酶-底物、血流、神经信号、遗传图谱、生态网络等有具体画法。
- [ ] 细胞膜、细胞器、主动运输、酶活性、血氧、遗传概率、食物网等关键对象避免本 spec 列出的常见画错点。
- [ ] 结构图/机制图/曲线图/遗传图/生态网络有图例、单位、方向或流程提示。
- [ ] 颜色、线宽、透明度、箭头、粒子密度、曲线、节点大小都有明确生物含义。
- [ ] 参数变化实时更新可视化和数值面板。
- [ ] 标注不遮挡关键结构，有避让或引线。
- [ ] 结构热区 hover/selected/correct/incorrect 状态完整。
- [ ] Canvas 粒子或流动动画流畅，目标 ≥ 30fps。
- [ ] 手机端核心可视化可缩放或重排，不裁切关键标注。

### 视觉验收

- [ ] 背景图铺满视口，遮罩不遮挡前景。
- [ ] UI 气质符合已选择的 `UI_STYLE_PRESET`；默认应呈现明亮生物图谱 / 结构机制工作台气质，而不是强制深色实验室。
- [ ] 至少保留 `bio-atlas-light`、`microscope-fluorescence`、`botanical-field`、`medical-clinical`、`genetics-notebook`、`ecosystem-diorama` 六套风格预设说明或 token。
- [ ] 深色显微荧光风只在 `microscope-fluorescence` 被选择时作为主导风格。
- [ ] 标题有主题化字体效果，不是普通 h1。
- [ ] 面板、按钮、图例、参数控件有清晰层级和状态。
- [ ] 粒子不遮挡内容、不拦截点击。
- [ ] `prefers-reduced-motion` 下装饰动画减少，核心学习仍可完成。
- [ ] 文字对比度达标。
- [ ] 生物编码色彩不被氛围色污染。

### 交互验收

- [ ] 所有按钮有 hover、active、disabled 状态。
- [ ] 屏幕切换有过渡，不瞬切。
- [ ] 滑块、拖拽、图层切换流畅。
- [ ] 点选/拖拽标注/排序/匹配/推算/诊断题型可完整提交和反馈。
- [ ] 答错后可重试，但首次答案记录不被覆盖。
- [ ] 成就 toast 不遮挡关键结构或题目区域。

### 数据验收

- [ ] JSON 语法合法。
- [ ] 所有 ID 引用一致。
- [ ] `source_ref`、章节、知识点、题目、成就、可视化之间关系完整。
- [ ] `visual_style.json` 记录已选择的 `UI_STYLE_PRESET`、可用预设、surface tokens 和章节主题色。
- [ ] localStorage 只保存轻量进度。
- [ ] IndexedDB 保存图片 Blob。
- [ ] object URL 不长期存储。
- [ ] 图片 cache key 和 prompt hash 可稳定复现。

### 响应式验收

- [ ] 桌面端 ≥1024px 布局正常。
- [ ] 平板端 768px 参数面板和主可视化协调。
- [ ] 手机端 ≤480px 核心学习、答题、反馈可完成。
- [ ] 移动端图例、题目、参数面板不遮挡主图。
- [ ] SVG 可缩放、可平移或重排。

### 准确性 / 一致性验收

- [ ] 结构名称、结构位置、结构功能无错误。
- [ ] 代谢路径、生理调节、神经传导、免疫反应等机制正确。
- [ ] 实验变量、对照组、曲线趋势和结论正确。
- [ ] 遗传概率、基因型/表型关系、家系图判断正确。
- [ ] 生态关系、能量流、物质循环、种群变化合理。
- [ ] 图表数据、单位、比例和图例一致。
- [ ] 题目正确答案唯一或按题型规则明确。
- [ ] 错误选项对应真实常见误区。
- [ ] 反馈解析严谨、温和、可验证。
- [ ] 没有虚构核心生物知识、真实实验结论或遗传/生态规律。

### 产品形态验收

- [ ] 最终用户动线从已完成产品开始。
- [ ] 没有把上传文件、输入内容、生成产品写成最终用户主流程。
- [ ] 内容提取和填充属于开发指引、内容文件契约和验收标准。
- [ ] 背景图首次启动生图被写成视觉资产准备流程，而不是生成器玩法。

### 设计粒度验收

- [ ] 产品概览声明 `设计粒度 = 可填充玩法框架`。
- [ ] spec 主要定义玩法结构、内容槽位、映射规则、数据 Schema 和约束。
- [ ] 具体章节、结构、实验变量、题目、参数值、成就名可由 `skills/内容文件` 填充。
- [ ] 本 spec 可用于不同生物内容，而不是只服务单个固定章节。

### 未完成判定

以下任一项不通过，则判定最终实现未完成：

- [ ] 背景图不是由真实生图能力生成。
- [ ] 必需背景图未 ready 就进入标题页。
- [ ] 核心生物可视化被静态图片或纯文字替代。
- [ ] 知识点没有四阶段闭环。
- [ ] SVG 没有图层、图例、标注和可交互状态。
- [ ] 生物 SVG/CSS 绘制没有落实原语速查、质感配方、动效模式和常见画错点约束。
- [ ] 题目脱离生命机制可视化。
- [ ] 答题反馈没有动态演示。
- [ ] strict 准确性自检发现核心生物错误仍未修正。
- [ ] 未读取完整内容文件就生成核心内容。
