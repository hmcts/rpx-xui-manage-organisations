import { BeforeYouStartComponent } from './before-you-start/before-you-start.component';
import { CheckYourAnswersComponent } from './check-your-answers/check-your-answers.component';
import { GovukDlListItemComponent } from './govuk-dl-list-item/govuk-dl-list-item.component';
import { NotificationBannerComponent } from './notification-banner/notification-banner.component';
import { SubmittedConfirmationComponent } from './submitted-confirmation/submitted-confirmation.component';

export const components: any[] = [
  CheckYourAnswersComponent,
  GovukDlListItemComponent,
  SubmittedConfirmationComponent,
  NotificationBannerComponent,
  BeforeYouStartComponent
];

export * from './check-your-answers/check-your-answers.component';
export * from './govuk-dl-list-item/govuk-dl-list-item.component';
export * from './notification-banner/notification-banner.component';
export * from './submitted-confirmation/submitted-confirmation.component';
