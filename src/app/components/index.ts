import { HmctsGlobalHeaderComponent } from './hmcts-global-header/hmcts-global-header.component';
import { HmctsGlobalFooterComponent } from './hmcts-global-footer/hmcts-global-footer.component';
import {
  HmctsPrimaryNavigationComponent
} from '../../../projects/gov-ui/src/lib/components/hmcts-primary-navigation/hmcts-primary-navigation.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AccessibilityComponent } from './accessibility/accessibility.component';
import { ServiceDownComponent } from './service-down/service-down.component';
import { GetHelpComponent } from './get-help/get-help.component';
import { LegacyTermsAndConditionsComponent } from './legacy-terms-and-conditions/legacy-terms-and-conditions.component';

export const components: any[] = [
  HmctsGlobalHeaderComponent,
  HmctsGlobalFooterComponent,
  HmctsPrimaryNavigationComponent,
  CookiePolicyComponent,
  PrivacyPolicyComponent,
  AccessibilityComponent,
  ServiceDownComponent,
  GetHelpComponent,
  LegacyTermsAndConditionsComponent
];

export * from './hmcts-global-header/hmcts-global-header.component';
export * from './hmcts-global-footer/hmcts-global-footer.component';
export * from '../../../projects/gov-ui/src/lib/components/hmcts-primary-navigation/hmcts-primary-navigation.component';
export * from './cookie-policy/cookie-policy.component';
export * from './privacy-policy/privacy-policy.component';
export * from './accessibility/accessibility.component';
export * from './service-down/service-down.component';
export * from './get-help/get-help.component';
export * from './legacy-terms-and-conditions/legacy-terms-and-conditions.component';
