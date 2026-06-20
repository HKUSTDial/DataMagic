# 输入输出示例

DataMagic 支持完整数据视频生成，也支持更快的单图生成。下面展示的是对外可说明的输入和输出形式。

## 示例输入：完整数据视频

**用户目标**

```text
分析季度销售表现，并说明哪个产品类别带来了最强增长。
```

**表格**

```csv
quarter,category,revenue,growth_rate
Q1,Software,128000,0.08
Q2,Software,146000,0.14
Q3,Hardware,119000,0.05
Q4,Software,182000,0.25
```

**预期输出**

- 一个多场景动态数据视频。
- 用旁白解释关键趋势。
- 根据数据字段和用户目标自动选择图表。
- 可在浏览器预览中继续编辑文本、布局和视觉样式。

## 示例输入：Single Chart

**图表目标**

```text
展示不同类别的收入排名，并突出表现最强的类别。
```

**数据**

```csv
category,revenue
Software,182000
Hardware,119000
Services,97000
Accessories,44000
```

**预期输出**

- 一个单场景动态图表。
- 推荐图表类型和视觉模板。
- 快速预览，并支持编辑图表元素。

## 演示材料

- 演示视频：[https://datamagic-home.github.io/#video](https://datamagic-home.github.io/#video)
- 示例页面：[https://datamagic-home.github.io/#samples](https://datamagic-home.github.io/#samples)

