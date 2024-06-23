export interface ConfirmationModalData {
  translation: ConfirmationModalTranslationData;
  action: (checkboxValue?: boolean) => unknown;
  shouldConsiderCheckbox?: boolean;
}

export interface ConfirmationModalTranslationData {
  questionTranslationKey: string;
  questionTranslationParams?: { [key: string]: string | number };
  checkboxTranslationKey?: string;
  checkboxTranslationParams?: { [key: string]: string | number };
  remarkTranslationKey?: string;
  remarkTranslationParams?: { [key: string]: string | number };
}
