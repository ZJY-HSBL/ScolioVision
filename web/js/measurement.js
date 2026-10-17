import {cobbAngleFromPoints} from './cobbMath.mjs';
const NS = 'http://www.w3.org/2000/svg';
const instructions = [
  '① 点击上端椎上终板的左端点',
  '② 点击上端椎上终板的右端点',
  '③ 点击下端椎下终板的左端点',
  '④ 点击下端椎下终板的右端点',
  '四个端点已就绪，可以生成测量结果。'
];
function element(tag, attrs = {}) {
  const node = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}
const measurement = {
  points: [],
  width: 0,
  height: 0,
  zoom: 1,
  init() {
    this.svg = document.getElementById('measurement-overlay');
    this.stage = document.getElementById('image-stage');
    this.img = document.getElementById('preview-img');
    this.progress = document.querySelectorAll('#point-progress span');
    this.count = document.getElementById('point-count');
    this.instruction = document.getElementById('point-instruction');
    this.live = document.getElementById('live-cobb-angle');

    this.svg.addEventListener('click', e => this.addPoint(e));
    this.svg.addEventListener('pointerdown', event => this.beginDrag(event));
    this.svg.addEventListener('pointermove', event => this.moveDrag(event));
    this.svg.addEventListener('pointerup', event => this.endDrag(event));
    this.svg.addEventListener('pointercancel', event => this.endDrag(event));
    document.addEventListener('keydown', event => {
      const target = event.target;
      if (target instanceof HTMLElement && (target.matches('input, textarea, select') || target.isContentEditable)) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && document.getElementById('analyze-page').classList.contains('active') && this.points.length) {
        event.preventDefault(); this.undo();
      }
    });
    document.getElementById('undo-point').addEventListener('click', () => this.undo());
    document.getElementById('clear-points').addEventListener('click', () => this.clear());
    document.getElementById('zoom-in').addEventListener('click', () => this.setZoom(this.zoom + .25));
    document.getElementById('zoom-out').addEventListener('click', () => this.setZoom(this.zoom - .25));
    document.getElementById('reset-view').addEventListener('click', () => this.resetView());
    document.getElementById('contrast-toggle').addEventListener('click', () => {
      this.img.classList.toggle('contrast-on');
      document.getElementById('contrast-toggle').setAttribute('aria-pressed', String(this.img.classList.contains('contrast-on')));
    });
    window.addEventListener('scoliovision:image-ready', () => {
      this.width = this.img.naturalWidth;
      this.height = this.img.naturalHeight;
      this.svg.setAttribute('viewBox', '0 0 ' + this.width + ' ' + this.height);
      this.svg.setAttribute('preserveAspectRatio', 'none');
      this.clear();
      this.resetView();
    });
    window.addEventListener('scoliovision:image-cleared', () => {
      this.width = this.height = 0;
      this.clear();
      this.resetView();
    });
    this.render();
  },
  emitChange() { window.dispatchEvent(new Event('scoliovision:measurement-change')); },
  addPoint(event) {
    if (!this.width || !this.height || this.points.length >= 4) return;
    if (document.getElementById('analysis-mode').value !== 'manual') return;
    const rect = this.svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (event.clientX - rect.left) * this.width / rect.width;
    const y = (event.clientY - rect.top) * this.height / rect.height;
    this.points.push({x: Math.max(0, Math.min(this.width, x)), y: Math.max(0, Math.min(this.height, y))});
    this.render();
    this.emitChange();
  },

  imagePoint(event) {
    const rect = this.svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    return {
      x: Math.max(0, Math.min(this.width, (event.clientX - rect.left) * this.width / rect.width)),
      y: Math.max(0, Math.min(this.height, (event.clientY - rect.top) * this.height / rect.height))
    };
  },
  beginDrag(event) {
    if (this.points.length !== 4 || document.getElementById('analysis-mode').value !== 'manual') return;
    const pos = this.imagePoint(event);
    if (!pos) return;
    const radius = Math.max(16, this.width * 22 / Math.max(this.svg.getBoundingClientRect().width, 1));
    let nearest = -1, distance = radius;
    this.points.forEach((p, index) => {
      const d = Math.hypot(p.x - pos.x, p.y - pos.y);
      if (d < distance) { nearest = index; distance = d; }
    });
    if (nearest < 0) return;
    this.dragIndex = nearest;
    this.svg.setPointerCapture(event.pointerId);
    event.preventDefault();
  },
  moveDrag(event) {
    if (this.dragIndex === undefined) return;
    const point = this.imagePoint(event);
    if (!point) return;
    this.points[this.dragIndex] = point;
    this.render();
    this.emitChange();
  },
  endDrag(event) {
    if (this.dragIndex === undefined) return;
    this.dragIndex = undefined;
    if (this.svg.hasPointerCapture(event.pointerId)) this.svg.releasePointerCapture(event.pointerId);
  },
  loadPoints(points) {
    if (!this.width || !this.height || !Array.isArray(points) || points.length !== 4) throw new Error('请先导入影像与有效的四点标注');
    if (!points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.x <= this.width && p.y >= 0 && p.y <= this.height)) throw new Error('导入的坐标超出了影像边界');
    cobbAngleFromPoints(points);
    this.points = points.map(p => ({x: p.x, y: p.y}));
    this.render(); this.emitChange();
  },
  undo() { if (!this.points.length) return; this.points.pop(); this.render(); this.emitChange(); },
  clear() { this.points = []; this.render(); this.emitChange(); },
  setZoom(level) {
    this.zoom = Math.max(.5, Math.min(3, Math.round(level * 4) / 4));
    this.stage.style.width = (this.zoom * 100) + '%';
    document.getElementById('zoom-label').textContent = Math.round(this.zoom * 100) + '%';
  },
  resetView() { this.setZoom(1); this.img.classList.remove('contrast-on'); document.getElementById('contrast-toggle').setAttribute('aria-pressed', 'false'); },
  getResult() {
    if (this.points.length !== 4) return null;
    try {
      return {
        cobbAngle: Number(cobbAngleFromPoints(this.points).toFixed(2)),
        endplates: {
          superior: this.points.slice(0, 2).map(p => ({x: Number(p.x.toFixed(2)), y: Number(p.y.toFixed(2))})),
          inferior: this.points.slice(2, 4).map(p => ({x: Number(p.x.toFixed(2)), y: Number(p.y.toFixed(2))}))
        },
        imageSize: {width: this.width, height: this.height},
        method: 'manual-four-point-endplate-angle'
      };
    } catch { return null; }
  },
  render() {
    if (!this.svg) return;
    this.svg.replaceChildren();
    this.svg.style.touchAction = this.points.length === 4 ? 'none' : 'manipulation';
    this.points.forEach((point, index) => {
      const hue = index < 2 ? '#f1b46d' : '#67d5bd';
      const ring = element('circle', {cx: point.x, cy: point.y, r: Math.max(5, this.width / 125), fill: hue, stroke: '#142b2b', 'stroke-width': Math.max(2, this.width / 450)});
      this.svg.appendChild(ring);
      const label = element('text', {x: point.x + Math.max(12, this.width / 60), y: point.y - 8, fill: hue, 'font-size': Math.max(16, this.width / 35), 'font-family': 'sans-serif', 'font-weight': '700'});
      label.textContent = String(index + 1);
      this.svg.appendChild(label);
    });
    [[0,1],[2,3]].forEach(([i,j], n) => {
      if (!this.points[j]) return;
      const a = this.points[i], b = this.points[j];
      this.svg.insertBefore(element('line', {x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:n ? '#67d5bd' : '#f1b46d','stroke-width':Math.max(3,this.width/250),'stroke-linecap':'round'}),this.svg.firstChild);
    });
    this.count.textContent = this.points.length + ' / 4';
    this.instruction.textContent = instructions[this.points.length];
    this.progress.forEach((node, i) => node.classList.toggle('done', i < this.points.length));
    const result = this.getResult();
    this.live.textContent = result ? result.cobbAngle.toFixed(1) + '°' : '—';
  },
  exportAnnotatedPng(fileName='scoliovision-annotation.png') {
    if (!this.width || !this.height || !this.img.complete) throw new Error('请先导入影像');
    const canvas = document.createElement('canvas');
    canvas.width = this.width; canvas.height = this.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('无法生成标注影像');
    ctx.drawImage(this.img, 0, 0, this.width, this.height);
    ctx.lineWidth = Math.max(3, this.width / 250);
    [[0,1],[2,3]].forEach(([i,j],n) => {
      if (!this.points[j]) return;
      ctx.strokeStyle = n ? '#67d5bd' : '#f1b46d';
      ctx.beginPath();ctx.moveTo(this.points[i].x,this.points[i].y);ctx.lineTo(this.points[j].x,this.points[j].y);ctx.stroke();
    });
    this.points.forEach((p,i) => {
      ctx.fillStyle = i < 2 ? '#f1b46d' : '#67d5bd';
      ctx.beginPath();ctx.arc(p.x,p.y,Math.max(5,this.width/125),0,Math.PI*2);ctx.fill();
    });
    const result = this.getResult();
    if(result){
      ctx.fillStyle='#102125b9';ctx.fillRect(0,0,Math.min(this.width,360),Math.max(40,this.height/20));
      ctx.fillStyle='#ffffff';ctx.font=Math.max(17, this.width / 24)+'px sans-serif';
      ctx.fillText('Manual Cobb: '+result.cobbAngle.toFixed(1)+'°',12,Math.max(27,this.height/32));
    }
    canvas.toBlob(blob => {
      if(!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');a.href=url;a.download=fileName;a.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    },'image/png');
  }
};
export default measurement;
