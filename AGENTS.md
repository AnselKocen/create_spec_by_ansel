# Spec Forge Project Instructions

This project contains a local workflow for generating high-quality game/product specs from user-provided content files and/or an interview with the user. When the user asks to create, standardize, or generate a spec in this project, follow this workflow.

## Core Principle

Do not generate a full spec immediately.

First help the user clarify and confirm the gameplay. After gameplay is confirmed, generate the final `spec.md`.

When writing generated spec files to disk, always save them in a named output directory. Do not leave new generated specs as anonymous root-level `spec.md` / `spec.gameplay.md` files unless the user explicitly asks for that.

The reusable parts from the validated specs are:

- fixed spec skeleton and section order
- fillable gameplay/product framework
- output mode split: `fixed-content` vs `generator-tool`
- content extraction and gameplay mapping method
- accompanying content-file / SKILL contract
- image-generation constraints
- UI quality constraints
- SVG/CSS techniques
- high-precision SVG/CSS visual primitive guidance
- particle/atmosphere design
- visual style generation method
- accuracy-mode constraints
- data Schema style
- acceptance/self-check standards

The validated specs are references and pattern libraries for structure. Treat them as reusable structure abilities that can be mixed and extended. Different products should keep the same core skeleton and mandatory contracts, while changing the gameplay structure, content slots, mapping rules, data fields, visual direction, and content-file mapping.

## Local Files To Know

- `README.md`: user-facing usage
- `specforge/modules/spec-composer-contract.md`: composition rules
- `specforge/modules/interview-protocol.md`: staged interview before writing gameplay/spec files
- `specforge/modules/fixed-spec-skeleton.md`: mandatory final spec section order
- `specforge/modules/framework-spec-method.md`: fillable gameplay framework and content mapping method
- `specforge/modules/fixed-content-mode.md`: default internal mode, fillable finished-product framework
- `specforge/modules/generator-tool-mode.md`: explicit mode, user-facing generator/tool framework
- `specforge/modules/image-generation-rules.md`: strict image-generation contract
- `specforge/modules/style-prompt-library.md`: reusable visual style prompt bases
- `specforge/modules/ui-particles-svg.md`: UI, SVG, particle guidance
- `specforge/modules/svg-css-visual-primitives.md`: high-precision SVG/CSS drawing primitives and visual implementation guidance
- `specforge/modules/accuracy-modes.md`: strict / semi-strict / fantasy accuracy modes

Validated reference specs:

- `spec_人格测试.md`
- `spec_恐怖故事.md`
- `physics-spec.md`
- `chemistry-spec.md`
- `spec_图鉴.md`
- `spec_古风人物.md`
- `spec_现代人物.md`
- `人物传记spec.md`
- `spec通用游戏.md`
- `spec-template.md`

## Preferred Codex Workflow

If the user says something like:

- “帮我生成一个 spec”
- “按 specforge 流程做”
- “阅读 specforge”
- “先问我想做什么方向”
- “读取这些文件做一个恐怖/图鉴/人格/物理/化学 spec”

then:

1. Read the local Spec Forge rules, especially `specforge/modules/interview-protocol.md`, `specforge/modules/fixed-spec-skeleton.md`, `specforge/modules/framework-spec-method.md`, `specforge/modules/fixed-content-mode.md`, `specforge/modules/generator-tool-mode.md`, and relevant reference specs in this project.
2. Assume every final spec will be used together with accompanying `skills` / content files in the downstream pipeline. If actual files are present now, read them; if they are not present now, continue the interview and keep the SKILL/content-file contract with placeholders.
3. Follow `specforge/modules/interview-protocol.md`: after reading the rules, immediately ask the first round of questions. Do not summarize the rules, do not output an execution checklist, do not ask everything at once, and do not generate `spec.gameplay.md` until the key answers are clear.
4. Ask the key setup questions if they are not already answered:
   - What gameplay or product structure should this become? Examples: branching narrative, multi-ending text adventure, collection/index, interactive simulation, quiz/test, puzzle, timeline, card/combination, storybook reading, or any custom structure.
   - Is this a fillable finished-product framework, or a user-facing generator/tool?
     - Finished-product framework: `skills + spec` are filled by the backend pipeline, and the final user directly plays / reads / tests / collects / learns the completed product.
     - Generator/tool: the final product itself lets users input content and generate something.
   - What kind of `skills` / content files will accompany this spec downstream, and what kind of content should they fill? Examples: stories, knowledge points, encyclopedia entries, character profiles, question banks, experiment material.
   - What name should this spec/project be saved under? If the user does not care, infer a short meaningful name from the product title.
   - How should the player mainly play, and what should be left for `skills` to fill?
   - Is the structure linear, free exploration, branching, loop-based, or simulation-based?
   - Does it require real AI-generated images? If yes, which parts need images: title/background, chapter art, characters, entries, cards, endings, UI textures, etc.?
   - Image generation timing defaults to `first-run-cache`: generated on the app's first launch, cached locally, and reused on later launches. Ask whether any required images must be `build-time` exceptions, or whether a `hybrid` split is needed.
   - If the product requires high-precision SVG / Canvas / interactive simulation, which objects must be finely drawn, which processes need particles or continuous animation, and should the final spec include physics/chemistry-level drawing guidance?
   - Which accuracy mode should apply: strict, semi-strict, or fantasy?
   - What visual/UI atmosphere is desired? If unclear, derive style dimensions from content and gameplay rather than choosing from a fixed menu.
5. Create or choose a named output directory using this pattern: `generated-specs/<project-name>/`.
   - `<project-name>` should be short, readable, and derived from the user's product/spec name or gameplay structure.
   - If the directory already exists, ask before overwriting, or append a short disambiguator such as a date or version.
6. Generate `generated-specs/<project-name>/spec.gameplay.md` first.
7. Show the gameplay plan to the user and wait for confirmation.
8. Only after confirmation, generate the final `generated-specs/<project-name>/spec.md`.
   - The product overview table must always start with `| 产品名称 | {{GAME_NAME}} |` and `| 来源素材 | {{BOOK_NAME}} |`.
   - The product overview must include `| 设计粒度 | 可填充玩法框架 |` unless the user explicitly asks for a one-off concrete instance.
   - `fixed-content` / `generator-tool` are internal pipeline output modes. They may appear in `spec.gameplay.md`, but must not appear literally in the final `spec.md`.
   - Default internally to `fixed-content` unless the user explicitly asks for a generator/tool/creator/adapter that final users operate.
   - For the default completed-product mode, write the final spec as a fillable gameplay/product framework: concrete themes, characters, chapters, endings, questions, entries, and image prompts usually appear as slots, mapping rules, ranges, and schemas that `skills` will fill.
   - Content extraction, style selection, image asset planning / generation strategy, and self-check belong in content-file contract, core constraints, image-generation contract, development guide, and acceptance criteria.
   - For user-facing generator/tool products, user-facing input/generate/preview/export flows are allowed, but UI quality, particles, SVG/CSS, image-generation constraints, Schema, and acceptance standards still apply.
   - If high-precision SVG / Canvas is required, the final spec must include domain-specific drawing guidance comparable to the physics/chemistry references: visual primitives, SVG/CSS texture recipes, animation modes, labels/legends, interaction states, common visual mistakes, and dedicated visual acceptance criteria.
   - The final `spec.md` must describe the product behavior in natural language, such as whether final users open a completed product directly or operate a generator/tool; do not expose internal labels like `fixed-content` or `generator-tool`.
   - The final spec must always include an accompanying content-file / SKILL section.
   - Do not call this section “素材”.
   - The section must state the implementation premise directly: "完整内容文件会与本 spec 一起提供，通常位于项目根目录的 `skills/` 文件夹中。"
   - The section must require the implementer to read every content file in full and extract the project-specific content needed for this spec, not rely on an index summary or invent the core content from scratch.
   - The section must explain what to extract according to the gameplay structure and content features, such as objects, relationships, processes, rules, conflicts, stages, variables, question material, visual themes, or mechanic mappings.
   - If no files are available yet, keep the section as an explicit contract with placeholders such as `{{CONTENT_FILE_PATH}}` and `{{COVERED_MODULE}}`.

Do not skip the gameplay-confirmation step.

## Reference Structure Patterns

Use these as reference patterns, not as a closed product-type menu:

- `personality`: dimensions, questions, result types, feedback tone
- `horror`: atmosphere progression, clues, choices, endings
- `physics`: visualization, parameter exploration, answer feedback, strict self-check
- `chemistry`: experiment flow, reaction variables, safety and equation checks
- `collection`: entries, categories, unlocks, illustrated assets
- `storybook`: pages, narration, picture prompts, gentle interactions
- `biography-linear`: timeline, life stages, key relationships
- `biography-modern`: fixed visual frame, modern biography interactions
- `biography-branch`: choices, values, multi-ending life paths
- `generic`: general gameplay loops and state structures
- `template`: generic product skeleton

## Image Generation Rules

Every final spec must include an image-generation strategy section. If the product requires any real bitmap image asset, the section must include strong constraints:

- Image generation is an asset gate, not an optional visual enhancement. If a product requires any real bitmap asset, default to `first-run-cache`: first app launch shows a themed asset preparation page, generates only missing images, stores them in IndexedDB, and later launches reuse cached images without regenerating.
- CSS gradients are not image generation.
- SVG paths are not image generation.
- Canvas drawings are not image generation.
- Emoji/Unicode are not image generation.
- Text placeholders are not image generation.
- A real image generation model/tool/API must be called.
- Each generated asset needs a detailed prompt.
- All images in one project need a shared style prompt base.
- The final spec must require a static `IMAGE_ASSET_MANIFEST` with asset id, purpose, required flag, plan status, style prompt base, full prompt, negative prompt, aspect ratio, generation timing, prompt hash, cache key, seed source, and storage driver.
- The final spec must require runtime `IMAGE_ASSET_RUNTIME_STATE` records with generation status, cache status, cached Blob reference, loaded/decoded flags, ready flag, and errors.
- The final spec must state which parts use real image generation and declare `IMAGE_GENERATION_TIMING`; default to `first-run-cache`, using `build-time` or `hybrid` only for explicit exceptions.
- For `first-run-cache` or the first-run branch of `hybrid`, the final app must include a themed first-run asset preparation page, check IndexedDB first, generate only cache-miss images, store image Blobs in IndexedDB, and reuse cached images on later launches without calling the image API.
- If final delivery is a single HTML file and timing is `build-time`, generated images must be embedded as base64/data URLs after real image generation and may be used as `seed_source` for IndexedDB on first launch.
- If image generation is unavailable or required assets cannot be generated, the implementer must stop and tell the user instead of faking it or delivering placeholders.

If the product explicitly requires no real bitmap image assets, keep the image-generation strategy section and state that no generated bitmap assets are required for this spec. Do not add fake image placeholders.

## Accuracy Modes

Use `strict` for science, history, law, medicine, and real biographies.

Use `semi-strict` when core facts must be right but narrative expression can be dramatized.

Use `fantasy` when experience, atmosphere, and internal consistency matter more than factual checking.

## Do Not Build An Evaluator

The current requested scope is spec generation, not automatic spec evaluation. Include acceptance criteria and self-check sections inside the generated spec, but do not build a separate evaluator unless the user explicitly asks.
