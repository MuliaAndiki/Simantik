import { describe, expect, test } from 'bun:test';
import { validateChangePassword } from './password.util';

describe('validateChangePassword', () => {
  test('rejects empty current password', () => {
    expect(
      validateChangePassword({
        currentPassword: '',
        newPassword: 'abc12345',
        confirmPassword: 'abc12345',
      })
    ).not.toBeNull();
  });
  test('rejects short password', () => {
    expect(
      validateChangePassword({
        currentPassword: 'old12345',
        newPassword: 'ab12',
        confirmPassword: 'ab12',
      })
    ).not.toBeNull();
  });
  test('rejects letters-only password', () => {
    expect(
      validateChangePassword({
        currentPassword: 'old12345',
        newPassword: 'abcdefgh',
        confirmPassword: 'abcdefgh',
      })
    ).not.toBeNull();
  });
  test('rejects mismatched confirmation', () => {
    expect(
      validateChangePassword({
        currentPassword: 'old12345',
        newPassword: 'abc12345',
        confirmPassword: 'abc12346',
      })
    ).not.toBeNull();
  });
  test('accepts valid form', () => {
    expect(
      validateChangePassword({
        currentPassword: 'old12345',
        newPassword: 'abc12345',
        confirmPassword: 'abc12345',
      })
    ).toBeNull();
  });
});
