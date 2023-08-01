import { BeforeYouStartComponent } from './before-you-start/before-you-start.component';
import { CheckYourAnswersComponent } from './check-your-answers/check-your-answers.component';
import { CompanyHouseDetailsComponent } from './company-house-details/company-house-details.component';
import { DocumentExchangeReferenceDetailsComponent } from './document-exchange-reference-details/document-exchange-reference-details.component';
import { DocumentExchangeReferenceComponent } from './document-exchange-reference/document-exchange-reference.component';
import { GovukDlListItemComponent } from './govuk-dl-list-item/govuk-dl-list-item.component';
import { NotificationBannerComponent } from './notification-banner/notification-banner.component';
import { SubmittedConfirmationComponent } from './submitted-confirmation/submitted-confirmation.component';

export const components: any[] = [
  CheckYourAnswersComponent,
  GovukDlListItemComponent,
  SubmittedConfirmationComponent,
  NotificationBannerComponent,
  BeforeYouStartComponent,
  CompanyHouseDetailsComponent,
  DocumentExchangeReferenceComponent,
  DocumentExchangeReferenceDetailsComponent
];

export * from './check-your-answers/check-your-answers.component';
export * from './govuk-dl-list-item/govuk-dl-list-item.component';
export * from './notification-banner/notification-banner.component';
export * from './submitted-confirmation/submitted-confirmation.component';

