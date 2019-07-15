import * as fromUsers from '../actions/user.actions';


export interface UsersListState {
  userList: object[];
  loaded: boolean;
  loading: boolean;
}

export const initialState: UsersListState = {
  userList: [],
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromUsers.UserActions
): UsersListState {
  switch (action.type) {

    case fromUsers.LOAD_USERS: {
      const userList = [];
      return {
        ...state,
        userList,
        loading: true
      };
    }

    case fromUsers.LOAD_USERS_SUCCESS: {
      const userList = action.payload.users;
      return {
        ...state,
        userList,
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

export const getUsers = (state: UsersListState) => state.userList;
export const getLoginFormLoading = (state: UsersListState) => state.loading;
export const getLoginFormLoaded = (state: UsersListState) => state.loaded;

