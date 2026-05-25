import { aatDifferences } from './aat-diffs';
import { testDifferences } from './test-diffs';
import { baseConfig } from './base-config';

export function organisationServices(environment?: string, fallbackUrl?: string) {
  const organisationServicesEnvironment = getOrganisationServicesEnvironment(environment, fallbackUrl);
  let config;
  if (organisationServicesEnvironment === 'prod') {
    config = baseConfig;
  } else if (organisationServicesEnvironment === 'aat' || organisationServicesEnvironment === 'preview') {
    config = mergeConfigs(baseConfig, aatDifferences);
  } else {
    config = mergeConfigs(baseConfig, testDifferences);
  }
  return config;
}

function getOrganisationServicesEnvironment(environment?: string, fallbackUrl?: string): string {
  const environmentConfig = getEnvironmentFromValue(environment);
  if (environmentConfig) {
    return environmentConfig;
  }

  return getEnvironmentFromValue(fallbackUrl) || '';
}

function mergeConfigs(baseConfig, newConfig) {
  if (!newConfig?.length) {
    return [...baseConfig];
  }

  const mergedConfig = [...baseConfig];
  newConfig.forEach((newItem) => {
    const existingIndex = mergedConfig.findIndex((baseItem) => baseItem.key === newItem.key);
    if (existingIndex >= 0) {
      mergedConfig[existingIndex] = { ...mergedConfig[existingIndex], ...newItem };
    } else {
      const noneIndex = mergedConfig.findIndex((baseItem) => baseItem.key === 'NONE');
      if (noneIndex >= 0) {
        mergedConfig.splice(noneIndex, 0, newItem);
      } else {
        mergedConfig.push(newItem);
      }
    }
  });
  return mergedConfig;
}

function getEnvironmentFromValue(value?: string): string | null {
  if (!value) {
    return null;
  }

  const environment = value.toLowerCase();
  if (environment === 'prod' ||
    environment === 'production' ||
    environment.includes('hmcts-access.service.gov.uk')) {
    return 'prod';
  }

  if (environment === 'preview' || environment.includes('.preview.')) {
    return 'preview';
  }

  if (environment === 'aat' ||
    environment.includes('.aat.') ||
    environment.includes('-aat.') ||
    environment.includes('idam-web-public.aat.platform.hmcts.net')) {
    return 'aat';
  }

  return environment;
}
