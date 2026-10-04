import navigation from './navigation.js';
import imageUpload from './imageUpload.js';
import trainingDetail from './trainingDetail.js';
import analyzer from './analyzer.js';
import history from './history.js';

document.addEventListener('DOMContentLoaded', () => {
  navigation.init();
  imageUpload.init();
  analyzer.init();
  trainingDetail.init();
  history.init();
});
