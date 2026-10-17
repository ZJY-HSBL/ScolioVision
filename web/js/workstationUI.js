/* Presentation-only workstation state. Does not infer diagnoses or modify image data. */
import imageUpload from './imageUpload.js';
import measurement from './measurement.js';

const steps = ['step-import','step-landmark','step-review','step-export'];

const workstationUI = {
  init() {
    this.status = document.getElementById('workspace-session-status');
    this.viewerState = document.getElementById('viewer-state');
    this.dimensions = document.getElementById('image-dimensions');
    this.mode = document.getElementById('analysis-mode');
    this.result = document.getElementById('result-area');
    this.mode.addEventListener('change', () => this.render());
    ['scoliovision:image-ready','scoliovision:image-cleared',
      'scoliovision:measurement-change','scoliovision:result-ready'].forEach(name => {
      window.addEventListener(name, () => this.render());
    });
    this.render();
  },

  render() {
    const hasImage = Boolean(imageUpload.getImageData());
    const isManual = this.mode.value === 'manual';
    const count = isManual ? measurement.points.length : 0;
    const hasResult = this.result.style.display === 'block';
    const image = document.getElementById('preview-img');
    const dims = hasImage ? image.naturalWidth + ' × ' + image.naturalHeight + ' PX' : 'NO IMAGE';
    const origin = this.mode.value === 'remote' ? 'REMOTE MODE' : 'BROWSER SESSION';

    this.viewerState.textContent = hasImage
      ? this.mode.value === 'remote' ? 'REMOTE MODE' : 'IMAGE LOADED'
      : 'NO IMAGE';
    this.dimensions.textContent = dims + ' · ' + origin;

    const stage = !hasImage ? 0 : hasResult ? 3 : !isManual || count === 4 ? 2 : 1;
    document.querySelector('#step-landmark strong').textContent = isManual ? '终板标注' : '模式准备';
    steps.forEach((id, index) => {
      const el = document.getElementById(id);
      el.dataset.state = index < stage ? 'complete' : index === stage ? 'active' : 'pending';
      el.setAttribute('aria-label', el.querySelector('strong').textContent + '：' +
        (index < stage ? '已完成' : index === stage ? '当前步骤' : '待执行'));
    });

    let label = '待导入影像';
    if (hasImage) {
      if (this.mode.value === 'remote') label = '远程模式 · 可能传输影像';
      else if (this.mode.value === 'demo') label = '模拟模式 · 非医学测量';
      else if (hasResult) label = '测量完成 · 待复核导出';
      else label = '本地标注 · ' + count + '/4 点';
    }
    this.status.firstChild.textContent = label + ' ';
  }
};
export default workstationUI;
