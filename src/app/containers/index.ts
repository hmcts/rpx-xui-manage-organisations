
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ServiceDownComponent } from './service-down/service-down.component';
import { RedirectComponent } from './redirect/redirect.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

export const containers: any[] = [
  HeaderComponent,
  FooterComponent,
  ServiceDownComponent,
  RedirectComponent,
  CookiePolicyComponent,
  PrivacyPolicyComponent,
  TermsAndConditionsComponent
];

export * from './footer/footer.component';
export * from './header/header.component';
export * from './service-down/service-down.component';
export * from './cookie-policy/cookie-policy.component';
export * from './privacy-policy/privacy-policy.component';
export * from './terms-and-conditions/terms-and-conditions.component';
