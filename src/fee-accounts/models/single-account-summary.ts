export interface SingleAccountSummary {
  account_number: string;
  account_name: string;
  credit_limit: number;
  available_balance: number;
  status: string | 'Active';
  effective_date: string;
}
export interface SingleAccontSummaryRemapped extends SingleAccountSummary {
  routerLink: string;
}
