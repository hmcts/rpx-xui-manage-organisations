import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromFeeAccounts from '../../store/reducers/fee-accounts.reducer';
import * as fromFeature from '../reducers';

export const selectFeatureFee = createFeatureSelector<fromFeature.FeeAccountsState>('feeAccounts');
export const getFeeAccountsState = createSelector(selectFeatureFee, (state: any) => state.feeAccounts);
export const feeAccounts = createSelector(getFeeAccountsState, fromFeeAccounts.getFeeAccounts);
export const feeAccountsLoading = createSelector(getFeeAccountsState, fromFeeAccounts.getFeeAccountsLoading);
export const feeAccountsLoaded = createSelector(getFeeAccountsState, fromFeeAccounts.getFeeAccountsLoaded);
export const isOneOrMorefeeAccountsMissing = createSelector(getFeeAccountsState, fromFeeAccounts.getOneOrMoreAccountMissingLoaded);
export const getErrorMessages = createSelector(getFeeAccountsState, fromFeeAccounts.getFeeAccountErrorMessages);
