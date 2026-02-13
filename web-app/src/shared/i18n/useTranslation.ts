import i18next, { type InitOptions } from 'i18next';
import {
  initReactI18next,
  useTranslation as useTranslationOrg
} from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { publicRuntimeConfig } from '../config/runtime';

const isServer = typeof window === 'undefined';

await i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend((language: string, namespace: string) => {
      return import(`../../i18n/${language}/${namespace}.json`);
    })
  )
  .init({
    debug: false,
    supportedLngs: publicRuntimeConfig.i18n.supportedLanguages,
    fallbackLng: publicRuntimeConfig.i18n.fallbackLanguage,
    defaultNS: publicRuntimeConfig.i18n.defaultNamespace,
    fallbackNS: publicRuntimeConfig.i18n.defaultNamespace,
    ns: [publicRuntimeConfig.i18n.defaultNamespace],
    lng: undefined,
    detection: {
      order: ['cookie', 'navigator', 'path', 'htmlTag'],
      caches: ['cookie'],
      cookieName: publicRuntimeConfig.i18n.cookieName
    },
    preload: isServer ? publicRuntimeConfig.i18n.supportedLanguages : []
  } as unknown as InitOptions);

export const useTranslation = () => {
  const { i18n, t } = useTranslationOrg(
    publicRuntimeConfig.i18n.defaultNamespace
  );

  return { i18n, t };
};
