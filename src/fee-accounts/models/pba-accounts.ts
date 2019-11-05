export interface  PbaAccounts {
  organisationId: string;
  pbaNumber: string;
  userId?:	string;
}
export interface PbaAccountsSummary extends PbaAccounts {
  routerLink: string;
}

export interface FeeAccount {
account_number: string;
account_name: string;
credit_limit: number;
available_balance: number;
status: string;
effective_date: Date;
}

export interface FeeAccountSummary extends FeeAccount {
  routerLink: string;
}
