import utils from './utils.js';

const history = {
  init() {
    this.emptyTip = document.querySelector('.empty-tip');
    this.analysisList = document.querySelector('.analysis-list');
    this.lastAssessment = document.getElementById('last-assessment');
    this.render();
  },

  render() {
    const results = utils.getSavedResults();

    if (this.lastAssessment) {
      this.lastAssessment.textContent = results.length
        ? `上次评估：${results[0].date}`
        : '上次评估：暂无记录';
    }

    if (!this.emptyTip || !this.analysisList) {
      return;
    }

    this.emptyTip.style.display = results.length ? 'none' : 'block';
    this.analysisList.style.display = results.length ? 'flex' : 'none';
    this.analysisList.replaceChildren();

    results.forEach(result => {
      const item = document.createElement('div');
      item.className = 'analysis-item';

      const imageBox = document.createElement('div');
      imageBox.className = 'item-img';

      if (result.image) {
        const image = document.createElement('img');
        image.src = result.image;
        image.alt = '历史分析图像';
        imageBox.appendChild(image);
      } else {
        imageBox.classList.add('item-img-placeholder');
        imageBox.textContent = 'XR';
      }

      const content = document.createElement('div');
      content.className = 'item-content';

      const title = document.createElement('p');
      title.className = 'item-title';
      title.textContent = `${result.date} · ${result.source || 'demo'}`;

      const description = document.createElement('p');
      description.className = 'item-desc';
      const angleText = Number.isFinite(Number(result.cobbAngle))
        ? ` · Cobb ${Number(result.cobbAngle).toFixed(1)}°`
        : '';
      description.textContent = `${result.type || '未分类'}${angleText}`;

      content.append(title, description);
      item.append(imageBox, content);
      this.analysisList.appendChild(item);
    });
  }
};

export default history;
