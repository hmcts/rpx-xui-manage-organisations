import * as fromRegistration from '../actions/organisation.actions';


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

export const getRegistationFormEntities = (state: RegistrationFormState) => state.entities;
export const getRegistrationFromLoading = (state: RegistrationFormState) => state.loading;
export const getRegistrationPizzasLoaded = (state: RegistrationFormState) => state.loaded;

