// 修改文字和视频数组顺序后重新发布。
window.REPORT = {
  "date": "2026.11.14",
  "review": [
    "确定模型架构",
    "考虑自采数据的采集与标注"
  ],
  "pending": "数据采集与标注方案落地",
  "training": "加入 UmeTrack、SHOW3D 进一步训练",
  "developmentTitle": "HOT3D 开发集",
  "developmentMetric": "相机系 MPJPE（mm）↓",
  "trainingRows": [
    {
      "label": "HOT3D",
      "value": 20.285
    },
    {
      "label": "+ UmeTrack",
      "value": 16.358
    },
    {
      "label": "+ SHOW3D",
      "value": 14.174
    }
  ],
  "testResults": [
    {
      "dataset": "HOT3D 测试集",
      "value": "24.0 mm",
      "metric": "世界系 MPJPE · all"
    },
    {
      "dataset": "SHOW3D 测试集",
      "value": "19.4 mm",
      "metric": "相机系 MPJPE · MANO 头"
    }
  ],
  "groups": {
    "comparison": [
      {
        "id": "compare-four",
        "title": "四种方法对比",
        "src": "media/compare-four.mp4",
        "poster": "media/compare-four.jpg",
        "duration": "00:37",
        "aspect": "1664 / 1248"
      },
      {
        "id": "compare-ace",
        "title": "ACE Ego Hand",
        "src": "media/compare-ace.mp4",
        "poster": "media/compare-ace.jpg",
        "duration": "00:37",
        "aspect": "832 / 624"
      },
      {
        "id": "compare-hawor",
        "title": "HaWoR",
        "src": "media/compare-hawor.mp4",
        "poster": "media/compare-hawor.jpg",
        "duration": "00:37",
        "aspect": "832 / 624"
      },
      {
        "id": "compare-vjepa",
        "title": "V-JEPA Hand",
        "src": "media/compare-vjepa.mp4",
        "poster": "media/compare-vjepa.jpg",
        "duration": "00:37",
        "aspect": "832 / 624"
      },
      {
        "id": "compare-wilor",
        "title": "WiLoR",
        "src": "media/compare-wilor.mp4",
        "poster": "media/compare-wilor.jpg",
        "duration": "00:37",
        "aspect": "832 / 624"
      }
    ],
    "quest": [
      {
        "id": "app-overlay",
        "title": "自制 App · 骨架叠加",
        "src": "media/app-overlay.mp4",
        "poster": "media/app-overlay.jpg",
        "duration": "00:37",
        "aspect": "2560 / 960"
      },
      {
        "id": "app-mediapipe",
        "title": "自制 App · MediaPipe 对照",
        "src": "media/app-mediapipe.mp4",
        "poster": "media/app-mediapipe.jpg",
        "duration": "00:37",
        "aspect": "2560 / 960"
      },
      {
        "id": "demo-01",
        "title": "Ceres · 投影回放",
        "src": "media/demo-01.mp4",
        "poster": "media/demo-01.jpg",
        "duration": "01:09",
        "aspect": "2 / 1"
      },
      {
        "id": "demo-02",
        "title": "Quest 调试 · 片段一",
        "src": "media/demo-02.mp4",
        "poster": "media/demo-02.jpg",
        "duration": "03:25",
        "aspect": "16 / 9"
      },
      {
        "id": "demo-03",
        "title": "Quest 调试 · 片段二",
        "src": "media/demo-03.mp4",
        "poster": "media/demo-03.jpg",
        "duration": "02:06",
        "aspect": "16 / 9"
      },
      {
        "id": "demo-04",
        "title": "HTS",
        "src": "media/demo-04.mp4",
        "poster": "media/demo-04.jpg",
        "duration": "02:04",
        "aspect": "16 / 9"
      },
      {
        "id": "demo-05",
        "title": "EgoKit",
        "src": "media/demo-05.mp4",
        "poster": "media/demo-05.jpg",
        "duration": "00:24",
        "aspect": "16 / 9"
      }
    ]
  },
  "next": "相机标定"
};
