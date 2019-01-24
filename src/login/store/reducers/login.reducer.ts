import * as fromLogin from '../actions/login.actions';


export interface LoginFormState {
  user: any; // todo add type user model
  loaded: boolean;
  loading: boolean;
}

export const initialState: LoginFormState = {
  user: {},
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromLogin.LoginActions
): LoginFormState {
  switch (action.type) {

    case fromLogin.LOGIN_USER: {
      return {
        ...state,
        loading: true
      }
    }

    case fromLogin.LOGIN_USER_SUCCESS: {
      const user = action.payload;
      return {
        ...state,
        user,
        loading: false,
        loaded: true

      };
    }


  }

  return state;
}

export const getLoginFormEntities = (state: LoginFormState) => state.user;
export const getLoginFormLoading = (state: LoginFormState) => state.loading;
export const getLoginFormLoaded = (state: LoginFormState) => state.loaded;

