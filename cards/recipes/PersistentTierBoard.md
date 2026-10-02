# 持续分层与证据更新

[English](https://github.com/HKUSTDial/DataMagic/blob/main/cards/recipes/en/PersistentTierBoard.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`PersistentTierBoard`

## 用途

保留分层板和已出现对象，按明确阈值移动更新对象；支持改善与回落，不把主观档位伪装成数值排名。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/persistent-tier-board/PersistentTierBoard.tsx`
- 数据结构：`templates/persistent-tier-board/schema.json`
- 示例数据：`templates/persistent-tier-board/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

## 适用情境

让榜单成为持续存在的舞台：旧对象保留，只移动新证据改变的对象。适合服务水平、产品评估、质量等级和分层教学，既支持升级也支持回落。

## 实现

- 组件：`templates/persistent-tier-board/PersistentTierBoard.tsx`
- 数据结构：`templates/persistent-tier-board/schema.json`
- 示例数据：`templates/persistent-tier-board/sample-data.json`
- 备用数据：`templates/persistent-tier-board/alternate-data.json`
- 渲染标识：`ShotCraft-PersistentTierBoard`

## 分层规则

三层 `tiers` 按 `minimum` 降序排列，底层从 0 开始，边界归入上层。这里是“值越大越高层”的量化评估，不是任意主观评级，也不是每一层内部的精确排名。

0–3 秒建立全貌；对象按 `at` 更新，运动 0.85 秒，未更新对象持续保留；9.4–12 秒结论停留。移动中暂显示旧值，落位后显示新值；颜色和边框提示正在迁移。短片不重置榜单。

## 复用与验收

默认配送准时率；备用质量分数包含降级和跨两层升级，验证并非只支持向上移动。阈值是明确的作者输入，演示阈值不是行业标准。

- 本项目独立实现通用分层板表现方式，不使用参考项目的球员照片、人像、声音或源码。

## 对象图像

- 实体条目的 `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。

## 补充制作约束

- 使用 3–5 个唯一身份对象，数值落在 `[0, maximum]` 内。
- 每个对象固定在自己的列，层级由阈值计算，不手动指定。
- 核对阈值边界、初始位置、每次更新和最终位置。
- 不把不同指标放进同一层级尺度；主观评价必须明确标注，不伪装为测量结果。
- 阈值图例始终可见，阅读时不漂移运镜。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-PersistentTierBoard out/PersistentTierBoard.mp4 --props=templates/persistent-tier-board/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
