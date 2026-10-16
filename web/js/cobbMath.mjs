export function cobbAngleFromPoints(points) {
  if (!Array.isArray(points) || points.length !== 4) {
    throw new RangeError('Cobb angle requires exactly four points');
  }
  for (const p of points) {
    if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.y)) {
      throw new TypeError('All landmark coordinates must be finite numbers');
    }
  }
  const a = {x: points[1].x - points[0].x, y: points[1].y - points[0].y};
  const b = {x: points[3].x - points[2].x, y: points[3].y - points[2].y};
  const lenA = Math.hypot(a.x, a.y);
  const lenB = Math.hypot(b.x, b.y);
  if (lenA < 1e-8 || lenB < 1e-8) throw new RangeError('Endplate endpoints cannot coincide');
  const cosine = Math.max(0, Math.min(1, Math.abs((a.x * b.x + a.y * b.y) / (lenA * lenB))));
  return Math.acos(cosine) * 180 / Math.PI;
}
