import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromPayments from './payments.reducer';


export interface PaymentsState {
  payments: fromPayments.PaymentsFormState;
}

export const reducers: ActionReducerMap<PaymentsState> = {
  payments: fromPayments.reducer,
};

export const getRootPaymentsState = createFeatureSelector<PaymentsState>(
  'payments'
);
