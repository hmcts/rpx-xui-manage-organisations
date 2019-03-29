export interface  PbaAccounts {
  organisationId: string;
  pbaNumber: string;
  userId?:	string
}
export interface PbaAccountsSummary extends PbaAccounts {
  routerLink: string;
}


