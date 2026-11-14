import { describe, expect, it } from 'bun:test';
import {
  buildProgressChartGeometry,
  DEFAULT_PROGRESS_CHART_DIMENSIONS,
  resolveActivePointIndex,
} from './student-progress-chart.util';

describe('student-progress-chart.util', () => {
  describe('buildProgressChartGeometry', () => {
    it('returns empty points and paths when chartData is empty', () => {
      const result = buildProgressChartGeometry([]);
      expect(result).toEqual({ points: [], linePath: '', areaPath: '' });
    });

    it('centers a single data point without generating NaN or areaPath', () => {
      const result = buildProgressChartGeometry([{ date: '14 Nov', score: 80, label: 'Tryout 1' }]);

      expect(result.points).toHaveLength(1);
      expect(result.points[0].x).toBe(300);
      expect(Number.isFinite(result.points[0].y)).toBe(true);
      expect(result.linePath).toBe('');
      expect(result.areaPath).toBe('');
    });

    it('generates linePath and areaPath cleanly for two or more points and clamps out-of-range scores', () => {
      const result = buildProgressChartGeometry([
        { date: '10 Nov', score: -15 },
        { date: '12 Nov', score: 50 },
        { date: '14 Nov', score: 130 },
      ]);

      expect(result.points).toHaveLength(3);
      expect(result.points[0].score).toBe(0);
      expect(result.points[2].score).toBe(100);
      expect(result.points[0].x).toBe(DEFAULT_PROGRESS_CHART_DIMENSIONS.paddingX);
      expect(result.points[2].x).toBe(
        DEFAULT_PROGRESS_CHART_DIMENSIONS.width - DEFAULT_PROGRESS_CHART_DIMENSIONS.paddingX
      );
      expect(result.linePath.startsWith('M ')).toBe(true);
      expect(result.areaPath).toContain(' Z');
    });
  });

  describe('resolveActivePointIndex', () => {
    it('returns null when there are no points', () => {
      expect(resolveActivePointIndex(null, 0)).toBeNull();
      expect(resolveActivePointIndex(2, 0)).toBeNull();
    });

    it('defaults to the last index when selection is null or out of range', () => {
      expect(resolveActivePointIndex(null, 4)).toBe(3);
      expect(resolveActivePointIndex(-1, 4)).toBe(3);
      expect(resolveActivePointIndex(9, 2)).toBe(1);
    });

    it('preserves a valid selected index', () => {
      expect(resolveActivePointIndex(1, 4)).toBe(1);
    });
  });
});
