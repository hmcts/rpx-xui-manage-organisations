import { aatDifferences } from './aat-diffs';
import { testDifferences } from './test-diffs';
import { baseConfig } from './base-config';

const LOG_PREFIX = '[organisationServices]';

export function organisationServices(environment?: string, fallbackUrl?: string) {
  console.log(`${LOG_PREFIX} raw inputs`, { environment, fallbackUrl });
  const organisationServicesEnvironment = getOrganisationServicesEnvironment(environment, fallbackUrl);
  console.log(`${LOG_PREFIX} resolved environment`, organisationServicesEnvironment);

  let config;
  if (organisationServicesEnvironment === 'prod') {
    console.log(`${LOG_PREFIX} applying baseConfig for prod`);
    config = baseConfig;
  } else if (organisationServicesEnvironment === 'aat' || organisationServicesEnvironment === 'preview') {
    console.log(`${LOG_PREFIX} applying aatDifferences`, { organisationServicesEnvironment });
    config = mergeConfigs(baseConfig, aatDifferences);
  } else {
    console.log(`${LOG_PREFIX} applying testDifferences`, { organisationServicesEnvironment });
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
    console.log(`${LOG_PREFIX} no value supplied for environment detection`);
    return null;
  }

  const environment = value.toLowerCase();
  if (environment === 'prod' ||
    environment === 'production' ||
    environment.includes('hmcts-access.service.gov.uk')) {
    console.log(`${LOG_PREFIX} detected prod`, { value, environment });
    return 'prod';
  }

  if (environment === 'preview' || environment.includes('.preview.')) {
    console.log(`${LOG_PREFIX} detected preview`, { value, environment });
    return 'preview';
  }

  if (environment === 'aat' ||
    environment.includes('.aat.') ||
    environment.includes('-aat.') ||
    environment.includes('idam-web-public.aat.platform.hmcts.net')) {
    console.log(`${LOG_PREFIX} detected aat`, { value, environment });
    return 'aat';
  }

  console.log(`${LOG_PREFIX} no prod/aat/preview match, using value for fallback branch`, { value, environment });
  return environment;
}
