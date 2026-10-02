# 角色主持与透视数据板 / Character Presenter & Perspective Board

## 用途 / Purpose

把一个问题组织成角色讲解、逐项数据证据、最终结论，而不是只展示图表。
A reusable character-led explanation: question, staged evidence, takeaway.

## 实现 / Implementation

- Component: `templates/character-perspective-board/CharacterPerspectiveBoard.tsx`
- Schema: `templates/character-perspective-board/schema.json`
- Default data: `templates/character-perspective-board/sample-data.json`
- Alternate data: `templates/character-perspective-board/alternate-data.json`
- Composition: `ShotCraft-CharacterPerspectiveBoard`
- Alternate composition: `CharacterPerspectiveBoard-Alternate`
- Native output: 1920×1080, 30 fps, 14 seconds / silent preview.
- Sample presenter: `public/assets/character-perspective-board/cat-host.mp4`

## 故事节拍 / Story beats

0–2s：角色与设问；3、5.4、7.8s：逐项证据；10.4–14s：保留完整数据并给出结论。
Question first, reveal one row per beat, retain evidence and hold the takeaway.

`rows[].at` and `conclusionAt` are explicit seconds; align them to your own narration if adding audio. The preview does not synthesize speech or lip-sync; existing cat motions are illustrative and not aligned to these new words.

## 数据与素材 / Data and media

- 替换标题、问题、指标、单位、共同尺度、数据和结论。两个主题共用同一组件，不改源码。
- 所有条形共用 `maximum`，数值与条长来自同一 `value`；不从透视后的屏幕长度推断比例。
- 仅支持 2–3 项非负数，标签最多 12 字；数值最多四位，长小数应先合理四舍五入。
- 所有数据必须同口径、同单位、同时间范围；增长率对比不等于完整家庭预算或因果证明。
- 主持素材可换成自有角色图片或视频；路径相对于 `public/`。视频填真实 `durationSeconds`，短片停在末帧，不循环。
- 生成角色、合成数据必须注明；不要把演示当作真实统计。

Replace all editorial fields, values, scale, and presenter media. Use a shared unit and comparison basis. Short footage holds its last frame; it never loops. Label generated media and synthetic data.

## 运镜约束 / Motion constraints

数据板采用小角度透视，默认 -7°；允许 -10° 至 10°，0° 为正面。
Board slides in once; perspective stays fixed while reading. No continuous rocking, no CSS animation. Revealed rows stay visible. Leave at least two seconds for the final takeaway.

## 复用验证 / Reuse validation

默认家庭开支百分比，与物流节省时间两组输入已提供。后者使用“分钟”和非递增值，检验模板是否暗藏单位或排序假设。
Render both datasets, then inspect the question, each reveal, final values, and conclusion.

[查看同一模板的物流主题预览 / Alternate logistics preview](https://datamagic.chat/cards/media/examples/CharacterPerspectiveBoard-Logistics.mp4)

```bash
npm run render:advanced -- --only=CharacterPerspectiveBoard
npx remotion render src/index.ts CharacterPerspectiveBoard-Alternate /tmp/character-logistics.mp4 --concurrency=1 --muted
npm run preview:lite
```

## 来源与公开示例 / Sample provenance

猫视频来自本地先前生成的原创角色镜头，公开素材去除原音轨。没有引入参考项目源码、创作者人像、声音或原视频片段。参考的是主持人与透视证据板的通用表现手法；本配方并非任何创作者的官方或授权模板。
The supplied cat footage is a previously generated fictional character, redistributed without audio. This independently implemented recipe contains no reference creator footage, voice, likeness, or copied source code.

## 对象图像 / Entity imagery

- 实体条目的 `iconSrc` / entity item `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.
