export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'errors.unknownError';
}
