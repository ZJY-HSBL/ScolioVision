# ScolioVision

## Scoliosis Imaging Analysis and Rehabilitation Interaction Research System

ScolioVision is a research-oriented software system for scoliosis imaging workflows. It integrates image input, local preprocessing, inference services, structured result visualization, analysis-history management, and rehabilitation-content interaction into a unified framework.

The modular design enables flexible integration of landmark detection, endplate detection, segmentation, angle-estimation, and other deep-learning models.

## Core Capabilities

- Radiograph upload and local preprocessing.
- File-format and upload-size validation.
- Unified inference-service adapter.
- Structured Cobb-angle and curve-type presentation.
- Result-source, fingerprint, and result-band management.
- Local analysis-history storage.
- Rehabilitation exercise library with video interaction.
- Responsive desktop/mobile interface.
- Integration with Python, PyTorch, ONNX, Flask, FastAPI, and related services.
- Research protocol and API-contract documentation.

## Workflow

```text
Image Input → Local Validation & Preprocessing → Inference Service → Structured Result → Visualization / History / Rehabilitation Interaction
```

## Run

```bash
cd ScolioVision/web
npm ci
npm run dev
```

Production build: `npm run build`  
Project check: `npm run check`

## Research Directions

The platform can be extended for vertebral landmark localization, endplate detection, end-vertebra selection, automatic Cobb-angle estimation, curve-pattern classification, image-quality control, external validation, and longitudinal follow-up analysis.


## v0.3.0 workstation

The default mode is now **manual endplate-based Cobb geometry**: place four image-space endpoints across superior and inferior endplates and compute the acute line-to-line angle. The image-first viewer supports undo/reset, contrast adjustment, zoom, annotation PNG and JSON export. History stores metadata only and offers record deletion. The synthetic inference demo is clearly marked and is not a medical assessment.

Run `npm test` for geometry unit tests. On version increments merged into `main`, the GitHub Actions release workflow builds, tests and publishes a versioned static site ZIP in [Releases](https://github.com/ZJY-HSBL/ScolioVision/releases). This package is not a native desktop installer.

This is a research and teaching tool, not a medical device. End-vertebra selection and clinical interpretation require qualified oversight.
