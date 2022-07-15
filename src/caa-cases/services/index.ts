import { UnassignedCasesService } from './caa-cases.service';
import { CaseShareService } from './share-case.service';

export const services: any[] = [
  UnassignedCasesService,
  CaseShareService
];

export * from './caa-cases.service';
export * from './share-case.service';
