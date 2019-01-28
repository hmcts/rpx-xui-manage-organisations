import * as fromUserform from '../actions/userform.actions';
import { Userform } from 'src/users/userform.model';


export interface UserformState {
  userform: Userform; // todo add type user model
  loaded: boolean;
  loading: boolean;
}

export const initialState: UserformState = {
  userform: null,
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromUserform.UserformActions
): UserformState {
  switch (action.type) {
    case fromUserform.SAVE_USER_SUCCESS: {
      const userform = action.payload;

      return {
        ...state,
        userform,
        loaded: true
      }

    }

  }

  return state;
}

export const getUserform = (state: UserformState) => state.userform;
export const getUserFormLoading = (state: UserformState) => state.loading;
export const getUserFormLoaded = (state: UserformState) => state.loaded;

