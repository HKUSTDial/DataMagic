# 编辑账本式竞赛

[English](en/EditorialLedgerRace.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`EditorialLedgerRace`

## 用途

把排名变化组织成问题、追踪对象、转折旁注和最终主张，适合证据导向的编辑化数据故事。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/editorial-ledger-race/EditorialLedgerRace.tsx`
- 数据结构：`templates/editorial-ledger-race/schema.json`
- 示例数据：`templates/editorial-ledger-race/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

## 实现源码

```text
templates/editorial-ledger-race/EditorialLedgerRace.tsx
templates/editorial-ledger-race/schema.json
templates/editorial-ledger-race/sample-data.json
```

## 对象图像

- 实体条目的 `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。

## 补充制作约束

- 适合证据导向的编辑化排名故事，不适合逐秒监控或必须使用高饱和队伍色的场景；高能竞赛可用 `CinematicTrackRace`。
- 使用与 `BarChartRace` 相同的稳定对象、有序快照和确定性插值。
- `story` 提供 `hook`、`turningPoint`、`takeaway`、`focusEntityId`；所有数字和名次由结构化数据推导。
- 先呈现问题和完整比较，再持续插值并缓慢推近追踪对象，只出现一次转折旁注。
- 标题、来源、结论留在固定层，结尾静止至少 1.5 秒；1920x1080、30fps。
- 核对最终排名、追踪对象和旁注，不用装饰纹理替代真实数据，标注合成数据。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-EditorialLedgerRace out/EditorialLedgerRace.mp4 --props=templates/editorial-ledger-race/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
