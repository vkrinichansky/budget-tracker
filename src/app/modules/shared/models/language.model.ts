export const LanguageLSKey = 'language';

export enum LanguagesEnum {
  English = 'en',
  Ukrainian = 'ua',
}

export interface LanguageSwitcherData {
  [key: string]: {
    translationKey: string;
    icon: string;
  };
}

export const PredefinedLanguages: LanguageSwitcherData = {
  [LanguagesEnum.English]: {
    translationKey: 'english',
    icon: 'ukFlag',
  },
  [LanguagesEnum.Ukrainian]: {
    translationKey: 'ukrainian',
    icon: 'uaFlag',
  },
};
