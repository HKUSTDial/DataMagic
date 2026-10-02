# Video Metric Overlay

将真实视频作为主要证据层，把 1–4 个指标放入经过预留的负空间，而不是用图表遮住现场主体。

## 素材与数据

- `videoSrc` 指向 `public/` 下可替换的 MP4；样例素材由 `agnes-video-v2.0` 直接生成连续视频，再统一为 1920×1080、30fps、8 秒，无第三方实拍素材依赖。
- `metrics` 同时驱动标签、数值、单位、颜色和数据条长度。
- `title`、`subtitle`、`source` 和 `conclusion` 始终位于稳定界面层。
- 生成记录保存在 `templates/video-data-overlay/assets/recycling-facility-agnes.json`，包含模型、提示词、任务标识和输出规格。

## 运动与验收

1920×1080、30fps、8 秒。视频全幅播放，指标依次进入，结论在后段显现；最后 1.2 秒同时冻结视频与数据图层。确保主体未被文字遮挡、背景变化时仍有足够对比度、来源在 64px 安全区内。生成影像必须抽帧检查物体形变、镜头抖动与文字伪影，不合格时重新生成或回退到已验收缓存。

## 对象图像 / Entity imagery

- `metrics[].iconSrc` / `tracking.iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.
