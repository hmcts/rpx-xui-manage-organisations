import * as fromRegistration from '../actions/registration.actions';


export interface RegistrationFormState {
  entities: any[];
  loaded: boolean;
  loading: boolean;
}

export const initialState: RegistrationFormState = {
  entities: [],
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromRegistration.RegistrationActions
): RegistrationFormState {
  switch (action.type) {
    case fromRegistration.LOAD_REGISTRATION_FORM: {
      return {
        ...state,
        loading: true,
      };
    }

    case fromRegistration.LOAD_REGISTRATION_FORM_SUCCESS: {
      const form = action.payload;

      const entities = form;

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

    case fromRegistration.LOAD_REGISTRATION_FORM_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
      };
    }
  }

  return state;
}

export const getFormEntities = (state: RegistrationFormState) => state.entities;
export const getFromLoading = (state: RegistrationFormState) => state.loading;
export const getPizzasLoaded = (state: RegistrationFormState) => state.loaded;

