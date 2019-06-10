import * as fromUsers from '../actions/user.actions';


export interface UsersState {
  users: any[]; // todo add type user model
  loaded: boolean;
  loading: boolean;
}

export const initialState: UsersState = {
  users: [],
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromUsers.UserActions
): UsersState {
  switch (action.type) {

    case fromUsers.LOAD_USERS: {
      const users = [];
      return {
        ...state,
        users,
        loading: true
      };
    }

    case fromUsers.LOAD_USERS_SUCCESS: {
      const users = action.payload;
      return {
        ...state,
        users,
        loaded: true,
        loading: false
      };
    }


    case fromUsers.LOAD_USERS_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }

  }

  return state;
}

export const getUsers = (state: UsersState) => state.users;
export const getLoginFormLoading = (state: UsersState) => state.loading;
export const getLoginFormLoaded = (state: UsersState) => state.loaded;

