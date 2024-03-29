import { FeeAccountErrorNotificationComponent } from '../components/notifications/fee-account-error-notification.component';
import { SummaryComponent } from '../components/summary/summary.component';
import { TransactionsComponent } from '../components/transactions/transactions.component';
import { OrganisationAccountMissingComponent } from './account-missing/account-missing.component';
import { OrganisationAccountsOverviewContainerComponent } from './overview-container/account-overview-container.component';
import { OrganisationAccountsComponent } from './overview/account-overview.component';

export const containers: any[] = [
  OrganisationAccountsComponent,
  OrganisationAccountsOverviewContainerComponent,
  OrganisationAccountMissingComponent,
  TransactionsComponent,
  SummaryComponent,
  FeeAccountErrorNotificationComponent
];

export * from './overview/account-overview.component';
export * from './account-missing/account-missing.component';
export * from './overview-container/account-overview-container.component';
export * from '../components/transactions/transactions.component';
export * from '../components/summary/summary.component';
export * from '../components/notifications/fee-account-error-notification.component';
