# 电影赛道式竞赛

[English](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/en/CinematicTrackRace.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`CinematicTrackRace`

## 用途

用暗色赛道、领先者聚光和一次关键超越冲击聚焦，把排名变化变成高能竞赛段落。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/cinematic-track-race/CinematicTrackRace.tsx`
- 数据结构：`templates/cinematic-track-race/schema.json`
- 示例数据：`templates/cinematic-track-race/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

## 实现源码

```text
templates/cinematic-track-race/CinematicTrackRace.tsx
templates/cinematic-track-race/schema.json
templates/cinematic-track-race/sample-data.json
```

## 对象图像

- 实体条目的 `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。

## 补充制作约束

- 适合强调一次关键反超的高能竞赛；需要慢读每个中间值时使用 `EditorialLedgerRace`。
- 稳定对象、有序快照和确定性竞赛模型保持一致；`story` 提供设问、转折、结论和追踪对象。
- 先建立全部赛道，再连续插值数值与名次；关键反超仅使用一次短促 `crash_focus`。
- 固定界面、来源和结论不进入冲击变换层。
- 1920x1080、30fps，结尾静止至少 1.5 秒。
- 检查标签、数值和领先面板不被裁切，追踪值和胜者与数据一致，辉光不能掩盖图形或降低对比度，标注合成数据。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-CinematicTrackRace out/CinematicTrackRace.mp4 --props=templates/cinematic-track-race/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
