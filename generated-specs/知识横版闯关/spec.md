# 知识横版闯关产品规格说明

## 一、产品概览

| 维度 | 值 |
|------|-----|
| 产品名称 | {{GAME_NAME}} |
| 来源素材 | {{BOOK_NAME}} |
| 设计粒度 | 可填充玩法框架 |
| 玩法结构 | 横屏平台闯关 + 知识题目触发 + 章节式关卡推进 |
| 产品类型 | 已填充完成的知识闯关游戏 |
| 核心主题槽位 | `{{CORE_SUBJECT}}` / `{{CORE_THEME}}` / `{{LEARNING_GOAL}}` |
| 目标体验 | 玩家像玩横版冒险游戏一样穿过知识关卡，在移动、跳跃、冲刺、攻击和答题反馈中完成章节学习 |
| 交互方式 | 键盘 / 触屏横屏操控 + 答题弹窗 / 拖拽交互 |
| 视角与节奏 | 2D 横版侧视角，实时操控，答题时暂停或半暂停关卡 |
| 内容规模 | 每个知识章节 1 关；每关约 10 题；题型混合；章节数量由内容文件决定 |
| 通关规则 | 每关答对率达到 50% 可通关；70% 获得 2 星；90% 获得 3 星 |
| 惩罚规则 | 答错扣生命并显示解析；生命归零则本关失败并从起点或检查点重试 |
| 准确性模式 | strict |

本 spec 定义的是一个可由任意学科、任意主题内容文件填充的横屏知识闯关框架。后续构建阶段会读取完整内容文件，提取章节、知识点、题目、答案、解析和难度，并填入关卡、题目触发物、结算、复习和错题回看中。最终用户打开产品后直接游玩已完成的知识闯关游戏，不需要在前端上传或生成内容。

## 二、涉及的 SKILL / 内容文件清单

完整内容文件会与本 spec 一起提供，通常位于项目根目录的 `skills/` 文件夹中。构建产品时，必须读取每个文件的完整内容，并从中提取本 spec 需要的内容。

实现者必须读取每个内容文件全文，不能只依赖文件名、目录索引、摘要或标题来生成核心内容。题目、答案、解析、章节归属、知识点归类和难度必须能追溯到内容文件原文，或追溯到内容文件明确指向的可验证知识来源。

| 内容文件路径 | 覆盖模块 | 在本产品中的用途 |
|-------------|----------|------------------|
| `{{CONTENT_FILE_PATH}}` | `{{COVERED_MODULE}}` | `{{USAGE_IN_PRODUCT}}` |

### 内容提取维度

| 提取维度 | 在本 spec 中映射到 |
|----------|--------------------|
| 章节 / 模块 / 单元 | 关卡列表，每章一关 |
| 核心知识点 | 题目池、题目触发物、关卡主题标签 |
| 概念定义 | 选择题、判断题、填空题 |
| 过程 / 步骤 / 时间线 | 排序题、路线机关、阶段式题目链 |
| 对象与关系 | 连线题、拖拽匹配题、NPC 对话题 |
| 规则 / 公式 / 判断标准 | 知识门、路障题、终点门解锁条件 |
| 常见误区 | 错误选项、答错解析、错题回看提示 |
| 例子 / 案例 / 应用场景 | 情境选择题、宝箱奖励题、敌人弱点题 |
| 难度线索 | 题目难度、关卡前后段分布、敌人强度 |
| 视觉主题词 | 封面图 prompt、关卡色彩、地形装饰、粒子氛围 |

### 内容使用验收重点

- 实现者必须能说明每个关卡对应哪些内容文件、哪些章节或哪些知识簇。
- 每道题必须有 `source_ref`，指向内容文件路径、章节、段落或可定位片段。
- 摘要、目录和标题只能用于导航，不能作为题目、答案和解析的唯一依据。
- 若内容文件缺少答案或解析，构建阶段必须基于可验证知识补全，并在数据中标记补全依据。

## 三、目标用户

| 维度 | 描述 |
|------|------|
| 用户画像 | 泛用学习者，包括儿童、青少年、成人自学者和复习者 |
| 使用场景 | 章节复习、轻量闯关学习、知识点巩固、错题回看、课后练习游戏化 |
| 设备偏好 | 横屏桌面浏览器、平板横屏、移动端横屏 |
| 知识水平 | 由内容文件决定，可覆盖入门、复习、进阶和综合应用 |
| 操作门槛 | 需要理解左右移动、跳跃、冲刺、攻击和基础答题操作 |

产品不能假设所有用户都熟悉平台跳跃游戏。第一关必须包含轻量操作引导，并用低风险场景让玩家学习移动、跳跃、攻击、触发题目和查看解析。

## 四、产品目的

### 核心价值

把任意完整知识内容转化为可游玩的横屏章节闯关体验：玩家不只是连续刷题，而是在关卡空间中主动寻找题目、突破知识门、获得即时反馈，并通过生命、星级和错题回看来完成复习闭环。

### 成功标准

- 每个章节能被自动映射成一关，并包含约 10 道来自内容文件的题目。
- 玩家完成一关后能清楚知道本章掌握情况：答对率、星级、错题、解析和建议复习点。
- 50% 答对率通关、70% / 90% 星级阈值准确生效。
- 答错扣生命、生命归零、检查点重试和错题回看形成完整反馈链。
- 游戏体验保留横版闯关的移动、跳跃、冲刺、攻击和碰撞乐趣，而不是退化为静态题库页面。
- 内容准确性达到 strict 要求：题目、答案、解析和知识分类可追溯、可验证。

## 五、视觉风格规范

### 整体气质

本产品是“知识冒险关卡”，视觉应同时具备游戏感和学习清晰度。关卡内元素必须一眼区分：玩家、平台、题目触发物、敌人、危险物、奖励、终点门和 HUD。画面可以有主题变化，但不能因为装饰过多而干扰平台碰撞和答题阅读。

最终实现应根据 `skills/内容文件` 的主题自动选择或混合视觉方向：

| 视觉方向 | 适用内容 | 关键词 |
|----------|----------|--------|
| 像素冒险 | 泛用闯关、复古游戏感、全年龄学习 | pixel platformer, crisp pixel edges, readable blocks |
| 校园冒险 | 课程学习、考试复习、错题练习 | friendly campus adventure, classroom motifs, energetic UI |
| 百科博物馆 | 科普、地理、生物、历史、图鉴型知识 | museum exploration, labeled exhibits, natural history palette |
| 未来实验室 | 科学、数学、编程、工程 | sci-fi learning lab, holographic panels, neon accents |
| 纸片手账 | 语文、阅读、通识、轻学习 | paper craft, notebook stickers, warm hand-drawn interface |
| 奇幻知识大陆 | 混合学科、儿童向、故事化学习 | whimsical fantasy gates, glowing knowledge tokens |
| 清爽信息图 | 成人学习、职业知识、效率学习 | flat vector infographic, precise icons, calm UI |

### 配色和排版

- 配色应由内容主题决定，但必须至少包含：背景主色、平台结构色、玩家强调色、题目触发色、危险色、成功色、错误色、UI 文本色。
- 成功色和错误色不得与学科数据颜色混淆；例如科学内容中用于温度、酸碱、风险等的颜色不能同时承担答题反馈含义。
- 文本与背景对比度必须满足可读性，题目弹窗中的正文、选项、解析不能使用低透明度或过度装饰字体。
- 标题不是普通 `<h1>`。标题必须使用主题化字体效果，例如描边、投影、发光、贴纸层、像素边、纸片裁切、扫描线或卷轴装饰。
- 游戏内 HUD 使用稳定尺寸和等宽数字，生命、答对率、星级进度在数值变化时不能导致布局跳动。

### UI 元素

- 按钮、题目面板、结算面板、章节卡片、暂停菜单、错题回看都必须主题化设计，禁止浏览器默认样式。
- 按钮 hover / active 必须有明确反馈：轻微位移、阴影、描边亮度、发光、像素闪烁或纸片弹性。
- 答题弹窗的宽高必须响应式约束，长题目、长选项和长解析不得溢出或遮挡确认按钮。
- 章节选择页不能做成营销落地页，应直接展示可玩的章节地图、星级、锁定状态和进度。
- 卡片只用于章节项、题目项、结算项、弹窗和工具面板；不要把整页包成层层嵌套卡片。

### 粒子和氛围

- 标题页和通关页可使用主题粒子：星点、纸屑、粉尘、光点、数据碎片、墨点、气泡或像素粒子。
- 粒子数量通常 10-30 个，必须 `pointer-events: none`，不得遮挡题目或平台关键区域。
- 关卡中粒子只用于反馈：跳跃落地尘埃、攻击火花、答对光点、答错碎片、开门光效、通关庆祝。
- 尊重 `prefers-reduced-motion`：关闭装饰粒子和夸张转场，但保留核心移动、碰撞、答题反馈和必要状态变化。

### 高精度 SVG / Canvas / CSS 横版绘制指南

本产品的核心关卡画面必须由 SVG / Canvas / CSS / HTML 程序化实现，不得用静态图片替代关卡、角色、平台、题目触发物或核心动画。最终实现需要达到绘制手册级精度。

#### 可视化原语速查

| 要画的东西 | 推荐技术 | 为什么 | 关键绘制点 |
|------------|----------|--------|------------|
| 玩家角色 | SVG symbol + CSS transform，或 Canvas sprite 状态机 | 状态少、需清楚可读、方便换主题 | idle / run / jump / dash / attack / hurt / dead 状态；角色轮廓与碰撞盒接近 |
| 静态平台 | SVG rect/path/polygon + CSS 背景纹理 | 结构精确、易标记可站立面 | 顶面高光、边缘阴影、危险边界、不同材质主题化 |
| 移动平台 | DOM/SVG 平台 + JS 插值运动 | 需要稳定碰撞和可预测轨迹 | 轨迹点、速度、暂停点、玩家站上后的同步位移 |
| 斜坡 / 台阶 | SVG polygon/path | 碰撞面需要精确 | 可站立斜面与装饰斜线分离，避免视觉欺骗 |
| 题目触发物 | SVG + CSS 状态动画 | 需要多种外观和完成态 | 问号砖块、卷轴、知识门、宝箱、NPC、路障、敌人弱点题 |
| 敌人 | Canvas 或 SVG 状态机 | 需要巡逻、受击、消失 | 巡逻范围、方向提示、受击闪白、答题击败态 |
| 攻击特效 | SVG path 弧线 / Canvas 短粒子 | 时间短、需表达命中 | slash 弧线、冲击波、命中火花、攻击冷却 |
| HUD | HTML/CSS | 数值更新和响应式最稳 | 生命、答对数、答错数、答对率、星级进度、当前章节 |
| 题目弹窗 | HTML/CSS + 少量 SVG 图标 | 文本排版优先 | 题干、选项、拖拽区、解析区、按钮、错误态 |
| 终点门 | SVG + CSS transition | 需要锁定 / 开启 / 通关状态 | 门缝光、锁链、进度符号、开启动画 |

#### SVG / CSS 质感配方

| 对象 | 绘制配方 |
|------|----------|
| 玩家角色 | 使用 2-4 个主形状组成清晰剪影；头部/身体/脚部层级分明；run 时脚部循环摆动，jump 时身体压缩后拉伸，hurt 时闪白和短暂后仰 |
| 平台砖块 | 顶面使用浅色高光条，侧面使用稍暗色；用 `pattern` 或伪元素做细纹理；可站立边缘保持清晰直线 |
| 问号砖块 | 正面用高对比符号，待触发时轻微上下浮动；触发瞬间向上弹起 4-8px 并产生小粒子；完成后降饱和或变为空砖 |
| 漂浮卷轴 / 卡片 | SVG rect + 卷边 path；悬浮时 `translateY` 循环；打开题目时展开为弹窗标题装饰 |
| 知识门 | 双层 SVG 门板 + 锁形图标；未达 50% 时锁发暗；达标时锁链断开、门缝发光、门板平滑打开 |
| 宝箱 | SVG polygon/rect 组合；闭合态有描边高光；答对后箱盖旋转开启，喷出星星或生命粒子 |
| NPC | 简化几何角色，头部、身体、标志物分层；可对话时头顶显示小气泡图标；题目完成后变为感谢或让路动作 |
| 敌人 | 轮廓必须区别于玩家；巡逻时有方向性；被攻击后短暂压扁 / 闪白；答对后消散为粒子 |
| 攻击弧线 | 使用 SVG path，前景实线 + 后景模糊同色 stroke；持续 120-180ms，结束后自动移除 |
| 答对反馈 | 成功色光点向外扩散，题目触发物变为完成态，HUD 答对数平滑 +1 |
| 答错反馈 | 错误色短闪，生命图标减少，角色轻微后退；不得使用刺眼全屏高频闪烁 |

#### 领域动效模式

- 角色移动使用速度、加速度和摩擦插值，禁止位置瞬移。
- 跳跃必须有起跳压缩、上升、下落、落地缓冲和尘埃反馈。
- 冲刺必须有方向拖尾、短暂速度提升和冷却提示。
- 攻击必须有前摇、命中窗口和后摇，命中反馈要与碰撞判定一致。
- 移动平台必须连续插值，玩家站在平台上时随平台移动，不得穿透或抖动。
- 答题弹窗出现时，关卡进入暂停或半暂停：玩家、敌人、陷阱和计时逻辑不能继续伤害玩家。
- 答对后道路开启、门解锁、题目触发物消失或变为已完成态，动画时长 300-800ms。
- 章节切换不能瞬切，可使用地图滑动、卷轴展开、像素擦除、实验室扫描、书页翻动等主题转场。

#### 标注与数据编码原则

- HUD 中生命用固定数量图标或固定宽度槽位表示，不能因生命变化挤压其他 UI。
- 答对率用进度条 + 数字共同表示；50%、70%、90% 三个阈值必须在进度条上有清楚刻度。
- 题目触发物完成态、未完成态、已答错待重试态必须有不同视觉状态。
- 知识门旁应显示当前答对率和“还需答对 {{NEEDED_CORRECT_COUNT}} 题”这类可操作提示。
- 题目解析引用知识点时应显示章节或知识标签，帮助回看。
- 移动端横屏时，HUD 放在上方或角落，虚拟按钮放在底部两侧，题目弹窗居中并避开虚拟按钮区域。

#### 交互态视觉暗示

| 状态 | 视觉要求 |
|------|----------|
| hover | 可点击章节、按钮、题目选项、宝箱、NPC 显示描边增强、轻微上浮或发光 |
| active | 按钮和攻击键有按下位移；角色攻击 / 冲刺即时出现对应动作 |
| selected | 已选答案保持高亮，不破坏选项文字可读性 |
| dragging | 拖拽题元素跟随手指 / 鼠标，显示投影和目标吸附区 |
| locked | 未解锁章节、未开启知识门降低饱和度并显示锁形标记 |
| correct | 成功色短时出现，随后回到主题色，不长期污染原本语义色 |
| incorrect | 错误色提示 + 解析面板，避免高频闪烁和过度惩罚感 |
| disabled | 禁用按钮降低透明度并移除 hover 效果，不能看起来仍可点击 |

#### 常见画错点 / 禁止降级

- 平台碰撞盒不得与视觉平台明显错位。
- 角色脚底已经站在平台上时不得继续下落。
- 题目弹窗打开后，敌人和陷阱不得继续造成伤害。
- 终点门不得在答对率不足 50% 时打开。
- 50%、70%、90% 星级阈值不得四舍五入误判。
- 答错扣生命不得和答题取消、关闭弹窗、未提交答案混淆。
- 攻击动画不得只播放特效而没有命中窗口和冷却。
- 关卡内核心视觉不得用封面图裁切或静态背景图冒充。
- SVG / Canvas 装饰图形不得被登记为真实生图资产。
- 移动端横屏虚拟按键不得遮挡题目、终点门或底部平台。

## 六、生图策略与资产契约

### 生图范围声明

本产品需要真实位图资产，但范围仅限构建期预置的封面图 / 标题页主视觉。游戏内关卡、玩家角色、平台、题目触发物、敌人、NPC、HUD、答题弹窗、粒子和动效均由 SVG / Canvas / CSS / HTML 程序化实现，不需要真实生图资产。

| 资产 ID | 用途 | 是否必需 | 时机 |
|---------|------|----------|------|
| `cover_art` | 标题页封面图 / 主视觉背景 | 是，作为正常封面体验必需 | `build-time` |

### 什么是生图

- 调用真实图像生成模型、图像生成 API 或等效工具，输入完整提示词并获得真实图像文件。
- 构建期获得的图片可以打包为本地资产、base64 / data URL，或作为首次写入 IndexedDB 的 seed。
- 最终页面展示封面时，必须引用真实生成图像的结果，不能用程序化图形冒充。

### 什么不是生图

- CSS 渐变、box-shadow、border-radius 画出的图形不是生图。
- SVG path、circle、polygon、filter 手动绘制不是生图。
- Canvas 代码绘制不是生图。
- emoji / Unicode 符号不是生图。
- 文字占位、色块占位、程序化封面都不是生图。

### IMAGE_GENERATION_TIMING

`IMAGE_GENERATION_TIMING = build-time`

封面图必须在实现 / 构建阶段生成并写入交付物。若交付为单个 HTML 文件，可在真实生图完成后将封面图转为 base64 / data URL 内嵌；若交付为多文件应用，可作为本地图片资产打包。

即使采用构建期预置，最终 app 仍应为封面图保留静态资产清单、运行时状态和缓存记录。如果实现选择在首次打开时把构建期图片作为 `seed_source` 写入 IndexedDB，后续刷新应优先从 IndexedDB Blob 读取并创建本次会话 object URL。

### 封面图风格生成方法

封面图不固定单一画风。构建阶段应根据内容文件的学科和气质选择一个 `STYLE_PROMPT_BASE`：

| 候选基底 | 英文提示词基底 |
|----------|----------------|
| 像素冒险 | `pixel art educational platformer cover, crisp pixel edges, bright readable palette, adventurous side-scrolling world, charming game title composition` |
| 校园冒险 | `friendly campus adventure illustration, energetic students learning through a side-scrolling quest, clean classroom motifs, playful educational atmosphere` |
| 百科博物馆 | `museum exploration adventure cover, natural history and knowledge exhibits, labeled artifacts, warm discovery lighting, educational platformer mood` |
| 未来实验室 | `sci-fi learning lab cover art, holographic platforms, neon knowledge gates, futuristic educational adventure, clean high-tech atmosphere` |
| 纸片手账 | `paper craft notebook adventure cover, stickers, cutout platforms, warm hand-drawn educational game style, playful study journey` |
| 奇幻知识大陆 | `whimsical fantasy knowledge kingdom cover, glowing gates, magical scrolls, side-scrolling adventure, storybook educational atmosphere` |
| 清爽信息图 | `flat vector infographic adventure cover, clean geometric platforms, knowledge icons, calm modern educational interface style` |

完整提示词必须由 `STYLE_PROMPT_BASE + {{CORE_SUBJECT}} + {{CORE_THEME}} + 横版知识闯关 + 封面构图 + 无具体商业 IP` 组成。每张图的完整 prompt 至少包含 30 个英文词或等量详细描述。

### 生图结果 URL 处理

- 如果构建期生图工具返回的是 URL，而不是直接返回图片 bytes / Blob，必须先确认该 URL 在当前构建或页面环境中可读取为真实图片 Blob。
- URL 结果必须通过 MIME 类型检查、Blob 转换、图片 load 和 decode 校验后，才能写入交付物、写入 IndexedDB seed、或把 `cover_art.ready` 标记为 true。
- 如果生图结果返回 `http://.../__runtime/llm-images/...` 这类 runtime 临时图片 URL，必须在 `fetch` / `imageUrlToFile` / Blob 转换前，把同域 HTTP 临时 URL 规范化为 HTTPS 或同源相对 URL；不得直接 fetch 原始 HTTP 临时 URL。
- URL 不可读取、返回非图片、转 Blob 失败、MIME 不合法、load 失败或 decode 失败时，必须将 `cover_art` 标记为 `failed / ready = false`，不得把 URL 字符串本身当作已生成图片。

### 静态资产计划：IMAGE_ASSET_MANIFEST

构建阶段必须输出静态 `IMAGE_ASSET_MANIFEST`。示例结构：

```json
{
  "asset_manifest_version": "1.0.0",
  "image_generation_timing": "build-time",
  "assets": [
    {
      "id": "cover_art",
      "purpose": "title page cover artwork and main visual",
      "required": true,
      "plan_status": "required",
      "initial_runtime_status": "seed_available",
      "style_prompt_base": "{{STYLE_PROMPT_BASE}}",
      "prompt": "{{FULL_COVER_PROMPT}}",
      "negative_prompt": "no copyrighted characters, no brand logos, no unreadable text, no gore, no distorted UI, no low quality",
      "aspect_ratio": "16:9",
      "generation_timing": "build-time",
      "cache_key": "{{PROJECT_ID}}:1.0.0:cover_art:{{PROMPT_HASH}}",
      "prompt_hash": "{{PROMPT_HASH}}",
      "seed_source": {
        "type": "prebundled_asset",
        "path_or_data_url": "{{COVER_IMAGE_SEED}}"
      },
      "storage_driver": "indexeddb_blob",
      "safety_requirements": "must avoid copyrighted characters and unsafe visual content"
    }
  ]
}
```

静态计划层不得把未生成图片写成已完成状态。`seed_available` 只能表示构建期真实图片已经可作为种子，不等于浏览器运行时已经加载、解码并 ready。

### 运行时资产状态：IMAGE_ASSET_RUNTIME_STATE

运行时必须为封面图维护状态记录：

| 字段 | 要求 |
|------|------|
| `asset_id` | `cover_art` |
| `cache_key` | 与 manifest 一致 |
| `generation_status` | `generated` / `failed`；构建期 seed 可用时为 `generated` |
| `cache_status` | `not_checked` / `seed_loaded` / `cache_hit` / `cached` / `cache_corrupt` |
| `cached_blob_ref` | IndexedDB store 和 `cache_key`，不得存 object URL |
| `loaded` | 浏览器是否已加载图片 |
| `decoded` | 图片是否已完成解码 |
| `ready` | 只有 generated + cached/cache_hit/seed_loaded + loaded + decoded 且安全检查通过才为 true |
| `error` | 失败原因，成功时为空 |

### IndexedDB 缓存记录

如果实现将构建期封面写入 IndexedDB，记录至少包含：

| 字段 | 要求 |
|------|------|
| `cache_key` | 稳定缓存键 |
| `asset_id` | `cover_art` |
| `asset_manifest_version` | 当前资产清单版本 |
| `prompt_hash` | prompt + style prompt base + negative prompt + manifest version 的哈希 |
| `blob` | 封面图片 Blob |
| `mime_type` | `image/png` / `image/jpeg` / `image/webp` |
| `created_at` | 首次写入时间 |
| `updated_at` | 最近更新时间 |
| `status` | `cached` / `failed` |
| `error` | 失败原因，成功时为空 |

### 生图失败和无图片兜底

- 如果构建期无法调用真实生图工具，必须明确告知需要生图能力，不得用 CSS / SVG / Canvas 冒充封面图。
- 如果封面图生成失败、转 Blob 失败、load/decode 失败、缓存写入失败或安全检查失败，`cover_art.ready` 必须保持 `false`。
- 产品可以进入明确标记的无封面兜底标题页，使用程序化 UI、标题、SVG 装饰和 CSS 背景维持可玩性；但这不是生图成功路径，不能把兜底图登记为生成图。
- 失败状态必须保留重试入口或实现阶段重试说明。
- localStorage 只能存轻量状态、版本和进度，不得保存图片、base64、大 data URL、Blob 字符串或 object URL。

## 七、功能清单

### P0 功能

| 功能 | 解决的问题 | 输入 | 输出 |
|------|------------|------|------|
| 标题页与开始 | 进入游戏并建立知识冒险主题 | 用户点击开始 | 进入章节选择页 |
| 章节选择 | 展示由内容文件生成的章节关卡和星级 | 已填充章节数据、用户进度 | 可进入关卡、锁定关卡、星级状态 |
| 横版关卡操控 | 提供移动、跳跃、冲刺、攻击的游戏体验 | 键盘 / 触屏输入 | 角色位置、速度、动画、碰撞反馈 |
| 题目触发物 | 将知识题放入关卡空间 | 玩家碰撞 / 攻击 / 对话 | 打开题目弹窗或题目战斗态 |
| 混合题型答题 | 支持不同知识结构 | 题目数据、用户作答 | 正误结果、解析、题目状态 |
| 答错扣生命 | 形成风险和反馈 | 错误答案 | 生命减少、解析显示、受伤动画 |
| 通关判定 | 按答对率控制进度 | 本关答对数 / 总题数 | 终点门开启或提示补答 |
| 三星结算 | 给出掌握程度反馈 | 答对率、生命、耗时、错题 | 星级、错题列表、下一关入口 |
| 错题回看 | 支持复习闭环 | 本关错题记录 | 题目、答案、解析、来源标签 |
| 进度存档 | 保留章节解锁和星级 | 用户完成数据 | localStorage 轻量进度记录 |

### P1 功能

| 功能 | 说明 |
|------|------|
| 检查点 | 生命归零或掉落后从最近检查点重试 |
| 道具奖励 | 宝箱题答对后获得生命、护盾、短时加速或星星粒子 |
| 章节地图主题变化 | 根据内容主题改变平台材质、粒子和装饰 |
| 限时挑战模式 | 可选，不影响主线；用于刷星或复习 |
| 题目筛选复玩 | 仅重玩错题或低掌握知识点 |
| 无封面模式提示 | 封面图失败时仍可进入游戏，但标题页标记为无封面兜底 |

## 八、用户动线

### 标准动线

```text
打开 app
→ 载入构建期封面图 / 检查封面运行时状态
→ 标题页
→ 章节选择页
→ 选择已解锁章节
→ 关卡准备页
→ 横版关卡主界面
→ 移动 / 跳跃 / 冲刺 / 攻击
→ 接触题目触发物
→ 作答
→ 答对解除阻挡或获得奖励 / 答错扣生命并显示解析
→ 达到 50% 答对率后终点门开启
→ 到达终点
→ 结算星级
→ 错题回看 / 重玩刷星 / 下一关
```

### 封面失败动线

```text
打开 app
→ 封面图加载 / 解码 / 缓存状态失败
→ 标题页进入无封面兜底视觉
→ 显示封面资产失败状态和重试入口
→ 用户仍可开始游戏
→ 核心关卡不依赖封面图，继续正常游玩
```

### 本关失败动线

```text
答错或受伤
→ 生命减少
→ 生命归零
→ 本关失败面板
→ 展示本轮答对率、错题和建议
→ 从起点或检查点重试
```

## 九、信息结构

### 页面结构

| 页面 / 状态 | 内容 | 主要交互 |
|-------------|------|----------|
| 标题页 | 封面图或无封面兜底、游戏标题、开始、继续、设置 | 开始游戏、继续进度、重试封面 |
| 章节选择页 | 章节关卡、星级、锁定态、进度摘要 | 选择章节、查看星级、进入错题回看 |
| 关卡准备页 | 章节标题、学习目标、题目数量、操作提示 | 开始关卡 |
| 横版关卡页 | 玩家、平台、题目触发物、敌人、HUD、终点门 | 移动、跳跃、冲刺、攻击、暂停 |
| 答题弹窗 | 题干、题型控件、选项、提交、解析区 | 作答、提交、查看解析 |
| 结算页 | 答对率、星级、生命余量、错题、来源标签 | 下一关、重玩、回看错题 |
| 错题回看页 | 错题列表、正确答案、解析、知识点标签 | 复习、返回章节、重玩错题 |
| 设置页 | 音效开关、动效偏好、输入说明、重置进度 | 调整设置 |

### 关卡内信息层级

1. 玩家与平台碰撞信息最高优先级。
2. 题目触发物和终点门第二优先级。
3. 敌人、危险物、奖励第三优先级。
4. 装饰、粒子、背景最低优先级。

题目弹窗出现时，题干和选项优先于所有关卡元素。弹窗应阻止误触移动按钮或攻击按钮。

## 十、数据设计

### 构建阶段产品数据

```ts
type SourceFile = {
  id: string;
  path: string;
  title: string;
  covered_module: string;
  full_text_digest: string;
};

type KnowledgeChapter = {
  id: string;
  title: string;
  source_file_ids: string[];
  source_refs: SourceRef[];
  learning_goal: string;
  key_concepts: string[];
  difficulty: "intro" | "normal" | "advanced" | "mixed";
  visual_theme_tags: string[];
};

type SourceRef = {
  file_path: string;
  section_title?: string;
  paragraph_id?: string;
  quote_or_locator: string;
};

type Question = {
  id: string;
  chapter_id: string;
  type: "single_choice" | "multi_choice" | "true_false" | "fill_blank" | "ordering" | "matching" | "scenario_choice";
  difficulty: 1 | 2 | 3 | 4 | 5;
  knowledge_tags: string[];
  prompt: string;
  options?: QuestionOption[];
  blanks?: BlankSpec[];
  ordering_items?: OrderingItem[];
  matching_pairs?: MatchingPair[];
  correct_answer: unknown;
  explanation: string;
  common_mistake?: string;
  source_refs: SourceRef[];
};

type LevelDefinition = {
  id: string;
  chapter_id: string;
  title: string;
  target_question_count: number;
  pass_rate: 0.5;
  star_thresholds: {
    one_star: 0.5;
    two_star: 0.7;
    three_star: 0.9;
  };
  initial_lives: number;
  checkpoints: Checkpoint[];
  terrain: TerrainSegment[];
  question_nodes: QuestionNode[];
  enemies: EnemyDefinition[];
  rewards: RewardDefinition[];
  exit_gate: ExitGateDefinition;
};
```

### 题目触发物数据

```ts
type QuestionNode = {
  id: string;
  question_id: string;
  node_type: "question_block" | "scroll" | "knowledge_gate" | "chest" | "npc" | "barrier" | "enemy_weakness";
  position: { x: number; y: number };
  size: { width: number; height: number };
  required_for_route: boolean;
  completed: boolean;
  retry_allowed: boolean;
  visual_state: "idle" | "hover" | "triggered" | "correct" | "wrong_pending_retry" | "completed";
};
```

### 运行时用户进度

```ts
type UserProgress = {
  version: string;
  unlocked_level_ids: string[];
  level_results: Record<string, LevelResult>;
  settings: UserSettings;
  cover_asset_state?: RuntimeImageAssetState;
};

type LevelResult = {
  level_id: string;
  best_correct_rate: number;
  best_stars: 0 | 1 | 2 | 3;
  completed: boolean;
  attempts: number;
  wrong_question_ids: string[];
  last_played_at: string;
};

type LevelRunState = {
  level_id: string;
  lives: number;
  answered_question_ids: string[];
  correct_question_ids: string[];
  wrong_question_ids: string[];
  current_checkpoint_id: string;
  player_position: { x: number; y: number };
  gate_unlocked: boolean;
  paused_reason?: "question_open" | "menu" | "level_complete" | "life_zero";
};
```

### 图片资产数据

```ts
type ImageAssetManifestItem = {
  id: "cover_art";
  purpose: string;
  required: boolean;
  plan_status: "required" | "optional";
  initial_runtime_status: "pending" | "seed_available";
  style_prompt_base: string;
  prompt: string;
  negative_prompt: string;
  aspect_ratio: "16:9";
  generation_timing: "build-time";
  cache_key: string;
  prompt_hash: string;
  seed_source: { type: "prebundled_asset" | "prebundled_data_url" | "none"; value?: string };
  storage_driver: "indexeddb_blob";
  safety_requirements: string;
};

type RuntimeImageAssetState = {
  asset_id: "cover_art";
  cache_key: string;
  generation_status: "pending" | "generated" | "failed";
  cache_status: "not_checked" | "seed_loaded" | "cache_hit" | "cached" | "cache_corrupt";
  cached_blob_ref?: { db: string; store: string; cache_key: string };
  loaded: boolean;
  decoded: boolean;
  ready: boolean;
  error?: string;
};

type IndexedDBImageCacheRecord = {
  cache_key: string;
  asset_id: "cover_art";
  asset_manifest_version: string;
  prompt_hash: string;
  blob: Blob;
  mime_type: "image/png" | "image/jpeg" | "image/webp";
  created_at: string;
  updated_at: string;
  status: "cached" | "failed";
  error?: string;
};
```

### 存储约束

- localStorage 只能保存用户进度、设置、轻量版本号和封面运行时摘要。
- localStorage 不得保存图片、base64、大 data URL、Blob 字符串、object URL 或生成结果。
- IndexedDB 用于图片 Blob 缓存和必要的资产元数据。
- object URL 只用于本次会话展示，刷新后必须从 IndexedDB Blob 或构建期 seed 重新创建，并在替换或卸载时释放。

## 十一、交互设计

### 输入映射

| 输入 | 动作 | 说明 |
|------|------|------|
| A / ← | 左移 | 横版移动 |
| D / → | 右移 | 横版移动 |
| W / ↑ / Space | 跳跃 | 可二段跳与否由实现决定，但默认单跳 |
| Shift | 冲刺 | 有冷却和拖尾反馈 |
| J / 鼠标按钮 | 攻击 | 击退敌人或触发可攻击对象 |
| E / Enter | 互动 / 提交 | 与 NPC、宝箱、知识门交互；答题时提交 |
| Esc | 暂停 | 打开暂停菜单 |
| 触屏左侧虚拟摇杆 / 按钮 | 移动 | 横屏移动端 |
| 触屏右侧按钮 | 跳跃 / 冲刺 / 攻击 | 稳定占位，不遮挡题目 |

### 操作反馈

| 操作 | 视觉反馈 | 状态反馈 |
|------|----------|----------|
| 移动 | run 动画、脚步尘埃 | 速度更新 |
| 跳跃 | 起跳压缩、上升姿态、落地尘埃 | 垂直速度和落地状态 |
| 冲刺 | 方向拖尾、短暂加速线 | 冲刺冷却 |
| 攻击 | slash 弧线、命中火花 | 攻击窗口、敌人击退 |
| 触发题目 | 触发物弹起 / 发光 / 展开 | 地图暂停，题目打开 |
| 答对 | 成功粒子、触发物完成态 | 答对数 +1，可能开门 |
| 答错 | 角色受伤、错误提示、生命减少 | 错题记录，解析显示 |
| 终点门开启 | 门发光、锁链断开 | `gate_unlocked = true` |
| 通关 | 星级动画、通关转场 | 存档更新 |

### 答题交互

- 题目打开后默认暂停关卡移动和伤害。
- 选择题和判断题点击选项后进入 selected 态，再点击提交。
- 填空题必须支持键盘输入和移动端输入，空值不能提交。
- 排序题和连线 / 匹配题必须有拖拽态、目标吸附态和错误回弹态。
- 多选题必须显示已选数量或选择状态，避免误提交。
- 提交后必须显示正确答案和解析；答错时先扣生命，再允许关闭解析。

## 十二、核心机制约束

### 不可更改的玩法规则

- 每个知识章节映射为一关。
- 每关默认约 10 题，可根据内容规模微调，但不能少到无法形成答对率评价。
- 通关阈值固定为答对率 50%。
- 星级阈值固定为：50% = 1 星，70% = 2 星，90% = 3 星。
- 答错必须扣生命并显示解析。
- 生命归零必须触发本关失败或检查点重试。
- 达不到 50% 答对率时，终点门不得开启或不得结算为通关。
- 玩家必须能通过移动、跳跃、冲刺和攻击参与关卡，不得退化为纯答题列表。

### 内容映射约束

- 题目、答案、解析、章节归属、知识标签和难度必须从完整内容文件中提取或基于可验证知识补全。
- 关卡地形、敌人、道具和粒子可以由 AI 创作，但不得改变知识事实。
- 错误选项应来自常见误区、相近概念、易混对象或内容文件中的冲突点。
- 题目触发物的类型应服务题目含义：关键规则用知识门，奖励题用宝箱，应用题用 NPC，误区题可用敌人弱点。

### 准确性模式约束

本产品使用 `strict` 准确性模式：

- 不允许虚构关键知识。
- 题目答案必须经过验证。
- 解析必须能说明为什么正确和为什么常见错误不成立。
- 公式、单位、时间线、人物关系、实验现象、定义和术语必须正确。
- 验收时必须抽查题目与内容文件原文的对应关系。

### 产品形态约束

最终用户体验的是已经填充完成的游戏。读取内容文件、提取章节、生成题库、生成关卡数据和构建期封面图属于构建阶段动作，不得做成最终用户必须操作的上传 / 生成流程。

本 spec 是可填充玩法框架。以下内容由 `skills/内容文件` 填入：

- `{{CORE_SUBJECT}}`
- `{{CHAPTER_TITLE}}`
- `{{LEARNING_GOAL}}`
- `{{QUESTION_PROMPT}}`
- `{{CORRECT_ANSWER}}`
- `{{EXPLANATION}}`
- `{{COMMON_MISTAKE}}`
- `{{SOURCE_REF}}`
- `{{VISUAL_THEME_TAGS}}`

## 十三、内容 / 章节概览

### 章节生成规则

| 内容情况 | 章节 / 关卡生成方式 |
|----------|---------------------|
| 内容文件已有明确章节 | 每章映射为一关 |
| 内容文件是题库 | 按知识标签或难度聚类为关卡 |
| 内容文件是百科 / 条目 | 按类别、主题或对象关系生成关卡 |
| 内容文件是流程 / 方法 | 按步骤阶段生成关卡 |
| 内容文件是混合材料 | 先聚类成 4-8 个主题关卡，再为每关抽取约 10 题 |

### 单关内容结构

| 关卡段落 | 题目与玩法 | 目的 |
|----------|------------|------|
| 起点教学段 | 1 道简单题 + 操作提示 | 进入主题、熟悉控制 |
| 前半段 | 3-4 道基础和概念题 | 建立知识信心 |
| 中段挑战 | 2-3 道应用题、匹配题或排序题 | 检查理解 |
| 后半段 | 2-3 道难度较高或综合题 | 冲刺星级 |
| 终点门 | 显示答对率和剩余要求 | 执行 50% 通关阈值 |

### 题目分布建议

- 每关约 10 题。
- 基础题 40%，应用题 40%，综合 / 易错题 20%。
- 题型混合，但每关至少包含 2 种题型。
- 关键路径题不宜全部高难，否则会阻断体验。
- 宝箱题可以略高难，作为额外奖励和刷星动力。

### 章节占位结构

| 章 | 关卡标题 | 知识来源 | 题量 | 视觉主题 | 终点目标 |
|----|----------|----------|------|----------|----------|
| `{{CHAPTER_INDEX}}` | `{{CHAPTER_TITLE}}` | `{{SOURCE_REF}}` | `{{QUESTION_COUNT}}` | `{{VISUAL_THEME_TAGS}}` | `{{LEARNING_GOAL}}` |

## 十四、技术约束

- 推荐实现为单页 Web 游戏，可使用 HTML / CSS / JavaScript / TypeScript。
- 横版关卡可使用 Canvas 主循环 + SVG/DOM UI 混合方案；核心碰撞和运动逻辑必须稳定。
- 不得依赖远程商业 IP 资源、未授权字体、未授权角色或未授权音效。
- 可使用轻量游戏循环实现，但若引入外部库，必须保证部署可用、体积合理、不会破坏离线体验。
- 帧率目标：桌面和平板 ≥ 45fps，最低不得长期低于 30fps。
- 横屏优先；移动端必须提示横屏，并提供可用的触屏虚拟按键。
- 题目弹窗和结算页必须适配桌面、平板、移动横屏。
- localStorage 用于轻量进度；IndexedDB 用于封面图片 Blob 缓存。
- 前端不得硬编码任何私密 API key。
- 构建期封面图必须真实生成；如果没有生图能力，不得交付声称完成的封面图片体验。
- 核心关卡视觉不得依赖封面图，封面失败不应阻止玩家进入游戏。

## 十五、开发指引

1. 读取完整内容文件：遍历 `skills/` 中所有相关文件，读取全文，建立文件路径、章节、段落和知识点索引。
2. 提取知识结构：识别章节 / 模块 / 单元、核心概念、规则、过程、对象关系、常见误区、案例和难度线索。
3. 生成题库：为每章生成约 10 道混合题，写入答案、解析、难度、知识标签和 `source_refs`。
4. 校验题库：检查每道题是否可追溯，答案是否唯一或规则清晰，解析是否准确。
5. 生成关卡数据：每章一关，放置题目触发物、平台、敌人、奖励、检查点和终点门。
6. 生成构建期封面图：根据内容主题选择 `STYLE_PROMPT_BASE`，调用真实生图工具，输出封面图和 `IMAGE_ASSET_MANIFEST`。
7. 实现封面资产链路：加载构建期图片，必要时写入 IndexedDB Blob；运行时创建 object URL、load/decode，设置 ready；失败时进入无封面兜底。
8. 实现横版引擎：角色状态机、重力、碰撞、移动平台、敌人巡逻、攻击判定、触发物碰撞。
9. 实现答题系统：支持选择、判断、填空、排序、匹配、情境题；题目打开时暂停或半暂停关卡。
10. 实现进度系统：答对率、生命、终点门、星级、章节解锁、错题回看和 localStorage 存档。
11. 实现高质量 UI：标题、HUD、章节页、题目弹窗、结算页、设置页都使用主题化样式。
12. 实现响应式横屏：桌面、平板和移动横屏均可操作；长文本不溢出。
13. 执行自检：内容准确性、生图链路、碰撞稳定性、星级阈值、生命扣除、错题回看、响应式和无障碍。

## 十六、验收标准

### 功能验收

- [ ] 最终用户打开产品后可以直接进入已填充完成的知识闯关游戏。
- [ ] 每个章节映射为一关，每关约 10 道题。
- [ ] 玩家可以移动、跳跃、冲刺、攻击，并通过接触题目触发物进入答题。
- [ ] 支持选择、判断、填空、排序、匹配、情境题中的多种题型。
- [ ] 答对后题目触发物进入完成态，并更新答对率。
- [ ] 答错后扣生命、显示解析并记录错题。
- [ ] 生命归零触发本关失败或检查点重试。
- [ ] 答对率不足 50% 时不能通关。
- [ ] 50% / 70% / 90% 星级阈值准确生效。
- [ ] 结算页展示答对率、星级、错题和下一步操作。

### 随附内容文件验收

- [ ] 实现者读取了每个内容文件全文。
- [ ] 每个关卡能追溯到对应内容文件和章节 / 知识簇。
- [ ] 每道题有 `source_refs`，指向原文位置或可验证依据。
- [ ] 题目、答案、解析、难度和知识标签不是凭空编造。
- [ ] 错误选项来自常见误区、相近概念或内容文件中的易混点。

### 生图验收

- [ ] 封面图由真实生图模型 / 工具 / API 在构建期生成。
- [ ] 没有用 CSS、SVG、Canvas、emoji 或文字占位冒充封面生图。
- [ ] 已输出静态 `IMAGE_ASSET_MANIFEST`，包含 asset id、purpose、required、plan status、initial runtime status、style prompt base、full prompt、negative prompt、aspect ratio、generation timing、cache key、prompt hash、seed source、storage driver 和安全要求。
- [ ] 封面图 prompt 至少包含 30 个英文词或等量详细描述，并和内容主题相关。
- [ ] 如果生图工具返回 URL，已完成可读取性、Blob 转换、MIME、load 和 decode 校验。
- [ ] 如果返回 `http://.../__runtime/llm-images/...` runtime 临时图 URL，已先规范化为 HTTPS 或同源相对 URL，再进行 fetch / Blob 转换。
- [ ] 若封面图作为 seed 写入 IndexedDB，缓存记录包含 Blob、MIME、prompt hash、版本和时间戳。
- [ ] 页面展示封面时使用真实图片资源；若从 IndexedDB 读取，则通过 Blob 创建本次会话 object URL。
- [ ] object URL 不长期存储，刷新后重新从 Blob 或 seed 创建。
- [ ] 封面生成、加载、解码或缓存失败时，`ready = false`，产品进入明确的无封面兜底标题页，并保留重试入口或实现阶段重试说明。

### 高精度 SVG / Canvas / CSS 可视化验收

- [ ] 核心关卡不是静态图片、不是纯文字、不是无交互 SVG 装饰。
- [ ] 玩家角色有 idle、run、jump、dash、attack、hurt、dead 等状态。
- [ ] 平台碰撞盒与视觉平台基本一致，不出现明显穿模或误判。
- [ ] 移动平台连续插值，玩家站上后不抖动、不掉落。
- [ ] 题目触发物具备未触发、触发、答对、答错待重试、完成等视觉状态。
- [ ] 攻击动画有命中窗口、冷却和命中反馈。
- [ ] 终点门锁定 / 开启状态清楚，并与 50% 通关阈值绑定。
- [ ] HUD 中生命、答对率和星级阈值稳定显示，不因数值变化跳动。
- [ ] hover、active、selected、dragging、locked、correct、incorrect、disabled 等状态有明确视觉反馈。
- [ ] 参数变化和状态切换有连续过渡，不能瞬切。
- [ ] `prefers-reduced-motion` 下关闭装饰动效但保留核心反馈。
- [ ] 已避免常见画错点：碰撞错位、题目弹窗期间继续受伤、星级误判、移动端按键遮挡等。

### 交互验收

- [ ] 桌面键盘操作完整可用。
- [ ] 移动端横屏虚拟按钮完整可用。
- [ ] 题目弹窗打开时不会误触关卡操作。
- [ ] 长题干、长选项和长解析不溢出、不遮挡按钮。
- [ ] 拖拽题有拖拽态、吸附态和错误回弹态。
- [ ] 暂停、重试、返回章节和继续下一关路径清楚。

### 数据验收

- [ ] 构建阶段数据和运行时用户进度数据分离。
- [ ] `Question`、`LevelDefinition`、`QuestionNode`、`UserProgress` 等 Schema 字段服务本产品玩法。
- [ ] localStorage 不保存图片、base64、大 data URL、Blob 字符串或 object URL。
- [ ] IndexedDB 仅用于图片 Blob 和必要资产元数据。
- [ ] 存档版本变化时有兼容或重置策略。

### 响应式验收

- [ ] 桌面横屏、平板横屏、移动横屏均可完整游玩。
- [ ] 移动端提示横屏，不在竖屏下强行挤压关卡。
- [ ] HUD、虚拟按键、题目弹窗和结算页互不遮挡。
- [ ] 文本在按钮、卡片、弹窗和 HUD 内不溢出。

### 准确性 / 一致性验收

- [ ] strict 模式下关键知识不被虚构或戏剧化改写。
- [ ] 答案、解析、公式、单位、时间线、术语和关系正确。
- [ ] 若内容文件是科学、历史、法律、医学、真实传记等高风险领域，题目和解析必须经过额外事实核验。
- [ ] 游戏化外观不改变知识结论。

### 产品形态验收

- [ ] 最终用户动线从已完成游戏入口开始，不要求上传内容或点击生成。
- [ ] 内容读取、题库生成、关卡填充和封面生图属于构建阶段。
- [ ] spec 主要定义玩法结构、内容槽位、映射规则和约束，而不是提前写死某一套具体题库。
- [ ] 任意新内容文件替换后，仍可按同一框架生成章节关卡、题库和验收数据。
