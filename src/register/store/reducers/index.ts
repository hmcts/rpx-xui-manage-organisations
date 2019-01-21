import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromRegistration from './registration.reducer';


export interface RegistrationState {
  registration: fromRegistration.RegistrationFormState;
}

export const reducers: ActionReducerMap<RegistrationState> = {
  registration: fromRegistration.reducer,
};

export const getProductsState = createFeatureSelector<RegistrationState>(
  'registration'
);
