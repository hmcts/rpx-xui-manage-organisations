import { createSelector } from '@ngrx/store';

import * as fromFeature from '../../store/reducers';
import * as fromPayments from '../../store/reducers/payments.reducer';

export const getPaymentsState = createSelector(
  fromFeature.getRootPaymentsState,
  (state: fromFeature.PaymentsState) => state.payments
);

export const getPaymentsEntities = createSelector(
  getPaymentsState,
  fromPayments.getPaymentsFormEntities
);
