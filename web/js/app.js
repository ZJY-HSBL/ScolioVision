import navigation from './navigation.js';
import imageUpload from './imageUpload.js';
import trainingDetail from './trainingDetail.js';
import analyzer from './analyzer.js';
import history from './history.js';
import measurement from './measurement.js';
import workstationUI from './workstationUI.js';

document.addEventListener('DOMContentLoaded', () => {
  navigation.init();
  imageUpload.init();
  measurement.init();
  analyzer.init();
  trainingDetail.init();
  history.init();
  workstationUI.init();
  document.getElementById('go-to-measurement').addEventListener('click', () => {
    document.querySelector('[data-target="analyze-page"]').click();
  });
});
