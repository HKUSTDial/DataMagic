# Tracked Video Callout

通过可编辑的归一化关键帧，让一条数据标注持续指向视频中的人物、设备、产品或建筑。

## 跟踪契约

- `tracking.keyframes[].frame/x/y` 定义视频时间与锚点位置，`x/y` 范围为 0–1。
- 关键帧之间线性插值；锚点、引导线、标签与数值使用同一颜色身份。
- 一次只解释一个被跟踪对象，避免把画面变成密集监控界面。
- 样例使用 `agnes-video-v2.0` 生成的连续回收分选镜头，锚点跟随机械臂上方主关节；关键帧针对最终 16:9 裁切逐帧校准。

## 运动与验收

1920×1080、30fps、8 秒。标题和来源不跟随视频移动；结论位于固定层。最后 1.2 秒冻结视频和全部标注。逐帧检查跟踪点不越界、不穿过主要文字、不因生成物体短暂形变而漂移，并确认素材路径可由用户 MP4 直接替换。

## 对象图像 / Entity imagery

- `metrics[].iconSrc` / `tracking.iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- Use a local image path relative to `public/` or a supplied image URL. Flags, supplied brand logos, and original category illustrations stay attached to their entity while text and exact values remain readable.
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。
- Regional locator illustrations are schematic, not flags, official emblems, or geographical boundaries. Do not add repetitive decorative icons to time points.
