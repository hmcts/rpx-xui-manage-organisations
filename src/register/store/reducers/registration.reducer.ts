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

export function reducer(
  state = initialState,
  action: fromRegistration.RegistrationActions
): RegistrationFormState {
  switch (action.type) {
    case fromRegistration.LOAD_PAGE_ITEMS: {
      if (state.pages['organisation-pba']) {
        const copypbaPage = Object.assign({}, state.pages['organisation-pba']);
        const allControls = [];
        const allpbaList = [];
        const filledpbaList = [];
        const emptypbaList = [];

        Object.keys(state.pagesValues).map((key) => {
          if (key.startsWith('PBANumber')) {
            allpbaList.push(key);
            if (state.pagesValues[key]) {
              filledpbaList.push(key);
            } else {
              emptypbaList.push(key);
            }
          }
        });

        state.pages['organisation-pba'].meta.groups.forEach((element, index) => {
          if (element.inputButton && emptypbaList.includes(element.inputButton.control)
            && allpbaList.length > 1) {
            if (emptypbaList.length > 1 && filledpbaList.length === 0 && index === 0) {
              allControls.push(element);
              emptypbaList.splice(index, 1);
            }
          } else {
            allControls.push(element);
          }
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const allDataList = Object.entries(state.pagesValues).filter((key, value) => {
          return !(emptypbaList.includes(key[0]) && allpbaList.length > 1);
        }).reduce((obj, k) => {
          obj[k[0]] = k[1];
          return obj;
        }, {});

        copypbaPage.meta = { ...copypbaPage.meta, groups: allControls };
        const pbaPage = { ...state.pages, 'organisation-pba': copypbaPage };
        state = { ...state, pages: pbaPage };
        state = { ...state, pagesValues: allDataList };
      }

      return {
        ...state,
        loading: true
      };
    }

    case fromRegistration.LOAD_PAGE_ITEMS_SUCCESS: {
      const pageId = action.payload.pageId;
      const payload = action.payload.payload;
      const pageItems = {
        ...payload,
        loaded: true,
        loading: false,
        init: true
      };

      const pages = {
        ...state.pages,
        [pageId]: pageItems
      };

      return {
        ...state,
        pages,
        loading: false,
        loaded: true
      };
    }

    case fromRegistration.ADD_PBA_NUMBER: {
      const pageGroups: [] = state.pages['organisation-pba'].meta.groups.slice();
      const predicate = (element: any) => element.hasOwnProperty('inputButton');
      const lastInputIndex = AppUtils.findLastIndex(pageGroups, predicate);
      if (lastInputIndex === -1) {
        // @ts-ignore
        pageGroups.splice(lastInputIndex + 1, 0, newPBAElement(1));
      } else {
        // @ts-ignore
        const maxInputControl = pageGroups[lastInputIndex].inputButton.control;
        const maxIndex = maxInputControl.replace(/^\D+/g, '');
        // @ts-ignore
        pageGroups.splice(lastInputIndex + 1, 0, newPBAElement(parseInt(maxIndex, 10) + 1));
      }
      const pages = {
        ...state.pages,
        'organisation-pba': {
          ...state.pages['organisation-pba'],
          meta: {
            ...state.pages['organisation-pba'].meta,
            groups: pageGroups
          },
          init: false
        }
      };
      const pagesValues = {
        ...state.pagesValues,
        ...action.payload
      };
      return {
        ...state,
        pages,
        pagesValues,
        loading: false,
        loaded: true
      };
    }

    case fromRegistration.REMOVE_PBA_NUMBER: {
      const pageGroups: [] = state.pages['organisation-pba'].meta.groups.slice();
      const predicate = (element: any) => element.hasOwnProperty('inputButton') && action.payload.includes(element.inputButton.control);
      const matchIndex = pageGroups.findIndex(predicate);
      pageGroups.splice(matchIndex, 1);
      const pages = {
        ...state.pages,
        'organisation-pba': {
          ...state.pages['organisation-pba'],
          meta: {
            ...state.pages['organisation-pba'].meta,
            groups: pageGroups
          }
        }
      };
      const removeItem = action.payload.replace('remove', '');
      const pagesValues = { ...state.pagesValues };
      delete pagesValues[removeItem];
      return {
        ...state,
        pages,
        pagesValues,
        loading: false,
        loaded: true
      };
    }

    case fromRegistration.SAVE_FORM_DATA: {
      let pages = { ...state.pages };
      if (action.payload.pageId === 'organisation-pba') {
        pages = {
          ...state.pages,
          'organisation-pba': {
            ...state.pages['organisation-pba'],
            init: false
          }
        };
      }

      const pagesValues = {
        ...state.pagesValues,
        ...action.payload.value
      };

      const partialMatchHaveKey = Object.keys(action.payload.value).find((key) => key.indexOf('have') > -1);

      const nextUrl = partialMatchHaveKey ?
        state.navigation[action.payload.pageId][action.payload.value[partialMatchHaveKey]] :
        state.navigation[action.payload.pageId];

      return {
        ...state,
        pages,
        pagesValues,
        nextUrl
      };
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
      window.scrollTo(0, 0);
      const apiError = action.payload.error.apiError;

      let apiMessageMapped;
      for (const key in apiErrors) {
        if (apiError) {
          if (apiError.includes('PBA_NUMBER Invalid or already exists')) {
            const errorDescription = action.payload.error.apiErrorDescription;
            const pbaErrorNumber = errorDescription.substring(errorDescription.indexOf(')=(') + 3, errorDescription.indexOf(') already exists'));
            apiMessageMapped = `This PBA number ${pbaErrorNumber} has already been used.`;
          }
          if (apiError.includes(apiErrors[key])) {
            apiMessageMapped = errorMessageMappings[key];
          }
        }
      }

      if (apiMessageMapped && apiError) {
        return {
          ...state,
          submitted: false,
          errorMessage: apiMessageMapped,
          errorMessageCode: apiError
        };
      } else if (action.payload.error.statusCode === 400) {
        return {
          ...state,
          submitted: false,
          errorMessage: action.payload.error.apiErrorDescription,
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

    case fromRegistration.RESET_ERROR_MESSAGE: {
      return {
        ...state,
        submitted: false,
        errorMessage: '',
        errorMessageCode: ''
      };
    }

    case fromRegistration.RESET_ERROR_MESSAGE_CODE: {
      return {
        ...state,
        submitted: false,
        errorMessage: '',
        errorMessageCode: ''
      };
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

