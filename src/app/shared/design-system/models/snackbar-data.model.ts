export interface SnackbarData {
  message: string;
  buttonText: string;
  buttonAction: () => unknown;
  type: SnackbarType;
}

export enum SnackbarType {
  Message = 'message',
  Error = 'error',
}
