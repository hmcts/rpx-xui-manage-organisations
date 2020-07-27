import { ShareCaseEffects } from './share-case.effects';
import { UnassignedCasesEffects } from './unassigned-cases.effects';

export const effects: any[] = [
    UnassignedCasesEffects,
    ShareCaseEffects
  ];

export * from './unassigned-cases.effects';
export * from './share-case.effects';
