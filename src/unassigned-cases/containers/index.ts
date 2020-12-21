import { CaseShareCompleteComponent } from './case-share-complete/case-share-complete.component';
import { CaseShareConfirmComponent } from './case-share-confirm/case-share-confirm.component';
import { CaseShareComponent } from './case-share/case-share.component';
import { UnassignedCasesComponent } from './unassigned-cases/unassigned-cases.component';

export const containers: any[] = [
  UnassignedCasesComponent,
  CaseShareComponent,
  CaseShareConfirmComponent,
  CaseShareCompleteComponent
];

export * from './unassigned-cases/unassigned-cases.component';
export * from './case-share/case-share.component';
export * from './case-share-confirm/case-share-confirm.component';
export * from './case-share-complete/case-share-complete.component';
