export const LanguageLSKey = 'language';

export enum LanguagesEnum {
  English = 'en-US',
  Ukrainian = 'uk-UA',
}

export interface LanguageSwitcherData {
  [key: string]: {
    translationKey: string;
    short: string;
    icon: string;
  };
}

export const PredefinedLanguages: LanguageSwitcherData = {
  [LanguagesEnum.English]: {
    translationKey: 'english',
    short: 'EN',
    icon: 'ukFlag',
  },
  [LanguagesEnum.Ukrainian]: {
    translationKey: 'ukrainian',
    short: 'UA',

    icon: 'uaFlag',
  },
};
