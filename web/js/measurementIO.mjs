/**
 * Reloads landmark coordinates from ScolioVision's own versioned JSON export.
 * No image data is loaded from JSON; geometry must match the active raster exactly.
 */
export function parseMeasurementImport(text, size) {
  if (typeof text !== 'string' || text.length > 2_000_000) throw new Error('JSON 文件无效或过大');
  let doc;
  try { doc = JSON.parse(text); } catch { throw new Error('无法解析测量 JSON'); }
  if (!doc || doc.schema !== 'scoliovision.measurement.v1' || doc.method !== 'manual-four-point-endplate-angle') {
    throw new Error('只支持 ScolioVision 手动测量导出的 JSON');
  }
  if (!Number.isInteger(size?.width) || !Number.isInteger(size?.height) || size.width < 1 || size.height < 1) {
    throw new Error('请先载入与原测量相同尺寸的影像');
  }
  if (doc.imageSize?.width !== size.width || doc.imageSize?.height !== size.height) {
    throw new Error('影像尺寸不匹配，无法安全恢复坐标');
  }
  const points = [...(doc.endplates?.superior || []), ...(doc.endplates?.inferior || [])];
  if (points.length !== 4 || !points.every(p =>
    p && Number.isFinite(p.x) && Number.isFinite(p.y) &&
    p.x >= 0 && p.x <= size.width && p.y >= 0 && p.y <= size.height
  )) throw new Error('终板坐标缺失、无效或超出范围');
  const dx1 = points[1].x - points[0].x, dy1 = points[1].y - points[0].y;
  const dx2 = points[3].x - points[2].x, dy2 = points[3].y - points[2].y;
  if (Math.hypot(dx1,dy1) < 1e-8 || Math.hypot(dx2,dy2) < 1e-8) throw new Error('终板端点重合');
  return points.map(p=>({x:p.x,y:p.y}));
}
