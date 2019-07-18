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

      var apiError = action.payload.error
      var apiStatus = action.payload.status

      var errorMessageMappings = {
        500: "Sorry, there is a problem with the service. Try again later. - 500",
        502: "Sorry, there is a problem with the service. Try again later. - 502",
        503: "Sorry, there is a problem with the service. Try again later. - 503",
        504: "Sorry, there is a problem with the service. Try again later. - 504",
        1: "Duplicate email address already exists",
        2: "Something went wrong, have you entered all required fields?",
        3: "SRA already exists"
      };

      var apiErrors = {
        1: "email_address",
        2: "Validation failed",
        3: "sra_id_uq1"
      };

      var errorMessageString;

      for (var key in apiErrors) {
        if (apiError.includes(apiErrors[key])) {
          errorMessageString = errorMessageMappings[key]
        }
      }

      if (apiStatus == 500 || apiStatus == 502 || apiStatus == 503 || apiStatus == 504) {
        errorMessageString = errorMessageMappings[apiStatus]
      }

      if (errorMessageString) {
        console.log('Reference data returns:' + apiError + " " + apiStatus)
        return {
          ...state,
          submitted: false,
          errorMessage: errorMessageString
        };
      }
      else {
        return {
          ...state,
          submitted: false,
          errorMessage: apiError + " " + apiStatus
        };
      }
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

