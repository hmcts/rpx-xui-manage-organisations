import * as fromPayments from '../actions/payments.actions';


export interface PaymentsFormState {
  entities: any[];
  loaded: boolean;
  loading: boolean;
}

export const initialState: PaymentsFormState = {
  entities: [],
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromPayments.PaymentsActions
): PaymentsFormState {
  switch (action.type) {
    case fromPayments.LOAD_PAYMENTS_FORM: {
      return {
        ...state,
        loading: true,
      };
    }

    case fromPayments.LOAD_PAYMENTS_FORM_SUCCESS: {
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

    case fromPayments.LOAD_PAYMENTS_FORM_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
      };
    }
  }

  return state;
}

export const getPaymentsFormEntities = (state: PaymentsFormState) => state.entities;
export const getPaymentsFormLoading = (state: PaymentsFormState) => state.loading;
export const getPaymentsFormLoaded = (state: PaymentsFormState) => state.loaded;

