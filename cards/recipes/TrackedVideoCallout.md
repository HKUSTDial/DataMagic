# 视频对象跟踪标注

[English](en/TrackedVideoCallout.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`TrackedVideoCallout`

## 用途

用可编辑关键帧持续指向 Agnes 生成视频中的设备、人物或产品，同时保持标题与结论稳定。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/video-data-overlay/VideoDataOverlay.tsx`
- 数据结构：`templates/video-data-overlay/schema.json`
- 示例数据：`templates/video-data-overlay/tracked-callout-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

通过可编辑的归一化关键帧，让一条数据标注持续指向视频中的人物、设备、产品或建筑。

## 跟踪契约

- `tracking.keyframes[].frame/x/y` 定义视频时间与锚点位置，`x/y` 范围为 0–1。
- 关键帧之间线性插值；锚点、引导线、标签与数值使用同一颜色身份。
- 一次只解释一个被跟踪对象，避免把画面变成密集监控界面。
- 样例使用 `agnes-video-v2.0` 生成的连续回收分选镜头，锚点跟随机械臂上方主关节；关键帧针对最终 16:9 裁切逐帧校准。

## 运动与验收

1920×1080、30fps、8 秒。标题和来源不跟随视频移动；结论位于固定层。最后 1.2 秒冻结视频和全部标注。逐帧检查跟踪点不越界、不穿过主要文字、不因生成物体短暂形变而漂移，并确认素材路径可由用户 MP4 直接替换。

## 对象图像

- `metrics[].iconSrc` / `tracking.iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-TrackedVideoCallout out/TrackedVideoCallout.mp4 --props=templates/video-data-overlay/tracked-callout-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
