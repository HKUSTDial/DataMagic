# 从 CSV 到第一支动态柱状图视频

[观看 76 秒中文上手演示](../../../assets/walkthrough/datamagic-first-video-zh.mp4) · [浏览器播放与文件下载](../../../assets/walkthrough/index.html) · [返回项目首页](../../../README.md)

本例实际复用了 `BarChartRace` 配方：换成虚构咖啡店的销量表，生成首版，再修改标题、颜色与结尾停留。视频包含真实配方库操作录屏、实际执行记录和完整的两版输出，配有旁白与内嵌字幕。

## 你可以直接这样试

1. 准备仓库，在你使用的编程智能体中打开仓库目录。
2. 打开[动态柱状图竞赛](https://datamagic.chat/cards/#BarChartRace)，点击“复制实现指令”。
3. 附上本目录的 [sales.csv](sales.csv)，给出 [第一次请求](brief.md)。配套 Skill 位于 `skills/datamagic-video/`。
4. 查看输出后，再给出 [修改请求](revision.md)。
5. 对比视频中的数值、标题、颜色和结尾停留。

本次实际复制到的完整文本保存在 [copied-implementation.txt](copied-implementation.txt)。数据为教学演示，单位为杯。

## 直接复现已完成的工程

首次使用需要 Node.js 20.10+、Cards 依赖和 Remotion 可用的浏览器。在仓库根目录运行：

```bash
cd cards
npm ci
node examples/coffee-race-walkthrough/render.cjs
```

已有依赖时可跳过安装。默认浏览器由 Remotion 处理；如需指定本机 Chromium：

```bash
REMOTION_BROWSER_EXECUTABLE=/path/to/chrome node examples/coffee-race-walkthrough/render.cjs
```

渲染脚本会读取 CSV、生成两份参数、渲染两个 MP4 与六张检查帧。再次运行会更新本例的参数和输出，库里的原始模板和演示数据保持不变。检查视频需要 FFmpeg/ffprobe：

```bash
FFMPEG=ffmpeg node examples/coffee-race-walkthrough/verify.cjs
```

## 文件与对应关系

| 文件 | 内容 |
|---|---|
| [sales.csv](sales.csv) | 六个月 × 六种饮品，36 个数值 |
| [brief.md](brief.md)、[revision.md](revision.md) | 两次自然语言任务说明 |
| [build-props.cjs](build-props.cjs) | CSV → 模板字段映射与数据校验 |
| [v1.json](v1.json)、[v2.json](v2.json) | 首版和修改版的可编辑参数 |
| [entry.tsx](entry.tsx) | 导入原生模板，注册两版动画；修改版冻结末帧两秒 |
| [render.cjs](render.cjs) | 可重复执行的渲染脚本 |
| [render.log](render.log)、[render-report.json](render-report.json) | 本次实际执行计时与输出配置 |
| [verification.json](verification.json) | 数值、时长、分辨率和最后两秒稳定性检查 |

字段映射：CSV 第一列 → `snapshots[].time`；其余列标题 → `entities[].label`；每个数值 → 对应时间与饮品的 `snapshots[].values`。此示例读取简单的宽表 CSV，不支持带引号的复杂字段。

## 实际结果

- [首版 MP4](../../../assets/walkthrough/coffee-race-v1.mp4)：12 秒，1920×1080，30 fps，六色竞赛图。
- [修改版 MP4](../../../assets/walkthrough/coffee-race-v2.mp4)：14 秒，拿铁为紫色，其余饮品为灰蓝色，结尾增加两秒。
- 首月领先：美式 820 杯；末月领先：拿铁 1450 杯。
- 两版各核对 36 个输入数值，改版前后数据完全一致。
- 修改版最后两秒的逐帧平均亮度差低于 0.001，画面保持稳定。
- 本次渲染及六张检查帧共约 125 秒，实际时间依赖机器性能。

本次由当前助手按照仓库 Skill 和配方完成适配，使用服务器现有依赖；尚未验证全新 Mac 的首次安装，也不是对不同 Agent 成功率的评测。教程中的执行记录页是实际测试的复盘页面，不是额外的生成工作台。

## 重新制作教程视频

`record.cjs` 使用 Playwright 录制实际配方库操作并截取复盘页面。先在仓库根目录启动静态服务，再运行录制脚本：

```bash
python3 -m http.server 18640 --bind 127.0.0.1
```

另一个终端，在仓库根目录执行（需 Playwright 与 Chromium）：

```bash
node cards/examples/coffee-race-walkthrough/record.cjs
FFMPEG=ffmpeg node cards/examples/coffee-race-walkthrough/build-tutorial.cjs
```

可用 `WALKTHROUGH_URL`、`PLAYWRIGHT_MODULE`、`CHROME_PATH` 指定现有环境。教程旁白已保存在 `assets/walkthrough/audio/`，逐句响度均已检查；构建可复用这些音频。旁白由 IndexTTS2 生成，背景配乐复用本项目的程序合成音轨。
