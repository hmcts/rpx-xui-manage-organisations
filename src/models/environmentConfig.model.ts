import { InjectionToken } from '@angular/core';

export const ENVIRONMENT_CONFIG = new InjectionToken<EnvironmentConfig>('environment.config');

export interface EnvironmentConfig {
  idamWeb: string;
  manageCaseLink: string;
  manageOrgLink: string;
  protocol: string;
  googleAnalyticsKey: string;
  launchDarklyClientId?: string;
}
