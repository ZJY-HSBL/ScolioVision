# Changelog

## 0.4.0 — 2026-10-17

- Added drag-to-edit endpoints, keyboard undo and user-visible refinement instructions.
- Added schema-validated JSON import for manually marked endplates; image dimensions and coordinates are checked before applying.
- Added automated desktop/mobile UI screenshot capture and README preview gallery, using a synthetic test fixture.
- Expanded automated test coverage for measurement import and malformed input.
- Kept strict separation between manual geometry, demo inference and unvalidated remote model output.

## 0.3.0 — 2026-10-17

### Added
- Image-first desktop and mobile measurement workstation.
- Manual four-point endplate annotation with geometrically calculated Cobb angle.
- Image viewer zoom, enhanced contrast, annotation undo/reset, and live angle preview.
- Export of measurement JSON and annotated PNG images.
- Local metadata-only history and per-record deletion.
- Six geometry unit tests and CI build verification.
- Automatic GitHub Releases containing tested static site ZIP artifacts.

### Changed
- Manual measurement is the default; deterministic image-hash inference is now explicitly labelled simulation mode.
- Distinguished geometry derived from human-selected endpoints from remote model inference.
- Refreshed documentation, version metadata and npm lockfile.

### Limits
- No automatic vertebra detection, model weights, diagnostic conclusion or Windows executable.
- For research and teaching only.


## 0.2.0 — 2026-10-03

### Features

- Bilingual ScolioVision project documentation.
- Modular inference-service architecture.
- Structured scoliosis analysis-result schema.
- Local image preprocessing and preview.
- Analysis-history management.
- Rehabilitation exercise-library interaction.
- Responsive research-oriented user interface.
- Standardized remote model API contract.
- Research protocol, architecture documentation, security notes, and citation metadata.
- Webpack development and production configuration.
- Static project verification command.
