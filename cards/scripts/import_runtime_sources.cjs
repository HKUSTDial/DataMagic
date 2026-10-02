#!/usr/bin/env node
// Maintainer migration: emit apply_patch input, never overwrite files directly.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const source = path.resolve(process.argv[2] || '');
const mode = process.argv[3] || 'list';
if (!fs.existsSync(path.join(source, 'components/runtime_style_templates/runtimePreview.ts'))) {
  throw new Error('Pass the original Remotion src directory.');
}
const libraryPath = 'gallery/api/library.json';
const library = JSON.parse(fs.readFileSync(path.join(root, libraryPath), 'utf8'));
const cards = library.cards.filter(card => card.source.adapter === 'datamagic');
const files = new Set();
const resolve = (base) => {
  const found = [base, ...['.ts', '.tsx', '.json', '/index.ts', '/index.tsx'].map(ext => base + ext)]
    .find(file => fs.existsSync(file) && fs.statSync(file).isFile());
  if (!found || !found.startsWith(source + path.sep)) throw new Error(`Unresolved local dependency: ${base}`);
  return found;
};
function visit(file) {
  if (files.has(file)) return;
  files.add(file);
  if (file.endsWith('.json')) return;
  const text = fs.readFileSync(file, 'utf8');
  const parsed = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  for (const node of parsed.statements) {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
      const name = node.moduleSpecifier.text;
      if (name.startsWith('.')) visit(resolve(path.resolve(path.dirname(file), name)));
      else if (!['react', 'remotion'].includes(name)) throw new Error(`Review external dependency ${name} in ${file}`);
    }
  }
}
const dispatchers = ['components/scenes/RuntimeStyleTemplateScene.tsx', 'components/scenes/RuntimeTextTemplateScene.tsx'];
for (const file of [...dispatchers, 'components/runtime_style_templates/runtimePreview.ts']) visit(path.join(source, file));
const sorted = [...files].sort();
const target = file => `src/legacy/${path.relative(source, file)}`;
function edit(relative, content) {
  const file = path.join(root, relative);
  const before = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (before === content) return '';
  const lines = text => text.replace(/\n$/, '').split('\n');
  if (before === null) return `*** Add File: ${file}\n${lines(content).map(line => '+' + line).join('\n')}\n`;
  const diff = spawnSync('diff', ['-u', file, '-'], {input:content, encoding:'utf8', maxBuffer:8 * 1024 * 1024});
  if (diff.status !== 1) throw new Error(`Could not generate diff for ${file}: ${diff.stderr}`);
  return `*** Update File: ${file}\n` + diff.stdout.split('\n').slice(2).join('\n').replace(/^@@[^\n]*@@[^\n]*$/gm, '@@');
}
let patch = '';
if (mode === 'list') {
  console.log(JSON.stringify({files: sorted.map(target), batches: Math.ceil(sorted.length / 5)}));
  process.exit(0);
}
if (mode === 'sources') {
  const offset = Number(process.argv[4]) * 5;
  for (const file of sorted.slice(offset, offset + 5)) {
    let content = fs.readFileSync(file, 'utf8');
    if (file.endsWith('/runtimeSlots.ts')) content = content.replace("      if (anim?._debug_info?.word_aligned !== true) return false;",
      "      // Standalone Cards accept explicit emphasis timing, with or without the\n      // hosted system's optional word-alignment debug metadata.");
    patch += edit(target(file), content);
  }
} else if (mode === 'catalog') {
  const previewFile = path.join(source, 'components/runtime_style_templates/runtimePreview.ts');
  const compiled = ts.transpileModule(fs.readFileSync(previewFile, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
  const mod = new Module(previewFile);
  mod._compile(compiled, previewFile);
  const {RUNTIME_PREVIEW_TEMPLATES, runtimePreviewConfig} = mod.exports;
  const implementationById = new Map();
  for (const relative of dispatchers) {
    const file = path.join(source, relative);
    const content = fs.readFileSync(file, 'utf8');
    const imports = new Map();
    const parsed = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
    for (const node of parsed.statements) {
      if (!ts.isImportDeclaration(node) || !node.moduleSpecifier.text.startsWith('.')) continue;
      const names = node.importClause?.namedBindings;
      if (!names || !ts.isNamedImports(names)) continue;
      for (const specifier of names.elements) imports.set(specifier.name.text, {
        file:target(resolve(path.resolve(path.dirname(file), node.moduleSpecifier.text))),
        export:(specifier.propertyName || specifier.name).text,
      });
    }
    function readAdapter(node) {
      if (ts.isPropertyAssignment(node) && ts.isStringLiteral(node.name) && node.name.text.startsWith('StyleTemplate-')) {
        const impl = imports.get(node.initializer.getText(parsed));
        if (!impl) throw new Error(`Missing implementation for ${node.name.text}`);
        implementationById.set(node.name.text, impl);
      }
      ts.forEachChild(node, readAdapter);
    }
    readAdapter(parsed);
  }
  const batch = process.argv[4] === undefined ? null : Number(process.argv[4]);
  for (const [index, card] of cards.entries()) {
    const template = RUNTIME_PREVIEW_TEMPLATES.find(item => item.id === card.source.compositionId);
    const impl = implementationById.get(card.source.compositionId);
    if (!template || !impl) throw new Error(`Missing runtime source for ${card.slug}`);
    const config = runtimePreviewConfig(template);
    const scene = config.scenes[0];
    const sample = {sceneContent: scene.content, scene: {...scene}};
    // Content is supplied once: avoid two diverging copies when replacing data.
    delete sample.scene.content;
    const folder = `templates/runtime-cards/${card.slug}`;
    const schema = {
      type: 'object', required: ['sceneContent', 'scene'], additionalProperties: false,
      description: `${card.slug}: edit sceneContent data/template_payload and scene animation timing together.`,
      properties: {
        sceneContent: {type:'object', required:['style_template_id', 'title'], properties:{
          style_template_id:{const:template.id}, title:{type:'string', minLength:1},
          data:{type:'array', items:{type:'object'}}, template_payload:{type:'object'}, style:{type:'object'},
        }, additionalProperties:true},
        scene:{type:'object', properties:{time_range:{type:'array', minItems:2, maxItems:2, items:{type:'number'}}, animations:{type:'array', items:{type:'object'}}}, additionalProperties:true},
      },
    };
    Object.assign(card.source, {component:impl.file, exportName:impl.export,
      entryComponent:'src/runtime/RuntimeCard.tsx', schema:`${folder}/schema.json`, sampleData:`${folder}/sample-data.json`,
      renderCompositionId:card.source.previewCompositionId, bundled:true});
    const include = batch === null || Math.floor(index / 5) === batch;
    if (include) {
      patch += edit(`${folder}/sample-data.json`, JSON.stringify(sample, null, 2) + '\n');
      patch += edit(`${folder}/schema.json`, JSON.stringify(schema, null, 2) + '\n');
    }
    const docPath = `recipes/${card.slug}.md`;
    let doc = fs.readFileSync(path.join(root, docPath), 'utf8').split('\n## Public availability / 公开范围')[0].split('\n## Editable implementation / 可编辑实现')[0].trimEnd();
    doc += `\n\n## Editable implementation / 可编辑实现\n\n- Source / 源码: \`${impl.file}\` (\`${impl.export}\`)\n- Shared render entry / 渲染入口: \`src/runtime/RuntimeCard.tsx\`\n- Sample props / 示例数据: \`${folder}/sample-data.json\`\n- Schema / 参数结构: \`${folder}/schema.json\`\n- Canvas / 画布: 1280×720, 30 fps, 180 frames (6 seconds)\n\nRun from \`cards/\` / 在 \`cards/\` 目录运行：\n\n\`\`\`bash\nnpx remotion render src/index.ts ${card.source.previewCompositionId} out/${card.slug}.mp4 --props=${folder}/sample-data.json\n\`\`\`\n\nReplace \`sceneContent.data\` and the matching fields in \`sceneContent.template_payload\` together. Text scenes use title, subtitle, bullets and their payload fields. Update animation target labels in \`scene.animations\` when changing labels. Read the component and shared helpers for its supported data shape, then check values and rendered keyframes.\n\n替换数据时，同步调整 \`sceneContent.data\` 与 \`sceneContent.template_payload\` 中对应字段；文字镜头使用标题、正文、要点及其 payload。改标签后同步调整 \`scene.animations\` 的高亮目标。依照组件和共享函数支持的数据结构修改，并检查数值与渲染关键帧。\n`;
    if (include) {
      patch += edit(docPath, doc);
      patch += edit(`gallery/${docPath}`, doc);
    }
  }
  if (batch === null || batch === -1) {
    patch += edit(libraryPath, JSON.stringify(library, null, 2) + '\n');
    if (fs.existsSync(path.join(root, 'api/library.json'))) patch += edit('api/library.json', JSON.stringify(library, null, 2) + '\n');
  const manifest = cards.map(card => ({slug:card.slug, id:card.source.compositionId, previewId:card.source.previewCompositionId,
    component:card.source.component, schema:card.source.schema, sampleData:card.source.sampleData}));
  patch += edit('src/runtime/catalog.json', JSON.stringify(manifest, null, 2) + '\n');
  }
} else throw new Error(`Unknown mode ${mode}`);
process.stdout.write(patch ? '*** Begin Patch\n' + patch + '*** End Patch\n' : '');
