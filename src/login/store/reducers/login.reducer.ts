import * as fromLogin from '../actions/login.actions';


export interface LoginState {
  user: any; // todo add type user model
  loaded: boolean;
  loading: boolean;
}

export const initialState: LoginState = {
  user: {},
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromLogin.LoginActions
): LoginState {
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

export const getLoggedInUserData = (state: LoginState) => state.user;
export const getLoginFormLoading = (state: LoginState) => state.loading;
export const getLoginFormLoaded = (state: LoginState) => state.loaded;

