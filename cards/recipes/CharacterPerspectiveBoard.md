# 角色主持与透视数据板

[English](en/CharacterPerspectiveBoard.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`CharacterPerspectiveBoard`

## 用途

猫或自定义角色主持，搭配稳定的倾斜透视数据板，按设问、逐项证据、结论推进。附家庭账本与物流两组可替换示例。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/character-perspective-board/CharacterPerspectiveBoard.tsx`
- 数据结构：`templates/character-perspective-board/schema.json`
- 示例数据：`templates/character-perspective-board/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

## 适用情境

把一个问题组织成角色讲解、逐项数据证据、最终结论，而不是只展示图表。

## 实现

- 组件：`templates/character-perspective-board/CharacterPerspectiveBoard.tsx`
- 数据结构：`templates/character-perspective-board/schema.json`
- 默认数据：`templates/character-perspective-board/sample-data.json`
- 备用数据：`templates/character-perspective-board/alternate-data.json`
- 渲染标识：`ShotCraft-CharacterPerspectiveBoard`
- 备用渲染标识：`CharacterPerspectiveBoard-Alternate`
- 主持素材：`public/assets/character-perspective-board/cat-host.mp4`

## 故事节拍

0–2s：角色与设问；3、5.4、7.8s：逐项证据；10.4–14s：保留完整数据并给出结论。

## 数据与素材

- 替换标题、问题、指标、单位、共同尺度、数据和结论。两个主题共用同一组件，不改源码。
- 所有条形共用 `maximum`，数值与条长来自同一 `value`；不从透视后的屏幕长度推断比例。
- 仅支持 2–3 项非负数，标签最多 12 字；数值最多四位，长小数应先合理四舍五入。
- 所有数据必须同口径、同单位、同时间范围；增长率对比不等于完整家庭预算或因果证明。
- 主持素材可换成自有角色图片或视频；路径相对于 `public/`。视频填真实 `durationSeconds`，短片停在末帧，不循环。
- 生成角色、合成数据必须注明；不要把演示当作真实统计。

## 运镜约束

数据板采用小角度透视，默认 -7°；允许 -10° 至 10°，0° 为正面。

## 复用验证

默认家庭开支百分比，与物流节省时间两组输入已提供。后者使用“分钟”和非递增值，检验模板是否暗藏单位或排序假设。

[查看同一模板的物流主题预览 / Alternate logistics preview](https://datamagic.chat/cards/media/examples/CharacterPerspectiveBoard-Logistics.mp4)

```bash
npm run render:advanced -- --only=CharacterPerspectiveBoard
npx remotion render src/index.ts CharacterPerspectiveBoard-Alternate /tmp/character-logistics.mp4 --concurrency=1 --muted
npm run preview:lite
```

## 来源与公开示例

猫视频来自本地先前生成的原创角色镜头，公开素材去除原音轨。没有引入参考项目源码、创作者人像、声音或原视频片段。参考的是主持人与透视证据板的通用表现手法；本配方并非任何创作者的官方或授权模板。

## 对象图像

- 实体条目的 `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。

## 补充制作约束

- `rows[].at` 与 `conclusionAt` 的单位均为秒；加入旁白时按自己的语音时间对齐。
- 现有猫动作仅为示例，不与当前文案口型同步。
- 数据板只入场一次，阅读时透视固定，不持续摇晃，不使用 CSS 动画。
- 已揭晓数据保留，最终结论至少停留 2 秒。
- 渲染默认和备用两组数据，检查设问、每次揭晓、最终数值及结论。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-CharacterPerspectiveBoard out/CharacterPerspectiveBoard.mp4 --props=templates/character-perspective-board/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
