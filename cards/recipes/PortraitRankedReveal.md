# 竖屏倒序榜单 / Portrait Countdown Ranking

## 用途 / Purpose

针对手机重新布局的 9:16 数据故事，不是把横屏画面裁窄。先提出问题，再从末位揭晓 2–4 个对象，最后保留结论。相同数值并列同一排名。

A purpose-built portrait story, not a crop of a landscape chart. Start with a question, reveal 2–4 categories from lowest to highest value, and hold the conclusion. Equal values share a rank.

## 源码与文件 / Source files

- Component: `templates/portrait-ranked-reveal/PortraitRankedReveal.tsx`
- Data: `templates/portrait-ranked-reveal/sample-data.json`
- Schema: `templates/portrait-ranked-reveal/schema.json`
- Shared timing: `src/sceneTiming.ts`
- Composition: `ShotCraft-PortraitRankedReveal`
- Preview: `gallery/media/PortraitRankedReveal.mp4`

## 数据与叙事 / Data and narrative

`rows` 含稳定 `id`、`label`、`value`、揭晓秒数 `at` 和 `caption`。共同零基线由 `maximum` 指定。数值非负且不超尺度，ID 唯一。揭晓间隔至少 0.8 秒，顺序必须从低值到高值。10 秒模板的 `at` 范围是 1.5–7.2 秒，给开场与结论留时间。

Rows contain stable IDs, labels, values, reveal times in seconds, and commentary. Use one zero-based scale (`maximum`); values must be nonnegative and within it. IDs must be unique. Reveals are at least 0.8 seconds apart, in nondecreasing value order. In this 10-second composition, reveal times must be 1.5–7.2 seconds to reserve a hook and final hold.

标签最多 12 字，标题 24 字，问题和结论 48 字，来源 56 字。英文同样按字符计数，超长英文请主动缩写，不保证长段落自动适配。替换数据时重新计算差距并改写说明，不能沿用旧结论。

Labels allow 12 characters, titles 24, questions and takeaways 48, sources 56. These limits count English characters too; abbreviate long text. Recalculate differences and rewrite commentary when values change. Sample values are synthetic and must not be presented as factual statistics.

## 画面与动画 / Layout and timing

1080×1920，30 fps，300 帧，10 秒；H.264，CRF 18。所有动画使用帧时间，无 CSS 动画。默认演示无配音。

1080×1920, 30 fps, 300 frames, 10 seconds; H.264 CRF 18. Frame-driven animation; silent preview.

主要内容在左 80、右 160、上 135、下 265 像素的安全范围内；右侧和底部预留给移动端按钮、字幕。不同平台覆盖区域不同，实际发布仍需预览检查。没有自动配音或自动词级同步。

Content reserves 80 px left, 160 px right, 135 px top, and 265 px bottom for mobile UI and captions. These are conservative design margins, not a guarantee for every platform. Check the target platform preview. Narration and word alignment are not generated automatically.

## 使用 / Render

From the `cards/` directory:

```bash
npm ci
npx remotion render src/index.ts ShotCraft-PortraitRankedReveal out/portrait.mp4 --props=templates/portrait-ranked-reveal/sample-data.json --codec=h264 --crf=18
```

## 验收 / Acceptance

检查开场、每次揭晓与结尾；标题不截断，未揭晓值不泄露，条长与数值一致，最高值最后出现，结论与来源可读。交付数据、源码和完整竖屏 MP4，而不仅是最后一帧。

Inspect the opening, every reveal, and conclusion. Verify text stays within bounds, hidden values do not leak, bar lengths match numbers, the winner appears last, and the final takeaway/source are readable. Deliver data, source, and the complete portrait MP4.
# 对象图像 / Entity imagery

对象可设置 `iconSrc`，指向 public 中的国旗、品牌素材或类别插图；保持名称和数值可读，图像随对象身份移动，不按当前排名重新分配。倒序揭晓时图标与名称同步出现。示例公司使用通用类别插图。

Set an entity's `iconSrc` to a local public asset or supplied image URL. Keep names and values readable; imagery follows entity identity, not current rank, and appears with the entity's reveal. Fictional companies use category illustrations.
