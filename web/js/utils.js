import config from './config.js';

const STORAGE_KEY = 'spinalAnalysisResults';

const utils = {
  showToast(message, duration = 2200) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    window.setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  },

  compressImage(file, maxWidth = 960, quality = 0.82) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = event => {
        const img = new Image();

        img.onload = () => {
          try {
            let width = img.width;
            let height = img.height;

            if (!width || !height) {
              throw new Error('无法读取图像尺寸');
            }

            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const context = canvas.getContext('2d', {
              alpha: file.type === 'image/png'
            });

            if (!context) {
              throw new Error('浏览器不支持 Canvas 图像处理');
            }

            context.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL(file.type || 'image/jpeg', quality));
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => reject(new Error('图片加载失败'));
        img.src = event.target.result;
      };

      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  },

  saveAnalysisResult(result) {
    const results = this.getSavedResults();
    const record = {
      id: Date.now(),
      date: new Date().toLocaleString('zh-CN', { hour12: false }),
      type: result.type,
      cobbAngle: result.cobbAngle,
      band: result.band,
      description: result.description,
      image: result.image,
      source: result.source,
      fingerprint: result.fingerprint,
      timestamp: Date.now()
    };

    const next = [record, ...results].slice(0, config.maxStoredResults);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      const compact = next.map((item, index) => ({
        ...item,
        image: index === 0 ? item.image : ''
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compact));
    }

    return next;
  },

  getSavedResults() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
};

export default utils;
