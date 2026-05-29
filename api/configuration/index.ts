import * as propertiesVolume from '@hmcts/properties-volume';
import * as configModule from 'config';

import { DEVELOPMENT, HTTP } from './constants';
import { ENVIRONMENT, PACT_BROKER_PASSWORD, PROTOCOL, SYSTEM_USER_PASSWORD } from './references';

// Handle both CommonJS and ES module exports - Consider uniform exports in future
const config = (configModule as any).default || configModule;

/**
 * If you are running locally you might need to set the mountPoint up as documented in the readme.
 * ie. propertiesVolume.addTo(config, { mountPoint: '/Volumes/mnt/secrets/'})
 *
 * ALLOW_CONFIG_MUTATIONS should equal true on the environment otherwise HMCTS Properties Volume will
 * not be able to merge the volume secrets into the Node config object.
 *
 * @see Readme.md
 * @see https://github.com/lorenwest/node-config/wiki/Environment-Variables
 */
export const initialiseSecrets = () => {
  propertiesVolume.addTo(config);
  // propertiesVolume.addTo(config, { mountPoint: '/Volumes/mnt/secrets/'})
};

/**
 * Allows us to integrate the Azure key-vault flex volume, so that we are able to access Node configuration values.
 */
initialiseSecrets();

/**
 * Get Environment
 *
 * See Readme for more information on how the configuration file is set.
 * 'Environmental Variables Setup & Error Handling'
 *
 * @see Readme
 * @returns {string} ie. - development / preview / aat / ithc, prod
 */
export const getEnvironment = () => process.env.NODE_CONFIG_ENV;

const ENV_ONLY_CONFIG_REFERENCES: Record<string, string> = {
  [PACT_BROKER_PASSWORD]: 'PACT_BROKER_PASSWORD',
  [SYSTEM_USER_PASSWORD]: 'SYSTEM_USER_PASSWORD'
};

/**
 * Get Configuration Value
 *
 * Returns the configuration value, using a config reference. It uses the reference to pull out the value
 * from the .yaml file
 *
 * @see /config .yaml
 * @see references.ts
 * @param reference - ie. 'services.ccdDefApi'
 */
export const getConfigValue = <T = any>(reference: string): T => {
  const envName = ENV_ONLY_CONFIG_REFERENCES[reference];

  if (envName && process.env[envName]) {
    return process.env[envName] as T;
  }

  return config.get(reference);
};

export const hasConfigValue = (reference) => config.has(reference);

/**
 * Show Feature
 *
 * Helper method for config feature toggling
 *
 * @param feature
 * @return boolean
 */
export const showFeature = (feature) => config.get(`feature.${feature}`);

/**
 * Generate Environment Check Text
 *
 * We generate text to be used for debugging purposes, so as the person attempting to initialise the application knows
 * what the NODE_CONFIG_ENV is set as and what config file is being used.
 */
export const environmentCheckText = () =>
  `NODE_CONFIG_ENV is set as ${process.env.NODE_CONFIG_ENV} therefore we are using the ${config.get(ENVIRONMENT)} config.`;

/**
 * Get Protocol
 *
 * If running locally we return 'http'
 *
 * @returns {string | string}
 */
export const getProtocol = () => getEnvironment() === DEVELOPMENT ? HTTP : getConfigValue(PROTOCOL);
