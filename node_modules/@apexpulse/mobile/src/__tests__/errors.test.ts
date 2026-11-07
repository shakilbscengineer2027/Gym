import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AppError } from '../api/errors.ts';

describe('AppError & Error Handling', () => {
  it('correctly maps NETWORK_ERROR to user friendly offline message', () => {
    const error = new AppError('NETWORK_ERROR', 'Network connection unavailable', 0);
    assert.strictEqual(
      error.getUserMessage(),
      'No internet connection. Changes saved locally to your device.'
    );
  });

  it('correctly maps AUTH_REQUIRED to session expired message', () => {
    const error = new AppError('AUTH_REQUIRED', 'Unauthorized', 401);
    assert.strictEqual(
      error.getUserMessage(),
      'Your session has expired. Please sign in again.'
    );
  });

  it('creates AppError from an unknown native JavaScript Error', () => {
    const nativeError = new TypeError('Failed to fetch resource');
    const appError = AppError.fromUnknown(nativeError);
    assert.strictEqual(appError.code, 'NETWORK_ERROR');
  });
});
