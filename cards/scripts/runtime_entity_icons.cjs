const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const catalog = require('../src/runtime/catalog.json');
const category = (name) => `icons/categories/${name}.svg`;
const flags = {Ethiopia:'ET', Kenya:'KE', Colombia:'CO', Brazil:'BR', Guatemala:'GT', India:'IN'};
const brands = ['Apple', 'Microsoft', 'Amazon', 'Google', 'Nvidia', 'Meta'];
const categories = {
  Enterprise:'cloud', Consumer:'service', SMB:'store', Partner:'service', Retail:'store', Online:'online', Direct:'online', Wholesale:'market', Field:'transport', Reseller:'store', Trial:'review', Renewal:'service',
  Engineering:'robot', Product:'product', Sales:'finance', Operations:'scan', Support:'service', Marketplace:'market',
  'Product A':'product', 'Product B':'cloud', Mobile:'online', Web:'online', API:'cloud', Email:'service',
  'Mobile App':'online', 'Web Direct':'online', 'Desktop App':'product', 'API Partners':'cloud', 'Social Referral':'service', Search:'scan', Affiliate:'review',
  Suppliers:'product', Partners:'service', Imports:'transport', Visitors:'online', Leads:'scan', Qualified:'review', Proposal:'research', Won:'finance',
  'Organic Search':'scan', 'Paid Ads':'finance', Social:'service', Referral:'review',
  Plan:'research', Build:'robot', Launch:'online', Scale:'energy', Review:'review',
};
const iconFor = (label) => flags[label] ? `icons/flags/${flags[label]}.svg` : brands.includes(label) ? `icons/brands/${label.toLowerCase()}.svg` : categories[label] ? category(categories[label]) : null;

const edits = [];
const audit = [];
const add = (file, previous, next) => {
  if (next !== previous) edits.push({file, previous, next});
};
const normalizeSvgLabels = (code, file) => {
  const ast = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  const visit = (node) => {
    if (ts.isJsxElement(node) && node.openingElement.tagName.getText(ast) === 'text') {
      const raw = node.getText(ast);
      const match = raw.match(/<RuntimeEntityLabel sceneContent=\{sceneContent\} label=\{([^}]+)\}>/);
      if (match) {
        const openEnd = node.openingElement.getEnd() - node.getStart(ast);
        const opening = raw.slice(0, openEnd).replace(/^<text/, '<RuntimeEntitySvgLabel').replace(/>$/, ` sceneContent={sceneContent} label={${match[1]}}>`);
        const children = raw.slice(openEnd).replace(/<RuntimeEntityLabel sceneContent=\{sceneContent\} label=\{[^}]+\}>/g, '').replace(/<\/RuntimeEntityLabel>/g, '').replace(/<\/text>$/, '</RuntimeEntitySvgLabel>');
        edits.push([node.getStart(ast), node.getEnd(), opening + children]);
        return;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
  for (const [start, end, replacement] of edits.sort((a,b) => b[0] - a[0])) code = code.slice(0,start) + replacement + code.slice(end);
  return {code, converted:edits.length};
};
for (const card of catalog) {
  if (process.env.RUNTIME_ICON_SLUG && card.slug !== process.env.RUNTIME_ICON_SLUG) continue;
  const dataPath = path.join(root, card.sampleData);
  const raw = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(raw);
  const payload = data.sceneContent.template_payload || {};
  const entities = payload.items || payload.rows || payload.series || [];
  const mapping = Object.fromEntries(entities.map((row) => [row.label || row.name, iconFor(row.label || row.name)]).filter(([,src]) => src));
  // No icons on time ticks, abstract metrics, city names without supplied artwork,
  // or purely editorial titles. No visual inference from a string at render time.
  if (!Object.keys(mapping).length) {
    audit.push({slug: card.slug, changed: false, reason: 'Time axes, abstract metrics, editorial copy, or no accurately matching entity asset.'});
    continue;
  }
  const file = path.join(root, card.component);
  const previous = fs.readFileSync(file, 'utf8');
  if (previous.includes('runtimeEntityVisuals') && data.sceneContent.entity_icons) {
    audit.push({slug:card.slug, changed:true, labels:Object.keys(mapping), assets:Object.values(mapping), placements:{svgLabels:(previous.match(/<RuntimeEntitySvgLabel/g)||[]).length, htmlLabels:(previous.match(/<RuntimeEntityLabel/g)||[]).length}});
    continue;
  }
  let code = previous;
  let svg = 0;
  let html = 0;
  // Wrap only actual entity labels; numeric labels, axis names and title copy stay intact.
  code = code.replace(/<text\b([^>]*?)>\s*\{(truncate\(((?:row|point|item|series|n|node|tile|slice|segment|activeSlice|lead)\.(?:label|name)),[^\n]*?\))\}\s*<\/text>/g, (_match, attrs, expr, label) => {
    svg++;
    return `<RuntimeEntitySvgLabel${attrs} sceneContent={sceneContent} label={${label}}>{${expr}}</RuntimeEntitySvgLabel>`;
  });
  code = code.replace(/\{(truncate\(((?:row|point|item|series|n|node|tile|slice|segment|activeSlice|lead)\.(?:label|name)),[^\n]*?\))\}/g, (match, expr, label, offset, source) => {
    // SVG replacements already contain the expression; do not nest an HTML span there.
    const lastOpen = source.lastIndexOf('<', offset);
    if (source.slice(lastOpen, offset).startsWith('<RuntimeEntitySvgLabel')) return match;
    html++;
    return `<RuntimeEntityLabel sceneContent={sceneContent} label={${label}}>{${expr}}</RuntimeEntityLabel>`;
  });
  const normalized = normalizeSvgLabels(code, file);
  code = normalized.code;
  svg += normalized.converted;
  if (!svg && !html) {
    audit.push({slug: card.slug, changed: false, reason: 'No entity label/legend rendered by this specific layout; an icon would misrepresent axis metrics.'});
    continue;
  }
  const names = [svg ? 'RuntimeEntitySvgLabel' : '', html ? 'RuntimeEntityLabel' : ''].filter(Boolean);
  const helperPath = path.dirname(file) === path.join(root, 'src/legacy/components/runtime_style_templates') ? './runtimeEntityVisuals' : '../runtimeEntityVisuals';
  code = `import {${names.join(', ')}} from '${helperPath}';\n${code}`;
  add(file, previous, code);
  data.sceneContent.entity_icons = mapping;
  entities.forEach((row) => {const src = mapping[row.label || row.name]; if (src) row.iconSrc = src;});
  add(dataPath, raw, JSON.stringify(data, null, 2) + '\n');
  const schemaPath = path.join(root, card.schema);
  const oldSchema = fs.readFileSync(schemaPath, 'utf8');
  const schema = JSON.parse(oldSchema);
  schema.properties.sceneContent.properties.entity_icons = {type:'object', description:'Exact original entity label to a local asset path or supplied logo URL. Labels and numbers remain unchanged.', additionalProperties:{type:'string', minLength:1}};
  add(schemaPath, oldSchema, JSON.stringify(schema, null, 2) + '\n');
  audit.push({slug:card.slug, changed:true, labels:Object.keys(mapping), assets:Object.values(mapping), placements:{svgLabels:svg, htmlLabels:html}});
}
fs.mkdirSync(path.join(root, 'out'), {recursive:true});
fs.writeFileSync(path.join(root, 'out/entity-icons-runtime-audit.json'), JSON.stringify({total:catalog.length, changed:audit.filter((x)=>x.changed).length, cards:audit}, null, 2));
const patch = ['*** Begin Patch', ...edits.map(({file, previous, next}) => `*** Update File: ${file}\n@@\n${previous.trimEnd().split('\n').map((line)=>'-'+line).join('\n')}\n${next.trimEnd().split('\n').map((line)=>'+'+line).join('\n')}`), '*** End Patch'].join('\n');
if (process.argv.includes('--patch')) process.stdout.write(JSON.stringify({patch, changed:audit.filter((x)=>x.changed).map((x)=>x.slug)}));
else console.log(JSON.stringify({total:audit.length, changed:audit.filter((x)=>x.changed).map((x)=>x.slug), instruction:'Use --patch to produce an apply_patch-compatible change set.'}, null, 2));
