import { AccountsOverviewComponent } from './overview/account-overview.component';
import { TransactionsComponent } from '../components/transactions/transactions.component';
import { SummaryComponent } from '../components/summary/summary.component';

export const containers: any[] = [AccountsOverviewComponent, TransactionsComponent, SummaryComponent];

export * from './overview/account-overview.component';
export * from '../components/transactions/transactions.component';
export * from '../components/summary/summary.component';
