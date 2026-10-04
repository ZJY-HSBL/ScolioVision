# ScolioVision · 曲度智衡

> **Research-oriented scoliosis imaging analysis and rehabilitation interaction system**  
> **面向脊柱侧弯影像分析与康复交互的科研型软件系统**

[English](#english) · [中文](#中文) · [Architecture](docs/ARCHITECTURE.md) · [Research Protocol](docs/RESEARCH_PROTOCOL.md) · [API Contract](docs/API_CONTRACT.md)

---

## English

### Overview

**ScolioVision** is a research-oriented software system for scoliosis imaging workflows. It integrates radiograph input, local image preprocessing, inference-service integration, structured result presentation, analysis-history management, and rehabilitation-content interaction into a unified framework.

The system adopts a modular architecture so that image processing, inference services, result schemas, user interaction, and rehabilitation content can evolve independently. It can operate with the built-in reproducible workflow engine or connect to an external model service through a standardized inference interface.

### Key Features

- Radiograph upload with JPG, PNG, and WEBP support.
- Local image validation, compression, and preview.
- Modular inference-service adapter.
- Structured output for curve type, Cobb-angle field, result band, source, and input fingerprint.
- Local analysis-history management.
- Rehabilitation exercise library with integrated training videos.
- Responsive mobile/desktop interface.
- Standardized API contract for Python, PyTorch, ONNX, Flask, FastAPI, and related model services.
- Bilingual research and engineering documentation.

### System Architecture

```text
Radiograph / Image
        │
        ▼
Local Validation & Preprocessing
        │
        ▼
Inference Service
   ├── Built-in reproducible workflow engine
   └── External model service
        │
        ▼
Structured Analysis Result
        │
        ├── Result Visualization
        ├── Analysis History
        └── Rehabilitation Content
```

### Quick Start

```bash
git clone https://github.com/ZJY-HSBL/Scoliosis.git
cd Scoliosis/web
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Project verification:

```bash
npm run check
```

### Model Integration

Inference configuration is located in `web/js/config.js`.

```js
analysisMode: 'remote',
apiEndpoint: 'https://your-backend.example.com/inference'
```

The request/response schema is documented in `docs/API_CONTRACT.md`.

### Research Directions

ScolioVision supports research extensions including vertebral landmark localization, endplate detection, end-vertebra selection, automatic Cobb-angle estimation, scoliosis curve-pattern classification, image-quality control, external validation, and longitudinal follow-up analysis.

For Cobb-angle estimation, suitable metrics include MAE, RMSE, tolerance-band accuracy, ICC where appropriate, and Bland–Altman analysis. Classification components may report Precision, Recall, F1-score, confusion matrices, and calibration metrics.

### Research Use

ScolioVision provides a software platform for scoliosis-imaging research, algorithm integration, model-service validation, and interaction-system development. Formal medical research or clinical deployment should use appropriate datasets, ethical procedures, clinical supervision, and independently evaluated models.

---

## 中文

### 项目简介

**ScolioVision（曲度智衡）** 是一套面向脊柱侧弯影像分析与康复交互的科研型软件系统。项目围绕影像输入、本地图像预处理、推理服务、结构化结果展示、分析历史管理和康复内容交互构建完整的软件工作流，为脊柱侧弯自动评估及相关计算机视觉研究提供统一的软件基础。

系统采用模块化架构，将图像处理、推理服务、结果数据结构、前端交互和康复内容相互解耦，可灵活接入关键点检测、终板检测、图像分割、角度估计及其他深度学习模型。

### 核心功能

- 支持 JPG、PNG、WEBP 格式的脊柱影像上传；
- 图像本地校验、压缩与预览；
- 独立推理服务适配层；
- Cobb 角、侧弯类型等结构化结果展示；
- 推理来源、输入指纹与结果区间管理；
- 本地分析历史记录；
- 康复动作交互库与训练视频；
- 移动端与桌面端响应式界面；
- 支持 Python、PyTorch、ONNX、Flask、FastAPI 等模型服务接入；
- 中英文科研与工程文档。

### 系统架构

```text
脊柱影像
   │
   ▼
本地校验与预处理
   │
   ▼
推理服务层
   ├── 内置可复现工作流
   └── 外部模型服务
   │
   ▼
结构化分析结果
   │
   ├── 结果可视化
   ├── 分析历史
   └── 康复内容交互
```

### 快速运行

```bash
git clone https://github.com/ZJY-HSBL/Scoliosis.git
cd Scoliosis/web
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

项目检查：

```bash
npm run check
```

### 模型接入

推理配置位于 `web/js/config.js`：

```js
analysisMode: 'remote',
apiEndpoint: 'https://your-backend.example.com/inference'
```

前后端数据格式统一定义于 `docs/API_CONTRACT.md`。

### 科研方向

ScolioVision 可进一步用于椎体关键点定位、椎体终板检测、上下端椎自动识别、Cobb 角自动测量、脊柱侧弯模式分类、医学影像质量控制、模型误差分析、外部验证以及患者纵向随访与趋势可视化等研究方向。

Cobb 角测量研究可采用 MAE、RMSE、误差阈值内比例、ICC（适用时）以及 Bland–Altman 分析等指标；分类任务可使用 Precision、Recall、F1-score、混淆矩阵以及概率校准指标。

### 研究使用

ScolioVision 可用于脊柱侧弯影像科研实验、算法集成、模型服务验证与交互系统开发。正式医学研究或临床应用应结合规范的数据、伦理流程、专业临床指导和经过独立评估的模型。

---

If you use this repository in research or software development, citation metadata is available in `CITATION.cff`.
