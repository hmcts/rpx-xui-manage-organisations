import { AccessibilityComponent } from './accessibility/accessibility.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { GetHelpComponent } from './get-help/get-help.component';
import { HmctsGlobalFooterComponent } from './hmcts-global-footer/hmcts-global-footer.component';
import { HmctsGlobalHeaderComponent } from './hmcts-global-header/hmcts-global-header.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ServiceDownComponent } from './service-down/service-down.component';
import { SignedOutComponent } from './signed-out/signed-out.component';
import { TermsAndConditionsRegisterOtherOrgComponent } from './terms-and-conditions-register-other-org/terms-and-conditions-register-other-org.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

export const components: any[] = [
  HmctsGlobalHeaderComponent,
  HmctsGlobalFooterComponent,
  CookiePolicyComponent,
  PrivacyPolicyComponent,
  AccessibilityComponent,
  ServiceDownComponent,
  GetHelpComponent,
  TermsAndConditionsRegisterOtherOrgComponent,
  TermsAndConditionsComponent,
  SignedOutComponent
];

export * from '../../../projects/gov-ui/src/lib/components/hmcts-primary-navigation/hmcts-primary-navigation.component';
export * from './accessibility/accessibility.component';
export * from './cookie-policy/cookie-policy.component';
export * from './get-help/get-help.component';
export * from './hmcts-global-footer/hmcts-global-footer.component';
export * from './hmcts-global-header/hmcts-global-header.component';
export * from './privacy-policy/privacy-policy.component';
export * from './service-down/service-down.component';
export * from './signed-out/signed-out.component';
export * from './terms-and-conditions/terms-and-conditions.component';

