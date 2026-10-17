import config from './config.js';
import {parseMeasurementImport} from './measurementIO.mjs';
import utils from './utils.js';
import imageUpload from './imageUpload.js';
import measurement from './measurement.js';
import trainingDetail from './trainingDetail.js';
import history from './history.js';
import {runInference} from './inferenceService.js';

const analyzer = {
  init() {
    this.analyzeBtn = document.getElementById('analyze-btn');
    this.loading = document.getElementById('loading');
    this.error = document.getElementById('error');
    this.resultArea = document.getElementById('result-area');
    this.spinalType = document.getElementById('spinal-type');
    this.spinalDescription = document.getElementById('spinal-description');
    this.trainingPlanContent = document.getElementById('training-plan-content');
    this.saveResultBtn = document.getElementById('save-result-btn');
    this.resultMode = document.getElementById('result-mode');
    this.resultBand = document.getElementById('result-band');
    this.cobbAngle = document.getElementById('cobb-angle');
    this.modeSelect = document.getElementById('analysis-mode');
    this.currentTrainingPlan = [];
    this.currentResult = null;
    this.busy = false;
    this.analyzeBtn.addEventListener('click', () => this.startAnalysis());
    this.saveResultBtn.addEventListener('click', () => this.saveResult());
    this.modeSelect.addEventListener('change', () => this.changeMode());

    document.getElementById('export-json').addEventListener('click', () => this.exportJson());
    document.getElementById('import-json').addEventListener('click', () => document.getElementById('import-json-file').click());
    document.getElementById('import-json-file').addEventListener('change', event => this.importJson(event));
    document.getElementById('export-image').addEventListener('click', () => {
      try { measurement.exportAnnotatedPng(); } catch (error) { utils.showToast(error.message || '标注导出失败'); }
    });
    this.trainingPlanContent.addEventListener('click', event => {
      const planItem = event.target.closest('.training-plan-item');
      if (!planItem) return;
      const index = Number(planItem.dataset.index);
      if (Number.isInteger(index) && this.currentTrainingPlan[index]) {
        trainingDetail.showDetail(this.currentTrainingPlan[index]);
      }
    });
    window.addEventListener('scoliovision:measurement-change', () => {
      this.invalidateResult();
      this.refreshAvailability();
    });
    window.addEventListener('scoliovision:image-ready', () => {
      this.invalidateResult();
      document.getElementById('image-filename').textContent = imageUpload.getFileName();
      this.refreshAvailability();
    });
    window.addEventListener('scoliovision:image-cleared', () => {
      this.invalidateResult();
      document.getElementById('image-filename').textContent = '未载入影像';
      this.refreshAvailability();
    });
    this.changeMode();
  },

  getTrainingPlanByType() {
    return [
      {
        name: '死虫式',
        instructions: '仰卧位，双膝弯曲与髋同宽，双臂伸直指向天花板。保持腰部稳定，缓慢伸展对侧手臂和腿，再有控制地回到起始位置。',
        intensity: { sets: 3, reps: 12, rest: 45, frequency: 5 },
        notes: [
          '保持脊柱中立位',
          '缓慢控制动作',
          '保持自然呼吸',
          '如出现疼痛或明显不适应立即停止'
        ]
      },
      {
        name: '单侧侧屈',
        instructions: '站立位，双脚与肩同宽。一侧手臂上举，在可控范围内向对侧做侧屈动作，随后缓慢回正。',
        intensity: { sets: 3, reps: 8, rest: 45, frequency: 4 },
        notes: [
          '避免强行追求动作幅度',
          '保持躯干不过度前后倾',
          '仅作为动作库演示，不构成个体化处方'
        ]
      },
      {
        name: '猫式呼吸',
        instructions: '四足跪姿，配合呼吸进行脊柱屈伸活动。动作保持缓慢、连续和可控。',
        intensity: { sets: 3, reps: 10, rest: 30, frequency: 5 },
        notes: [
          '避免锁死肘关节',
          '动作范围以舒适为限',
          '保持均匀呼吸'
        ]
      },
      {
        name: '脊柱三维矫正',
        instructions: '在站姿或坐姿下建立中立位，依次进行冠状面、矢状面和水平面的姿势控制练习。',
        intensity: { sets: 2, reps: 6, rest: 60, frequency: 3 },
        notes: [
          '动作应缓慢且可控',
          '不替代专业康复评估',
          '研究原型仅展示交互流程'
        ]
      }
    ];
  },


  changeMode() {
    const manual = this.modeSelect.value === 'manual';
    document.getElementById('manual-controls').style.display = manual ? 'block' : 'none';
    measurement.svg.style.pointerEvents = manual ? 'auto' : 'none';
    const labels = { manual:'生成测量结果 →', demo:'运行模拟流程（非真实测量） →', remote:'调用远程模型 →' };
    this.analyzeBtn.textContent = labels[this.modeSelect.value] || labels.manual;
    this.invalidateResult();
    this.refreshAvailability();
  },

  refreshAvailability() {
    const manual = this.modeSelect.value === 'manual';
    this.analyzeBtn.disabled = this.busy || !imageUpload.getImageData() || (manual && !measurement.getResult());
  },

  invalidateResult() {
    this.currentResult = null;
    this.resultArea.style.display = 'none';
    this.error.style.display = 'none';
  },

  renderResult(result) {
    this.spinalType.textContent = result.type;
    this.spinalDescription.textContent = result.description;
    const manual = result.source === 'manual-four-point';
    this.resultMode.textContent = manual ? 'MANUAL · GEOMETRY' : result.source === 'reproducible-workflow' ? 'SIMULATED · DEMO' : 'REMOTE · UNVERIFIED';
    this.resultBand.textContent = result.band;
    this.cobbAngle.textContent = Number(result.cobbAngle).toFixed(1) + '°';
    document.getElementById('export-image').disabled = !manual;
    this.currentTrainingPlan = this.getTrainingPlanByType();
    this.trainingPlanContent.replaceChildren();
    this.currentTrainingPlan.forEach((plan, index) => {
      const item = document.createElement('button');
      item.type = 'button'; item.className = 'training-plan-item'; item.dataset.index = String(index);
      const title = document.createElement('h4'); title.textContent = plan.name; item.append(title);
      this.trainingPlanContent.append(item);
    });
    this.resultArea.style.display = 'block';
  },

  async startAnalysis() {
    if (this.busy) return;
    const imageData = imageUpload.getImageData();
    if (!imageData) { utils.showToast('请先上传影像'); return; }
    this.busy = true; this.refreshAvailability();
    this.error.style.display = 'none';
    this.loading.style.display = 'block';
    this.resultArea.style.display = 'none';
    try {
      let result;
      if (this.modeSelect.value === 'manual') {
        const landmarks = measurement.getResult();
        if (!landmarks) throw new Error('请完成四点标注，两条终板的端点不能重合');
        result = {
          ...landmarks,
          type:'终板手动测量',
          band:'人工标注 · 未经临床复核',
          description:'Cobb 角由人工选择的两条终板直线夹角计算。软件没有自动识别上、下端椎，也没有判断侧弯分型。请核对端椎选取与标注位置。',
          source:'manual-four-point'
        };
      } else {
        result = await runInference({
          imageData,
          fileName: imageUpload.getFileName()
        }, this.modeSelect.value);
      }
      this.currentResult = {...result};
      this.renderResult(result);
      utils.showToast(this.modeSelect.value === 'manual' ? '已生成几何测量结果' : '流程已完成，请核对来源标签');
    } catch (error) {
      this.error.textContent = error.message || '分析失败，请重试';
      this.error.style.display = 'block';
      console.error('Analysis error:', error);
    } finally {
      this.busy = false;
      this.loading.style.display = 'none';
      this.refreshAvailability();
    }
  },

  saveResult() {
    if (!this.currentResult) { utils.showToast('没有可保存的结果'); return; }
    try {
      utils.saveAnalysisResult(this.currentResult);
      history.render();
      utils.showToast('已保存测量元数据，未保存原始影像');
    } catch(error) {
      utils.showToast('本地存储失败，请检查空间或浏览器设置');
      console.error(error);
    }
  },


  async importJson(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      if (file.size > 2_000_000 || !file.name.toLowerCase().endsWith('.json')) throw new Error('请选择不超过 2MB 的 JSON 文件');
      if (this.modeSelect.value !== 'manual') throw new Error('请切换到手动测量模式');
      const text = await file.text();
      const points = parseMeasurementImport(text,{width:measurement.width,height:measurement.height});
      measurement.loadPoints(points);
      utils.showToast('已恢复四个端点，请核对标注后重新生成结果');
    } catch(error) {
      utils.showToast(error.message || '导入失败');
    }
  },

  exportJson() {
    if (!this.currentResult) { utils.showToast('请先完成一次测量'); return; }
    const payload = {
      schema:'scoliovision.measurement.v1',
      appVersion:config.version,
      exportedAt:new Date().toISOString(),
      researchUseOnly:true,
      ...this.currentResult
    };
    const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'scoliovision-measurement.json'; a.click();
    window.setTimeout(() => URL.revokeObjectURL(url),1000);
  }
};
export default analyzer;
