# Bump Chart Story / 动态排名轨迹

- ID: `ShotCraft-BumpChartStory`
- Recipe key: `BumpChartStory`
- Category: `race_chart`

## Use / 适用场景

Use when the story is about who overtook whom, not only who has the largest
final value. 适合市场份额、国家排名、品牌竞争和年度榜单变化。

## Data contract / 数据契约

- Every series must provide one numeric value for every period.
- Rank and label are derived from the same values; do not provide rank separately.
- Keep 3–6 series visible so moving labels remain readable.

## Animation contract / 动画契约

- Reveal the trajectory continuously, then hold the final ranking.
- Use stable colors for entities across all periods.
- Avoid abrupt rank jumps or independently animated labels.

## Native implementation

`templates/bump-chart-story/BumpChartStory.tsx`
# 对象图像 / Entity imagery

对象可设置 `iconSrc`，指向 public 中的国旗、品牌素材或类别插图；保持名称和数值可读，图像随对象身份移动，不按当前排名重新分配。倒序揭晓时图标与名称同步出现。示例公司使用通用类别插图。

Set an entity's `iconSrc` to a local public asset or supplied image URL. Keep names and values readable; imagery follows entity identity, not current rank, and appears with the entity's reveal. Fictional companies use category illustrations.
