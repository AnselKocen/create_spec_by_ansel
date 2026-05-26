# 地理互动模拟学习游戏 spec

## 一、产品概览

| 维度 | 值 |
|------|-----|
| 产品名称 | {{GAME_NAME}} |
| 来源素材 | {{BOOK_NAME}} |
| 设计粒度 | 可填充玩法框架 |
| 玩法结构 | 地貌 / 气候参数模拟 + 多题型反馈互动学习 |
| 产品类型 | 地理 SVG/Canvas 参数模拟学习游戏 |
| 学科范围 | 自然地理、区域地理、世界地理、中国地理、人文地理、综合地理 |
| 核心主题槽位 | {{CORE_GEOGRAPHY_THEME}} |
| 目标体验 | 让用户通过高精度地图、剖面、气候图和动态地理过程，亲手调参、观察变化、完成判读并理解地理因果 |
| 交互方式 | 点击推进、滑块调参、地图点选/框选、拖拽标注、图层切换、时间轴、排序/匹配、选择答案 |
| 内容规模 | 5-7 章；每章 3-4 个知识点；总题量 20-25 题；每章 3 个成就 |
| 准确性模式 | strict |
| 生图范围 | 标题页 / 全局背景图需要真实位图生图；核心地图、剖面、气候图和地理模拟必须用 SVG/Canvas/HTML 实现 |
| UI 风格策略 | 默认 `atlas-light` 明亮专业地图册；可按内容选择 `field-expedition`、`satellite-gis`、`earth-science-museum`、`night-observatory` 等预设 |
| IMAGE_GENERATION_TIMING | first-run-cache |
| 运行与存储 | 纯前端单文件；进度使用 localStorage；背景图片 Blob 使用 IndexedDB 缓存 |

### 核心设计理念

**地理知识、参数模拟、图像判读和答题反馈必须是同一个可视化场景的不同状态，不得拼成“文字讲解 + 静态图 + 选择题”的普通课件。**

每个知识点对应一个高精度 SVG / Canvas 地理可视化场景。这个场景贯穿：

```text
讲解动态演示 → 玩家参数探索 → 多题型答题 → 查看反馈
```

如果去掉地图、剖面、气候图、图层变化和动态反馈后只剩文字与题目，本产品即判定未完成。

### 产品形态说明

本 spec 描述的是已完成内容填充的地理互动学习游戏。构建阶段会读取随附 `skills/内容文件`，提取具体地理知识、图表、区域案例、参数范围、题目材料和视觉主题，填入本 spec 定义的数据结构。最终用户打开的是已经完成的地理互动学习游戏，不需要上传文件、输入内容或操作生成器。

## 二、涉及的 SKILL / 内容文件清单

完整内容文件会与本 spec 一起提供，通常位于项目根目录的 `skills/` 文件夹中。构建产品时，必须读取每个文件的完整内容，并从中提取本 spec 需要的内容。

| 内容文件路径 | 覆盖模块 | 在本产品中的用途 |
|-------------|----------|------------------|
| `{{CONTENT_FILE_PATH}}` | `{{COVERED_MODULE}}` | `{{USAGE_IN_PRODUCT}}` |
| `skills/{{GEOGRAPHY_KNOWLEDGE_FILE}}` | `{{GEOGRAPHY_MODULE}}` | 提取章节、知识点、地理概念、区域事实、地理过程、参数范围、题目依据 |
| `skills/{{GEOGRAPHY_CASE_FILE}}` | `{{CASE_MODULE}}` | 提取真实区域案例、地图对象、空间关系、数据图表、图像判读材料 |

### 内容使用验收重点

- 实现者必须读取每个内容文件的完整正文。
- 核心知识、地名、区域事实、图表数据、题目答案和解析必须能追溯到内容文件原文或明确可核验的地理知识。
- 文件名、目录、摘要和索引只能作为导航，不能作为核心内容依据。
- 不得凭空编造真实区域事实、气候规律、地貌成因、人口资源数据或题目答案。
- 如果内容文件暂未提供，必须保留本节占位符和提取契约，等待下一步实现时替换。

### 内容提取维度

| 提取维度 | 在本 spec 中映射到 |
|----------|--------------------|
| 地理对象：山脉、河流、湖泊、海峡、洋流、城市、区域、气候类型、板块、资源、人口等 | 地图图层、可点击对象、图例项、标注、章节主题、题目热区 |
| 地理关系：上下游、迎风/背风、海陆位置、板块边界、交通联系、资源与产业关系等 | 参数响应规则、因果图层、匹配题、地图判读题、解锁条件 |
| 地理过程：风化、侵蚀、沉积、河流改道、季风推进、锋面移动、城市扩张、板块运动等 | 动态 SVG/Canvas 演化动画、时间轴状态、反馈演示 |
| 地理规则：气候成因、垂直地带性、纬度地带性、洋流影响、海拔递减、人口分布规律等 | 可调参数、验证规则、题目答案、自检项 |
| 地理数据：气温、降水、海拔、坡度、流速、含沙量、人口密度、资源储量、城市化率等 | 数值面板、图表、气候图、热力层、参数范围 |
| 图表材料：地图、剖面图、气候统计、人口资源图、流线图等 | SVG 图层、判读题、拖拽标注、图层匹配、数据 Schema |
| 可验证事实：地名、区域特征、真实案例、教材定义、图表结论 | strict 准确性验收、题目正确答案、解析依据 |
| 视觉主题：区域地貌、自然环境、地图风格、学习氛围 | 背景图 prompt、UI 气质、粒子类型、章节过渡 |

### 内容文件到章节的映射原则

- 章节按知识递进或区域综合逻辑组织，不强行照搬文件目录。
- 每个知识点必须能生成一个可视化场景，而不是只有文字定义。
- 每个章节至少包含 3 个可操作或可判读的地理变量。
- 题目干扰项必须来自真实常见误解，例如把迎风坡/背风坡混淆、把寒流/暖流影响反写、把人口密度与自然条件关系简化为单因果。

## 三、目标用户

| 用户维度 | 描述 |
|----------|------|
| 核心用户 | 多年龄层通用，可通过内容文件填充为小学科普、初中地理、高中地理、成人通识或综合研学版本 |
| 知识水平 | 从零基础到进阶均可；具体术语密度、题目难度、参数精度由内容文件决定 |
| 使用场景 | 课堂演示、自主学习、章节复习、地理图像判读训练、科普体验 |
| 设备偏好 | 桌面浏览器和平板优先；手机端必须可完成核心学习与答题 |
| 学习目标 | 通过地图、剖面、气候图和动态过程建立地理空间感、因果感和图像判读能力 |

### 难度分层

本框架默认支持 `基础 / 进阶 / 综合` 三档难度：

| 难度 | 内容特征 | 交互复杂度 |
|------|----------|------------|
| 基础 | 术语解释清晰，强调直观现象和单因素因果 | 少量滑块、点选和 3 选 1 |
| 进阶 | 引入多因素叠加、图表判读和区域比较 | 多图层、拖拽标注、气候图判读 |
| 综合 | 区域综合分析、人地关系、多变量推断 | 参数预测、地图框选、剖面排序、图层匹配 |

## 四、产品目的

### 核心价值

本产品让用户通过亲手调整地貌、气候、水文和人文地理参数，观察高精度 SVG / Canvas 地理场景如何变化，从而理解地理现象背后的空间关系、过程机制和因果判断。

### 成功标准

- 用户能通过调参观察说出至少一个地理因果链，例如“山地抬升 → 迎风坡降水增强 → 背风坡雨影区形成”。
- 用户能在地图、剖面图、气候图、流线图中完成判读，而不是只背诵文字结论。
- 每个知识点的讲解、探索、答题、反馈都共用同一个可视化场景。
- 用户完成章节后能在章末总结中看到本章核心变量、图像判读方法和常见误区。
- 产品填充不同地理内容后，仍能保持同一套高质量交互结构和 strict 准确性验收。

### 不做什么

- 不做纯文字讲义。
- 不做只有选择题的题库。
- 不用 AI 生图或静态位图代替核心地理可视化。
- 不为酷炫动效牺牲地理事实、图表可读性或因果正确性。

## 五、视觉风格规范

### 整体气质

视觉方向为：**可变地理视觉系统：明亮专业地图册为默认，按内容切换多套 UI 风格，并始终保留多彩地理语义色板**。

用户打开页面时，应首先感到这是一个可操作、可判读、颜色丰富但秩序清楚的地理学习工作台，而不是被单一黑色科技面板包住的通用 dashboard。前景始终是可操作的地形沙盘、地图图层、气候图、风场箭头、洋流流线、雨带粒子和区域图层；背景通过真实生图获得，并根据 `UI_STYLE_PRESET` 匹配不同风格。

默认风格为 `atlas-light`：明亮专业地图册 + 动态地形沙盘 + 多彩地理数据图层。`night-observatory` 仅作为灾害、大气、海洋、夜间观测等内容的可选深色预设，不得作为唯一默认。

### UI 风格预设

最终实现必须在构建 / 填充阶段选择一个初始 `UI_STYLE_PRESET`，并可选地在设置中允许最终用户切换。无论使用哪种风格，地理变量的颜色编码、图例、单位和可读性优先级都高于装饰风格。

| 预设 ID | 风格名称 | 适合内容 | 背景 / 表面 | 面板和控件 | 氛围动效 |
|---------|----------|----------|-------------|------------|----------|
| `atlas-light` | 明亮专业地图册 + 动态地形沙盘 | 通用地理、区域地理、课堂学习、综合复习 | 雾白、浅灰地图纸、浅石绿、淡海蓝 | 白色 / 浅灰半透明面板、细灰线、少量墨绿或海蓝强调 | 经纬网淡入、等高线展开、轻微纸纹和图层滑入 |
| `field-expedition` | 野外研学采样台 | 地貌、水文、生态、区域研学 | 暖白纸面、岩灰、土壤色、植被绿 | 采样标签式面板、地图夹板质感、自然色按钮 | 风沙微粒、河流细粒、地形阴影缓慢变化 |
| `satellite-gis` | 卫星 / GIS 专业工作台 | 遥感、城市、交通、人口、资源 | 中性灰、浅钢蓝、白色工作台、少量深色地图窗口 | GIS 图层列表、规整网格、紧凑数据读数 | 扫描线、图层淡入、热力层切换 |
| `earth-science-museum` | 地球科学展厅 | 小学科普、成人通识、跨章节综合 | 明亮暖白、海洋蓝、地层橙、草地绿 | 展陈式信息牌、圆角较小的明亮模块、清晰图例 | 展台灯光、剖面展开、气候带渐变 |
| `night-observatory` | 夜间地理观测站 | 灾害、洋流、大气、宇宙尺度或需要强沉浸的章节 | 炭黑、深海蓝、冷青、低饱和紫灰 | 深色半透明仪表、细线发光、琥珀读数 | 经纬网扫描、卫星轨迹、低亮风场粒子 |

### 风格选择规则

- 默认选择 `atlas-light`，除非内容文件明确需要夜间、灾害、深海、遥感或强沉浸氛围。
- 小学科普或通识内容优先 `earth-science-museum`，保持明亮、亲近、可读。
- 区域案例、城市、交通、资源和人口分析优先 `satellite-gis`。
- 野外地貌、水文、生态和研学路线优先 `field-expedition`。
- `night-observatory` 适合特定章节或全局主题，但不能让所有页面都变成单一深蓝黑科技风。
- 同一产品可以使用一个全局预设，也可以让章节继承全局预设并按章节主题色轻微变化；不得每页随机换风格导致体验割裂。

### 视觉层级

| 层级 | 内容 | 实现要求 |
|------|------|----------|
| 背景层 | AI 生成的全局地理背景图，风格由 `UI_STYLE_PRESET` 决定 | 固定铺满视口，不能遮挡 UI |
| 调和层 | 中性亮/暗遮罩或轻纸纹层 | 提升前景可读性，不改变地理图层色彩含义 |
| 氛围层 | 经纬网扫描、雨带粒子、风场微粒、等高线流光、采样点或扫描线 | `pointer-events: none`，不得影响操作 |
| 主 UI 层 | 章节、题目、参数面板、图例、按钮 | 高对比度、清晰分组、响应式 |
| 核心可视化层 | SVG 地图、剖面、气候图、Canvas 动态粒子 | 判读优先，所有编码有地理含义 |
| 反馈层 | 正误反馈、图层高亮、成就 toast | 不遮挡关键地图区域，出现后可关闭或自动消退 |

### 背景系统

- 背景图必须由真实生图模型或图像生成 API/工具生成。
- 背景图方向必须来自当前 `UI_STYLE_PRESET` 的画风基底，例如明亮地图册、野外研学台、GIS 工作台、地球科学展厅或夜间观测站；不得固定写死为黑色观测站。
- 背景图固定铺满视口：`background-size: cover; background-position: center; background-attachment: fixed`。
- 背景图上方叠加中性调和层：明亮预设可用 `rgba(255,255,255,0.28)`、`rgba(245,247,242,0.18)` 或轻纸纹；深色预设可用 `rgba(0,0,0,0.28-0.42)`。
- 调和层必须保持中性，不得使用带强色相的遮罩，以免污染地图图层和气候图颜色判断。
- 核心页面如果背景过于活跃，必须增加浅色或深色工作台底板，保证地图、题目和图例可读。

### 标题设计

- 游戏标题不能只是普通 `<h1>`。
- 标题应使用主题化字体效果：经纬网切线、等高线纹理、微弱描边、地图扫描光、`text-shadow`、`background-clip: text` 等。
- 标题入场动画顺序：背景载入 → 经纬网扫描 → 主标题上浮淡入 → 副标题淡入 → 按钮出现。
- 标题特效不能导致文字不可读；文字主体必须有稳定基色，特效仅作增强。

### UI 面板风格

- 面板风格由 `UI_STYLE_PRESET` 决定，不默认深色。
- `atlas-light` 使用浅色半透明地图纸面板、细灰线、低饱和绿色/海蓝强调和清晰阴影。
- `field-expedition` 使用暖白纸面、岩灰边框、采样标签和自然色按钮。
- `satellite-gis` 使用紧凑 GIS 控制台、白/灰面板、钢蓝强调和图层列表。
- `earth-science-museum` 使用明亮展陈式信息牌、清晰色块和亲和但不过度圆润的控件。
- `night-observatory` 才使用深色半透明底、毛玻璃、细线描边和轻微发光边缘。
- 页面区块不做大面积浮夸卡片堆叠；核心是地图/剖面/图表工作台。
- 图例面板、参数面板、题目面板和反馈面板必须视觉区分。
- 卡片圆角 4-8px，保持仪器感，不要过度圆润。
- 所有按钮必须有 hover、active、disabled 和 selected 状态。
- 图例、单位、颜色编码必须清晰，不得为了风格模糊掉数据含义。

### 配色规范

本产品需要更丰富的地理色彩系统。丰富性主要用于地图、剖面、气候、水文、灾害和人文图层；UI 底色可以明亮或深色，但必须保持克制，避免变成花哨的通用科技页面。

#### UI 基础色

| 用途 | 方向 | 说明 |
|------|------|------|
| 背景/表面 | 雾白、浅灰地图纸、暖白、岩灰、浅钢蓝、低饱和墨绿；深色预设可用炭黑、深海蓝 | 与背景图融合，给图层留出对比；黑色不是默认 |
| 面板分隔 | 低透明冷灰、纸面灰、低饱和青灰、岩灰、暗橄榄灰 | 用于边框、分割线、次级容器 |
| 文字/标注 | 深墨绿、炭灰、地图黑、冷白、浅暖白 | 对比度 ≥ 4.5:1；标注不得被彩色图层吞掉 |
| 交互强调 | 青蓝、琥珀、雷达绿、珊瑚红、地图黄、植被绿、海洋蓝 | 用于按钮、当前章节、可交互提示，不作为随意装饰 |
| 正确/错误 | 清晰绿色 / 温和红色 | 反馈专用，不与地理编码冲突 |

#### 地理专题色板

| 专题 | 色彩方向 | 地理含义 |
|------|----------|----------|
| 地形高程 | 深海蓝 → 海岸青 → 低地绿 → 丘陵黄绿 → 高原赭黄 → 山地棕 → 雪线白 | 海拔、地形起伏、山地/高原/平原差异 |
| 地貌过程 | 湿润土褐、河岸赭色、沙丘金黄、岩层紫灰、冰川淡蓝 | 侵蚀、沉积、风成、构造、冰川等过程 |
| 气温热量 | 冰蓝 → 青绿 → 温带绿 → 暖黄 → 橙 → 深红 | 温度、热量带、极端高温；必须与人口热力区分 |
| 降水湿度 | 雾白 → 浅蓝 → 天蓝 → 深蓝 → 蓝紫 | 降水量、湿度、云雨带、洪涝风险 |
| 风场/气压 | 浅青、薄荷绿、冷白箭头、低透明紫色等压线 | 风向、风速、气压梯度、季风推进 |
| 洋流/海温 | 暖流橙红、寒流钴蓝、上升流青绿、海温渐变蓝橙 | 洋流性质、海温异常、渔场形成 |
| 板块/地质灾害 | 板块紫、断层玫红、火山橙红、地震亮红、滑坡土褐 | 构造边界、灾害风险、地壳活动 |
| 生态/植被 | 苔原灰绿、草原黄绿、森林深绿、雨林翠绿、荒漠沙黄 | 自然带、植被覆盖、生态差异 |
| 人口/城市 | 人口紫红、城市琥珀、交通亮橙、资源金黄、产业蓝紫 | 人口密度、城市节点、交通流线、资源和产业 |
| 区域综合 | 主图层保持专题色，次图层降饱和并提高透明度 | 多因素叠加时避免互相抢色 |

#### 章节主题色策略

每章可以有自己的主题色，使章节体验有变化，但不能改变地理编码的基础语义。

| 章节方向 | 推荐主题色 | 使用方式 |
|----------|------------|----------|
| 地图与空间基础 | 经纬网青蓝 + 地图黄 | 用于定位、比例尺、方向提示 |
| 地形与地貌 | 高程绿棕 + 岩层紫灰 | 用于等高线、剖面、地貌演化 |
| 气候系统 | 降水蓝 + 热量橙红 + 风场青 | 用于气候图、雨带、季风、热量带 |
| 水文与海洋 | 河流亮蓝 + 湿地青绿 + 洋流橙/蓝 | 用于流域、河流、洋流、海温 |
| 板块与灾害 | 构造紫 + 火山橙 + 风险红 | 用于板块边界、地震、火山、滑坡 |
| 人文地理 | 城市琥珀 + 人口紫红 + 交通亮橙 | 用于城市、人口、产业、交通 |
| 区域综合 | 以当前主问题的专题色为主，其余图层灰化 | 用于多变量综合分析 |

#### 防止画面变花的约束

- 同一核心可视化中，最多允许 2-3 个强色系同时作为注意力焦点；其余图层必须降低饱和度、透明度或转为灰阶/线框。
- 地理编码色优先级高于 UI 装饰色。按钮、边框、光效不得抢过地图主变量。
- 每种颜色必须能在图例中说明含义，不得出现“只是好看”的地图色块。
- 如果同一页面同时出现温度、人口热力和灾害风险，必须使用不同色相或不同纹理/符号编码，不能全部用红橙热力图。
- 正误反馈色只在反馈层短时出现，不得永久改变地理图层本身的颜色语义。
- 色盲可访问性：关键图层不能只靠红绿区分，必须辅以纹理、线型、符号、数值或标注。

同一画面中，颜色必须先服务地理编码，其次才服务章节气质，最后才服务 UI 氛围。

### 氛围粒子与动效

标题页必须实现地理主题氛围效果：

- 经纬网扫描线：低透明度横纵线或弧线缓慢扫过。
- 风场微粒：小点沿风向缓慢漂移。
- 雨带粒子：少量蓝色粒子沿云带移动。
- 等高线流光：极细线条沿地形纹理低速流动。
- 星点/卫星轨迹可作为标题页增强，但不得喧宾夺主。

粒子约束：

- 数量通常 10-30 个，核心页面可更低。
- 粒子不得遮挡地图、题目、图例或参数读数。
- 必须设置 `pointer-events: none`。
- 必须尊重 `prefers-reduced-motion`：关闭漂移动画或改为静态低透明纹理。

### SVG / Canvas 可视化风格

SVG 是本产品的最高优先级核心资产，不是插图装饰。

#### SVG 必须承担的内容

| 可视化对象 | SVG 要求 |
|------------|----------|
| 分层设色地图 | 高程、温度、降水、人口密度、资源分布等以图层表达；每层有图例、单位和透明度控制 |
| 等高线与地形阴影 | 等高线密度随坡度变化；标高点清晰；山脊、谷地、鞍部等可识别 |
| 地形剖面 | 地表曲线、海拔标尺、岩层/植被/积雪/河谷剖面分层清楚 |
| 风场与洋流 | 箭头方向准确；线宽、颜色或粒子密度表达强度；流线可动 |
| 气候图 | 气温折线、降水柱状、月份刻度、气候类型标注、判读辅助线 |
| 板块构造图 | 板块边界、运动箭头、碰撞/张裂/俯冲剖面、火山地震带 |
| 水文过程图 | 河流流向、侵蚀岸/堆积岸、三角洲推进、洪泛区 |
| 人文地理图层 | 人口热力、城市节点、交通流线、资源区位、产业联系 |
| 题目热区 | 地图点选/框选的可交互区域，必须有 hover/selected 状态 |

#### SVG 质量硬约束

- 每个知识点至少有一个 SVG 或 SVG + Canvas 混合核心可视化。
- 同一知识点四阶段共用同一可视化，通过 `vis_state` 切换状态。
- 所有 SVG 图层需要有语义化分组，例如 `base-map`、`terrain-layer`、`climate-layer`、`flow-layer`、`labels-layer`、`interaction-layer`、`feedback-layer`。
- 关键地理变量必须有可解释的视觉编码：颜色、线宽、透明度、箭头长度、粒子密度、等值线密度、符号大小。
- 地图图层必须有图例，图例说明颜色/符号/单位，不得只靠用户猜。
- 标注必须有避让策略：不遮挡关键地物、图例、题目选区；必要时使用引线和锚点。
- 动态标注平滑移动，不跳变。
- 可交互对象必须有 hover、active、selected、locked、correct、incorrect 状态。
- 地图、剖面、图表的比例和方向提示必须清楚；简化示意图也要标注“示意”或用数据范围说明。
- 手机端 SVG 必须可缩放、可平移或重排，核心标注不能被裁切。

#### 地理可视化原语速查

本节定义地理场景中常见图形元素的绘制工具和质感方向。开发者根据知识点内容组合使用，不得只画一个平面色块地图。

| 要画的东西 | 推荐技术 | 为什么 | 关键绘制点 |
|------------|----------|--------|------------|
| 分层设色底图 | SVG path + clipPath + linearGradient / discrete fill | 地理区域需要可点击、可标注、可按图层控制 | 区域边界清晰；主变量色带必须有图例；次要边界用低透明描边 |
| 等高线 | SVG path + stroke-dasharray + 标高 textPath | 线条精确，便于按海拔分组、hover 高亮和动画展开 | 等高线必须闭合或合理出图幅；坡陡处线距更密；每隔若干线标注海拔 |
| 地形阴影 | SVG filter + feGaussianBlur / feDropShadow + 半透明叠层 | 让地貌有体积感，又不破坏数据色 | 光源方向统一；山脊亮、谷地暗；阴影 opacity 低于主色带 |
| 地形剖面 | SVG path + area fill + 坐标轴 + clipPath | 剖面需要精确标尺、可叠加岩层/植被/雪线 | 地表曲线平滑；海拔轴和水平距离轴清楚；剖面层用 clipPath 限制范围 |
| 河流与流域 | SVG path + 渐变 stroke + marker 箭头 + Canvas 粒子 | 河流需要方向、支流层级和动态流动 | 上游线细、下游线粗；流向箭头顺坡；支流汇入点清楚 |
| 风场/洋流 | SVG path 流线 + marker + Canvas 粒子 | 大量流线可解释方向和强弱，粒子表达连续运动 | 箭头方向准确；线宽/粒子速度映射强度；寒暖流必须区分 |
| 降水/云带 | Canvas 粒子 + SVG 云带轮廓 / 等值线 | 粒子数量和密度可表达降水强度 | 粒子不遮挡标注；降水密度对应数值；云带边缘柔和 |
| 气候图 | SVG rect 柱状 + path 折线 + axis/grid | 气候判读依赖清晰坐标和月份刻度 | 降水柱和气温线分轴或明确单位；南北半球季节差异可标注 |
| 板块边界 | SVG path + pattern stroke + 运动箭头 | 边界类型需要符号化表达 | 碰撞、张裂、转换边界使用不同线型；箭头方向不能含混 |
| 人口/城市热力 | SVG symbol/use + radialGradient heat spots | 节点和热力可独立控制 | 城市节点大小映射等级；人口热力不得与温度热力混淆 |
| 题目热区 | SVG transparent path + data-id + focus ring | 地图点选/框选需要稳定命中区域 | 热区可比可见区域略大；hover 显示边界；选中态不覆盖原始数据色 |
| 参数面板/图例 | HTML/CSS + SVG swatch | DOM 更适合读数和控件 | 每个色带、线型、符号都有标签、单位和范围 |

#### 地理 SVG/CSS 质感配方

| 视觉对象 | 具体做法 |
|----------|----------|
| 分层设色地形 | 用离散色阶表达高度，叠加 5%-12% opacity 的地形阴影；山地边缘可用细浅色描边模拟受光面，低地保持低饱和，避免色块过艳 |
| 等高线 | 低海拔线用低透明细 stroke，高海拔线略深；主等高线每 4-5 条加粗；用 `stroke-linejoin: round` 避免折角生硬；标高文字沿 `textPath` 或贴近线段 |
| 山脊/谷地 | 山脊用极淡亮线沿 ridge path，谷地用低透明冷色阴影；两者必须跟随等高线结构，不得随意装饰 |
| 河流 | 主河道用双层 stroke：底层较宽低透明蓝色，顶层较窄亮蓝；用 `stroke-linecap: round`；可沿 path 移动小粒子表达流向 |
| 湖泊/海域 | 使用蓝色径向或线性渐变，岸线有细亮边；深水区更深，浅岸区更浅；水域纹理 opacity 很低 |
| 风场箭头 | 箭杆用 `path`，箭头用 `marker` 或 polygon；箭头长度/线宽映射风速；低风速可用虚线或低透明 |
| 洋流 | 暖流用橙红线 + 柔和外发光，寒流用钴蓝线 + 低透明冷光；线上粒子沿流向移动；交汇处不要让颜色混成脏色 |
| 雨带/降水 | SVG 绘制云带轮廓，Canvas 绘制雨粒；降水强度用粒子密度和下落速度表达，不能只改颜色 |
| 气候图 | 坐标轴和网格用低透明灰线；降水柱圆角 2-3px；气温折线用高对比 stroke，数据点小圆点可 hover 显示值 |
| 地形剖面 | 地表曲线下方用分层填充；岩层可用 `pattern` 斜纹/点纹；积雪用白色薄层；植被用低矮绿色短线或点状纹理 |
| 板块边界 | 俯冲边界用齿状三角 marker，张裂边界用双向箭头和裂隙虚线，转换边界用平行反向箭头；符号必须进入图例 |
| 城市/人口 | 城市节点用圆点 + 外环，等级越高外环越大；人口密度用半透明热力斑点，不得盖住地名 |

#### 地理动效模式

- **等高线展开**：章节过渡或讲解起始时，等高线可用 `stroke-dasharray` / `stroke-dashoffset` 由低海拔到高海拔依次绘出，帮助用户理解地形起伏。
- **地形抬升**：板块碰撞或山地形成时，剖面曲线通过 path 插值逐步隆起，阴影和等高线同步更新，不能只让山体整体上移。
- **雨带推进**：季风或锋面讲解中，云带轮廓平移，降水粒子密度随地形迎风坡增强，背风坡粒子减少。
- **河流侵蚀/沉积**：弯道外侧用短暂高亮和细粒子表示侵蚀，内侧用沉积色块逐渐累积；反馈阶段可对比错误预测和真实变化。
- **洋流流动**：粒子沿曲线运动，速度映射洋流强度；寒暖流交汇时粒子不应乱跳，交汇区可用低透明涡旋。
- **风向旋转**：风向旋钮改变时，箭头和粒子方向连续旋转，不得瞬间翻转。
- **城市扩张**：热力或土地利用斑块从城市节点向外扩散，受交通线和地形约束；不能均匀圆形扩散。
- **参数变化**：温度、降水、海拔、人口等连续变量必须插值过渡，图例读数同步平滑变化。

#### 地理标注与图例原则

- 地名、地貌名、气候类型、数值读数必须贴近目标元素，并用细引线和小锚点连接。
- 标注不得覆盖河流汇合点、山脊线、风场箭头、气候图峰值等判读关键位置。
- 多标注冲突时，优先保留题目相关标注，次要标注折叠为可 hover 展开。
- 图例必须解释颜色、线宽、箭头、透明度、符号大小、粒子密度、纹理含义。
- 数值和单位使用等宽字体，单位紧跟数值，例如 `1200 m`、`25 °C`、`800 mm`。
- 答题阶段可以隐藏部分答案性标注，但不能隐藏完成判读所需的坐标轴、比例、方向、单位和图例。

#### 地理交互态视觉暗示

| 状态 | 视觉表现 |
|------|----------|
| hover 地图区域 | 区域边界加亮，填充增加 5%-10% 透明亮层，显示名称 tooltip；不得覆盖原始色带 |
| hover 流线/箭头 | 线条略加粗，沿线出现短暂方向粒子，tooltip 显示变量名和单位 |
| dragging 剖面线/参数点 | 显示虚线辅助线、当前坐标/数值读数，相关剖面或图层实时更新 |
| selected 区域 | 使用外描边、角标或半透明斜纹表示，不直接把区域涂成反馈色 |
| locked 答题态 | 非题目相关控件降 opacity，核心图层保留；cursor 改为 default |
| correct | 反馈层短时绿色描边/路径高亮，并播放正确过程动画 |
| incorrect | 先用温和红色短时标出错误选择，再回到原图层色彩并演示正确路径 |
| disabled | 控件和图层开关降饱和，保留可读标签，不误导为未加载 |

#### 地理常见画错点

- 河流不得逆坡流；流向箭头必须符合地形或图中说明。
- 等高线不得随意相交；同一条等高线不能标注多个不同海拔。
- 山脊、山谷、鞍部、陡崖的等高线形态必须能被判读，不能只是随机波纹。
- 气候图不能省略坐标轴、月份、单位；气温线和降水柱不能共用未说明的比例。
- 温度热力、人口热力、灾害风险不能全部用同一种红橙色编码。
- 风场箭头、洋流线、交通流线不得穿过图例和题干关键文字。
- 板块边界类型必须用不同符号表达，不能只用一条普通线。
- 简化地图必须标注“示意”或说明数据范围，不能让示意图冒充精确地图。
- Canvas 粒子不得遮挡地名、坐标轴、题目热区和关键图例。
- 答题反馈不能永久改写地图原始色带，否则会破坏后续判读。

#### Canvas 适用范围

Canvas 用于大量粒子或连续场变化：

- 降水粒子、雪线变化、云团移动。
- 河流泥沙扩散、河道摆动、三角洲推进。
- 风沙移动、沙丘迁移、火山灰扩散。
- 洋流粒子、海温扩散、上升流动态。
- 地震波、城市扩张热力渐变、人口流动。
- 大量风场/流场粒子的逐帧动画。

SVG 与 Canvas 可以混用：SVG 负责精确地图、剖面、标注、坐标、图例和交互热区；Canvas 负责连续粒子、流场、扩散和动态氛围。

### 动效标准

- UI 过渡时长 200-800ms。
- 章节过渡 1.5-3s，可使用地图扫描、地形抬升、等高线展开、卫星轨迹扫过。
- 参数变化必须使用插值过渡，不能硬切换。
- 可视化动画使用 `requestAnimationFrame`，目标 ≥ 30fps。
- 可视化动画应支持暂停/重播。
- 动效必须服务理解、反馈或氛围，不允许无意义闪烁。
- `prefers-reduced-motion` 下关闭装饰性动画，保留核心地理过程演示的必要版本。

## 六、生图策略与资产契约

本产品需要真实位图生图资产，但范围仅限标题页 / 全局背景图。核心地理地图、剖面、气候图、图层、图表、题目热区和地理模拟必须由 SVG / Canvas / HTML 实现，不得用 AI 图片、截图或静态位图替代。

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

```text
STYLE_PROMPT_BASE_BY_PRESET =

atlas-light:
bright professional geography atlas workbench, layered topographic maps, clean cartography table, terrain sandbox model, soft daylight, precise contour lines, subtle GIS panels, rich natural geographic color accents, calm educational atmosphere, high detail, wide background composition, no people, no readable text

field-expedition:
modern field geography study station, relief model on a survey table, mineral and soil sample trays, folded non-readable maps, outdoor daylight, natural greens and earth tones, scientific but warm, high detail, wide background composition, no people, no readable text

satellite-gis:
clean satellite mapping studio, GIS layer panels, crisp terrain data screens, aerial imagery mood, neutral surfaces, sharp grid overlays, professional geospatial interface, high detail, wide background composition, no people, no readable text

earth-science-museum:
colorful earth science museum learning lab, illuminated terrain model, climate ribbons, ocean current displays, tectonic layer exhibit, bright educational atmosphere, high detail, wide background composition, no people, no readable text

night-observatory:
night geography observatory, professional cartography lab, holographic terrain sandbox, layered contour maps, climate data panels, atmospheric flow visualization, deep cinematic lighting, precise scientific visualization mood, high detail, wide background composition, no people, no readable text
```

项目级 negative prompt：

```text
people, readable text, watermark, logo, blurry map labels, distorted UI text, low resolution, cartoonish clutter, fantasy monsters, inaccurate flags, overexposed, messy composition, one-note black interface unless night-observatory is selected
```

### 静态资产计划：IMAGE_ASSET_MANIFEST

最终实现必须先输出并核对静态 `IMAGE_ASSET_MANIFEST`。它只描述“需要哪些图片、如何生成、缓存键是什么”，不表示当前浏览器中图片已经生成完成。

```json
{
  "asset_manifest_version": "geo-bg-v1",
  "image_generation_timing": "first-run-cache",
  "ui_style_preset": "{{UI_STYLE_PRESET}}",
  "style_prompt_base": "{{SELECTED_STYLE_PROMPT_BASE_FROM_UI_STYLE_PRESET}}",
  "assets": [
    {
      "id": "global_geography_style_bg",
      "purpose": "标题页 / 全局背景图",
      "required": true,
      "plan_status": "required",
      "initial_runtime_status": "pending",
      "ui_style_preset": "{{UI_STYLE_PRESET}}",
      "style_prompt_base": "{{SELECTED_STYLE_PROMPT_BASE_FROM_UI_STYLE_PRESET}}",
      "prompt": "{{SELECTED_STYLE_PROMPT_BASE_FROM_UI_STYLE_PRESET}}, foreground contains an abstract terrain sandbox, layered contour map surfaces, climate and hydrology visualization panels with no readable text, clear wide composition with open space for UI overlays, high detail environmental concept art",
      "negative_prompt": "people, readable text, watermark, logo, blurry map labels, distorted UI text, low resolution, cartoonish clutter, fantasy monsters, inaccurate flags, overexposed, messy composition, one-note black interface unless night-observatory is selected",
      "aspect_ratio": "16:9",
      "generation_timing": "first-run-cache",
      "cache_key": "{{PROJECT_ID}}/geo-bg-v1/{{UI_STYLE_PRESET}}/global_geography_style_bg/{{PROMPT_HASH}}",
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
  "asset_id": "global_geography_style_bg",
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
  "asset_id": "global_geography_style_bg",
  "asset_manifest_version": "geo-bg-v1",
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

- 标题可用“正在准备地理学习背景”或“正在准备 {{UI_STYLE_PRESET}} 视觉资产”。
- 显示已完成数量 / 总数量、当前资产用途、生成状态。
- 资产准备页的临时视觉应匹配当前 UI 风格：明亮预设使用浅色地图纸、经纬网和轻量进度条；深色预设可使用深色底和 SVG 经纬网临时氛围。不得把临时 CSS/SVG 视觉当作最终背景图。
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
| P0 | 标题页 | 建立与 `UI_STYLE_PRESET` 匹配的地理学习入口 | 点击开始/继续 | 进入章节主页 |
| P0 | 章节主页 | 用户需要看到学习路径和解锁进度 | 点击章节 | 进入当前章节或回看已完成章节 |
| P0 | 知识点四阶段闭环 | 保证学习、探索、答题、反馈在同一地理场景中完成 | 点击/调参/答题 | 动态可视化 + 解析 + 进度推进 |
| P0 | 高精度 SVG 地理可视化 | 建立地理空间感和图像判读能力 | 内容文件填充的知识点与参数 | 地图、剖面、气候图、图层、标注 |
| P0 | 参数探索 | 用户需要亲手改变地理变量 | 滑块、时间轴、风向旋钮、图层开关、拖拽点 | SVG/Canvas 实时响应、数值面板同步 |
| P0 | 多题型答题 | 地理学习需要地图判读和图表分析，不只选择题 | 选择、点选、框选、拖拽、排序、匹配 | 锁定答案、进入反馈演示 |
| P0 | 查看反馈 | 正误都要回到地理过程本身解释 | 作答结果 | 正确过程或错误后果的可视化演示 |
| P0 | 章末总结 | 巩固本章核心变量、图像判读方法和误区 | 自动触发 | 知识卡片、关键图层回顾、成就展示 |
| P0 | 成就系统 | 用鼓励性成就替代冷冰冰分数 | 首次作答、探索行为 | toast、成就墙、章节成就 |
| P0 | 存档续学 | 用户离开后继续 | 自动保存/继续学习 | localStorage 恢复进度 |
| P0 | strict 准确性自检 | 防止地理事实、因果和图表错误 | 内容填充结果 | 自检记录和修正要求 |

### P1 功能

| 优先级 | 功能名称 | 解决什么问题 | 输入 | 输出 |
|--------|----------|--------------|------|------|
| P1 | 图层对比模式 | 帮助用户比较成因和现象 | 切换图层/滑动对比 | 前后图层对照 |
| P1 | 回放与慢放 | 复杂地理过程需要反复观察 | 播放/暂停/慢放 | 时间轴回放 |
| P1 | 错题回看 | 用户需要复盘误区 | 点击错题/章节回看 | 错题场景和正确反馈 |
| P1 | 隐藏标注挑战 | 提升图像判读训练强度 | 切换挑战模式 | 隐藏部分标签后作答 |
| P1 | UI 风格预设切换 | 用户或教师可能需要明亮、GIS、展厅或夜间等不同视觉气质 | 设置中选择预设 | 页面表面、背景、面板和氛围动效切换；地理编码色不变 |
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
→ [知识点闭环：讲解动态 SVG → 参数探索 → 多题型答题 → 查看反馈] × 3-4
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
答题
→ 答错
→ 同一 SVG 场景先演示错误选择会导致的结果
→ 再演示正确过程
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
│   ├── 讲解阶段
│   ├── 探索阶段
│   ├── 答题阶段
│   └── 反馈演示阶段
├── 知识点 2...
└── 章末总结

通关页
├── 成就墙
├── 各章一句话回顾
├── 关键地图/图表回顾
└── 重新开始 / 回看章节
```

### 页面布局

| 页面/状态 | 核心内容 | 交互方式 |
|-----------|----------|----------|
| 资产准备页 | 主题化生成进度、当前资产用途、错误重试 | 自动生成/重试 |
| 标题页 | AI 背景图、主题标题、开始/继续、氛围粒子 | 点击 |
| 章节主页 | 章节卡、解锁状态、进度、成就入口 | 点击章节 |
| 章节过渡 | 章标题、核心变量预告、地图扫描/地形抬升动效 | 点击进入 |
| 讲解阶段 | 中央 SVG/Canvas 地理场景、同步讲解、图例 | 点击继续/播放 |
| 探索阶段 | 可调参数面板、图层开关、地图/剖面实时响应 | 滑动、拖拽、切换 |
| 答题阶段 | 锁定场景、题干、多题型交互区 | 选择、点选、框选、拖拽、排序 |
| 反馈演示 | 同场景动态演示、正误高亮、解析 | 继续/重试 |
| 章末总结 | 变量卡、图像判读方法、常见误区、成就 | 继续/回看 |
| 通关页 | 成就墙、章节回顾、关键图层回顾 | 回看/重开 |

### 核心工作台布局

桌面端推荐：

```text
左侧：章节/知识点进度
中间：SVG/Canvas 地理可视化主区域
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
| 构建/填充阶段数据 | 从内容文件提取出的章节、知识点、地理对象、规则、题目、可视化配置 | 内嵌 JSON / JS 常量 |
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
| `knowledge_point` | 一对一 | `geo_visualization` | 每个知识点绑定一个可视化场景 |
| `geo_visualization` | 一对多 | `vis_state` | 四阶段共用可视化，以状态切换 |
| `knowledge_point` | 一对少 | `question` | 每个知识点 1-2 道题 |
| `question` | 一对多 | `answer_interaction` | 不同题型有不同交互数据 |
| `chapter` | 一对多 | `achievement` | 每章 3 个成就 |
| `visual_style_preset` | 一对多 | `chapter_theme_palette` | 全局 UI 风格可叠加章节主题色 |
| `image_asset_manifest` | 一对多 | `image_asset_runtime_state` | 静态计划对应运行时状态 |

### meta.json

```json
{
  "subject": "地理",
  "topic": "{{CORE_GEOGRAPHY_THEME}}",
  "game_title": "{{GAME_NAME}}",
  "game_subtitle": "{{GAME_SUBTITLE}}",
  "title_tagline": "{{TITLE_TAGLINE}}",
  "ui_style_preset": "atlas-light / field-expedition / satellite-gis / earth-science-museum / night-observatory",
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
    "atlas-light",
    "field-expedition",
    "satellite-gis",
    "earth-science-museum",
    "night-observatory"
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
      "theme": "{{CHAPTER_THEME}}",
      "accent_colors": ["{{ACCENT_COLOR}}"],
      "geo_semantic_palette_overrides": "{{ONLY_IF_GEOGRAPHIC_MEANING_REQUIRES_IT}}"
    }
  ],
  "constraints": [
    "geographic semantic colors override decorative UI colors",
    "black or deep-blue dominance is allowed only when night-observatory is selected",
    "all map colors must be explained by legend or labels"
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
    "geographic_objects": ["{{GEO_OBJECT}}"],
    "processes": ["{{GEO_PROCESS}}"],
    "rules": ["{{GEO_RULE}}"],
    "data_series": ["{{DATA_SERIES}}"],
    "case_regions": ["{{CASE_REGION}}"]
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
      "concept_preview": "{{CONCEPT_PREVIEW}}",
      "source_refs": ["{{CONTENT_FILE_PATH}}#{{SECTION_OR_ANCHOR}}"],
      "knowledge_points": [
        {
          "id": "ch1_kp1",
          "title": "{{KNOWLEDGE_POINT_TITLE}}",
          "core_concept": "{{CORE_CONCEPT}}",
          "accuracy_requirements": ["{{ACCURACY_REQUIREMENT}}"],
          "geo_visualization": {
            "id": "vis_ch1_kp1",
            "type": "svg 或 svg_canvas_hybrid",
            "perspective": "2d / pseudo_3d / profile_section",
            "description": "{{VISUALIZATION_DESCRIPTION}}",
            "svg_layers": [
              {
                "id": "base-map",
                "purpose": "底图 / 地形轮廓",
                "required": true,
                "encoding": "{{ENCODING_RULE}}"
              },
              {
                "id": "terrain-layer",
                "purpose": "等高线 / 分层设色 / 地形阴影",
                "required": true,
                "encoding": "{{TERRAIN_ENCODING}}"
              },
              {
                "id": "climate-layer",
                "purpose": "气温 / 降水 / 风场 / 云雨",
                "required": false,
                "encoding": "{{CLIMATE_ENCODING}}"
              },
              {
                "id": "interaction-layer",
                "purpose": "点选 / 框选 / 拖拽热区",
                "required": true,
                "encoding": "{{INTERACTION_ENCODING}}"
              },
              {
                "id": "labels-layer",
                "purpose": "地名 / 变量 / 单位 / 图例",
                "required": true,
                "encoding": "{{LABEL_RULE}}"
              },
              {
                "id": "feedback-layer",
                "purpose": "正误高亮 / 过程演示",
                "required": true,
                "encoding": "{{FEEDBACK_ENCODING}}"
              }
            ],
            "canvas_layers": [
              {
                "id": "particle-field",
                "purpose": "降水 / 风场 / 洋流 / 泥沙等连续粒子",
                "required": false,
                "performance_target": ">=30fps"
              }
            ],
            "key_elements": ["{{KEY_GEO_ELEMENT}}"],
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
                "type": "slider / toggle / drag_point / timeline / direction_knob / layer_switch",
                "min": 0,
                "max": 100,
                "default": 50,
                "unit": "{{UNIT}}",
                "validity_rule": "{{GEOGRAPHIC_VALIDITY_RULE}}"
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
                "type": "single_choice / map_point_select / map_box_select / drag_label / layer_match / climate_chart_reading / profile_order / parameter_prediction",
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
        "core_variables": ["{{CORE_VARIABLE}}"],
        "map_reading_methods": ["{{MAP_READING_METHOD}}"],
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
| 调整纬度/海拔/降水等参数 | 滑块、双向滑块、方向旋钮 | 可视化实时响应，不改变答题状态 |
| 切换图层 | 图层开关或标签页 | 地图图层显示/隐藏，图例同步更新 |
| 地图点选 | 点击 SVG 热区 | 记录选择，显示选中态 |
| 地图框选 | 拖出矩形/套索区域 | 记录选区并与答案区域比较 |
| 拖拽标注 | 拖动标签到锚点 | 吸附、错位提示、提交后判定 |
| 图层匹配 | 拖拽或点击连线 | 记录配对关系 |
| 剖面排序 | 拖拽卡片或阶段片段 | 记录顺序 |
| 参数预测 | 先选择预测结果，再播放参数变化 | 比较预测与实际反馈 |
| 答题提交 | 点击提交或完成操作后自动提交 | 锁定答案，进入反馈 |
| 答错重试 | 点击重试 | 保留首次答案记录，回到题目 |
| 存档 | 每次状态变化自动保存 | 写入 localStorage |

### 交互反馈

| 状态 | 反馈要求 |
|------|----------|
| hover 地图热区 | 细描边、低透明填充、浮动标签；不得遮挡邻近区域 |
| selected 地图热区 | 明确高亮并保持图例可读 |
| 参数拖动中 | 对应图层实时更新；数值面板平滑变化；相关标注强调 |
| 参数超出有效范围 | 控件限制或显示地理合理性说明 |
| 答对 | 正确图层高亮，关键过程播放，成功色反馈 |
| 答错 | 错误路径短暂演示，再切回正确路径；文案温和 |
| 成就解锁 | toast 从顶部或侧边出现，3s 后消退，可在成就墙查看 |
| 图层加载/切换 | 200-500ms 淡入，避免瞬切 |
| 动画暂停 | 显示暂停态和当前变量读数 |

### 多题型交互细则

| 题型 | 交互细则 | 判定方式 |
|------|----------|----------|
| 3 选 1 | 三个选项固定，正确答案仅 1 个 | `selected_option_id === correct_option_id` |
| 地图点选 | SVG 热区有唯一或多个正确区域 | 点击区域 ID 与答案集合匹配 |
| 地图框选 | 用户框选范围与目标区域计算重叠率 | 重叠率达到阈值且误选范围低于阈值 |
| 拖拽标注 | 标签吸附到锚点，提交后判定 | label-anchor 映射全部或部分正确 |
| 图层匹配 | 因果图层配对，例如现象 ↔ 成因 | 配对关系与答案表一致 |
| 气候图判读 | 用户选择气候类型、成因或月份特征 | 选项或多字段判定 |
| 剖面排序 | 拖拽阶段卡片排序 | 序列完全一致或按局部得分 |
| 参数预测 | 用户先预测，再播放结果 | 预测类别/范围与模拟结果一致 |

## 十二、核心机制约束

### 产品形态约束

- 读取内容文件、提取知识、生成章节、编制题目、生成背景图资产计划属于构建或资产准备流程。
- 最终用户体验从已完成产品入口开始，不能把上传文件、输入内容、生成产品作为最终用户主流程。
- 背景图首次启动生成是视觉资产准备流程，不是用户可操作的生成器玩法。

### 设计粒度约束

- 本 spec 是“可填充玩法框架”，不是单个写死的地理章节实例。
- 具体章节名、知识点、区域案例、参数数值、题目、图例、成就名和解析由 `skills/内容文件` 填充。
- 本 spec 负责定义内容如何提取、映射、组织、交互、表现和验收。

### UI 风格预设约束

- 最终实现必须选择并记录 `UI_STYLE_PRESET`，默认使用 `atlas-light`。
- `UI_STYLE_PRESET` 只控制页面表面、背景图方向、面板质感、标题氛围和装饰动效；不得改变地理数据本身的颜色语义、图例和判读规则。
- 如果实现运行时风格切换，切换只影响 UI token、背景资产和装饰氛围；题目答案、地图图层、参数规则和地理反馈不得变化。
- 黑色 / 深蓝科技风只能作为 `night-observatory` 的明确选择，不得让所有风格都退化成同一套黑色 dashboard。

### strict 准确性约束

必须严格正确：

- 地名、区域事实、空间关系。
- 气候类型、气温降水规律、季风、洋流、地形雨、雨影效应等因果。
- 地貌成因、板块运动、流水侵蚀沉积、风化风蚀、冰川地貌等过程。
- 人口、城市、资源、交通、产业布局等人文地理判断。
- 图表数据、题目答案、错误选项、反馈解析。
- 参数范围和单位。

不得：

- 虚构真实区域事实。
- 将示意性动画当作真实精确数据而不说明。
- 为视觉效果改变地理规律。
- 用随机干扰项替代真实常见误区。
- 让 AI 图片替代可验证的地理图层。

### 内容文件映射约束

- 每章必须能追踪到至少一个内容文件来源。
- 每个知识点必须包含 `source_ref`。
- 每道题必须明确来源依据或可核验规则。
- 内容文件提取时优先抽取对象、关系、过程、规则、数据、可操作变量和可验证结论。

### 知识点四阶段闭环规则

每个知识点必须走完：

1. 讲解：同一可视化按预设 `vis_state` 演示。
2. 探索：开放参数，用户观察变化。
3. 答题：锁定场景或隐藏标注，完成地理判读。
4. 反馈：同一场景演示正确过程和误区。

禁止每个阶段各造一个不相关图。

### 高精度 SVG 约束

- 地图/剖面/气候图必须可维护、可交互、可缩放。
- 图层、图例、标注、热区必须分层组织。
- 颜色、线宽、透明度、箭头、粒子密度都有明确地理含义。
- 题目不能让用户在无法辨认的地图上猜答案。
- 地理对象的简化必须服务教学，不能导致事实错误。

### 成就系统规则

每章 3 个成就：

| 类型 | 触发条件 | 风格 |
|------|----------|------|
| 全对成就 | 本章所有题首次答对 | 专家/观测员/制图师风格 |
| 全错成就 | 本章所有题首次答错 | 轻微调侃但不伤人 |
| 创意成就 | 探索阶段触发特殊但合理参数组合 | 奖励好奇心 |

规则：

- 成就名 6 字以内优先，描述 30-50 字。
- 全对/全错基于首次作答。
- 重试不重复触发成就。
- 创意成就由地理内容决定，例如把降水、坡度和植被参数组合到极端但合理状态，触发侵蚀风险提示。
- 不显示分数、百分比或等级。

## 十三、内容 / 章节概览

### 默认章节结构

实际章节由内容文件决定。若内容文件没有明确结构，可使用以下通用递进：

| 章 | 章节方向 | 核心可视化 | 典型参数 |
|----|----------|------------|----------|
| 1 | 地图与空间基础 | 经纬网、比例尺、方向、区域定位 | 纬度、经度、距离、方向 |
| 2 | 地形与地貌过程 | 等高线、地形剖面、侵蚀沉积 | 海拔、坡度、流速、侵蚀强度 |
| 3 | 气候系统 | 气候图、风带、季风、降水分布 | 纬度、气温、降水、风向、距海距离 |
| 4 | 水文与海洋 | 河流、流域、洋流、海温 | 流量、含沙量、洋流方向、海温 |
| 5 | 板块与自然灾害 | 板块边界、地震、火山、褶皱山脉 | 板块速度、边界类型、震源深度 |
| 6 | 人文地理与区位 | 人口、城市、产业、交通、资源 | 人口密度、城市化、资源分布、交通可达性 |
| 7 | 区域综合分析 | 多图层叠加、区域比较、综合判断 | 多变量组合 |

### 地理可视化场景速查

#### 地形与地貌

- 等高线判读：山峰、山谷、山脊、鞍部、陡崖。
- 河流侵蚀：上游下切、中游侧蚀、下游堆积。
- 三角洲演化：泥沙输入、海浪侵蚀、沉积推进。
- 风成地貌：风向、沙源、植被覆盖影响沙丘形态。
- 冰川地貌：U 形谷、角峰、冰碛物示意。

#### 气候与大气

- 纬度与太阳高度：纬度变化影响热量分布。
- 海陆热力差异：季风环流、昼夜海陆风。
- 地形雨：迎风坡抬升降水，背风坡雨影。
- 洋流影响：暖流增温增湿，寒流降温减湿。
- 气候图判读：最冷月/最热月、降水季节分配、南北半球。

#### 水文与海洋

- 流域与分水岭：流向、支流、汇水区。
- 河流补给：雨水、冰雪融水、湖泊/地下水补给。
- 洪水过程：降水强度、坡度、植被、城市化。
- 洋流系统：寒暖流、上升流、渔场形成。

#### 板块与灾害

- 板块碰撞：褶皱山脉、地震带、火山弧。
- 板块张裂：裂谷、海岭、新洋壳。
- 俯冲带：海沟、火山岛弧、深源地震。
- 灾害风险：地震烈度、滑坡、泥石流、洪涝风险。

#### 人文地理

- 人口分布：自然条件、交通、经济机会。
- 城市化：城市扩张、热岛效应、土地利用变化。
- 工业区位：资源、交通、市场、劳动力。
- 交通流线：节点、通道、可达性。
- 区域综合：自然条件与人类活动叠加。

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

- 复杂地图图层应合理简化路径，避免单个 SVG 节点过多导致卡顿。
- 动态变化优先更新 transform、opacity、stroke-dashoffset、path 参数或少量数据点，不要全量重建 DOM。
- 大量粒子使用 Canvas，不用数百个 SVG circle 硬撑。
- 图层开关应改变 group 可见性，避免销毁重建。
- 移动端可降低非核心粒子密度，但不得删除核心地理信息。

## 十五、开发指引

收到本 spec 后，下一步实现模型必须按以下顺序执行：

1. 读取本 spec 全文，确认最终用户体验是已完成内容填充的地理互动学习游戏。
2. 读取所有 `skills/内容文件` 的完整正文，建立 `source_material.json`。
3. 从内容文件中提取地理对象、关系、过程、规则、数据、可操作变量、可验证结论和图表材料。
4. 根据内容递进生成 5-7 章，每章 3-4 个知识点。
5. 根据内容文件、目标用户和章节主题选择 `UI_STYLE_PRESET`，默认 `atlas-light`；如选择 `night-observatory`，必须说明为何需要深色夜间观测氛围。
6. 为每个知识点设计一个可复用的 SVG 或 SVG + Canvas 可视化场景。
7. 为每个可视化定义图层、图例、参数、状态、题型和反馈演示。
8. 先建立 `IMAGE_ASSET_MANIFEST`，按 `UI_STYLE_PRESET` 为全局背景图写完整 prompt、negative prompt、cache key 和 prompt hash。
9. 实现首次启动图片缓存流程：查 IndexedDB，cache miss 时调用真实生图能力，写入 Blob，cache hit 不调用生图。
10. 实现标题页、章节主页、章节过渡、知识点四阶段闭环、章末总结和通关成就墙。
11. 实现多题型：3 选 1、地图点选/框选、拖拽标注、图层匹配、气候图判读、剖面排序、参数预测。
12. 实现 localStorage 进度与 IndexedDB 图片缓存，严格区分两者。
13. 对每章执行 strict 准确性自检，修正地理事实、因果、图表、单位和题目错误。
14. 对 SVG/CSS 绘制指南执行专项自检，确认地理可视化原语、质感配方、动效模式、标注/图例、交互态、常见画错点均已落实。
15. 对照验收标准全量自测。

### 开发时禁止

- 禁止只读内容文件摘要后自行编造章节。
- 禁止用静态图片代替核心 SVG/Canvas 地理可视化。
- 禁止把 CSS/SVG/Canvas 背景冒充为 AI 生图背景。
- 禁止在前端硬编码私密模型/API key。
- 禁止用纯文字“正确/错误”代替反馈演示。
- 禁止为了节省实现跳过探索阶段或多题型。
- 禁止把所有 UI 风格都做成同一套黑色 / 深蓝科技面板。

## 十六、验收标准

### 功能验收

| 功能 | 验收条件 | 自测结果 |
|------|----------|----------|
| 资产准备 | 首次缺图时显示主题化资产准备页，生成背景图并写入 IndexedDB | [ ] 通过 |
| 缓存复用 | 刷新或再次打开时 cache hit 只读缓存，不重新调用生图 API | [ ] 通过 |
| 标题页 | 真实生成背景图、主题标题、开始/继续按钮、氛围粒子完整 | [ ] 通过 |
| 章节主页 | 显示章节解锁状态、进度、已完成回看 | [ ] 通过 |
| 四阶段闭环 | 每个知识点包含讲解、探索、答题、反馈 | [ ] 通过 |
| 参数探索 | 参数变化实时影响地图/剖面/气候图或相关可视化 | [ ] 通过 |
| 多题型 | 至少实现 3 选 1、地图点选/框选、拖拽标注、图层匹配、气候图判读、剖面排序、参数预测中的多种题型 | [ ] 通过 |
| 反馈演示 | 答对答错都回到同一地理场景演示 | [ ] 通过 |
| 章末总结 | 展示核心变量、图像判读方法、常见误区和成就 | [ ] 通过 |
| 成就系统 | 每章 3 个成就，触发逻辑正确，toast 与成就墙可用 | [ ] 通过 |
| 存档续学 | localStorage 恢复章节、题目、成就和设置 | [ ] 通过 |

### 随附内容文件验收

- [ ] 已读取每个内容文件完整正文。
- [ ] 每章有内容文件来源追踪。
- [ ] 每个知识点有 `source_ref`。
- [ ] 每道题的答案和解析可追溯到内容文件或可核验地理知识。
- [ ] 没有只凭文件名、索引、摘要生成核心内容。
- [ ] 内容槽位可被不同地理主题复用。

### 生图验收

- [ ] 背景图由真实生图模型/API/工具生成。
- [ ] CSS 渐变、SVG、Canvas、emoji、文字占位没有被当作生图。
- [ ] `IMAGE_ASSET_MANIFEST` 包含 asset id、purpose、required、plan_status、`ui_style_preset`、style prompt base、full prompt、negative prompt、aspect ratio、generation timing、prompt hash、cache key、seed source、storage driver。
- [ ] 背景图 prompt 与 `UI_STYLE_PRESET` 匹配，不把未选择夜间观测站的产品生成成黑色科技背景。
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
- [ ] SVG 有语义化图层：底图、地形、气候、流线、标注、交互、反馈等。
- [ ] 已按“地理可视化原语速查”选择 SVG / Canvas / HTML/CSS 分工，不是无差别堆 SVG 节点。
- [ ] 已落实地理 SVG/CSS 质感配方：等高线、地形阴影、河流、风场、洋流、雨带、气候图、剖面等有具体画法。
- [ ] 等高线、河流、风场、洋流、气候图、剖面图等关键对象避免本 spec 列出的常见画错点。
- [ ] 地图/剖面/气候图有图例、单位、方向或比例提示。
- [ ] 颜色、线宽、透明度、箭头、粒子密度都有明确地理含义。
- [ ] 参数变化实时更新可视化和数值面板。
- [ ] 标注不遮挡关键地理对象，有避让或引线。
- [ ] 地图热区 hover/selected/correct/incorrect 状态完整。
- [ ] Canvas 粒子或流场动画流畅，目标 ≥ 30fps。
- [ ] 手机端核心可视化可缩放或重排，不裁切关键标注。

### 视觉验收

- [ ] 背景图铺满视口，遮罩不遮挡前景。
- [ ] UI 气质符合已选择的 `UI_STYLE_PRESET`；默认应呈现明亮专业地图册 / 地形沙盘气质，而不是强制黑色系。
- [ ] 至少保留 `atlas-light`、`field-expedition`、`satellite-gis`、`earth-science-museum`、`night-observatory` 五套风格预设说明或 token。
- [ ] 黑色 / 深蓝科技风只在 `night-observatory` 被选择时作为主导风格。
- [ ] 标题有主题化字体效果，不是普通 h1。
- [ ] 面板、按钮、图例、参数控件有清晰层级和状态。
- [ ] 粒子不遮挡内容、不拦截点击。
- [ ] `prefers-reduced-motion` 下装饰动画减少，核心学习仍可完成。
- [ ] 文字对比度达标。
- [ ] 地理编码色彩不被氛围色污染。

### 交互验收

- [ ] 所有按钮有 hover、active、disabled 状态。
- [ ] 屏幕切换有过渡，不瞬切。
- [ ] 滑块、拖拽、图层切换流畅。
- [ ] 点选/框选/拖拽标注/排序/匹配题型可完整提交和反馈。
- [ ] 答错后可重试，但首次答案记录不被覆盖。
- [ ] 成就 toast 不遮挡关键地图判读区域。

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

- [ ] 地名、区域事实、空间关系无错误。
- [ ] 气候类型、气温降水规律、季风、洋流、地形雨等因果正确。
- [ ] 地貌成因、板块运动、流水侵蚀沉积等过程正确。
- [ ] 人文地理判断不使用过度简化或错误因果。
- [ ] 图表数据、单位、比例和图例一致。
- [ ] 题目正确答案唯一或按题型规则明确。
- [ ] 错误选项对应真实常见误区。
- [ ] 反馈解析严谨、温和、可验证。
- [ ] 没有虚构核心地理知识、真实区域事实或数据。

### 产品形态验收

- [ ] 最终用户动线从已完成产品开始。
- [ ] 没有把上传文件、输入内容、生成产品写成最终用户主流程。
- [ ] 内容提取和填充属于开发指引、内容文件契约和验收标准。
- [ ] 背景图首次启动生图被写成视觉资产准备流程，而不是生成器玩法。

### 设计粒度验收

- [ ] 产品概览声明 `设计粒度 = 可填充玩法框架`。
- [ ] spec 主要定义玩法结构、内容槽位、映射规则、数据 Schema 和约束。
- [ ] 具体章节、区域案例、题目、参数值、成就名可由 `skills/内容文件` 填充。
- [ ] 本 spec 可用于不同地理内容，而不是只服务单个固定章节。

### 未完成判定

以下任一项不通过，则判定最终实现未完成：

- [ ] 背景图不是由真实生图能力生成。
- [ ] 必需背景图未 ready 就进入标题页。
- [ ] 核心地理可视化被静态图片或纯文字替代。
- [ ] 知识点没有四阶段闭环。
- [ ] SVG 没有图层、图例、标注和可交互状态。
- [ ] 地理 SVG/CSS 绘制没有落实原语速查、质感配方、动效模式和常见画错点约束。
- [ ] 题目脱离地理可视化。
- [ ] 答题反馈没有动态演示。
- [ ] strict 准确性自检发现核心地理错误仍未修正。
- [ ] 未读取完整内容文件就生成核心内容。
