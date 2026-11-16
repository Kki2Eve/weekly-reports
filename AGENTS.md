# 每周工作汇报

- 此目录是独立 Git 仓库。操作前检查 `git status --short`。
- 首页是历周目录；每周页面和媒体放在 `reports/YYYY-MM-DD/`，不要覆盖旧周报。
- 新周报用 `npm run new -- YYYY-MM-DD "标题"`，编辑该目录的 `report.json`。
- 新模板只有结构，不要沿用上周的指标、结果或结论。文字简短、浅色布局，以图像和视频为主。
- `reports/2026-11-14/` 是旧版归档；它的正文继续使用 `content.js`，`report.json` 仅保存首页元信息。
- 标准周报的 `content.js` 和根目录的 `reports.js` 是生成文件，应通过 `npm run build` 更新。
- 新的标准周报共享 `assets/report.js` 和样式。修改共享渲染器时检查所有标准周报，避免影响历史展示。
- 发布前运行 `npm run build`、`npm run check`，在浏览器检查首页与本周页面，确认视频可播放。
- 网页编辑只是本机草稿，导出文件替换对应周报的数据文件后才可发布。
- 保留现有 GitHub 仓库名和首页网址，除非用户明确要求迁移。
- 私有仓库不等于私有 Pages 网站。修改可见性前确认套餐支持和网站访问需求。
