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

## v0.4.0 precision workflow and screenshots

Drag landmark handles after placing all four points, undo with Ctrl/Cmd+Z, and import previously exported measurement JSON if the active image's dimensions match. See [README prototype screenshots](README.md#prototype-ui--原型界面). Screenshots use a synthetic non-patient fixture.

## v0.5.0 · Imaging workstation interface

The application launches directly into the image viewer. The redesigned UI provides dark imaging surfaces, a compact measurement inspector, a four-stage workflow indicator, source-image resolution status, and keyboard shortcuts (`+`, `-`, `0`, `Ctrl/⌘+Z`). Desktop and mobile screenshots are generated from a synthetic image fixture by the GitHub Actions browser workflow and displayed in the [main README](README.md). These interface changes do not imply clinical validation.
