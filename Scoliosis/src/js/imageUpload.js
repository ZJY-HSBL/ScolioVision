import config from './config.js';
import utils from './utils.js';

const imageUpload = {
  init() {
    this.fileInput = document.getElementById('file-input');
    this.uploadArea = document.getElementById('upload-area');
    this.previewArea = document.getElementById('preview-area');
    this.previewImg = document.getElementById('preview-img');
    this.previewRemove = document.getElementById('preview-remove');
    this.analyzeBtn = document.getElementById('analyze-btn');
    this.fileName = '';
    this.imageBase64 = '';

    this.uploadArea.addEventListener('click', event => {
      event.stopPropagation();
      this.fileInput.click();
    });

    document.querySelector('#upload-area label').addEventListener('click', event => {
      event.stopPropagation();
    });

    this.uploadArea.addEventListener('dragover', event => {
      event.preventDefault();
      event.stopPropagation();
      this.uploadArea.classList.add('dragover');
    });

    this.uploadArea.addEventListener('dragleave', event => {
      event.preventDefault();
      event.stopPropagation();
      this.uploadArea.classList.remove('dragover');
    });

    this.uploadArea.addEventListener('drop', event => {
      event.preventDefault();
      event.stopPropagation();
      this.uploadArea.classList.remove('dragover');

      if (event.dataTransfer.files?.length) {
        this.handleFile(event.dataTransfer.files[0]);
      }
    });

    this.fileInput.addEventListener('change', event => {
      if (event.target.files?.length) {
        this.handleFile(event.target.files[0]);
      }
    });

    this.previewRemove.addEventListener('click', event => {
      event.stopPropagation();
      this.clearPreview();
    });
  },

  async handleFile(file) {
    try {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const validExtensions = new Set(['jpg', 'jpeg', 'png', 'webp']);
      const validMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

      if (!validExtensions.has(extension) || (file.type && !validMimeTypes.has(file.type))) {
        throw new Error('请上传 JPG、PNG 或 WEBP 图片');
      }

      if (file.size > config.maxUploadBytes) {
        throw new Error('图片超过 5 MB，请压缩后重新上传');
      }

      utils.showToast('正在进行本地图像预处理…');
      const compressedDataUrl = await utils.compressImage(file);

      this.fileName = file.name;
      this.imageBase64 = compressedDataUrl;
      this.previewImg.src = compressedDataUrl;
      this.previewArea.style.display = 'block';
      this.analyzeBtn.disabled = false;

      utils.showToast('图像已就绪');
    } catch (error) {
      this.clearPreview();
      utils.showToast(error.message || '图片处理失败，请重试');
      console.error('Image processing error:', error);
    }
  },

  clearPreview() {
    this.previewArea.style.display = 'none';
    this.previewImg.src = '';
    this.analyzeBtn.disabled = true;
    this.imageBase64 = '';
    this.fileInput.value = '';
    this.fileName = '';
  },

  getImageData() {
    return this.imageBase64;
  },

  getFileName() {
    return this.fileName;
  }
};

export default imageUpload;
