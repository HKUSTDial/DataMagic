# 拉远孤立异常

[English](en/PullBackIsolation.md) · [GitHub](https://github.com/HKUSTDial/DataMagic)

- 配方标识：`PullBackIsolation`

## 用途

先呈现完整群体，再拉远并暗化邻项，把异常对象从平均结构中清晰分离。

## 开始使用

首次使用，可把 [DataMagic 仓库](https://github.com/HKUSTDial/DataMagic) 交给编程智能体，请它配置 `datamagic` Skill 并使用本配方；已有仓库则直接复用。附上你的数据、素材和修改要求。[完整使用与安装说明](https://github.com/HKUSTDial/DataMagic/blob/main/skills/datamagic/README.md)。下列文件路径相对于仓库的 `cards/` 目录。

## 源码与数据

- 组件源码：`templates/pull-back-isolation/PullBackIsolation.tsx`
- 数据结构：`templates/pull-back-isolation/schema.json`
- 示例数据：`templates/pull-back-isolation/sample-data.json`
- 示例预览：无声；加入旁白后需单独对齐时间。

- 实现源码：`templates/pull-back-isolation/PullBackIsolation.tsx`

先让观众读取完整群体，再拉远并降低非焦点对象的亮度，从平均结构中孤立真正异常值。不可通过改变柱高或数值制造差异。

## 数据契约

`focusIndex` 必须指向 items 中的有效对象；结论必须解释该对象为何异常，所有显示值与输入数据一致。

## 镜头契约

使用 `pull_back_isolation`。非焦点对象仍需保留足够轮廓作为比较上下文，最终结论停留不少于 1.5 秒。

## 文件

`templates/pull-back-isolation/schema.json`
`templates/pull-back-isolation/sample-data.json`

## 对象图像

- 实体条目的 `iconSrc` 可指定 `public/` 下的本地图片路径，或提供的图片 URL；国家可用国旗，品牌可用自备 Logo，类别可用原创图标。图像跟随实体条目移动、排序或揭示，数值和文字标签保留。
- 多国区域使用示意定位插图而非单一国家旗帜；时间点不添加重复装饰图标。地区插图不是地理边界或官方标识。

## 渲染

在 `cards/` 目录安装依赖后渲染；分辨率、时长和帧率以 Composition 与配方中的声明为准。

```bash
npm ci
npx remotion render src/index.ts ShotCraft-PullBackIsolation out/PullBackIsolation.mp4 --props=templates/pull-back-isolation/sample-data.json
```

## 交付检查

核对输入与输出的数值、标签、单位、对象身份、图标和配色。检查开场、中段、每次揭晓及结尾的重叠、裁切、对比度、动画连续性和阅读停顿；如有音频，检查音画与字幕同步。演示数据及生成素材须明确标注。交付 MP4、可编辑源码、参数文件和可复现的渲染命令。
