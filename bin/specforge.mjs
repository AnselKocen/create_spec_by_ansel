#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { spawn } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const VERSION = "0.1.0";

const REFERENCE_SPECS = {
  personality: {
    label: "人格测试",
    file: "spec_人格测试.md",
    description: "原创维度、35 道情境题、人格结果页、兼容性、人格形象图",
    defaultImageMode: "required-assets",
    defaultAccuracyMode: "fantasy"
  },
  horror: {
    label: "恐怖叙事",
    file: "spec_恐怖故事.md",
    description: "第一人称恐怖递进、CG、选择节点、章末解密、固定结局",
    defaultImageMode: "required-assets",
    defaultAccuracyMode: "fantasy"
  },
  physics: {
    label: "物理/天文互动学习",
    file: "physics-spec.md",
    description: "知识点四阶段闭环、SVG/Canvas 可视化、成就制、科学自检",
    defaultImageMode: "background-only",
    defaultAccuracyMode: "strict"
  },
  chemistry: {
    label: "化学互动学习",
    file: "chemistry-spec.md",
    description: "实验台四阶段闭环、器皿/反应动画、成就制、科学自检",
    defaultImageMode: "background-only",
    defaultAccuracyMode: "strict"
  },
  collection: {
    label: "图鉴收集",
    file: "spec_图鉴.md",
    description: "条目收集、答题解锁、每条目插图、画廊、成就、分享卡片",
    defaultImageMode: "required-assets",
    defaultAccuracyMode: "semi-strict"
  },
  "biography-linear": {
    label: "传记模拟人生（线性）",
    file: "spec_古风人物.md",
    description: "线性人生章节、对话、历史决策、真实选择反馈、章末感悟",
    defaultImageMode: "none",
    defaultAccuracyMode: "strict"
  },
  "biography-modern": {
    label: "现代人物传记（线性羊皮纸 UI）",
    file: "spec_现代人物.md",
    description: "现代人物线性传记、固定暖色羊皮纸布局、真实选择反馈",
    defaultImageMode: "none",
    defaultAccuracyMode: "strict"
  },
  "biography-branch": {
    label: "传记模拟人生（分支多结局）",
    file: "人物传记spec.md",
    description: "共享段、关键分支、死胡同回退、3 个结局、CG 场景",
    defaultImageMode: "required-assets",
    defaultAccuracyMode: "strict"
  },
  generic: {
    label: "通用游戏",
    file: "spec通用游戏.md",
    description: "核心循环、游戏世界、技能映射、首页生图、粒子、玩法验收",
    defaultImageMode: "background-only",
    defaultAccuracyMode: "semi-strict"
  },
  template: {
    label: "通用产品骨架",
    file: "spec-template.md",
    description: "通用 14 章结构，适合新产品类型",
    defaultImageMode: "background-only",
    defaultAccuracyMode: "semi-strict"
  }
};

const IMAGE_MODES = {
  none: "不需要生图：只使用 UI/SVG/Canvas/CSS 视觉设计",
  "background-only": "只需要背景/封面生图：主体玩法用代码可视化",
  "required-assets": "需要关键资产生图：如 CG、人格图、图鉴插图",
  full: "大量生图：背景、关键场景、结果页/卡片等都需要真实图片"
};

const ACCURACY_MODES = {
  strict: "严谨：事实/公式/时间线/方程式必须检查正确性",
  "semi-strict": "半严谨：核心事实正确，允许适度戏剧化",
  fantasy: "幻想：允许自由发挥，重点验收体验和一致性"
};

const STRUCTURE_MODES = {
  linear: "线性推进：章节/关卡按顺序解锁",
  free: "自由探索：玩家自己选择内容顺序",
  branch: "分支路线：关键选择影响后续内容",
  loop: "核心循环：重复挑战/收集/成长",
  simulation: "模拟实验/系统：玩家调参观察变化"
};

const REFERENCE_NAMES = new Set(Object.values(REFERENCE_SPECS).map((item) => item.file));
const TEXT_EXTENSIONS = new Set([".md", ".txt", ".json", ".yaml", ".yml", ".csv", ".tsv"]);

main().catch((error) => {
  console.error(`\n[specforge] ${error.message}`);
  if (process.env.SPECFORGE_DEBUG) {
    console.error(error.stack);
  }
  process.exit(1);
});

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  if (args.version) {
    console.log(VERSION);
    return;
  }

  if (args.command === "types") {
    printTypes();
    return;
  }

  if (args.command !== "create") {
    throw new Error(`未知命令：${args.command}`);
  }

  const answersFromFile = args.answers ? await readJson(path.resolve(args.answers)) : {};
  const rl = shouldUseTTY(args, answersFromFile)
    ? readline.createInterface({ input: stdin, output: stdout })
    : null;

  try {
    const context = await collectInputContext(args.inputPath || ".");
    const answers = await collectAnswers(args, answersFromFile, rl, context);
    const reference = await loadReferenceSpec(answers.productType);
    const modules = await loadModules(answers);
    const provider = resolveProvider(args);

    if (provider === "request") {
      const requestPath = path.resolve(args.requestOutput);
      const sessionPath = path.resolve(args.sessionOutput);
      const request = buildCodexRequest(args, answers, context, reference, modules);
      await writeOutput(requestPath, request, args, rl, "Codex 任务文件");
      await writeOutput(
        sessionPath,
        JSON.stringify(buildSession(context, requestPath, null, null, answers), null, 2),
        args,
        rl,
        "会话记录"
      );

      console.log("\n已生成 Codex 本地任务文件，不需要 OpenAI API key：");
      console.log(`- Codex 任务：${requestPath}`);
      console.log(`- 会话记录：${sessionPath}`);
      console.log("\n下一步在 Codex 里对我说：读取 specforge.request.md，开始生成玩法方案。");
      return;
    }

    const gameplay = args.noLlm
      ? buildFallbackGameplay(answers, context)
      : provider === "codex-cli"
        ? await generateGameplayWithCodexCli(args, answers, context, reference, modules)
        : await generateGameplay(args, answers, context, reference, modules);

    const confirmedGameplay = await confirmGameplay(args, answersFromFile, rl, gameplay);
    const finalSpec = args.noLlm
      ? buildFallbackSpec(answers, confirmedGameplay, reference, modules)
      : provider === "codex-cli"
        ? await generateFinalSpecWithCodexCli(args, answers, context, reference, modules, confirmedGameplay)
        : await generateFinalSpec(args, answers, context, reference, modules, confirmedGameplay);

    const outputPath = path.resolve(args.output || "spec.md");
    const gameplayPath = path.resolve(args.gameplayOutput || "spec.gameplay.md");
    const sessionPath = path.resolve(args.sessionOutput || "specforge.session.json");

    await writeOutput(gameplayPath, confirmedGameplay, args, rl, "玩法方案");
    await writeOutput(outputPath, finalSpec, args, rl, "最终 spec");
    await writeOutput(
      sessionPath,
      JSON.stringify(buildSession(context, null, outputPath, gameplayPath, answers), null, 2),
      args,
      rl,
      "会话记录"
    );

    console.log("\n生成完成：");
    console.log(`- 玩法方案：${gameplayPath}`);
    console.log(`- 最终 spec：${outputPath}`);
    console.log(`- 会话记录：${sessionPath}`);
  } finally {
    rl?.close();
  }
}

function resolveProvider(args) {
  if (args.noLlm) return "none";
  if (args.provider !== "auto") return args.provider;
  return process.env.OPENAI_API_KEY ? "openai" : "request";
}

function buildSession(context, requestPath, outputPath, gameplayPath, answers) {
  return {
    generated_at: new Date().toISOString(),
    input_path: context.inputPath,
    request_path: requestPath,
    output_path: outputPath,
    gameplay_path: gameplayPath,
    product_type: answers.productType,
    answers
  };
}

function parseArgs(argv) {
  const args = {
    command: "create",
    inputPath: null,
    output: "spec.md",
    gameplayOutput: "spec.gameplay.md",
    sessionOutput: "specforge.session.json",
    requestOutput: "specforge.request.md",
    type: null,
    model: process.env.SPECFORGE_MODEL || process.env.OPENAI_MODEL || "gpt-4.1",
    provider: process.env.SPECFORGE_PROVIDER || "auto",
    codexPath: process.env.SPECFORGE_CODEX_PATH || "codex",
    answers: null,
    noLlm: false,
    yes: false,
    force: false,
    strictReference: false,
    help: false,
    version: false
  };

  const rest = [];
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help" || token === "-h") args.help = true;
    else if (token === "--version" || token === "-v") args.version = true;
    else if (token === "--output" || token === "-o") args.output = takeValue(argv, ++index, token);
    else if (token === "--gameplay-output") args.gameplayOutput = takeValue(argv, ++index, token);
    else if (token === "--session-output") args.sessionOutput = takeValue(argv, ++index, token);
    else if (token === "--request-output") args.requestOutput = takeValue(argv, ++index, token);
    else if (token === "--type" || token === "-t") args.type = takeValue(argv, ++index, token);
    else if (token === "--model" || token === "-m") args.model = takeValue(argv, ++index, token);
    else if (token === "--provider") args.provider = takeValue(argv, ++index, token);
    else if (token === "--codex-path") args.codexPath = takeValue(argv, ++index, token);
    else if (token === "--codex-request") args.provider = "request";
    else if (token === "--codex-cli") args.provider = "codex-cli";
    else if (token === "--answers") args.answers = takeValue(argv, ++index, token);
    else if (token === "--no-llm") args.noLlm = true;
    else if (token === "--yes" || token === "-y") args.yes = true;
    else if (token === "--force" || token === "-f") args.force = true;
    else if (token === "--strict-reference") args.strictReference = true;
    else if (token.startsWith("--")) throw new Error(`未知参数：${token}`);
    else rest.push(token);
  }

  if (rest.length > 0) {
    const maybeCommand = rest[0];
    if (maybeCommand === "create" || maybeCommand === "types") {
      args.command = maybeCommand;
      args.inputPath = rest[1] || null;
    } else {
      args.command = "create";
      args.inputPath = maybeCommand;
    }
  }

  if (args.type && !REFERENCE_SPECS[args.type]) {
    throw new Error(`未知产品类型：${args.type}。运行 specforge types 查看可选值。`);
  }
  if (!["auto", "openai", "request", "codex-cli"].includes(args.provider)) {
    throw new Error(`未知 provider：${args.provider}。可选 auto/openai/request/codex-cli。`);
  }

  return args;
}

function takeValue(argv, index, flag) {
  if (index >= argv.length || argv[index].startsWith("--")) {
    throw new Error(`${flag} 需要一个值`);
  }
  return argv[index];
}

function printHelp() {
  console.log(`Spec Forge ${VERSION}

用法：
  specforge create [素材文件或目录] [选项]
  node ./bin/specforge.mjs create ./素材目录

常用选项：
  -t, --type <type>              指定产品类型
  -o, --output <file>            最终 spec 输出路径，默认 spec.md
      --gameplay-output <file>   玩法方案输出路径，默认 spec.gameplay.md
      --session-output <file>    会话记录输出路径，默认 specforge.session.json
      --answers <file>           使用 JSON 预填答案，适合自动化
  -m, --model <model>            LLM 模型，默认读取 SPECFORGE_MODEL / OPENAI_MODEL / gpt-4.1
      --provider <provider>      auto/openai/request/codex-cli，默认 auto
      --codex-request            不调 API，生成给 Codex 读取的 specforge.request.md
      --codex-cli                尝试调用本机 codex exec（不需要 OpenAI API key）
      --request-output <file>    Codex request 输出路径，默认 specforge.request.md
      --no-llm                   不调用 LLM，只生成可测试骨架
  -y, --yes                      自动确认玩法方案
  -f, --force                    覆盖已有输出文件
      --strict-reference         严格贴合所选参考 spec；默认只把参考 spec 当模式库

环境变量：
  OPENAI_API_KEY                 使用 --provider openai 时必需；Codex request 模式不需要
  OPENAI_BASE_URL                可选，默认 https://api.openai.com/v1
  SPECFORGE_MODEL                可选，指定模型

辅助命令：
  specforge types                查看可选产品类型
`);
}

function printTypes() {
  console.log("可选产品类型：\n");
  for (const [key, item] of Object.entries(REFERENCE_SPECS)) {
    console.log(`- ${key.padEnd(18)} ${item.label}：${item.description}`);
  }
}

function shouldUseTTY(args, answers) {
  if (args.yes) return false;
  const requiredIds = [
    "projectIntent",
    "productType",
    "gameplaySeed",
    "structureMode",
    "imageMode",
    "accuracyMode",
    "visualTaste"
  ];
  return requiredIds.some((id) => answers[id] === undefined) || answers.confirmGameplay === undefined;
}

async function collectAnswers(args, answersFromFile, rl, context) {
  const provider = new AnswerProvider(answersFromFile, rl);
  const productTypeDefault = args.type || answersFromFile.productType || inferTypeFromContext(context) || "generic";
  const productTypeMeta = REFERENCE_SPECS[productTypeDefault] || REFERENCE_SPECS.generic;

  console.log(`\n已读取素材：${context.files.length} 个文件，约 ${context.totalChars} 字符。`);

  const projectIntent = await provider.ask(
    "projectIntent",
    "1. 你想做个什么内容？（例如：把红楼梦做成恐怖叙事游戏 / 把化学教材做成实验模拟）",
    answersFromFile.projectIntent || ""
  );

  const productType = args.type || await provider.select(
    "productType",
    "2. 你想做成哪类已验证 spec？",
    Object.entries(REFERENCE_SPECS).map(([key, value]) => ({
      key,
      label: value.label,
      description: value.description
    })),
    productTypeDefault
  );

  const selectedMeta = REFERENCE_SPECS[productType];
  const gameplaySeed = await provider.ask(
    "gameplaySeed",
    "3. 你希望玩家主要怎么玩？（可以粗糙描述，玩法方案会单独确认）",
    answersFromFile.gameplaySeed || ""
  );

  const structureMode = await provider.select(
    "structureMode",
    "4. 内容推进方式更接近哪一种？",
    Object.entries(STRUCTURE_MODES).map(([key, label]) => ({ key, label })),
    answersFromFile.structureMode || defaultStructureFor(productType)
  );

  const imageMode = await provider.select(
    "imageMode",
    "5. 要不要生图？",
    Object.entries(IMAGE_MODES).map(([key, label]) => ({ key, label })),
    answersFromFile.imageMode || selectedMeta.defaultImageMode
  );

  const accuracyMode = await provider.select(
    "accuracyMode",
    "6. 内容准确性要求？",
    Object.entries(ACCURACY_MODES).map(([key, label]) => ({ key, label })),
    answersFromFile.accuracyMode || selectedMeta.defaultAccuracyMode
  );

  const visualTaste = await provider.ask(
    "visualTaste",
    "7. UI/画风/氛围有什么偏好？（没有就写“按主题自动选择”）",
    answersFromFile.visualTaste || "按主题自动选择"
  );

  const extraConstraints = await provider.ask(
    "extraConstraints",
    "8. 还有什么硬约束？（没有直接回车）",
    answersFromFile.extraConstraints || ""
  );

  return {
    projectIntent,
    productType,
    gameplaySeed,
    structureMode,
    imageMode,
    accuracyMode,
    visualTaste,
    extraConstraints
  };
}

class AnswerProvider {
  constructor(answers, rl) {
    this.answers = answers || {};
    this.rl = rl;
  }

  async ask(id, question, defaultValue = "") {
    if (this.answers[id] !== undefined) {
      console.log(`\n${question}\n> ${this.answers[id]}`);
      return String(this.answers[id]);
    }
    if (!this.rl) {
      return defaultValue;
    }
    const suffix = defaultValue ? `\n默认：${defaultValue}\n> ` : "\n> ";
    const answer = await this.rl.question(`\n${question}${suffix}`);
    return answer.trim() || defaultValue;
  }

  async select(id, question, choices, defaultKey) {
    if (this.answers[id] !== undefined) {
      const value = String(this.answers[id]);
      if (!choices.some((choice) => choice.key === value)) {
        throw new Error(`answers.${id} 的值无效：${value}`);
      }
      console.log(`\n${question}\n> ${value}`);
      return value;
    }
    if (!this.rl) {
      return defaultKey;
    }

    console.log(`\n${question}`);
    choices.forEach((choice, index) => {
      const marker = choice.key === defaultKey ? " (默认)" : "";
      const desc = choice.description ? ` — ${choice.description}` : "";
      console.log(`  ${index + 1}. ${choice.key}：${choice.label}${desc}${marker}`);
    });
    const raw = await this.rl.question("> ");
    const value = raw.trim();
    if (!value) return defaultKey;
    const byNumber = Number(value);
    if (Number.isInteger(byNumber) && byNumber >= 1 && byNumber <= choices.length) {
      return choices[byNumber - 1].key;
    }
    const byKey = choices.find((choice) => choice.key === value);
    if (byKey) return byKey.key;
    throw new Error(`无效选择：${value}`);
  }
}

function defaultStructureFor(productType) {
  if (productType === "collection") return "free";
  if (productType === "biography-branch") return "branch";
  if (productType === "physics" || productType === "chemistry") return "simulation";
  return "linear";
}

function inferTypeFromContext(context) {
  const text = context.preview.toLowerCase();
  if (text.includes("化学") || text.includes("chemistry")) return "chemistry";
  if (text.includes("物理") || text.includes("天文") || text.includes("physics")) return "physics";
  if (text.includes("人格") || text.includes("mbti")) return "personality";
  if (text.includes("恐怖") || text.includes("horror")) return "horror";
  if (text.includes("图鉴") || text.includes("collection")) return "collection";
  if (text.includes("传记") || text.includes("biography")) return "biography-linear";
  return null;
}

async function collectInputContext(inputPathRaw) {
  const inputPath = path.resolve(inputPathRaw);
  const stat = await fs.stat(inputPath).catch(() => null);
  if (!stat) {
    throw new Error(`找不到输入路径：${inputPath}`);
  }

  const files = [];
  if (stat.isFile()) {
    files.push(await readContextFile(inputPath));
  } else if (stat.isDirectory()) {
    const candidates = await walkTextFiles(inputPath);
    for (const file of candidates.slice(0, 40)) {
      files.push(await readContextFile(file));
    }
  } else {
    throw new Error(`输入路径不是文件或目录：${inputPath}`);
  }

  let totalChars = 0;
  const blocks = [];
  for (const file of files) {
    totalChars += file.chars;
    blocks.push(`## ${file.relativePath}\n\n${file.excerpt}`);
  }

  return {
    inputPath,
    files,
    totalChars,
    preview: blocks.join("\n\n---\n\n").slice(0, 90000)
  };
}

async function walkTextFiles(root) {
  const results = [];
  async function walk(dir, depth) {
    if (depth > 5) return;
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      if (["node_modules", "dist", "build", "coverage", "specforge", "bin"].includes(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath, depth + 1);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (!TEXT_EXTENSIONS.has(ext)) continue;
        if (path.resolve(root) === ROOT_DIR && REFERENCE_NAMES.has(entry.name)) continue;
        results.push(fullPath);
      }
    }
  }
  await walk(root, 0);
  return results.sort();
}

async function readContextFile(filePath) {
  const text = await fs.readFile(filePath, "utf8");
  return {
    path: filePath,
    relativePath: path.relative(process.cwd(), filePath),
    chars: text.length,
    excerpt: text.slice(0, 16000)
  };
}

async function loadReferenceSpec(productType) {
  const meta = REFERENCE_SPECS[productType] || REFERENCE_SPECS.generic;
  const filePath = path.join(ROOT_DIR, meta.file);
  const text = await fs.readFile(filePath, "utf8");
  return {
    ...meta,
    productType,
    path: filePath,
    text
  };
}

async function loadModules(answers) {
  const moduleNames = [
    "spec-composer-contract.md",
    "accuracy-modes.md",
    "ui-particles-svg.md",
    "style-prompt-library.md"
  ];
  if (answers.imageMode !== "none") {
    moduleNames.push("image-generation-rules.md");
  }

  const modules = {};
  for (const name of moduleNames) {
    modules[name] = await fs.readFile(path.join(ROOT_DIR, "specforge", "modules", name), "utf8");
  }
  return modules;
}

async function generateGameplay(args, answers, context, reference, modules) {
  const { system, user } = buildGameplayPrompt(answers, context, reference, modules);
  return callLLM(args, system, user);
}

function buildGameplayPrompt(answers, context, reference, modules) {
  const system = [
    "你是一个严谨的游戏 spec 架构师。",
    "你的任务不是写完整 spec，而是先生成“游戏玩法方案”，供用户单独确认。",
    "必须尊重用户选择的产品类型和参考 spec 的核心机制。",
    "输出 Markdown，不要寒暄。"
  ].join("\n");

  const user = `# 用户需求
${formatAnswers(answers)}

# 输入素材摘要
${context.preview || "（未读取到素材正文）"}

# 参考 spec 类型
- 类型：${reference.productType}
- 名称：${reference.label}
- 已验证母版：${reference.file}
- 描述：${reference.description}

# 任务
请生成“游戏玩法方案”，不要生成完整 spec。

必须包含：
1. 产品定位
2. 核心体验：这个产品是什么，不是什么，去掉什么就没价值
3. 核心循环，用箭头写出
4. 章节/关卡/条目/维度结构，按所选产品类型决定
5. 玩家每 1 分钟主要在做什么
6. 核心机制 2-4 个
7. 视觉与生图资产草案（只列资产，不写完整视觉规范）
8. 数据结构草案
9. 需要用户确认的 3-5 个玩法决策点

注意：
- 玩法方案必须足够具体，让后续最终 spec 能直接承接。
- 不要改写成完整 14 章 spec。
`;

  return { system, user };
}

async function confirmGameplay(args, answersFromFile, rl, gameplay) {
  console.log("\n================ 游戏玩法方案 ================\n");
  console.log(gameplay);
  console.log("\n================================================\n");

  if (args.yes || answersFromFile.confirmGameplay === true) {
    return gameplay;
  }
  if (!rl) {
    return gameplay;
  }

  while (true) {
    const action = (await rl.question("确认这个玩法方案吗？[y=确认 / e=手动追加修改意见 / q=退出]\n> ")).trim().toLowerCase();
    if (!action || action === "y" || action === "yes") {
      return gameplay;
    }
    if (action === "q" || action === "quit") {
      throw new Error("用户取消");
    }
    if (action === "e") {
      const edits = await rl.question("请输入要追加到玩法方案里的修改意见：\n> ");
      return `${gameplay}\n\n## 用户确认时追加的修改意见\n\n${edits.trim()}\n`;
    }
    console.log("请输入 y、e 或 q。");
  }
}

async function generateFinalSpec(args, answers, context, reference, modules, confirmedGameplay) {
  const { system, user } = await buildFinalSpecPrompt(args, answers, context, reference, modules, confirmedGameplay);
  return callLLM(args, system, user);
}

async function buildFinalSpecPrompt(args, answers, context, reference, modules, confirmedGameplay) {
  const system = [
    "你是 Spec Forge，一个本地 spec 编译器里的 LLM。",
    "你必须按已验证参考 spec 的结构和约束生成最终 spec。",
    "你不能弱化强约束，不能偷换产品类型，不能省略数据 Schema 和验收标准。",
    "只输出最终 Markdown spec 正文。"
  ].join("\n");

  const baseTemplate = await fs.readFile(path.join(ROOT_DIR, "spec-template.md"), "utf8");
  const moduleText = Object.entries(modules)
    .map(([name, text]) => `# 模块：${name}\n\n${text}`)
    .join("\n\n---\n\n");

  const referenceMode = args.strictReference
    ? "严格参考模式：尽量贴合所选参考 spec 的章节和小节。"
    : "灵活模式：所选参考 spec 只是已验证模式库，不是整篇母版；最终 spec 要根据本次玩法生成差异化结构。";

  const user = `# 用户需求
${formatAnswers(answers)}

# 已确认玩法方案
${confirmedGameplay}

# 输入素材摘要
${context.preview || "（未读取到素材正文）"}

# 参考使用模式
${referenceMode}

# 通用高层结构骨架
下面是通用骨架。最终 spec 应优先保留这种高层章节结构，但每章内部小节必须根据本次玩法动态设计。

${baseTemplate}

---

# 已验证参考 spec（模式库，不要默认整篇照抄）
文件：${reference.file}

这份参考 spec 只用于提取已验证的表达模式、强约束、数据 Schema 风格、验收方式和领域机制。除非启用了严格参考模式，不要机械复制它的全部小节。

${reference.text}

---

# 可复用强约束模块
${moduleText}

# 最终输出要求
1. 输出完整 Markdown spec，不要解释。
2. 保留已验证的高层结构：核心设计理念 / 视觉风格规范 / 功能清单 / 用户动线 / 信息结构 / 数据设计 / 交互设计 / 核心机制约束 / 数据 Schema / 内容概览 / 技术约束 / 开发指引 / 验收标准。
3. 不要让所有 spec 长得一样：核心机制、内容对象、章节表、题型/解密/收集/分支/可视化、数据 Schema 字段必须随本项目玩法变化。
4. 如果用户选择了生图模式 ${answers.imageMode}，按该模式插入或保留生图强约束；如果是 none，不要强行要求生图。
5. 准确性模式为 ${answers.accuracyMode}，按 accuracy 模块写入对应自检/验收要求。
6. 玩法必须与已确认玩法方案一致，不要重新发明另一个玩法。
7. 必须复用的通用能力只有：生图限制、UI 美化、SVG/CSS 技巧、粒子/氛围、动效、数据 Schema、验收约束。其余结构都要服务于本次玩法。
`;

  return { system, user };
}

async function generateGameplayWithCodexCli(args, answers, context, reference, modules) {
  const { system, user } = buildGameplayPrompt(answers, context, reference, modules);
  const prompt = [
    "# System Instructions",
    system,
    "",
    "# User Task",
    user,
    "",
    "请只在最终回答中输出玩法方案 Markdown，不要修改文件。"
  ].join("\n");
  return runCodexExec(args, prompt, "specforge-gameplay");
}

async function generateFinalSpecWithCodexCli(args, answers, context, reference, modules, confirmedGameplay) {
  const { system, user } = await buildFinalSpecPrompt(args, answers, context, reference, modules, confirmedGameplay);
  const prompt = [
    "# System Instructions",
    system,
    "",
    "# User Task",
    user,
    "",
    "请只在最终回答中输出最终 spec Markdown，不要解释，不要修改文件。"
  ].join("\n");
  return runCodexExec(args, prompt, "specforge-final");
}

async function runCodexExec(args, prompt, label) {
  const tmpDir = await fs.mkdtemp(path.join("/tmp", `${label}.`));
  const outputFile = path.join(tmpDir, "last-message.md");
  const commandArgs = [
    "exec",
    "--skip-git-repo-check",
    "-C",
    process.cwd(),
    "-s",
    "workspace-write",
    "-a",
    "never",
    "-o",
    outputFile,
    "-"
  ];

  await runProcess(args.codexPath, commandArgs, prompt);
  const text = await fs.readFile(outputFile, "utf8").catch(() => "");
  if (!text.trim()) {
    throw new Error("Codex CLI 没有返回内容。你可以改用 --codex-request，然后在 Codex 里手动继续。");
  }
  return text.trim();
}

function runProcess(command, args, stdinText) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["pipe", "pipe", "pipe"]
    });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.stdout.on("data", (chunk) => {
      stdout.write(chunk);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Codex CLI 执行失败（exit ${code}）：${stderr.trim()}`));
      }
    });
    child.stdin.end(stdinText);
  });
}

function buildCodexRequest(args, answers, context, reference, modules) {
  const modulePaths = Object.keys(modules)
    .map((name) => `- ${path.join("specforge", "modules", name)}`)
    .join("\n");
  const files = context.files
    .map((file) => `- ${file.relativePath}（${file.chars} 字符）`)
    .join("\n");

  return `# Spec Forge Codex Request

> 这是本地模式生成的任务文件，不需要 OpenAI API key。请 Codex 在当前项目中读取此文件，并按下面流程生成 spec。

## 任务目标

生成一个高质量游戏/互动产品 spec。最终输出到 \`${args.output || "spec.md"}\`，玩法方案先输出到 \`${args.gameplayOutput || "spec.gameplay.md"}\`。

## 用户选择

${formatAnswers(answers)}

## 输入素材

输入路径：${context.inputPath}

已读取文件：

${files || "（无）"}

素材摘要：

${context.preview || "（未读取到素材正文）"}

## 参考 spec

- 产品类型：${reference.productType}
- 参考文件：${reference.file}
- 参考说明：${reference.description}
- 参考策略：默认只作为“已验证模式库”，不是整篇母版。除非用户明确要求，不要机械照抄。

## 必读模块

${modulePaths}

## Codex 执行流程

1. 先读取参考 spec 和必读模块。
2. 基于“用户选择”和“输入素材”，先生成 **游戏玩法方案**，写入 \`${args.gameplayOutput || "spec.gameplay.md"}\`。
3. 把玩法方案展示给用户，并等待用户确认。
4. 用户确认后，再生成最终 \`${args.output || "spec.md"}\`。
5. 最终 spec 应保留通用高层结构，但不要让所有 spec 长得一样；核心机制、内容对象、章节表、数据 Schema 必须随玩法变化。
6. 必须复用的通用能力：生图限制、UI 美化、SVG/CSS 技巧、粒子/氛围设计、动效、准确性模式、验收约束。
7. 如果生图模式不是 \`none\`，必须写入“什么不是生图”的强约束，不能允许 CSS/SVG/Canvas/emoji 冒充生图。
8. 不做自动评估器；只在 spec 内写验收标准和自检要求。

## 玩法方案必须包含

1. 产品定位
2. 核心体验：这个产品是什么，不是什么，去掉什么就没价值
3. 核心循环
4. 内容结构
5. 玩家每 1 分钟主要在做什么
6. 核心机制 2-4 个
7. 视觉与生图资产草案
8. 数据结构草案
9. 需要用户确认的玩法决策点

## 最终 spec 必须包含

- 产品概览
- 核心设计理念
- 目标人群
- 产品目的
- 视觉风格规范
- 功能清单
- 用户动线
- 信息结构
- 数据设计
- 交互设计
- 核心机制约束
- 数据 Schema
- 内容概览
- 技术约束
- 开发指引
- 验收标准

## 重要

不同项目的 spec 应该不同。参考 spec 的作用是复用“验证过的约束写法”，不是复制整篇结构。
`;
}

function formatAnswers(answers) {
  return [
    `- 想做的内容：${answers.projectIntent}`,
    `- 产品类型：${answers.productType}（${REFERENCE_SPECS[answers.productType]?.label || ""}）`,
    `- 玩法想法：${answers.gameplaySeed}`,
    `- 推进方式：${answers.structureMode}（${STRUCTURE_MODES[answers.structureMode] || ""}）`,
    `- 生图模式：${answers.imageMode}（${IMAGE_MODES[answers.imageMode] || ""}）`,
    `- 准确性模式：${answers.accuracyMode}（${ACCURACY_MODES[answers.accuracyMode] || ""}）`,
    `- 视觉偏好：${answers.visualTaste}`,
    `- 额外硬约束：${answers.extraConstraints || "无"}`
  ].join("\n");
}

async function callLLM(args, system, user) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("缺少 OPENAI_API_KEY。设置后重试；或使用 --codex-request 在 Codex 里生成；或使用 --codex-cli 调用本机 Codex CLI。");
  }

  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = args.model;

  try {
    return await callResponsesApi(baseUrl, apiKey, model, system, user);
  } catch (error) {
    if (!error.status || ![404, 405].includes(error.status)) {
      throw error;
    }
    return callChatCompletionsApi(baseUrl, apiKey, model, system, user);
  }
}

async function callResponsesApi(baseUrl, apiKey, model, system, user) {
  const response = await fetch(`${baseUrl}/responses`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      input: [
        { role: "system", content: system },
        { role: "user", content: user }
      ]
    })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error?.message || `Responses API 请求失败：${response.status}`);
    error.status = response.status;
    throw error;
  }
  return extractResponsesText(data);
}

async function callChatCompletionsApi(baseUrl, apiKey, model, system, user) {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ]
    })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || `Chat Completions API 请求失败：${response.status}`);
  }
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("LLM 返回为空");
  return text.trim();
}

function extractResponsesText(data) {
  if (data.output_text) return String(data.output_text).trim();
  const chunks = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") chunks.push(content.text);
      else if (typeof content.output_text === "string") chunks.push(content.output_text);
    }
  }
  const text = chunks.join("\n").trim();
  if (!text) throw new Error("LLM 返回为空");
  return text;
}

function buildFallbackGameplay(answers, context) {
  return `# 游戏玩法方案（--no-llm 测试骨架）

## 产品定位

- 内容：${answers.projectIntent || "待填写"}
- 产品类型：${answers.productType}
- 推进方式：${answers.structureMode}

## 核心体验

${answers.gameplaySeed || "待 LLM 根据素材生成。"}

## 核心循环

进入 → 理解当前内容 → 进行交互/选择/挑战 → 获得反馈 → 推进或解锁下一内容

## 视觉与生图

- 生图模式：${answers.imageMode}
- 视觉偏好：${answers.visualTaste}

## 准确性

- 模式：${answers.accuracyMode}

## 素材读取

- 输入路径：${context.inputPath}
- 文件数：${context.files.length}

> 这是无 LLM 模式的测试骨架。正式生成建议使用 --codex-request 交给 Codex，或使用 --provider openai。
`;
}

function buildFallbackSpec(answers, gameplay, reference, modules) {
  return `# ${answers.projectIntent || "未命名项目"} 游戏设计文档

> 本文件由 Spec Forge --no-llm 模式生成，仅用于验证 CLI 流程。正式 spec 建议使用 --codex-request 交给 Codex，或使用 --provider openai。

---

## 已确认玩法方案

${gameplay}

---

## 参考母版

- 产品类型：${reference.productType}
- 参考文件：${reference.file}

最终正式生成时，会严格继承该母版的章节结构、核心机制约束、数据 Schema 和验收标准。

---

## 已加载模块

${Object.keys(modules).map((name) => `- ${name}`).join("\n")}
`;
}

async function writeOutput(filePath, content, args, rl, label) {
  const exists = await fs.stat(filePath).then(() => true).catch(() => false);
  if (exists && !args.force) {
    if (args.yes || !rl) {
      throw new Error(`${label} 已存在：${filePath}。使用 --force 覆盖。`);
    }
    const answer = (await rl.question(`${label} 已存在，是否覆盖？${filePath} [y/N]\n> `)).trim().toLowerCase();
    if (answer !== "y" && answer !== "yes") {
      throw new Error(`未覆盖已有文件：${filePath}`);
    }
  }
  await fs.writeFile(filePath, content.endsWith("\n") ? content : `${content}\n`, "utf8");
}

async function readJson(filePath) {
  const text = await fs.readFile(filePath, "utf8");
  return JSON.parse(text);
}
