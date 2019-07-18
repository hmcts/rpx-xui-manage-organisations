import * as fromRegistration from '../actions/registration.actions';

export const navigation  = {
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
  pages: {[id: string]: PageItems};
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
  pagesValues: {haveDXNumber: 'dontHaveDX'},
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

    /*if(apiError.includes[apiErrors[1]])
    {
      console.log('have a match')
    }
    else
    {
      console.log('no match')
    }*/

    var apiErrors = {
      400: "There has been an error submitting your data - 400",
      //500: "Sorry, there is a problem with the service. Try again later. - 500",
      502: "Sorry, there is a problem with the service. Try again later. - 502",
      503: "Sorry, there is a problem with the service. Try again later. - 503",
      504: "Sorry, there is a problem with the service. Try again later. - 504",
      1: "Duplicate email address already exists",
      2: "Something went wrong, have you entered all required fields?",
      3: "SRA already exists"
    };
     
     var errorMessageMappings = {
      400: "There has been an error submitting your data - 400",
      //500: "Sorry, there is a problem with the service. Try again later. - 500",
      502: "Sorry, there is a problem with the service. Try again later. - 502",
      503: "Sorry, there is a problem with the service. Try again later. - 503",
      504: "Sorry, there is a problem with the service. Try again later. - 504",
      1: "email_address",
      2: "Validation failed",
      3: "sra_id_uq1"
    };

    console.log('mapping is',apiErrors[1])
    
    var errorMessage;

    if(!errorMessageMappings[action.payload.status])
    {
      //undefined
      errorMessage = action.payload.status + " " + action.payload.statusText
    }
    else
    {
      errorMessage = errorMessageMappings[action.payload.status]
    }

    var string = action.payload.error,
    substring = "email_address";
    console.log('string includes')
    //console.log(string.includes(substring))
    console.log(string.includes(errorMessageMappings[action.payload.status]))

    for (var key in errorMessageMappings) {
      console.log('mapping is',key)
      if(string.includes(errorMessageMappings[key]))
      {
        console.log('true')
        var errorMessageString = apiErrors[key]
      }
      else
      {
        console.log('false')
        //console.log('string is',string)
        //console.log('mappings is',errorMessageMappings[key])
      }
    }
    console.log('error message string',errorMessageString)

    if(errorMessageString)
    {
      return {
        ...state,
        submitted: false,
        errorMessage: 'error message string ' + errorMessageString + " ref data response" + action.payload.status + " " + action.payload.error
      };
    }
    else
    {
      return {
        ...state,
        submitted: false,
        errorMessage: action.payload.status + " " + action.payload.error
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

