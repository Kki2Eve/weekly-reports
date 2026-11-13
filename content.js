// 修改文字后刷新网页即可。调整 videos 数组的顺序，就会调整演示顺序。
window.REPORT = {
  "date": "2026.11.14",
  "title": "从模型方案，\n到真实采集",
  "subtitle": "手部三维重建 · 周末进展汇报",
  "intro": "沿着两条主线推进：用更多数据改善模型，用 Quest 打通自采数据的图像与手部标注链路。",
  "recap": [
    {"title": "模型架构确定", "text": "确定免检测的双目视频网络路线：从两路图像直接恢复手部三维关键点，并结合相机轨迹得到世界系结果。"},
    {"title": "自采数据方案梳理", "text": "考虑用头显采集第一视角图像，同时记录设备提供的手部骨架，作为后续数据采集与标注的起点。"}
  ],
  "carryTitle": "留下的两个问题",
  "carry": ["扩充训练数据后，精度和跨设备泛化能改善多少？", "头显能否稳定导出图像与骨架，并让标注对齐到画面？"],
  "trainingTitle": "更多数据，带来实质改善",
  "trainingIntro": "在既定架构上加入 UmeTrack 与 SHOW3D，完成进一步训练、模型定型和测试评估。本次汇报合并回顾这一轮数据扩充的进展。",
  "trainingRows": [
    {"label": "HOT3D", "model": "v4_hot3d", "value": 20.285},
    {"label": "+ UmeTrack", "model": "v4_umetrack", "value": 16.358},
    {"label": "+ SHOW3D", "model": "v4_show3d · 定型", "value": 14.174}
  ],
  "trainingNote": "HOT3D 开发集 · 左相机系 MANO 头 MPJPE（mm），越低越好；同一开发集评测。数值取自仓库已记录结果。",
  "trainingResults": [
    {"value": "24.2 mm", "label": "SHOW3D 开发集", "text": "加入 SHOW3D 后，由 79.3 mm 降至 24.2 mm（MANO 头）。"},
    {"value": "19.4 mm", "label": "SHOW3D 测试集", "text": "定型模型在 6 位测试参与者、448 个场景上的 MANO 头结果。"},
    {"value": "仍需改善", "label": "跨设备泛化", "text": "公司 PICO 设备测试仍有退化，下一步聚焦困难样例与同型设备数据。"}
  ],
  "trainingConclusion": "本轮采用 v4_show3d；当前证据支持继续扩充合适的数据。",
  "questTitle": "让采集链路真正跑起来",
  "questIntro": "从“能看到手”推进到“能录下图像、导出骨架，并检查两者是否匹配”。",
  "questCards": [
    {"tag": "已完成", "title": "双眼显示与采集", "text": "修复双眼显示问题；打通双目 RGB、每手 21 点骨架和菜单手势开始／停止录制。"},
    {"tag": "已验证", "title": "时间与骨架一致性", "text": "真机采样中，骨架与对应手状态未发现不匹配；按图像时间查询历史手姿态的接口可用。"},
    {"tag": "已定位", "title": "录制帧率瓶颈", "text": "REC 显示的是采集发送帧率，实录约 21 对／秒。已定位调度节流问题，帧率优化仍待落地。"}
  ],
  "questPipeline": ["双目 RGB 图像", "图像关联时间戳", "对应时刻手部姿态", "21 点投影与回放检查"],
  "questConclusion": "采集与诊断链路已跑通；动态对齐质量与稳定采集帧率，是下一步的验证重点。",
  "questNote": "按图像时间查询目前完成诊断验证，尚未替换正式录制路径。画面叠合与 MediaPipe 对照用于检查，不能直接作为真实精度。",
  "demoTitle": "从实际画面看调试进展",
  "demoIntro": "先看投影回放，再看头显内的手部显示与交互。当前为初排，讲解顺序后续调整。",
  "videos": [
    {"id": "demo-01", "title": "图像投影与三维骨架回放", "tag": "Ceres · 投影回放", "description": "同屏查看 RGB 上的二维投影和三维骨架。重点观察静止、移动与遮挡时，关节点是否贴合手部。", "src": "media/demo-01.mp4", "poster": "media/demo-01.jpg", "duration": "01:09", "original": "ceres-episode-000003-2D-3D-crop-corrected.mp4"},
    {"id": "demo-02", "title": "Quest 头显调试 · 片段一", "tag": "Quest · 头显录屏", "description": "查看头显内的骨架显示、双手动作和录制界面。此片段保留完整过程，汇报时可拖动进度条。", "src": "media/demo-02.mp4", "poster": "media/demo-02.jpg", "duration": "03:25", "original": "com.oculus.vrshell-20261112-093429-0.mp4"},
    {"id": "demo-03", "title": "Quest 头显调试 · 片段二", "tag": "Quest · 动作展示", "description": "观察张手、握手和左右手运动中的骨架表现，关注动态动作下的位置偏差。", "src": "media/demo-03.mp4", "poster": "media/demo-03.jpg", "duration": "02:06", "original": "com.oculus.vrshell-20261112-104858-0.mp4"},
    {"id": "demo-04", "title": "HTS 手部追踪参考", "tag": "HTS · 参考表现", "description": "观察 Hand Tracking Streamer 在头显透视画面中的表现，作为静止与动态追踪的定性参考。", "src": "media/demo-04.mp4", "poster": "media/demo-04.jpg", "duration": "02:04", "original": "com.wengmister.handtrackingstreamer-20261113-112827-0.mp4"},
    {"id": "demo-05", "title": "EgoKit 采集界面与手部交互", "tag": "EgoKit · 采集探索", "description": "展示早期采集工具的界面与手部交互，说明自采方案的探索起点。", "src": "media/demo-05.mp4", "poster": "media/demo-05.jpg", "duration": "00:24", "original": "org.chuange.egokit-20261111-170539-0.mp4"}
  ],
  "nextTitle": "从跑通，走向稳定可用",
  "nextIntro": "下一周围绕数据质量推进，优先把影响训练和采集可靠性的因素查清楚。",
  "next": [
    {"title": "继续分析泛化问题", "text": "整理困难样例，检查新数据的标注质量，确定适合下一轮训练的数据来源。", "deliverable": "产出：困难样例与数据选择结论"},
    {"title": "落地时间对齐与帧率优化", "text": "以图像时间查询作为候选基线，验证动态表现；修正采集节流，复测帧率与稳定性。", "deliverable": "产出：可复测的采集版本"},
    {"title": "形成一批自采验证数据", "text": "覆盖静止、快速移动、捏合、抓取与遮挡，检查图像、骨架、相机参数及时间信息。", "deliverable": "产出：小规模样本与质量检查记录"}
  ],
  "closing": "目标：让模型改进有数据依据，让自采数据有质量依据。"
};
