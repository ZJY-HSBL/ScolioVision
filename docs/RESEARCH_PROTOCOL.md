# Research Protocol / 研究协议

## 1. Scope / 研究范围

**English.** This document defines a recommended path for evolving ScolioVision from an interaction prototype into a reproducible scoliosis-imaging research system. The current repository does not provide clinical validation.

**中文。** 本文档用于规定 ScolioVision 从交互原型发展为可复现脊柱侧弯影像研究系统的建议路径。当前仓库不提供临床有效性声明。

## 2. Proposed pipeline / 建议研究流程

1. **De-identification and quality control / 脱敏与质控**  
   Remove patient identifiers and reject images that fail predefined acquisition or visibility criteria.

2. **Anatomical localization / 解剖定位**  
   Detect vertebral centers, corners, endplates, or segmentation masks. Fix the representation before model comparison.

3. **End-vertebra selection / 上下端椎识别**  
   Define a reproducible selection rule. When expert labels are used, report the annotation protocol and reader agreement.

4. **Cobb-angle geometry / Cobb 角几何计算**  
   Compute the angle using a transparent geometric procedure based on predicted landmarks or endplates.

5. **Curve-pattern classification / 侧弯模式分类**  
   Keep classification conceptually separate from angle estimation so that failure sources can be analyzed independently.

6. **External validation / 外部验证**  
   Evaluate the frozen final model on a different center, device, or acquisition distribution whenever feasible.

## 3. Dataset splitting / 数据划分

- Split by **patient**, not by image.
- Prevent repeated examinations from the same patient from crossing splits.
- Record non-identifying cohort factors that may affect generalization.
- Freeze the test set before final model selection.
- Avoid selecting checkpoints or hyperparameters based on test-set performance.

## 4. Recommended metrics / 建议指标

### Cobb-angle estimation

- Mean Absolute Error (MAE)
- Root Mean Squared Error (RMSE)
- Error distribution
- Percentage within predefined tolerance bands
- Intraclass Correlation Coefficient (ICC), when appropriate
- Bland–Altman analysis
- Failure analysis stratified by image quality and curve magnitude

### Landmark detection

- Normalized point error
- PCK or task-specific localization thresholds
- Per-vertebra error distribution

### Classification

- Precision
- Recall
- F1-score
- Confusion matrix
- AUROC where meaningful
- Calibration analysis for probabilistic outputs

## 5. Reproducibility / 可复现性

Record software versions, random seeds, image resolution, preprocessing, augmentation, optimizer, learning-rate schedule, batch size, epochs, early-stopping criteria, checkpoint-selection rules, hardware, and final configuration files.

记录软件版本、随机种子、输入分辨率、预处理、数据增强、优化器、学习率策略、批大小、训练轮数、早停条件、最佳权重选择规则、硬件环境和最终配置文件。

## 6. Clinical and ethical boundary / 临床与伦理边界

Do not describe the software as a diagnostic device unless applicable regulatory and clinical validation requirements are satisfied. Research data should follow appropriate consent, ethics, de-identification, access-control, and retention procedures.

在满足相应临床验证与监管要求之前，不应将本软件描述为临床诊断设备。医学影像数据应按照适用的知情同意、伦理审批、脱敏、访问控制与数据保留制度进行管理。
