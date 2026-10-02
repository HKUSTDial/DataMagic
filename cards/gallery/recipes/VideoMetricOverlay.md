# 生成视频数据叠加

[English](en/VideoMetricOverlay.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`VideoMetricOverlay`

## 用途

以 Agnes 生成的连续 MP4 为主要情境层，将指标放入视频负空间并同步冻结结论，避免图表遮挡现场主体。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/video-data-overlay/VideoDataOverlay.tsx`
- 数据结构：`templates/video-data-overlay/schema.json`
- 示例数据：`templates/video-data-overlay/negative-space-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

将真实视频作为主要证据层，把 1–4 个指标放入经过预留的负空间，而不是用图表遮住现场主体。

## 素材与数据

- `videoSrc` 指向 `public/` 下可替换的 MP4；样例素材由 `agnes-video-v2.0` 直接生成连续视频，再统一为 1920×1080、30fps、8 秒，无第三方实拍素材依赖。
- `metrics` 同时驱动标签、数值、单位、颜色和数据条长度。
- `title`、`subtitle`、`source` 和 `conclusion` 始终位于稳定界面层。
- 生成记录保存在 `templates/video-data-overlay/assets/recycling-facility-agnes.json`，包含模型、提示词、任务标识和输出规格。

## 运动与验收

1920×1080、30fps、8 秒。视频全幅播放，指标依次进入，结论在后段显现；最后 1.2 秒同时冻结视频与数据图层。确保主体未被文字遮挡、背景变化时仍有足够对比度、来源在 64px 安全区内。生成影像必须抽帧检查物体形变、镜头抖动与文字伪影，不合格时重新生成或回退到已验收缓存。

## 对象图像

- `metrics[].iconSrc` / `tracking.iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-VideoMetricOverlay out/VideoMetricOverlay.mp4 --props=templates/video-data-overlay/negative-space-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
