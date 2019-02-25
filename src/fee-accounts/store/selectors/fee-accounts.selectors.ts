import {createFeatureSelector, createSelector} from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromFeeAccounts from '../../store/reducers/fee-accounts.reducer';
import { map } from 'rxjs/internal/operators';
import {FeeAccountsState} from '../reducers/fee-accounts.reducer';


export const selectFeatureFee = createFeatureSelector<fromFeature.FeeAccountsState>('feeAccounts');
export const getFeeAccountsState = createSelector( selectFeatureFee, (state: any) => state.feeAccounts);
export const getFeeAccountsRaw = createSelector( getFeeAccountsState, fromFeeAccounts.getFeeAccounts);
export const getFeeAccountsLoading = createSelector( getFeeAccountsState, fromFeeAccounts.getFeeAccountsLoading);
export const getFeeAccountsMapped = createSelector(
  getFeeAccountsRaw,
  (entities: any) => {
    const obj = entities.map((entity: any) => {
      const element = {
          ...entity,
          routerLink: `/fee-accounts/account/${entity.pbaNumber}/summary`
        };
      return element;
    })
    return obj;
  }
);



// feeAccountsData.forEach( (element: any) => {
//   element = {
//     ...element,
//     routerLink: `/fee-accounts/account/${element.pbaNumber}/summary`
//   };
//   mappedData.push(element);
// });

