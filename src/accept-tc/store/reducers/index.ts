import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromTC from './acept-tc.reducer';

export interface TCState {
  acceptedTC: fromTC.TermsAndCondition;
}

export const reducers: ActionReducerMap<TCState> = {
  acceptedTC: fromTC.reducer,
};

export const getAcceptTCRootState = createFeatureSelector<TCState>(
  'acceptTc'
);




