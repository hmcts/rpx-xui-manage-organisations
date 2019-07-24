import * as fromRegistration from '../actions/registration.actions';
import { errorMessageMappings, apiErrors } from '../../mappings/apiErrorMappings';

export const navigation = {
  'organisation-name': 'organisation-address',
  'organisation-address': 'organisation-pba',
  'organisation-pba': 'organisation-have-dx',
  'organisation-have-dx': {
    yes: 'organisation-dx',
    no: 'haveSra'
  },
  'organisation-dx': 'haveSra',
  haveSra: {
    yes: 'sraNumber',
    no: 'name'
  },
  sraNumber: 'name',
  name: 'email-address',
  'email-address': 'check'
};

export interface PageItems {
  formValues: any;
  meta: any;
  loading: boolean;
  loaded: boolean;
}

export interface RegistrationFormState {
  pages: { [id: string]: PageItems };
  pagesValues: object;
  navigation: object;
  nextUrl: string;
  loaded: boolean;
  loading: boolean;
  submitted: boolean;
  errorMessage: string;
}

export const initialState: RegistrationFormState = {
  pages: {},
  pagesValues: { haveDXNumber: 'dontHaveDX' },
  navigation,
  nextUrl: '',
  loaded: false,
  loading: false,
  submitted: false,
  errorMessage: ''
};

export function reducer(
  state = initialState,
  action: fromRegistration.RegistrationActions
): RegistrationFormState {
  switch (action.type) {

    case fromRegistration.LOAD_PAGE_ITEMS: {
      return {
        ...state,
        loading: true,
      };
    }

    case fromRegistration.LOAD_PAGE_ITEMS_SUCCESS: {
      const pageId = action.payload.pageId;
      const payload = action.payload.payload;
      const pageItems = {
        ...payload,
        loaded: true,
        loading: false
      };

      const pages = {
        ...state.pages,
        [pageId]: pageItems
      };

      return {
        ...state,
        pages,
        loading: false,
        loaded: true,
      };
    }

    // Seems like if the reducer is exactly the same as the previous the subscriber on the
    // state may not kick off as perhaps the objects aren't being deeply compared, a shallow
    // compare maybe being used.
    case fromRegistration.SAVE_FORM_DATA: {

      console.log('Save Form Data in reducer');
      console.log('state.pagesValues');
      console.log(state.pagesValues);
      console.log('action.payload.value');
      console.log(action.payload.value);

      const pagesValues = {
        ...state.pagesValues,
        ...action.payload.value
      };

      // nextUrl seems to be working fine.
      const nextUrl = action.payload.value.have ?
        state.navigation[action.payload.pageId][action.payload.value.have] :
        state.navigation[action.payload.pageId];

      console.log('new pagesValues');
      console.log(pagesValues);

      // ok so yep when the nextUrl matches the prevUrl when the user goes back
      // the register component can't pick up on it.

      console.log('prev nextUrl in state');
      console.log(state.nextUrl);

      console.log('next nextUrl state');
      console.log(nextUrl);

      return {
        ...state,
        pagesValues,
        nextUrl
      };
    }

    case fromRegistration.RESET_NEXT_URL: {
      return {
        ...state,
        nextUrl: '',
      };
    }

    case fromRegistration.SUBMIT_FORM_DATA_SUCCESS: {
      return {
        ...state,
        submitted: true
      };
    }

    case fromRegistration.SUBMIT_FORM_DATA_FAIL: {

      const apiError = action.payload.error;

      let apiMessageMapped;

      for (const key in apiErrors) {
        if (apiError.includes(apiErrors[key])) {
          apiMessageMapped = errorMessageMappings[key];
        }
      }

      if (apiMessageMapped) {
        return {
          ...state,
          submitted: false,
          errorMessage: apiMessageMapped
        };
      }

      return {
        ...state,
        submitted: false,
        errorMessage: errorMessageMappings[9]
      };
    }

    case fromRegistration.RESET_ERROR_MESSAGE: {
      return {
        ...state,
        submitted: false,
        errorMessage: ''
      };
    }
  }

  return state;
}

export const getRegistrationFormPages = (state: RegistrationFormState) => state.pages;
export const getRegistrationFormPagesValues = (state: RegistrationFormState) => state.pagesValues;
export const getRegistrationFromPagesSubmitted = (state: RegistrationFormState) => state.submitted;
export const getRegistrationNextUrl = (state: RegistrationFormState) => state.nextUrl;
export const getRegistrationFromLoading = (state: RegistrationFormState) => state.loading;
export const getRegistrationPagesLoaded = (state: RegistrationFormState) => state.loaded;
export const getRegistrationErrorMessages = (state: RegistrationFormState) => state.errorMessage;

