import utils from './utils.js';
import imageUpload from './imageUpload.js';
import trainingDetail from './trainingDetail.js';
import history from './history.js';
import { runInference } from './inferenceService.js';

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

    this.analyzeBtn.addEventListener('click', () => this.startAnalysis());
    this.saveResultBtn.addEventListener('click', () => this.saveResult());

    this.trainingPlanContent.addEventListener('click', event => {
      const planItem = event.target.closest('.training-plan-item');

      if (!planItem) {
        return;
      }

      const index = Number(planItem.dataset.index);

      if (Number.isInteger(index) && this.currentTrainingPlan[index]) {
        trainingDetail.showDetail(this.currentTrainingPlan[index]);
      }
    });

    this.currentTrainingPlan = [];
    this.currentResult = null;
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

  async startAnalysis() {
    try {
      this.loading.style.display = 'block';
      this.error.style.display = 'none';
      this.resultArea.style.display = 'none';
      this.analyzeBtn.disabled = true;

      const imageData = imageUpload.getImageData();

      if (!imageData) {
        throw new Error('未找到图像数据，请重新上传');
      }

      const result = await runInference({
        imageData,
        fileName: imageUpload.getFileName()
      });

      this.currentTrainingPlan = this.getTrainingPlanByType(result.type);
      this.currentResult = {
        ...result,
        image: imageData
      };

      this.spinalType.textContent = result.type;
      this.spinalDescription.textContent = result.description;
      this.resultMode.textContent = result.source === 'reproducible-workflow'
        ? 'REPRODUCIBLE'
        : 'REMOTE MODEL';
      this.resultBand.textContent = result.band;
      this.cobbAngle.textContent = `${Number(result.cobbAngle).toFixed(1)}°`;

      this.trainingPlanContent.replaceChildren();

      this.currentTrainingPlan.forEach((plan, index) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'training-plan-item';
        item.dataset.index = String(index);

        const title = document.createElement('h4');
        title.textContent = plan.name;

        item.appendChild(title);
        this.trainingPlanContent.appendChild(item);
      });

      this.loading.style.display = 'none';
      this.resultArea.style.display = 'block';
      this.analyzeBtn.disabled = false;

      utils.showToast('分析流程已完成');
    } catch (error) {
      this.loading.style.display = 'none';
      this.error.textContent = error.message || '分析失败，请重试';
      this.error.style.display = 'block';
      this.analyzeBtn.disabled = false;
      console.error('Analysis error:', error);
    }
  },

  saveResult() {
    if (!this.currentResult) {
      utils.showToast('没有可保存的分析结果');
      return;
    }

    try {
      utils.saveAnalysisResult(this.currentResult);
      history.render();
      utils.showToast('结果已保存到本地浏览器');
    } catch (error) {
      utils.showToast('本地保存失败，请检查浏览器存储空间');
      console.error('Save result error:', error);
    }
  }
};

export default analyzer;
