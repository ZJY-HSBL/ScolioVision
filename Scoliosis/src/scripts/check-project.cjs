const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const required = [
  'index.html',
  'css/style.css',
  'js/app.js',
  'js/analyzer.js',
  'js/config.js',
  'js/history.js',
  'js/imageUpload.js',
  'js/inferenceService.js',
  'js/navigation.js',
  'js/trainingDetail.js',
  'js/utils.js',
  'webpack.common.js',
  'webpack.config.dev.js',
  'webpack.config.prod.js',
  'site.webmanifest'
];

const missing = required.filter(relativePath => {
  return !fs.existsSync(path.join(root, relativePath));
});

if (missing.length) {
  console.error('Missing required project files:');
  missing.forEach(file => console.error(` - ${file}`));
  process.exit(1);
}

const sourceFiles = fs.readdirSync(path.join(root, 'js'))
  .filter(file => file.endsWith('.js'))
  .map(file => path.join(root, 'js', file));

const dangerousPatterns = [
  /Authorization\s*['"]?\s*:/i,
  /Bearer\s+[A-Za-z0-9._-]{12,}/i
];

const findings = [];

for (const file of sourceFiles) {
  const content = fs.readFileSync(file, 'utf8');

  for (const pattern of dangerousPatterns) {
    if (pattern.test(content)) {
      findings.push(path.relative(root, file));
      break;
    }
  }
}

if (findings.length) {
  console.error('Potential frontend credential pattern detected:');
  findings.forEach(file => console.error(` - ${file}`));
  process.exit(1);
}

console.log(`ScolioVision static check passed (${required.length} required files).`);
