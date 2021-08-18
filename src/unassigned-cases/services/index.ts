import { UnassignedCasesService } from './unassigned-cases.service';
import { CaseShareService } from './share-case.service';

export const services: any[] = [
  UnassignedCasesService,
  CaseShareService
];

export * from './unassigned-cases.service';
export * from './share-case.service';
