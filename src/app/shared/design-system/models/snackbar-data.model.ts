export interface SnackbarData {
  message: string;
  buttonText: string;
  buttonAction: () => unknown;
  type: SnackbarType;
}

export enum SnackbarType {
  MESSAGE = 'message',
  ERROR = 'error',
}
