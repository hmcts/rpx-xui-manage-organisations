import * as fromRegistration from '../actions/registration.actions';

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

    case fromRegistration.SAVE_FORM_DATA: {
      const pagesValues = {
        ...state.pagesValues,
        ...action.payload.value
      };

      const nextUrl = action.payload.value.have ?
        state.navigation[action.payload.pageId][action.payload.value.have] :
        state.navigation[action.payload.pageId];

      return {
        ...state,
        pagesValues,
        nextUrl
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
      const apiStatus = action.payload.status;

      const errorMessageMappings = {
        1: 'Duplicate email address already exists',
        2: 'Something went wrong, ensure you have entered all the fields below',
        3: 'SRA already exists',
        4: 'PBA number must begin with PBA and be length 10',
        5: 'PBA number already exists',
        6: 'Sorry, there is a problem with the service. Try again later',
      };

      const apiErrors = {
        1: 'email_address',
        2: 'Validation failed',
        3: 'sra_id_uq1',
        4: 'pbaNumber',
        5: 'pba_number'
      };

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
        errorMessage: errorMessageMappings[6]
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

