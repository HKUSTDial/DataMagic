# DataMagic 展示素材 / Showcase kit

[中文首页](../README.md) · [English homepage](../README.en.md) · [配方库](https://datamagic.chat/cards/)

## 30 秒效果集锦

用六段现有配方动画展示 DataMagic 的表达方式：角色讲解、人物与数据交接、动态柱状图竞赛、实景证据、趋势与多层地图滑行。竞赛取原预览第 3.5–7.5 秒，包含名次反超；地图滑行取第 2–6 秒，展示节点连线与空间移动；其他片段取第 1–5 秒。保留完整画面，不裁切图表。

- [中文旁白＋配乐＋音效 MP4](../assets/promo/datamagic-showcase-zh-voiced.mp4)
- [中文标题＋配乐音效 MP4（无旁白）](../assets/promo/datamagic-showcase-zh-music.mp4)
- [English titles + music and SFX](../assets/promo/datamagic-showcase-en-music.mp4)
- 原始静音画面：[中文](../assets/promo/datamagic-showcase-zh.mp4) · [English](../assets/promo/datamagic-showcase-en.mp4)
- [动态预览 GIF](../assets/promo/preview.gif) · [封面 JPG](../assets/promo/cover.jpg)
- [浏览器播放页](../assets/promo/index.html)（下载仓库后通过本地 HTTP 服务打开）

规格：1280×720、30 fps、30 秒、H.264，新增有声版使用 AAC 立体声音轨。中文主版本包含 AI 女声旁白、轻配乐与转场音效；另提供中文无旁白版与英文标题配乐版。中英文版分别替换展示标题，配方内部保持原始示例文案。示例中的数值为演示数据；生成角色与实景素材沿用各配方的来源说明。

The reel uses actual recipe previews, with English or Chinese section titles. The Chinese narrated edition uses IndexTTS2 speech; the English-title edition has music and SFX without narration. The underlying examples retain their original language. It showcases visual capabilities rather than a single continuous data analysis or an end-to-end user session.

## 镜头清单 / Shot list

| 时间 | 内容 | 对应配方 |
|---|---|---|
| 0–3 s | 数据柱生长、Logo 字标展开、停留后转入内容 | DataMagic 原有品牌图 |
| 3–7 s | 角色主持与透视数据板 | [CharacterPerspectiveBoard](../cards/recipes/CharacterPerspectiveBoard.md) |
| 7–11 s | 人物与数据交接 | [PresenterDataTakeover](../cards/recipes/PresenterDataTakeover.md) |
| 11–15 s | 动态柱状图竞赛 | [BarChartRace](../cards/recipes/BarChartRace.md) |
| 15–19 s | 实景转入数据证据 | [FootageEvidenceReveal](../cards/recipes/FootageEvidenceReveal.md) |
| 19–23 s | 趋势时间线 | [ChartTimelineTravel](../cards/recipes/ChartTimelineTravel.md) |
| 23–27 s | 多层数据地图滑行 | [ParallaxMapGlide](../cards/recipes/ParallaxMapGlide.md) |
| 27–30 s | Logo 回归与行动指引 / Call to action | 网站与仓库入口 |

## 使用建议与推广文案

本地 README 直接嵌入完整 MP4，支持 HTML 视频的 Markdown 预览器可以播放，同时保留文件链接。远端发布时再上传视频附件并替换引用地址；轻量 GIF 保留为备用展示素材。社交平台可以上传 MP4 以原生播放器展示。网页播放页使用 `preload="none"`，点击后才加载视频。GitHub 文件页面不执行仓库中的 HTML，可通过本地服务查看播放页。

**中文：**

> 让你的数据讲一个好故事。DataMagic 提供可复用的动态图表与讲解配方：角色主持、倾斜数据板、排名揭晓、趋势运镜、地图和实景叠加。先看效果，再把自己的数据交给 Agent，生成视频并保留可编辑源码。浏览配方：https://datamagic.chat/cards/

**English:**

> Pick an effect. Tell a story with your data. Explore DataMagic recipes for character-led explainers, perspective boards, rankings, timelines, maps, and footage overlays. Bring your data to a coding agent and create a video with editable source. Browse: https://datamagic.chat/cards/

## 重新制作 / Rebuild

在仓库根目录执行。需要 FFmpeg（支持 drawtext 和 libx264）、支持中文的字体，以及 Playwright 与 Chromium（用于逐帧绘制品牌动画）。脚本复用 `cards/gallery/media/` 下的六段 MP4，输出到 `assets/promo/`；再次执行会更新这些宣传素材。

```bash
npm install --no-save --prefix cards playwright
npx --prefix cards playwright install chromium
FFMPEG=ffmpeg PROMO_FONT=/path/to/chinese-font.ttf PROMO_LATIN_FONT=/path/to/latin-font.ttf node cards/scripts/build_promo.cjs
python3 -m http.server 8080
```

随后打开 `http://localhost:8080/assets/promo/`。脚本保留系统临时目录中的分段输出，便于检查和修改。默认字体路径适用于本次制作的 Linux 环境；Mac 上请通过 `PROMO_FONT` 指定字体。

已有 Playwright/Chromium 环境时，可以用 `PLAYWRIGHT_MODULE` 指定模块路径、`CHROME_PATH` 指定浏览器。`render_promo_brand.cjs` 逐帧控制原 Logo 的柱形揭示、字标展开和镜头收稳，原始 `assets/datamagic_logo.png` 保持不变。片头与片尾各 90 帧，完整视频的镜头和旁白时间线仍为 30 秒。

## 声音制作 / Sound production

- 中文旁白：[逐句文案与时间线](../assets/promo/narration.json)，本地 IndexTTS2 生成；复用项目已有女声音色参考，参考录音与模型权重不打包进仓库。
- 配乐：`score_promo.cjs` 合成的 120 BPM 柔和和弦、拨弦与轻节拍。
- 音效：同一脚本合成的切换气流声、轻落点与揭榜提示音，切换节点为 3、7、11、15、19、23、27 秒。配乐与音效未使用外部采样。
- 混音：旁白出现时自动压低配乐；有旁白版目标 -16 LUFS，无旁白版目标 -21 LUFS，限制峰值并保留片尾淡出。
- 逐句音量：语音采用补足分析长度的两遍响度处理，再裁回原时长；全部八句和最终成片逐段复测。混音脚本会自动执行音量检查，防止短句突然变小。实测结果见 [QA 记录](../assets/promo/audio/qa-report.json)。
- 中文旁白版已将字幕直接绘制到视频底部的独立字幕条，无需开启播放器字幕。每个镜头对应一句旁白，字幕与音频采用同一份时间线；保留[旁白字幕 WebVTT](../assets/promo/narration.zh.vtt)供后期编辑。音频各层保存在 `assets/promo/audio/`，可重新混音。

已生成的语音片段随素材保留，可直接重混，无需再次运行模型：

```bash
FFMPEG=ffmpeg node cards/scripts/score_promo.cjs
```

如修改旁白文字，使用安装好 IndexTTS2 依赖的 Python 环境，提供本地模型目录和你有权使用的参考音频：

```bash
python cards/scripts/generate_promo_voice.py --model-root /path/to/index-tts --reference /path/to/voice.wav
FFMPEG=ffmpeg node cards/scripts/score_promo.cjs
```

生成顺序为画面（`build_promo.cjs`）→ 语音（已有片段可跳过）→ 配乐混音（`score_promo.cjs`）。有声输出采用不同文件名，保留原始静音画面。
