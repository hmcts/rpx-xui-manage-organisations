import * as fromUsers from '../actions/user.actions';


export interface LoginState {
  users: any[]; // todo add type user model
  loaded: boolean;
  loading: boolean;
}

export const initialState: LoginState = {
  users: [],
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromUsers.UserActions
): LoginState {
  switch (action.type) {
    case fromUsers.LOAD_USERS_SUCCESS: {
        debugger;
      const users = action.payload;

      return {
        ...state,
        users,
        loaded: true
      }

    }

  }

  return state;
}

export const getUsers = (state: LoginState) => state.users;
export const getLoginFormLoading = (state: LoginState) => state.loading;
export const getLoginFormLoaded = (state: LoginState) => state.loaded;

