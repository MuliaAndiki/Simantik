import { describe, expect, test } from 'bun:test';
import {
  getPortalLabel,
  getSidebarFooterMenus,
  getSidebarGroupLabel,
  getSidebarMainMenus,
  resolveSidebarRole,
} from './app.config';

describe('resolveSidebarRole', () => {
  test('resolves from role query', () => {
    expect(resolveSidebarRole('admin')).toBe('ADMIN');
    expect(resolveSidebarRole('content_manager')).toBe('CONTENT_MANAGER');
    expect(resolveSidebarRole('student')).toBe('STUDENT');
  });
  test('falls back to pathname prefix', () => {
    expect(resolveSidebarRole(undefined, '/admin/students')).toBe('ADMIN');
    expect(resolveSidebarRole(undefined, '/content_manager/tryouts')).toBe('CONTENT_MANAGER');
    expect(resolveSidebarRole(undefined, '/student/dashboard')).toBeUndefined();
  });
});

describe('sidebar menus', () => {
  test('admin and CM get full menus', () => {
    expect(getSidebarMainMenus('ADMIN').length).toBeGreaterThan(0);
    expect(getSidebarMainMenus('CONTENT_MANAGER').length).toBeGreaterThan(0);
  });
  test('student main menu is trimmed', () => {
    expect(getSidebarMainMenus('STUDENT').length).toBe(6);
    expect(getSidebarMainMenus(undefined).length).toBe(6);
  });
  test('footer per role', () => {
    expect(getSidebarFooterMenus('ADMIN').map((m) => m.url)).toEqual(['/admin/settings']);
    expect(getSidebarFooterMenus('CONTENT_MANAGER').map((m) => m.url)).toEqual([
      '/content_manager/settings',
    ]);
    expect(getSidebarFooterMenus('STUDENT').map((m) => m.url)).toEqual(['/student/setting']);
    expect(getSidebarFooterMenus(undefined)).toEqual([]);
  });
  test('labels', () => {
    expect(getPortalLabel('ADMIN')).toBe('Admin Portal');
    expect(getPortalLabel('CONTENT_MANAGER')).toBe('Content Manager');
    expect(getPortalLabel(undefined)).toBe('SMA / SMK TKA Portal');
    expect(getSidebarGroupLabel('ADMIN')).toBe('ADMINISTRASI');
    expect(getSidebarGroupLabel('CONTENT_MANAGER')).toBe('MAIN');
    expect(getSidebarGroupLabel(undefined)).toBe('Menu');
  });
});
