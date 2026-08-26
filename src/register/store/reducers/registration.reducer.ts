import { AppUtils } from '../../../app/utils/app-utils';
import { apiErrors, errorMessageMappings } from '../../mappings/apiErrorMappings';
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

export const newPBAElement = (newPBAIndex) => {
  return {
    inputButton: {
      label: {
        text: 'PBA number (optional)',
        classes: 'govuk-label--m'
      },
      control: `PBANumber${newPBAIndex}`,
      type: 'inputButton',
      validators: ['pbaNumberPattern', 'pbaNumberMaxLength', 'pbaNumberMinLength', 'pbaNumberFormat'],
      validationErrors: [
        {
          validationErrorId: 'duplicatedPBAError',
          validationLevel: 'formControl',
          controls: 'PBANumber',
          text: 'You have entered this PBA number more than once'
        },
        {
          validationErrorId: 'invalidPBANumberError',
          validationLevel: 'formControl',
          controls: 'PBANumber',
          text: 'Enter a valid PBA number'
        }
      ],
      classes: 'govuk-width-input-button'
    }
  };
};

export interface PageItems {
  formValues: any;
  meta: any;
  loading: boolean;
  loaded: boolean;
  init: boolean;
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
  errorMessageCode: string;
}

export const initialState: RegistrationFormState = {
  pages: {},
  pagesValues: { haveDXNumber: 'dontHaveDX' },
  navigation,
  nextUrl: '',
  loaded: false,
  loading: false,
  submitted: false,
  errorMessage: '',
  errorMessageCode: ''
};

const ORGANISATION_PBA_PAGE_ID = 'organisation-pba';

function loadPageItems(state: RegistrationFormState): RegistrationFormState {
  return {
    ...removeEmptyPbaControls(state),
    loading: true
  };
}

function removeEmptyPbaControls(state: RegistrationFormState): RegistrationFormState {
  if (!state.pages[ORGANISATION_PBA_PAGE_ID]) {
    return state;
  }
  const copyPbaPage = {
    ...state.pages[ORGANISATION_PBA_PAGE_ID]
  };
  const allControls = [];
  const allPbaList = [];
  const filledPbaList = [];
  const emptyPbaList = [];
  const pagesValues = state.pagesValues as { [key: string]: any };

  Object.keys(pagesValues).forEach((key) => {
    if (key.startsWith('PBANumber')) {
      allPbaList.push(key);

      if (pagesValues[key]) {
        filledPbaList.push(key);
      } else {
        emptyPbaList.push(key);
      }
    }
  });

  state.pages[ORGANISATION_PBA_PAGE_ID].meta.groups.forEach((element, index) => {
    if (element.inputButton && emptyPbaList.includes(element.inputButton.control)
      && allPbaList.length > 1) {
      if (emptyPbaList.length > 1 && filledPbaList.length === 0 && index === 0) {
        allControls.push(element);
        emptyPbaList.splice(index, 1);
      }
    } else {
      allControls.push(element);
    }
  });

  const nextPagesValues = Object.entries(pagesValues).filter((key) => {
    return !(emptyPbaList.includes(key[0]) && allPbaList.length > 1);
  }).reduce((obj, k) => {
    obj[k[0]] = k[1];
    return obj;
  }, {});

  copyPbaPage.meta = { ...copyPbaPage.meta, groups: allControls };

  return {
    ...state,
    pages: {
      ...state.pages,
      [ORGANISATION_PBA_PAGE_ID]: copyPbaPage
    },
    pagesValues: nextPagesValues
  };
}

function loadPageItemsSuccess(
  state: RegistrationFormState,
  action: fromRegistration.LoadPageItemsSuccess
): RegistrationFormState {
  const pageId = action.payload.pageId;
  const payload = action.payload.payload;
  const pageItems = {
    ...payload,
    loaded: true,
    loading: false,
    init: true
  };

  return {
    ...state,
    pages: {
      ...state.pages,
      [pageId]: pageItems
    },
    loading: false,
    loaded: true
  };
}

function addPbaNumber(
  state: RegistrationFormState,
  action: fromRegistration.AddPBANumber
): RegistrationFormState {
  const pageGroups = state.pages[ORGANISATION_PBA_PAGE_ID].meta.groups.slice();
  const predicate = (element: any) => element.hasOwnProperty('inputButton');
  const lastInputIndex = AppUtils.findLastIndex(pageGroups, predicate);
  const newPbaIndex = getNewPbaIndex(pageGroups, lastInputIndex);

  pageGroups.splice(lastInputIndex + 1, 0, newPBAElement(newPbaIndex));

  return {
    ...state,
    pages: getPbaPages(state, pageGroups, { init: false }),
    pagesValues: {
      ...state.pagesValues,
      ...action.payload
    },
    loading: false,
    loaded: true
  };
}

function getNewPbaIndex(pageGroups: any[], lastInputIndex: number): number {
  if (lastInputIndex === -1) {
    return 1;
  }

  const maxInputControl = pageGroups[lastInputIndex].inputButton.control;
  const maxIndex = maxInputControl.replace(/^\D+/g, '');
  return Number.parseInt(maxIndex, 10) + 1;
}

function removePbaNumber(
  state: RegistrationFormState,
  action: fromRegistration.RemovePBANumber
): RegistrationFormState {
  const pageGroups = state.pages[ORGANISATION_PBA_PAGE_ID].meta.groups.slice();
  const predicate = (element: any) => element.hasOwnProperty('inputButton') && action.payload.includes(element.inputButton.control);
  const matchIndex = pageGroups.findIndex(predicate);
  const removeItem = action.payload.replace('remove', '');
  const pagesValues = { ...state.pagesValues };

  pageGroups.splice(matchIndex, 1);
  delete pagesValues[removeItem];

  return {
    ...state,
    pages: getPbaPages(state, pageGroups),
    pagesValues,
    loading: false,
    loaded: true
  };
}

function getPbaPages(state: RegistrationFormState, pageGroups: any[], pbaPageUpdates = {}) {
  return {
    ...state.pages,
    [ORGANISATION_PBA_PAGE_ID]: {
      ...state.pages[ORGANISATION_PBA_PAGE_ID],
      ...pbaPageUpdates,
      meta: {
        ...state.pages[ORGANISATION_PBA_PAGE_ID].meta,
        groups: pageGroups
      }
    }
  };
}

function saveFormData(
  state: RegistrationFormState,
  action: fromRegistration.SaveFormData
): RegistrationFormState {
  return {
    ...state,
    pages: getSavedFormPages(state, action.payload.pageId),
    pagesValues: {
      ...state.pagesValues,
      ...action.payload.value
    },
    nextUrl: getNextUrl(state, action.payload)
  };
}

function getSavedFormPages(state: RegistrationFormState, pageId: string) {
  if (pageId !== ORGANISATION_PBA_PAGE_ID) {
    return { ...state.pages };
  }

  return {
    ...state.pages,
    [ORGANISATION_PBA_PAGE_ID]: {
      ...state.pages[ORGANISATION_PBA_PAGE_ID],
      init: false
    }
  };
}

function getNextUrl(state: RegistrationFormState, payload: { value: any; pageId: string }): string {
  const partialMatchHaveKey = Object.keys(payload.value).find((key) => key.includes('have'));
  const navigationConfig = state.navigation as { [key: string]: any };

  return partialMatchHaveKey ?
    navigationConfig[payload.pageId][payload.value[partialMatchHaveKey]] :
    navigationConfig[payload.pageId];
}

function submitFormDataFail(
  state: RegistrationFormState,
  action: fromRegistration.SubmitFormDataFail
): RegistrationFormState {
  globalThis.scrollTo(0, 0);
  const error = action.payload.error;
  const apiError = error.apiError;
  const apiMessageMapped = getApiMessageMapped(apiError, error.apiErrorDescription);

  if (apiMessageMapped && apiError) {
    return {
      ...state,
      submitted: false,
      errorMessage: apiMessageMapped,
      errorMessageCode: apiError
    };
  }

  if (error.statusCode === 400) {
    return {
      ...state,
      submitted: false,
      errorMessage: error.apiErrorDescription,
      errorMessageCode: ''
    };
  }

  return {
    ...state,
    submitted: false,
    errorMessage: errorMessageMappings[9],
    errorMessageCode: ''
  };
}

function getApiMessageMapped(apiError: string, apiErrorDescription: string): string {
  let apiMessageMapped;

  for (const key in apiErrors) {
    if (apiError) {
      if (apiError.includes('PBA_NUMBER Invalid or already exists')) {
        const pbaErrorNumber = apiErrorDescription.substring(apiErrorDescription.indexOf(')=(') + 3, apiErrorDescription.indexOf(') already exists'));
        apiMessageMapped = `This PBA number ${pbaErrorNumber} has already been used.`;
      }
      if (apiError.includes(apiErrors[key])) {
        apiMessageMapped = errorMessageMappings[key];
      }
    }
  }

  return apiMessageMapped;
}

function resetErrorMessage(state: RegistrationFormState): RegistrationFormState {
  return {
    ...state,
    submitted: false,
    errorMessage: '',
    errorMessageCode: ''
  };
}

export function reducer(
  state = initialState,
  action: fromRegistration.RegistrationActions
): RegistrationFormState {
  switch (action.type) {
    case fromRegistration.LOAD_PAGE_ITEMS: {
      return loadPageItems(state);
    }

    case fromRegistration.LOAD_PAGE_ITEMS_SUCCESS: {
      return loadPageItemsSuccess(state, action);
    }

    case fromRegistration.ADD_PBA_NUMBER: {
      return addPbaNumber(state, action);
    }

    case fromRegistration.REMOVE_PBA_NUMBER: {
      return removePbaNumber(state, action);
    }

    case fromRegistration.SAVE_FORM_DATA: {
      return saveFormData(state, action);
    }

    /**
     * Reset Next Url
     *
     * We reset the nextUrl on the Store when a User clicks the Back Button.
     *
     * We do this as we subscribe to the nextUrl state within register.component.ts. When the nextUrl changes a Go action is dispatched,
     * which navigates the User to the next url (page).
     *
     * When the User clicks the Back button we need to reset the nextUrl state, otherwise the state will remain the same when they click
     * Continue, and therefore the register.component.ts's $nextUrlSubscription will never be trigger.
     *
     * @see register.component.ts
     */
    case fromRegistration.RESET_NEXT_URL: {
      return {
        ...state,
        nextUrl: ''
      };
    }

    case fromRegistration.SUBMIT_FORM_DATA_SUCCESS: {
      return {
        ...state,
        submitted: true
      };
    }

    case fromRegistration.SUBMIT_FORM_DATA_FAIL: {
      return submitFormDataFail(state, action);
    }

    case fromRegistration.RESET_ERROR_MESSAGE:
    case fromRegistration.RESET_ERROR_MESSAGE_CODE: {
      return resetErrorMessage(state);
    }

    default:
      return state;
  }
}

export const getRegistrationFormPages = (state: RegistrationFormState) => state.pages;
export const getRegistrationFormPagesValues = (state: RegistrationFormState) => state.pagesValues;
export const getRegistrationFromPagesSubmitted = (state: RegistrationFormState) => state.submitted;
export const getRegistrationNextUrl = (state: RegistrationFormState) => state.nextUrl;
export const getRegistrationFromLoading = (state: RegistrationFormState) => state.loading;
export const getRegistrationErrorMessages = (state: RegistrationFormState) => state.errorMessage;
export const getRegistrationErrorMessagesCodes = (state: RegistrationFormState) => state.errorMessageCode;
