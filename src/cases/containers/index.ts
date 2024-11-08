import { AcceptCasesComponent } from './accept-cases/accept-cases.component';
import { CaseShareCompleteComponent } from './case-share-complete/case-share-complete.component';
import { CaseShareConfirmComponent } from './case-share-confirm/case-share-confirm.component';
import { CaseShareComponent } from './case-share/case-share.component';
import { CasesComponent } from './cases/cases.component';

export const containers: any[] = [
  CaseShareComponent,
  CaseShareConfirmComponent,
  CaseShareCompleteComponent,
  CasesComponent,
  AcceptCasesComponent
];

export * from './case-share-complete/case-share-complete.component';
export * from './case-share-confirm/case-share-confirm.component';
export * from './case-share/case-share.component';
export * from './cases/cases.component';

