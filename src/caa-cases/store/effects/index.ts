import { ShareCaseEffects } from './share-case.effects';
import { UnassignedCasesEffects } from './caa-cases.effects';

export const effects: any[] = [
    UnassignedCasesEffects,
    ShareCaseEffects
  ];

export * from './caa-cases.effects';
export * from './share-case.effects';
