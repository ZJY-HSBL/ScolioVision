import utils from './utils.js';

const trainingDetail = {
  init() {
    this.backBtn = document.getElementById('back-to-plan');
    this.detailTitle = document.getElementById('detail-title');
    this.trainingInstructions = document.getElementById('training-instructions');
    this.trainingIntensity = document.getElementById('training-intensity');
    this.trainingNotes = document.getElementById('training-notes');
    this.startTrainingBtn = document.getElementById('start-training-btn');
    this.trainingVideo = document.getElementById('training-video');
    this.videoSource = this.trainingVideo.querySelector('source');

    this.backBtn.addEventListener('click', () => {
      document.getElementById('training-detail-page').classList.remove('active');
      document.getElementById('analyze-page').classList.add('active');
    });

    this.startTrainingBtn.addEventListener('click', () => {
      utils.showToast('动作计时已启动（演示）');
    });
  },

  getVideoForTraining(trainingName) {
    const videoMap = {
      '单侧侧屈': 'alteralflexion.mp4',
      '猫式呼吸': 'catpose.mp4',
      '死虫式': 'deadbug.mp4',
      '脊柱三维矫正': 'three-dimensional.mp4'
    };

    return videoMap[trainingName] || 'alteralflexion.mp4';
  },

  showDetail(training) {
    this.detailTitle.textContent = training.name;
    this.trainingInstructions.textContent = training.instructions;

    this.trainingIntensity.replaceChildren();

    const intensityRows = [
      `组数：${training.intensity.sets} 组`,
      `每组动作：${training.intensity.reps} 次`,
      `组间休息：${training.intensity.rest} 秒`,
      `训练频率：每周 ${training.intensity.frequency} 次`
    ];

    intensityRows.forEach(text => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      this.trainingIntensity.appendChild(paragraph);
    });

    const notes = document.createElement('ul');
    training.notes.forEach(note => {
      const item = document.createElement('li');
      item.textContent = note;
      notes.appendChild(item);
    });

    this.trainingNotes.replaceChildren(notes);

    const videoFile = this.getVideoForTraining(training.name);
    this.videoSource.src = `./videos/${videoFile}`;
    this.trainingVideo.load();

    document.getElementById('analyze-page').classList.remove('active');
    document.getElementById('training-detail-page').classList.add('active');
  }
};

export default trainingDetail;
