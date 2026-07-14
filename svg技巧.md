# SVG 技巧

这份文件单独整理高质量 SVG 的通用技巧。它不接入 `specforge` 流程，只作为写 spec 或实现可视化时的参考笔记。

核心原则：SVG 不只是装饰图，而是一个可命名、可分层、可交互、可验证的矢量场景。

## 1. 坐标与 viewBox

- 为核心图形定义稳定 `viewBox`，例如 `0 0 1200 760`。
- 所有关键对象、路径、标签锚点、热区都使用同一套场景坐标。
- 响应式缩放交给外层容器和 `viewBox`，不要给每个子元素写互相抵消的 `scale`。
- 数据型 SVG 要有集中化 scale 函数，把数据域转换到坐标域。
- 需要保持描边视觉稳定时，考虑 `vector-effect="non-scaling-stroke"`。
- 移动端允许折叠控制面板，但不应压扁核心图形比例。

示例：

```text
核心 SVG 使用 viewBox="0 0 1200 760"。
地图 / 实验台 / 结构图使用场景坐标；控制面板和读数使用 HTML/CSS。
数据坐标转换集中在 scale 函数中，不把魔法数字散落在 path 字符串里。
```

## 2. 语义图层

建议按职责拆分图层，而不是把所有 path 堆在一起。

| 图层 | 作用 | 典型内容 |
|------|------|----------|
| `defs-layer` | 资源定义 | gradient、pattern、filter、marker、symbol、clipPath、mask |
| `base-layer` | 背景和底板 | 坐标网格、地图底图、实验台轮廓、结构外形 |
| `data-layer` | 核心结构和数据 | 曲线、场线、箭头、器皿、节点、路线 |
| `texture-layer` | 材质和光影 | 高光、阴影、纹理、透明液体、地形阴影 |
| `motion-layer` | 少量 SVG 动效 | 沿路径移动的点、流向箭头、脉冲环 |
| `label-layer` | 标注和图例 | 标签、单位、引线、数值读数 |
| `hit-layer` | 透明交互热区 | 宽 stroke、透明 fill、拖拽区域 |
| `feedback-layer` | 反馈覆盖 | 选择框、正确/错误光圈、提示箭头 |

要点：

- `hit-layer` 与可见图形分离，别为了好点而把真实数据线画粗。
- `feedback-layer` 覆盖在上方，但不永久改写数据颜色。
- 标签和反馈要有锚点、引线或明确位置规则。

## 3. defs 资产库

重复使用的 SVG 资源尽量集中在 `defs` 或组件库里。

- `linearGradient` / `radialGradient`：统一光照、液体、能量、地形、玻璃、组织质感。
- `pattern`：网格、纸纹、显微颗粒、岩层、刻度、机械纹理。
- `filter`：共享阴影、辉光、轻微模糊、内发光。
- `marker`：箭头、流向、力方向、电流方向、路径端点。
- `clipPath`：液体限制在器皿内、地图裁切、器官剖面、卡片遮罩。
- `mask`：渐隐边缘、透明玻璃、扫描光、局部视野。
- `symbol` + `use`：重复图标、节点、细胞器、粒子、刻度、按钮纹样。

规则：重复出现 3 次以上的子图形，优先抽成 `symbol/use` 或组件；重复渐变、滤镜、marker 要统一命名和复用。

## 4. 设计 token

把颜色、线宽、透明度、阴影、动画时长、状态色写成 token。

| token 类型 | 示例 |
|------------|------|
| 语义色 | `--terrain-high`、`--water-flow`、`--force-vector` |
| 线宽 | `--stroke-thin`、`--stroke-data`、`--stroke-hit` |
| 透明度 | `--alpha-glass`、`--alpha-grid`、`--alpha-disabled` |
| 动效 | `--duration-fast`、`--duration-sim`、`--ease-out` |
| 反馈 | `--feedback-correct`、`--feedback-wrong`、`--selection-halo` |

注意：

- 数据颜色和反馈颜色分离。红色不能同时表示高温、错误、危险、动脉血、人口密度。
- `currentColor` 适合图标和 UI SVG，不适合多变量数据图。
- 深浅主题切换不能简单反相数据语义色。

## 5. 路径质量与描边

- 曲线使用 `path` 的 C/Q 命令或平滑算法，不用大量折线假装曲线。
- 结构性直线对齐坐标网格，减少模糊边缘。
- 根据对象选择 `stroke-linecap` 和 `stroke-linejoin`。
- 多层描边可以提升质感：底层宽描边做辉光，中层承载数据，顶层细线做高光。
- 命中热区用透明宽描边，不改变可见线宽。
- 动画路径可用 `pathLength="1"` 统一 `stroke-dasharray` / `stroke-dashoffset` 的尺度。

常用组合：

```text
可点击细线 = 可见 2px data stroke + 透明 14px hit stroke。
发光场线 = 模糊宽 stroke 底层 + 清晰细 stroke 上层 + 沿 path 的小粒子。
水流/电流方向 = path + marker 箭头 + dashoffset 缓动。
```

## 6. 数据到几何的映射

图形承载数据时，要明确映射规则：

- 数值映射到长度、角度、面积、颜色、透明度、线宽或粒子密度时，要有上下界。
- 面积编码不要直接用半径线性映射，否则面积感知会失真。
- 连续变量用连续色带，类别变量用离散色。
- 颜色、线宽、透明度、粒子密度不要同时塞太多变量。
- 参数变化需要连续插值，不要瞬切。
- 问答反馈不要覆盖数据编码；用 halo、外描边、角标或反馈层。

## 7. 命名与可追踪性

- 每个核心对象使用 `<g>` 分组。
- 分组带稳定 `id`、`data-entity-id`、`data-source-ref` 或类似字段。
- `id` 表达领域含义，如 `force-vector-gravity`、`beaker-liquid-hcl`、`cell-membrane-main`。
- 不要把核心场景做成一团匿名 path。

示例：

```html
<g id="bio-cell-membrane" data-entity-id="cell.membrane" data-source-ref="{{SOURCE_REF}}">
  <path class="membrane-outline" />
  <path class="membrane-highlight" />
  <path class="membrane-hit-zone" />
</g>
```

## 8. 标注、图例与避让

- 标注由锚点、引线、文本、背景垫片组成。
- 标签锚定到数据对象或结构对象；对象移动时标签跟随或重排。
- 密集场景用编号标签 + 侧栏解释，避免文字压住图形。
- 移动端可以折叠长说明，但单位、图例和关键标签不能消失。
- 数值读数使用等宽数字或稳定宽度容器，避免跳动。
- 标签碰撞要有规则：错行、引线转折、优先级隐藏、悬停展开。

## 9. 交互热区与状态

| 状态 | 技巧 |
|------|------|
| hover | 由透明热区捕获事件，可见对象显示外轮廓、轻 halo 或标签 |
| focus | 键盘可达，显示清晰 focus ring |
| dragging | 被拖对象临时抬升到交互层，显示辅助线、吸附点或坐标读数 |
| selected | 用外层描边、角标、halo 或独立符号表达 |
| locked | 降低控制层透明度，保留已选对象和必要标签 |
| correct | 短时反馈覆盖层，随后回到原始语义图 |
| incorrect | 短时错误反馈和原因指示，不永久染色 |
| disabled | 降低透明度和交互暗示，避免误导 |

移动端可点击目标建议不小于 40 CSS px。正误反馈要解释原因，不能只闪颜色。

## 10. SVG / Canvas / HTML 的边界

| 技术 | 适合负责 |
|------|----------|
| SVG | 精确结构、路径、标签、热区、图例、坐标轴、可点击对象 |
| Canvas | 大量粒子、连续流体、扩散、噪声场、碰撞、实时模拟 |
| HTML/CSS | 控件、读数、面板、表格、按钮、toast、响应式布局 |

推荐：SVG 画结构骨架和交互热区；Canvas 画连续粒子和背景流场；HTML/CSS 画控制面板和数值读数。三者共享同一套状态数据。

## 11. 动画与低动效

- 核心演示动效表达因果、方向、过程、变量变化，不能完全删除。
- 装饰动效如背景漂浮、闪烁、光效，可在低动效模式关闭。
- 连续模拟使用 `requestAnimationFrame` 或状态驱动插值。
- SVG 适合少量路径动画、dash 动画、transform、opacity、marker 方向变化。
- 大量粒子不要用大量 DOM 节点硬跑，应转 Canvas。
- `prefers-reduced-motion` 下保留核心机制演示的低频版本。

## 12. 性能与维护

- 大量重复形状使用 `symbol/use`、组件或 Canvas。
- 滤镜数量要少且复用，避免对大面积元素使用高开销模糊。
- 动画属性优先用 `transform`、`opacity`、`stroke-dashoffset`。
- 高频更新不要每帧重建整棵 SVG。
- 复杂场景按图层更新，参数变化只更新受影响的图层。
- 不在 `localStorage` 存 SVG 大字符串；运行时只保存轻量参数和进度。

## 13. 常见错误

- 只有一张漂亮但不可交互、不可追踪的 SVG 装饰图。
- 没有稳定 `viewBox`，移动端压扁或裁掉核心图形。
- 核心场景由匿名 path 堆成，无法追踪对象。
- 可点击细线没有独立热区，移动端难以操作。
- 正误反馈直接改写数据颜色，导致语义丢失。
- 图例、单位、坐标轴或标签缺失。
- 大量粒子用成百上千个 DOM 节点，导致卡顿。
- 每个元素单独创建滤镜/渐变，DOM 膨胀且风格不统一。
- 参数变化瞬切，用户看不出因果。
- `prefers-reduced-motion` 直接删除核心演示，导致机制不可理解。

## 14. 快速模板

```text
核心 SVG 采用稳定 viewBox：{{VIEWBOX}}。
图层按 defs / base / data / texture / motion / label / hit / feedback 组织。
重复图形、渐变、滤镜、marker、clipPath、mask 放入 defs 或组件库。
颜色、线宽、透明度、动画时长、反馈色使用语义 token。
可交互对象同时有可见图形和独立透明热区。
标注有锚点、引线、单位和避让策略。
参数变化连续插值；大量粒子或连续场交给 Canvas。
低动效模式关闭装饰循环，保留核心机制演示。
```
