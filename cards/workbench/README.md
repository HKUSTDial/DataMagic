# DataMagic 多轨工作台 / Local Motion Workbench

本机浏览器编辑器，不是只改一张榜单的表单，也不是在线自动生成后端。公开画廊用于选卡；工作台、素材导入和渲染在运行它的电脑上进行。

## 启动

需要 Node.js 20.10+、ffmpeg/ffprobe。首次渲染可能下载 Remotion 浏览器；已有 Chrome 可通过 `DATAMAGIC_RENDER_BROWSER` 指定绝对路径。

```bash
cd DataMagic/cards
npm ci
node workbench/motion/scripts/open.mjs --card=CharacterPerspectiveBoard
```

也可 `npm run workbench`，然后打开 `http://127.0.0.1:5190/`。前一种方式自动打开浏览器；加 `--no-open` 可只启动服务。端口占用时拒绝启动，不会杀掉其他进程。用 Ctrl+C 退出。

## 从选卡到交付

1. 在左侧选卡，加入当前轨道与播放头位置。30 张原生卡可修改数据；109 张参考卡是已渲染视频，不能直接改内部数字。取消“只看可改数据的原生模板”显示全部卡片。
2. 选择片段，在右侧调整参数、起点、长度、素材入点、速度、透明度、尺寸、位置、音量。简单参数有输入框；复杂数据支持 JSON。无效输入不会进入导出。
3. 拖动片段调整位置，拖动两端裁剪，可跨轨移动。添加文字、背景或导入自己的图片/视频/音频。轨道支持改名、显示/隐藏和顺序调整；上方轨道覆盖下方轨道。
4. 移动播放头后拆分，或复制、删除片段。快捷键：S 拆分，Delete 删除，Cmd/Ctrl+D 复制，Cmd/Ctrl+Z 撤销，Shift+Cmd/Ctrl+Z 重做，左右箭头逐帧。
5. 工程自动保存在当前浏览器，也可下载/导入工程 JSON。导出 MP4 会真实渲染编辑后的时间线。**Mac 本机用户点“发送到剪映”**：确认并退出剪映后，自动渲染、准备隔离依赖、新建草稿、登记素材并尝试打开剪映，不必下载包或手动敲安装命令。首次需要 Python 3.10+ 和联网；依赖在 `out/jianying-runtime/`，后续复用。

**服务器访问者：** 浏览器不能直接写入你 Mac 的剪映库，按钮会解释本机流程。仍可点“导出剪映包”，下载并解压后双击 `Open-in-Jianying.command`，在图形提示中确认安装。系统下载安全提示可能需要右键打开或本机 Agent 协助，不能保证所有 Mac 都免设置。

已有交付包可由本机 Agent 完成安装：`node workbench/motion/scripts/send-to-jianying.mjs --package=/absolute/path/package --check` 只检查；取得本机安装授权后用 `--yes` 安装并打开剪映。不要在 Linux 服务器执行这一步。

JSON 不嵌入媒体文件。跨电脑分享 JSON 时需一起迁移引用素材；剪映交付 ZIP 已包含剪映所需的媒体。关闭浏览器不会自动删除已上传或已导出的文件。

## 编辑范围与交付边界

- 横屏 1920×1080 或竖屏 1080×1920，30fps，最长 60 秒；最多 16 轨、100 片段，单次上传最大 50MB。这是短视频配方工作台，不是通用长片剪辑软件。
- 支持恒定速度 0.25–4 倍，不支持曲线变速、自动口型、生成配音或自动跨字幕语义对齐。
- 原生模板按原始素材时钟播放，裁剪/调速不会重排其内部动画；末帧可保持。视频和音频导出前检查素材时长，不用反复循环掩盖短素材。
- 剪映视觉轨合成底片，按镜头边界切分；工作台添加的文字与音频独立可改。模板内部数字、图表和人物不是剪映原生组件，需回工作台改参数重新渲染。
- 剪映包要求独立文字层在视觉层上方；导出会检查。字幕尺寸与位置是近似换算，须在剪映检查。
- Mac 剪映需要接收者本机明文旧草稿的平台字段，工具不会上传或伪造设备信息，不覆盖已有草稿。详见[剪映交付与真机验收](../docs/jianying-delivery.md)。服务器结构验证不等于 Mac 已成功打开。

## 安全与文件位置

默认仅绑定 localhost，无认证，不要放到阿里云公网作为公共编辑服务。可信内网测试可指定 Vite `--host`；此时文件上传与渲染发生在该内网服务器，而不是访问者电脑。

- 源码：`workbench/motion/`；工程规范、浏览器预览与渲染共用实现。
- 上传素材：`out/motion-uploads/`。
- 导出结果：`out/motion/<随机 ID>/`，含 `film.mp4`、`project.json`；剪映导出还含 `delivery.zip`。仅有 `READY.json` 的输出算完成，不覆盖旧工程。
- 单次渲染一个工程，渲染在独立进程执行，不占住编辑服务；进度可查看，失败有原因提示。修改工程后旧导出标为过期。
- `npm run workbench:build` 只构建前端，不会把本机导出服务变成安全的公网站点。

## 开发验证

```bash
npm test
npm run typecheck
npm run workbench:typecheck
npm run workbench:build
python3 -m unittest discover -s tests -p 'test_*.py'
```

`motion/scripts/acceptance.cjs` 是内部 Playwright 端到端验收脚本，检查真实编辑、素材上传、渲染、剪映包与窄屏；`motion/scripts/parity.mjs <工程ID>` 对比浏览器预览与渲染关键帧。测试脚本当前使用服务器的浏览器/测试环境路径，并非产品启动依赖。实际 Mac 剪映打开、编辑及导出需单独记录版本和结果。

旧 `server.py` 与 5185 单模板页面仅留作回归测试，不是当前工作台入口。
