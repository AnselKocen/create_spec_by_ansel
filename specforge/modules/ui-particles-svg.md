# UI / SVG / 粒子模块

最终 spec 的视觉部分应把 UI 当作主题的一部分，而不是默认网页样式。

## 标题设计

- 游戏标题不能只是普通 `<h1>`。
- 标题必须有主题化字体效果：`text-shadow`、`background-clip: text`、描边、渐变、字距、入场动画等。
- 可用 SVG 装饰元素围绕标题，例如藤蔓、波浪、齿轮、星星、裂痕、像素边框。

## 粒子 / 氛围效果库

| 效果 | 适用主题 | 实现要点 |
|------|----------|----------|
| 花瓣飘落 | 自然、日系、田园 | SVG 花瓣 + CSS animation，随机起点/速度/旋转 |
| 星星闪烁 | 太空、夜晚、魔法 | CSS opacity + scale 脉动，不同周期错开 |
| 气泡上浮 | 海洋、饮品、化学 | CSS/Canvas 上浮 + 轻微左右摆动 |
| 萤火虫漂浮 | 森林、童话 | CSS 光点 + 轻量 JS 随机缓动 |
| 灰烬/火星 | 火焰、战争、废墟 | CSS animation 上浮 + opacity 渐隐 |
| 落叶旋转 | 秋天、怀旧 | SVG 叶子 + CSS rotate |
| 光斑漂移 | 梦幻、森林、水面 | CSS radial-gradient 大光斑，周期 ≥ 15s |
| 雨线 | 阴郁、悬疑 | CSS 细线快速下落 |
| 尘埃漂浮 | 古老、图书馆、恐怖 | 极小低透明度圆点缓慢漂浮 |
| 代码雨 | 科技、黑客 | Canvas 或 CSS 字符流 |
| 音符飘浮 | 音乐 | SVG 音符 + 上浮动画 |
| 几何碎片 | 抽象、孟菲斯、现代 | CSS 三角/圆/十字缓慢旋转 |
| 烟雾/雾气 | 神秘、恐怖、仙侠 | 模糊 radial-gradient 极慢漂移 |
| 像素粒子 | 像素艺术、复古 | 小方块，步进式运动 |

约束：
- 粒子数量通常 10-30 个。
- 粒子不得遮挡核心内容，不得拦截点击，必要时 `pointer-events: none`。
- 尊重 `prefers-reduced-motion`。

## SVG / CSS 设计技巧

- 游戏角色/对象：SVG path/circle/polygon 组合，CSS transform 做动画。
- UI 图标：内联 SVG，使用 `currentColor` 继承主题色。
- 装饰边框：SVG path 做波浪、裂痕、藤蔓、锯齿、邮票边。
- 进度条：SVG rect/circle + `stroke-dasharray`。
- 未解锁态：剪影、迷雾、马赛克、信封、化石待挖掘等主题化设计。
- 按钮：避免默认样式，可用 clip-path、发光描边、贴纸感、毛玻璃、像素边框等。
- 状态反馈：hover/active 要结合颜色、位移、缩放、阴影或光效，不能只变颜色。

## 高精度 SVG / CSS 可视化

如果 SVG / Canvas 是核心体验，而不是装饰元素，必须同时遵守 `specforge/modules/svg-css-visual-primitives.md`。

最终 spec 需要写出领域专项绘制指南，包括：

- 哪些对象用 SVG、哪些过程用 Canvas、哪些读数/控件用 HTML/CSS。
- 常见对象的 SVG/CSS 质感配方，例如渐变、滤镜、高光、mask、clipPath、pattern、stroke-dasharray。
- 核心动效如何表达机制或数据变化，而不是只做装饰。
- 标注、图例、单位、数据编码和动态避让。
- hover、dragging、locked、selected、correct、incorrect 等交互态具体怎么画。
- 本领域常见画错点和不可降级项。
