import {FeeAccountsEffects} from './fee-accounts.effects';
import { SingleFeeAccountEffects } from './single-fee-account.effects';

export const effects: any[] = [
  FeeAccountsEffects,
  SingleFeeAccountEffects
];

export * from './fee-accounts.effects';
export * from './single-fee-account.effects';
