# 配方 → 数据 → 生成 → 修改：操作演示 v2

内部预览：`assets/walkthrough-v2/index.html`。旧版教程保留在 `assets/walkthrough/`。

页面录屏使用中文搜索“动态柱状图竞赛”来选择配方；`BarChartRace` 保留为代码里的稳定配方标识，不需要用户用英文搜索。网站支持部分关键词、同义词和空格分隔的多关键词匹配，例如“柱状”“条形图竞赛”“国家 排名”。

本次重新生成了六种饮品、六个月的虚构销量示例。`sales.csv` 是输入，`request-v1.txt` 与 `request-v2.txt` 是请求，`v1.json`、`v2.json` 是实际渲染参数。`verification.json` 校验两版的 36 个数值与 CSV 一致。

每种饮品配有独立绘制的 SVG 图标，位于 `cards/public/icons/coffee/`。修改版以 `highlightId: "drink-1"` 突出拿铁，其余饮品保留原来的颜色并略微淡化。通用模板中的 `entities[].iconSrc` 可替换为自己的 Logo、旗帜、头像等图片；图标依对象 ID 跟随排名，不依赖当前位置。

## 复现

在已安装依赖的 `cards/` 下运行：

```sh
node examples/agent-workflow-demo/adapt.cjs
node examples/agent-workflow-demo/render.cjs v1
node examples/agent-workflow-demo/render.cjs v2
node examples/agent-workflow-demo/render-film.cjs --stills
node examples/agent-workflow-demo/render-film.cjs
```

渲染脚本中的浏览器路径需按本机调整。旁白和页面采集素材已经保存在 `assets/walkthrough-v2/`；重新采集需要运行本地案例库与 `capture.cjs`。

## 演示与验证边界

配方库操作是实际页面录屏；任务输入与执行面板是本次过程的可视化重排，并在画面中标注「流程演示 · 非客户端录屏」。它不是 Codex 客户端实录。单独启动 Codex CLI 的尝试因认证 401 失败，因此这里不能作为独立 CLI 已跑通的证明。参数适配、数值校验和两版视频由当前助手实际执行，等待时间在教程中省略。

第一版展示摘录，修改后的第二版完整展示 14 秒。字幕按旁白分句及字数分配时间，不声称逐字语音对齐。BGM 与无 BGM 版共用同一画面、旁白、字幕和交互音效时间线。

本机浏览器合成音频时发生本地媒体加载错误，因此最终采用 `mix-film.cjs` 从同一个 `film/timeline.ts` 和语音清单编译音轨，再复用同一画面母版，保证两版画面一致。渲染脚本已采用该路径。`verify-film.cjs` 检查时长、帧数及音量，`verify-preview.cjs` 检查内部网页播放和窄屏布局。

## 本次验收

### 文字闪动修复

字体改为案例库已有的本地 Noto Sans SC 400/700；构建时嵌入完整字体字节，每个渲染进程通过 `FontFace.load()` 和 Remotion `delayRender` 等待字体加载完成。失败时终止渲染，不再静默回退。字体许可证见 `cards/gallery/fonts/LICENSE-Noto-Sans-SC.txt`。`render-film.cjs --font-check` 可先生成 46–48 秒的并行渲染测试，`verify-font-stability.cjs --preflight` 检查静止文字区域的连续帧；完整成片使用不带参数的验证命令。

- 修复后两版都是 1920×1080、30 fps、2160 帧、72 秒；分别约 9.25 MB / 9.16 MB。
- 修复后检查 46 秒输入文字、侧栏、面板标题，以及 22/32/46/69 秒固定标题的连续帧：全部通过。原固定文字区域最大帧差为 0.618，修复后为 0.00035（0–255 灰度平均差）；侧栏与面板标题的测量差为零。详见 `font-verification.json`。修复前视频保存在 `out/font-fix-before/`。
- 带配乐版 −18.07 LUFS、−1.91 dBTP；无配乐版 −18.04 LUFS、−1.94 dBTP。9 段原始旁白响度差 0.55 LU，无削波或尾部硬截断证据。
- 独立审查确认数值一致、修改版末尾停留、关键字幕无遮挡，以及两处布局修复。交叉淡化时约 0.33 秒的文字叠化保留为后续可优化项。
- 桌面与 390px 手机页面已实际播放验证。没有进行独立 Codex CLI 成功验证；认证问题仍需后续解决。

## 来源与制作

镜头组织参考 [Video ShotCraft](https://github.com/Vincentwei1021/video-shotcraft) 的 `input-trigger-moves / cursor-performance`。`film/PageCam.tsx` 复用其页面镜头组件，许可证见 `film/LICENSE-VideoShotCraft`；光标运动逻辑依据该项目对应示例改写。品牌、数据、录屏、配方成片和流程面板为 DataMagic 本次制作。点击、滑动音由脚本合成，配乐沿用本项目既有程序配乐，未使用该参考项目的第三方音乐文件。
