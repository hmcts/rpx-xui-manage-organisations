import {createFeatureSelector, createSelector} from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromFeeAccounts from '../../store/reducers/fee-accounts.reducer';
import { map } from 'rxjs/internal/operators';
import {FeeAccountsState} from '../reducers/fee-accounts.reducer';
import {SingleAccontSummary, SingleAccontSummaryRemapped} from '../../models/single-account-summary';


export const selectFeatureFee = createFeatureSelector<fromFeature.FeeAccountsState>('feeAccounts');
export const getFeeAccountsState = createSelector( selectFeatureFee, (state: any) => state.feeAccounts);
export const feeAccounts = createSelector( getFeeAccountsState, fromFeeAccounts.getFeeAccounts);
export const feeAccountsLoading = createSelector( getFeeAccountsState, fromFeeAccounts.getFeeAccountsLoading);
export const feeAccountsLoaded = createSelector( getFeeAccountsState, fromFeeAccounts.getFeeAccountsLoaded);
