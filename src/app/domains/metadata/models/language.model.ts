export enum LanguagesEnum {
  ENGLISH = 'en-US',
  UKRAINIAN = 'uk-UA',
}

export interface Language {
  id: LanguagesEnum;
  code: string;
  icon: string;
}

export const predefinedLanguagesDictionary: Record<LanguagesEnum, Language> = {
  [LanguagesEnum.ENGLISH]: {
    id: LanguagesEnum.ENGLISH,
    code: 'EN',
    icon: 'ukFlag',
  },
  [LanguagesEnum.UKRAINIAN]: {
    id: LanguagesEnum.UKRAINIAN,
    code: 'UA',
    icon: 'uaFlag',
  },
};
