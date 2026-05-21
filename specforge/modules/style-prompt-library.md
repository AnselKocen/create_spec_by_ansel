# 画风提示词基底库

画风采用组合方法。最终 spec 应根据内容文件、玩法结构和目标体验组合出一套 `STYLE_PROMPT_BASE` 或同等字段。所有图片共享同一基底，再替换主体描述、场景、动作和构图。

## 画风组合方法

生成画风时优先从这些维度组合：

| 维度 | 示例 |
|------|------|
| 媒介 | 水彩、油画、版画、墨绘、摄影、3D、像素、矢量、纸雕、拼贴 |
| 情绪 | 温柔、压迫、神秘、荒诞、庄严、清爽、梦幻、冷静、危险、治愈 |
| 文化 / 时代 | 古风、未来主义、民俗、复古、现代都市、自然博物、童话、科幻 |
| 材质 | 羊皮纸、玻璃、金属、陶瓷、木刻、织物、发光晶体、胶片颗粒 |
| 光影 | 低调暗光、柔和漫射、霓虹边缘光、舞台聚光、清晨自然光 |
| 构图 | 中心肖像、俯视图、横向场景、图鉴版式、电影宽银幕、儿童绘本跨页 |
| UI 质感 | 毛玻璃、仪器面板、手账贴纸、书页、档案夹、游戏 HUD |
| 动效气质 | 漂浮粒子、纸张翻动、扫描线、墨迹扩散、星尘、发光脉冲 |

最终写法可以是：

```text
STYLE_PROMPT_BASE = 媒介 + 情绪 + 文化/时代 + 材质 + 光影 + 构图 + 质量要求
```

下面的表格是可复用种子，不是限制范围。遇到新主题时，可以混合、改写或新建画风基底。

| 画风 | 英文提示词基底 | 适合主题 |
|------|---------------|----------|
| 暗色写实插画 | `dark realistic illustration, ultra detailed, cinematic lighting, deep shadow, muted dark tones, atmospheric composition` | 恐怖、悬疑、历史沉浸 |
| 水墨恐怖 | `dark ink wash horror, traditional Chinese ink painting, black ink splatter, wet brush strokes, rice paper texture, minimal color` | 民俗恐怖、诅咒、古风 |
| 复古恐怖版画 | `vintage horror engraving, woodcut print style, cross-hatching, aged paper, black and sepia tones, gothic illustration` | 民俗、宇宙恐怖、古籍 |
| 模糊失焦摄影 | `blurred unsettling photography, out of focus, grainy film texture, liminal space, uncanny atmosphere, desaturated colors` | 日常侵蚀、替身、心理恐怖 |
| 克苏鲁宇宙恐怖 | `cosmic horror illustration, Lovecraftian, impossible geometry, vast unknowable entity, deep sea and deep space palette, human insignificance` | 宇宙恐怖、未知存在 |
| 博物志科学绘图 | `scientific illustration, vintage natural history plate, precise linework, labeled specimen style, soft paper texture` | 动植物、矿物、自然图鉴 |
| 水彩田野速写 | `watercolor field sketch, naturalist journal, soft pigments, hand-drawn details, airy paper texture` | 花鸟、昆虫、户外、自然 |
| 工笔白描 | `Chinese gongbi fine brushwork, delicate ink line drawing, traditional pigments, silk texture, elegant composition` | 中国花鸟、草药、传统文化 |
| 国潮人物 | `Chinese trendy illustration, guochao character, bold decorative patterns, traditional motifs, modern color palette` | 中国历史人物、国风人格 |
| 水墨人物 | `Chinese ink wash character portrait, sumi-e style, minimal brush strokes, rice paper texture, elegant negative space` | 东方、禅意、古典文学 |
| 浮世绘版画 | `ukiyo-e woodblock print, bold outlines, flat composition, textured paper, traditional Japanese color palette` | 日式、海洋、怪谈 |
| 复古旅行海报 | `vintage travel poster, retro print, bold simplified shapes, limited color palette, nostalgic composition` | 城市、地标、美食文化 |
| 新艺术海报 | `art nouveau poster, decorative illustration, flowing ornamental lines, elegant botanical motifs, refined color harmony` | 花卉、神话、装饰艺术 |
| 像素百科 | `pixel art bestiary, 16-bit sprite style, crisp pixel edges, limited palette, game encyclopedia icon` | 怪物、游戏、复古 |
| 几何拼贴 | `geometric character made of shapes, bauhaus style, clean abstract forms, bold color blocks, modern poster design` | 抽象、科技、人格测试 |
| 扁平矢量插画 | `flat vector illustration, modern infographic style, clean shapes, crisp edges, balanced composition` | 城市建筑、科技产品、知识图 |
| 童话绘本 | `storybook illustration, whimsical fairy tale, soft colors, charming hand-painted texture, gentle magical atmosphere` | 童话、神话、儿童教育 |
| 赛博朋克概念图 | `cyberpunk concept art, neon sci-fi, dark futuristic city, holographic glow, digital corruption artifacts` | 科技、未来、机械 |
| 暗色油画 | `dark oil painting, impasto texture, Rembrandt chiaroscuro, heavy brush strokes, somber historical atmosphere` | 历史、传记、悬疑 |
| Q版 3D | `3D rendered chibi character, clay toy style, soft studio lighting, rounded forms, playful expression` | 人格测试、轻松可爱 |
| 线条极简 | `single line art character, continuous line drawing, minimal features, clean white background, elegant simplicity` | 文学、哲学、极简 |
