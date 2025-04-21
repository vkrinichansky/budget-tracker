export enum LanguagesEnum {
  English = 'en-US',
  Ukrainian = 'uk-UA',
}

export interface Language {
  id: string;
  code: string;
  icon: string;
}

export const predefinedLanguagesDictionary: Record<LanguagesEnum, Language> = {
  [LanguagesEnum.English]: {
    id: LanguagesEnum.English,
    code: 'EN',
    icon: 'ukFlag',
  },
  [LanguagesEnum.Ukrainian]: {
    id: LanguagesEnum.Ukrainian,
    code: 'UA',
    icon: 'uaFlag',
  },
};
