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
cd Scoliosis/src
npm install
npm run dev
```

Production build: `npm run build`  
Project check: `npm run check`

## Research Directions

The platform can be extended for vertebral landmark localization, endplate detection, end-vertebra selection, automatic Cobb-angle estimation, curve-pattern classification, image-quality control, external validation, and longitudinal follow-up analysis.
