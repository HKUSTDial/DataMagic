const localized = (value, lang) => typeof value === 'string' ? value : value?.[lang] || value?.zh || value?.en || '';
export function implementationBrief(item, lang = 'zh') {
  const name = localized(item.name, lang), purpose = localized(item.description, lang);
  const recipe = `cards/recipes/${lang === 'en' ? 'en/' : ''}${item.slug}.md`;
  if (lang === 'en') return [
    `Use the datamagic Skill to create a video with ${name} (${item.slug}).`,
    'Repository: https://github.com/HKUSTDial/DataMagic. If not configured, help me obtain the repository and configure its datamagic Skill first; otherwise reuse the existing checkout.',
    `Purpose: ${purpose}`,
    `Read the recipe first: ${recipe}. Follow its source, schema, and sample-data references in the DataMagic repository.`,
    'Adapt my supplied data and requested changes. If data is missing, ask for it or agree on explicitly labeled demonstration data.',
    'Preserve the selected layout and reveal rhythm unless I request a redesign. Keep values, units, entity images, and colors bound to the correct data.',
    'Use the recipe composition’s resolution, duration, and frame rate unless I specify otherwise.',
    'Deliver an MP4, editable source and props, and a reproducible render command. Follow the Skill’s review guidance to check data accuracy, readability, and opening/middle/ending frames.',
  ].join('\n');
  return [
    `请使用 datamagic Skill，按照“${name}”（${item.slug}）配方制作视频。`,
    '仓库：https://github.com/HKUSTDial/DataMagic 。尚未配置时，请先帮我下载仓库并配置其中的 datamagic Skill；已有则直接使用。',
    `用途：${purpose}`,
    `先读取配方：${recipe}，再按其中的引用读取源码、数据格式和示例数据。路径相对于 DataMagic 仓库。`,
    '用我提供的数据和修改要求替换示例内容。没有数据时先确认，或明确约定使用标注清楚的演示数据。',
    '除非我要求重新设计，否则保留模板布局与揭晓节奏。数值、单位、对象图标和配色应与数据正确对应。',
    '默认沿用所选配方的分辨率、时长和帧率；如果我另有要求，以我的要求为准。',
    '交付 MP4、可编辑源码与参数文件，以及可复现的渲染命令。按照 Skill 的检查流程核对数据、可读性和开场／中段／结尾画面。',
  ].join('\n');
}
