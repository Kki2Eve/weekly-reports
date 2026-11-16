# 工作汇报

[汇报首页](https://kki2eve.github.io/quest-weekend-report-20261114/) · [2026-11-14 汇报](https://kki2eve.github.io/quest-weekend-report-20261114/reports/2026-11-14/)

每周独立页面，按日期归档。纯 HTML / CSS / JavaScript，Node.js 18+ 即可维护，不需要 npm install。

## 每周添加

在本仓库目录执行：

```powershell
npm run new -- 2026-11-21 "本周工作汇报"
```

1. 填写 `reports/2026-11-21/report.json`。标题、简介和标签出现在首页；`sections` 的数组顺序就是汇报顺序。
2. 把这一周的图片、视频放进该周的 `media/`，在 JSON 中使用 `media/文件名.mp4` 等相对路径。
3. 执行 `npm run build`，自动生成本周内容与按日期倒序排列的首页目录。
4. 执行 `npm run preview`，打开 <http://127.0.0.1:4173/> 检查页面。
5. 执行 `powershell -ExecutionPolicy Bypass -File scripts/publish.ps1`，检查、提交并推送，等待 Pages 发布。

同一天的页面不会被新建命令覆盖。新建命令只创建本地文件，不会自动上传。以后也可以直接让 Codex 按日期添加新周报。

## 内容格式

每周页面用 `sections` 划分章节，默认上周回顾、本周工作、成果展示、下周计划。章节可添加、删减、调整顺序，每章 `id` 必须唯一，只用小写英文、数字和短横线。

每章 `blocks` 可放以下内容块：

```json
[
  { "type": "text", "text": "一句话说明" },
  { "type": "bullets", "items": ["完成事项", "遗留任务"] },
  { "type": "image", "src": "media/figure.png", "alt": "图片说明", "caption": "图标题" },
  { "type": "videos", "items": [
    { "title": "结果展示", "src": "media/demo.mp4", "poster": "media/demo.jpg" }
  ] },
  { "type": "metrics", "items": [
    { "label": "测试数据集", "value": "填写结果", "note": "指标与单位" }
  ] },
  { "type": "table", "columns": ["方法", "测试数据集", "指标"], "rows": [
    ["方法名称", "数据集名称", "填写结果"]
  ] }
]
```

示例中的文件需自行放入 `media/`，指标示例只是字段说明。视频建议使用浏览器兼容的 H.264 MP4 与 JPEG 封面；单个文件应小于 GitHub 的 100 MiB 限制。避免重复上传同一视频，也可以用 `../2026-11-14/media/文件名.mp4` 引用历史媒体。

## 快速修改

- 网页右上角「编辑内容」可修改文字。草稿按日期存储在当前浏览器，不会影响其他周或其他电脑。
- 「导出修改」得到 `report.json`，替换对应周的数据文件，再发布。
- 增删章节、插入图片视频、修改媒体顺序：编辑 `report.json`。
- 2026-11-14 保留原版布局和编辑器：正文编辑 `reports/2026-11-14/content.js`；首页标题、简介和标签编辑同目录 `report.json`。
- 「演示模式」支持左右方向键切换章节，Esc 退出。

## 目录

```text
index.html                  # 统一汇报入口
reports.js                  # 自动生成的目录
assets/                     # 首页和新版周报的公共样式、脚本
reports/
  2026-11-14/                # 原周报完整归档，含全部图片视频
    report.json              # 首页元信息
    content.js               # 原周报正文
    index.html / app.js / styles.css / media/
  YYYY-MM-DD/                # 后续每周一个目录
    report.json              # 编辑此文件
    content.js               # 自动生成，不直接编辑
    index.html / media/
templates/                  # 新建周报模板，不包含历史实验数据
scripts/                    # 新建、生成、检查、预览和发布
```

## 发布与访问

继续使用原仓库名，以保留已有首页链接。GitHub Pages 从 `main` 分支根目录发布；每周也有可单独分享的固定链接 `reports/YYYY-MM-DD/`。

`scripts/publish.ps1` 使用当前仓库的 Git 远程地址及现有 SSH 登录。其他电脑先克隆仓库、配置 GitHub SSH，再执行相同命令。

GitHub Free 支持公开仓库的 Pages；个人私有仓库的 Pages 需要 GitHub Pro。仓库私有化后，Pages 网站通常仍然公开。参见 [GitHub Pages 官方说明](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)。
