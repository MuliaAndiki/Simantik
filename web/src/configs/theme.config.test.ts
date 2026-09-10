import { describe, expect, it } from 'bun:test';
import { themeConfig } from './theme.config';

describe('themeConfig', () => {
  it('provides single white theme as default configuration', () => {
    expect(themeConfig).toBeDefined();
    expect(themeConfig.light).toBeDefined();
  });

  it('contains proper design system brand color tokens', () => {
    expect(themeConfig.background).toBe('#FAFCFD');
    expect(themeConfig.foreground).toBe('#111827');
    expect(themeConfig.primary.background).toBe('#F7CE46');
    expect(themeConfig.primary.foreground).toBe('#1A4D5C');
    expect(themeConfig.canvas).toBe('#FAFCFD');
    expect(themeConfig.ink).toBe('#111827');
    expect(themeConfig.accent2).toBe('#4CA7B1');
  });
});
