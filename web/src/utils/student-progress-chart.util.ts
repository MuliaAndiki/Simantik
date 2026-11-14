export interface ProgressChartInputPoint {
  date: string;
  score: number;
  label?: string;
}

export interface ProgressChartGeometryPoint extends ProgressChartInputPoint {
  x: number;
  y: number;
}

export interface ProgressChartDimensions {
  width: number;
  height: number;
  paddingX: number;
  paddingTop: number;
  paddingBottom: number;
}

export interface ProgressChartGeometry {
  points: ProgressChartGeometryPoint[];
  linePath: string;
  areaPath: string;
}

export const DEFAULT_PROGRESS_CHART_DIMENSIONS: ProgressChartDimensions = {
  width: 600,
  height: 180,
  paddingX: 40,
  paddingTop: 30,
  paddingBottom: 30,
};

function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.min(100, Math.max(0, score));
}

/**
 * Computes SVG points, smooth Bezier line path, and closed area path safely for 0, 1, or N points.
 */
export function buildProgressChartGeometry(
  chartData: ProgressChartInputPoint[] = [],
  dimensions: ProgressChartDimensions = DEFAULT_PROGRESS_CHART_DIMENSIONS
): ProgressChartGeometry {
  if (chartData.length === 0) {
    return { points: [], linePath: '', areaPath: '' };
  }

  const { width, height, paddingX, paddingTop, paddingBottom } = dimensions;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingTop - paddingBottom;

  const points: ProgressChartGeometryPoint[] = chartData.map((d, index) => {
    const safeScore = clampScore(d.score);
    const x =
      chartData.length === 1
        ? paddingX + graphWidth / 2
        : paddingX + (index / (chartData.length - 1)) * graphWidth;
    const y = paddingTop + (1 - safeScore / 100) * graphHeight;
    return { ...d, score: safeScore, x, y };
  });

  if (points.length < 2) {
    return { points, linePath: '', areaPath: '' };
  }

  const linePath = points.reduce((acc, curr, index) => {
    if (index === 0) return `M ${curr.x} ${curr.y}`;
    const prev = points[index - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, '');

  const baselineY = height - paddingBottom;
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${baselineY} L ${points[0].x} ${baselineY} Z`;

  return { points, linePath, areaPath };
}

/**
 * Resolves a safe active tooltip index for the current point count (defaults to the latest point).
 */
export function resolveActivePointIndex(
  selectedIndex: number | null,
  pointsLength: number
): number | null {
  if (pointsLength <= 0) return null;
  if (selectedIndex !== null && selectedIndex >= 0 && selectedIndex < pointsLength) {
    return selectedIndex;
  }
  return pointsLength - 1;
}
