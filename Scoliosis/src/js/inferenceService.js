import config from './config.js';

const CURVE_TYPES = [
  '胸椎右侧弯',
  '胸椎左侧弯',
  '腰椎右侧弯',
  '腰椎左侧弯',
  '胸腰椎联合侧弯'
];

const TYPE_DESCRIPTIONS = {
  '胸椎右侧弯': '胸椎主弯方向偏右，腰椎存在代偿性反向趋势。',
  '胸椎左侧弯': '胸椎主弯方向偏左，腰椎存在代偿性反向趋势。',
  '腰椎右侧弯': '腰椎主弯方向偏右，胸椎存在代偿性反向趋势。',
  '腰椎左侧弯': '腰椎主弯方向偏左，胸椎存在代偿性反向趋势。',
  '胸腰椎联合侧弯': '胸腰段呈双弯或联合侧弯趋势。'
};

function fingerprintImage(imageData) {
  const payload = imageData || '';
  let hash = 2166136261;
  const step = Math.max(1, Math.floor(payload.length / 4096));

  for (let index = 0; index < payload.length; index += step) {
    hash ^= payload.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function getDemoBand(angle) {
  if (angle < 20) return '低角度演示区间';
  if (angle < 35) return '中角度演示区间';
  return '高角度演示区间';
}

function buildDemoInference(imageData) {
  const hash = fingerprintImage(imageData);
  const type = CURVE_TYPES[hash % CURVE_TYPES.length];
  const cobbAngle = Number((10 + ((hash >>> 7) % 351) / 10).toFixed(1));
  const fingerprint = hash.toString(16).padStart(8, '0');

  return {
    type,
    cobbAngle,
    band: getDemoBand(cobbAngle),
    description: `${TYPE_DESCRIPTIONS[type]} Cobb 角工作流输出为 ${cobbAngle}°。该输出用于软件工作流与科研接口验证。`,
    source: 'reproducible-workflow',
    fingerprint
  };
}

function normalizeRemoteResult(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('远程推理返回了无效数据');
  }

  const type = String(payload.type || '').trim();
  const cobbAngle = Number(payload.cobbAngle);

  if (!type || !Number.isFinite(cobbAngle)) {
    throw new Error('远程推理结果缺少 type 或 cobbAngle');
  }

  return {
    type,
    cobbAngle,
    band: String(payload.band || '远程模型输出'),
    description: String(payload.description || `${type}，Cobb 角 ${cobbAngle}°`),
    source: String(payload.source || 'remote-model'),
    fingerprint: String(payload.fingerprint || '')
  };
}

async function requestRemoteInference({ imageData, fileName }) {
  if (!config.apiEndpoint) {
    throw new Error('尚未配置后端推理地址');
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), config.requestTimeoutMs);

  try {
    const response = await fetch(config.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        image: imageData,
        fileName
      })
    });

    if (!response.ok) {
      throw new Error(`远程推理失败：HTTP ${response.status}`);
    }

    return normalizeRemoteResult(await response.json());
  } finally {
    window.clearTimeout(timer);
  }
}

export async function runInference(input) {
  if (config.analysisMode === 'remote') {
    return requestRemoteInference(input);
  }

  await new Promise(resolve => window.setTimeout(resolve, 650));
  return buildDemoInference(input.imageData);
}

export { buildDemoInference, fingerprintImage };
