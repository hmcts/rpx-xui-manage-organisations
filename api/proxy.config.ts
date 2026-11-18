import { Express } from 'express';
import { getConfigValue } from './configuration';
import { SERVICES_TRANSLATION_API_URL } from './configuration/references';
import { applyProxy, ProxyConfig } from './lib/middleware/proxy';

export const createTranslationProxyConfig = (): ProxyConfig => ({
  rewrite: true,
  rewriteUrl: (path: string) => '/translation' + (path === '/' ? '' : path),
  source: '/api/translation',
  target: getConfigValue(SERVICES_TRANSLATION_API_URL)
});

export const initProxy = (app: Express): void => {
  applyProxy(app, createTranslationProxyConfig());
};
