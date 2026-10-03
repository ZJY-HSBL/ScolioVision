# Architecture / 系统架构

## Design goal / 设计目标

ScolioVision uses a modular architecture that separates software workflow concerns from model-service concerns, supporting independent development of image processing, inference, result presentation, and interaction components.

ScolioVision 采用模块化架构，将软件工作流与模型服务进行解耦，支持图像处理、推理、结果展示与交互模块独立开发和扩展。

## Modules / 模块

### `imageUpload.js`

Responsible for file-type validation, upload-size validation, local compression, preview state, and image-data access.

负责文件类型校验、大小限制、本地压缩、预览状态与图像数据读取。

### `inferenceService.js`

Provides a single inference interface.

- `demo`: built-in reproducible workflow output.
- `remote`: HTTP request to a configured project backend.

提供统一推理入口。Demo 模式用于可复现的软件工作流；Remote 模式用于连接外部模型服务。

### `analyzer.js`

Coordinates user action, inference, structured result rendering, exercise-library presentation, and result persistence.

负责分析流程编排、结构化结果展示、动作库展示和结果保存。

### `history.js`

Renders bounded browser-side analysis history.

负责展示受限数量的本地分析历史。

### `trainingDetail.js`

Handles exercise-library detail interaction and existing local training videos. This module is deliberately separated from medical inference.

负责动作内容与本地视频交互，并与医学推理逻辑分离。

## Result schema / 结果结构

```json
{
  "type": "胸椎右侧弯",
  "cobbAngle": 22.6,
  "band": "model-defined band",
  "description": "Structured interpretation",
  "source": "model-or-demo-id",
  "fingerprint": "optional-input-id"
}
```

## Future model architecture / 后续模型架构建议

```text
Image
  ├─ Quality control
  ├─ Landmark / endplate prediction
  ├─ End-vertebra selection
  ├─ Geometric Cobb calculation
  └─ Curve-pattern classification
        ↓
Normalized inference response
        ↓
ScolioVision frontend
```

Keeping the geometric calculation explicit is useful for interpretability and failure analysis.
