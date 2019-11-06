import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromTC from './acept-tc.reducer';

export interface TCState {
  accepted: fromTC.TermsAndCondition;
}

export const reducers: ActionReducerMap<TCState> = {
  accepted: fromTC.reducer,
};

export const getAcceptTCRootState = createFeatureSelector<TCState>(
  'acceptTc'
);




