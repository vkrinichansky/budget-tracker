export interface ConfirmationModalData {
  questionTranslationKey: string;
  translationParams: { [key: string]: string };
  action: () => unknown;
}
