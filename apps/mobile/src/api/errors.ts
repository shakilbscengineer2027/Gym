export type ErrorCode =
  | 'NETWORK_ERROR'
  | 'AUTH_REQUIRED'
  | 'TOKEN_EXPIRED'
  | 'VALIDATION_FAILED'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'SERVER_ERROR'
  | 'UNKNOWN';

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode?: number;
  readonly details?: any;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode?: number,
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }

  static isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
  }

  static fromUnknown(error: unknown): AppError {
    if (error instanceof AppError) return error;
    if (error instanceof Error) {
      if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
        return new AppError('NETWORK_ERROR', 'Network connection unavailable. Operating in offline mode.', 0);
      }
      return new AppError('UNKNOWN', error.message);
    }
    return new AppError('UNKNOWN', 'An unexpected error occurred. Please try again.');
  }

  getUserMessage(): string {
    switch (this.code) {
      case 'NETWORK_ERROR':
        return 'No internet connection. Changes saved locally to your device.';
      case 'AUTH_REQUIRED':
      case 'TOKEN_EXPIRED':
        return 'Your session has expired. Please sign in again.';
      case 'VALIDATION_FAILED':
        return this.message || 'Please verify the highlighted form fields.';
      case 'NOT_FOUND':
        return 'The requested resource was not found.';
      case 'CONFLICT':
        return 'A data conflict occurred. Your changes were queued for sync.';
      case 'SERVER_ERROR':
        return 'Server currently undergoing maintenance. Please retry in a moment.';
      default:
        return this.message || 'Something went wrong. Please try again.';
    }
  }
}
