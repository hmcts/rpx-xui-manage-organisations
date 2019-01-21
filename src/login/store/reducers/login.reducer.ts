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
    case fromLogin.LOAD_LOGIN_FORM: {
      return {
        ...state,
        loading: true,
      };
    }

    case fromLogin.LOAD_LOGIN_FORM_SUCCESS: {
      const formData = action.payload;

      const entities = formData;

      // const entities = pizzas.reduce(
      //   (entities: { [id: number]: Pizza }, pizza: Pizza) => {
      //     return {
      //       ...entities,
      //       [pizza.id]: pizza,
      //     };
      //   },
      //   {
      //     ...state.entities,
      //   }
      // );

      return {
        ...state,
        loading: false,
        loaded: true,
        entities,
      };
    }

    case fromLogin.LOAD_LOGIN_FORM_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
      };
    }
  }

  return state;
}

export const getLoginFormEntities = (state: LoginFormState) => state.entities;
export const getLoginFormLoading = (state: LoginFormState) => state.loading;
export const getLoginFormLoaded = (state: LoginFormState) => state.loaded;

