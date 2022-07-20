import { ShareCaseEffects } from './share-case.effects';
import { CaaCasesEffects } from './caa-cases.effects';

export const effects: any[] = [
  CaaCasesEffects,
  ShareCaseEffects
];

export * from './caa-cases.effects';
export * from './share-case.effects';
