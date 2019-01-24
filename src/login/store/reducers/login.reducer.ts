import * as fromLogin from '../actions/login.actions';


export interface LoginFormState {
  entities: any[];
  loaded: boolean;
  loading: boolean;
}

export const initialState: LoginFormState = {
  entities: [],
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromLogin.LoginActions
): LoginFormState {
  switch (action.type) {



  }

  return state;
}

export const getLoginFormEntities = (state: LoginFormState) => state.entities;
export const getLoginFormLoading = (state: LoginFormState) => state.loading;
export const getLoginFormLoaded = (state: LoginFormState) => state.loaded;

