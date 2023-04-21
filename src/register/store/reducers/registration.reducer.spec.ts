import { AddPBANumber, LoadPageItems, RemovePBANumber, ResetErrorMessage, SaveFormData, SubmitFormDataFail } from '../actions';
import { initialState, reducer } from './registration.reducer';

describe('RegistrationReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = reducer(undefined, action);
      expect(state).toEqual(initialState);
    });
  });
  describe('LOAD_PAGE_ITEMS action', () => {
    it('should set loading to true', () => {
      const action = new LoadPageItems('something');
      const state = reducer(initialState, action);
      expect(state.loading).toEqual(true);
    });
  });

  describe('LOAD_PAGE_ITEMS_SUCCESS action', () => {
    it('should update the state.pages', () => {
      const pageId = 'something';
      const action = new LoadPageItems(pageId);

      const state = reducer(initialState, action);
      // console.log('state.pages', state.pages)
      expect(state.pages).toEqual({});
    });
  });

  describe('SUBMIT_FORM_DATA_FAIL action', () => {
    it('should update the state.errorMessage', () => {
      const payload = { error: { apiError: 'Undefined error' }, status: '500' };
      const action = new SubmitFormDataFail(payload);
      const state = reducer(initialState, action);
      expect(state.errorMessage).toEqual('Sorry, there is a problem with the service. Try again later');
    });
  });

  describe('RESET_ERROR_MESSAGE action', () => {
    it('should reset error message to empty string', () => {
      const action = new ResetErrorMessage({});
      const state = reducer(initialState, action);
      expect(state.errorMessage).toEqual('');
    });
  });

  describe('ADD_PBA_NUMBER action', () => {
    it('should add 1st pba number input button element to page groups', () => {
      const action = new AddPBANumber({});
      const pages = {
        'organisation-pba': {
          formValues: {},
          loading: false,
          loaded: true,
          init: false,
          meta: {
            groups: [
              {
                button: {
                  control: 'addAnotherPBANumber',
                  value: 'Add another PBA number',
                  type: 'button',
                  classes: 'hmcts-button--secondary  hmcts-add-another__add-button',
                  onEvent: 'addAnotherPBANumber'
                }
              },
              {
                button: {
                  control: 'createButton',
                  value: 'Continue',
                  type: 'submit',
                  classes: '',
                  onEvent: 'continue'
                }
              }
            ]
          }
        }
      };
      const anInitialState = { ...initialState, pages };
      const state = reducer(anInitialState, action);
      expect(state.pages['organisation-pba'].meta.groups.length).toEqual(3);
      expect(state.pages['organisation-pba'].meta.groups[0].inputButton.control).toEqual('PBANumber1');
    });

    it('should add 2nd pba number input button element to page groups', () => {
      const action = new AddPBANumber({});
      const pages = {
        'organisation-pba': {
          formValues: {},
          loading: false,
          loaded: true,
          init: false,
          meta: {
            groups: [
              {
                inputButton: {
                  label: {
                    text: 'PBA number (optional)',
                    classes: 'govuk-label--m'
                  },
                  control: 'PBANumber1',
                  type: 'inputButton',
                  validators: [
                    'pbaNumberPattern',
                    'pbaNumberMaxLength',
                    'pbaNumberMinLength'
                  ],
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
              },
              {
                button: {
                  control: 'addAnotherPBANumber',
                  value: 'Add another PBA number',
                  type: 'button',
                  classes: 'hmcts-button--secondary  hmcts-add-another__add-button',
                  onEvent: 'addAnotherPBANumber'
                }
              },
              {
                button: {
                  control: 'createButton',
                  value: 'Continue',
                  type: 'submit',
                  classes: '',
                  onEvent: 'continue'
                }
              }
            ]
          }
        }
      };
      const anInitialState = { ...initialState, pages };
      const state = reducer(anInitialState, action);
      expect(state.pages['organisation-pba'].meta.groups.length).toEqual(4);
      expect(state.pages['organisation-pba'].meta.groups[1].inputButton.control).toEqual('PBANumber2');
    });

    it('should add pba number input button element with max index to page groups', () => {
      const action = new AddPBANumber({});
      const pages = {
        'organisation-pba': {
          formValues: {},
          loading: false,
          loaded: true,
          init: false,
          meta: {
            groups: [
              {
                inputButton: {
                  label: {
                    text: 'PBA number (optional)',
                    classes: 'govuk-label--m'
                  },
                  control: 'PBANumber1',
                  type: 'inputButton',
                  validators: [
                    'pbaNumberPattern',
                    'pbaNumberMaxLength',
                    'pbaNumberMinLength'
                  ],
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
              },
              {
                inputButton: {
                  label: {
                    text: 'PBA number (optional)',
                    classes: 'govuk-label--m'
                  },
                  control: 'PBANumber3',
                  type: 'inputButton',
                  validators: [
                    'pbaNumberPattern',
                    'pbaNumberMaxLength',
                    'pbaNumberMinLength'
                  ],
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
              },
              {
                button: {
                  control: 'addAnotherPBANumber',
                  value: 'Add another PBA number',
                  type: 'button',
                  classes: 'hmcts-button--secondary  hmcts-add-another__add-button',
                  onEvent: 'addAnotherPBANumber'
                }
              },
              {
                button: {
                  control: 'createButton',
                  value: 'Continue',
                  type: 'submit',
                  classes: '',
                  onEvent: 'continue'
                }
              }
            ]
          }
        }
      };
      const anInitialState = { ...initialState, pages };
      const state = reducer(anInitialState, action);
      expect(state.pages['organisation-pba'].meta.groups.length).toEqual(5);
      expect(state.pages['organisation-pba'].meta.groups[2].inputButton.control).toEqual('PBANumber4');
    });
  });

  describe('REMOVE_PBA_NUMBER action', () => {
    it('should remove last input button element from page groups', () => {
      const action = new RemovePBANumber('removePBANumber2');
      const pages = {
        'organisation-pba': {
          formValues: {},
          loading: false,
          loaded: true,
          init: false,
          meta: {
            groups: [
              {
                inputButton: {
                  label: {
                    text: 'PBA number (optional)',
                    classes: 'govuk-label--m'
                  },
                  control: 'PBANumber1',
                  type: 'inputButton',
                  validators: [
                    'pbaNumberPattern',
                    'pbaNumberMaxLength',
                    'pbaNumberMinLength'
                  ],
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
              },
              {
                inputButton: {
                  label: {
                    text: 'PBA number (optional)',
                    classes: 'govuk-label--m'
                  },
                  control: 'PBANumber2',
                  type: 'inputButton',
                  validators: [
                    'pbaNumberPattern',
                    'pbaNumberMaxLength',
                    'pbaNumberMinLength'
                  ],
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
              },
              {
                button: {
                  control: 'addAnotherPBANumber',
                  value: 'Add another PBA number',
                  type: 'button',
                  classes: 'hmcts-button--secondary  hmcts-add-another__add-button',
                  onEvent: 'addAnotherPBANumber'
                }
              },
              {
                button: {
                  control: 'createButton',
                  value: 'Continue',
                  type: 'submit',
                  classes: '',
                  onEvent: 'continue'
                }
              }
            ]
          }
        }
      };
      const anInitialState = { ...initialState, pages };
      const state = reducer(anInitialState, action);
      expect(state.pages['organisation-pba'].meta.groups.length).toEqual(3);
      expect(state.pages['organisation-pba'].meta.groups[1].inputButton).toBeFalsy();
    });

    it('should remove 2nd input button element from page groups', () => {
      const action = new RemovePBANumber('removePBANumber2');
      const pages = {
        'organisation-pba': {
          formValues: {},
          loading: false,
          loaded: true,
          init: false,
          meta: {
            groups: [
              {
                inputButton: {
                  label: {
                    text: 'PBA number (optional)',
                    classes: 'govuk-label--m'
                  },
                  control: 'PBANumber1',
                  type: 'inputButton',
                  validators: [
                    'pbaNumberPattern',
                    'pbaNumberMaxLength',
                    'pbaNumberMinLength'
                  ],
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
              },
              {
                inputButton: {
                  label: {
                    text: 'PBA number (optional)',
                    classes: 'govuk-label--m'
                  },
                  control: 'PBANumber2',
                  type: 'inputButton',
                  validators: [
                    'pbaNumberPattern',
                    'pbaNumberMaxLength',
                    'pbaNumberMinLength'
                  ],
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
              },
              {
                inputButton: {
                  label: {
                    text: 'PBA number (optional)',
                    classes: 'govuk-label--m'
                  },
                  control: 'PBANumber3',
                  type: 'inputButton',
                  validators: [
                    'pbaNumberPattern',
                    'pbaNumberMaxLength',
                    'pbaNumberMinLength'
                  ],
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
              },
              {
                button: {
                  control: 'addAnotherPBANumber',
                  value: 'Add another PBA number',
                  type: 'button',
                  classes: 'hmcts-button--secondary  hmcts-add-another__add-button',
                  onEvent: 'addAnotherPBANumber'
                }
              },
              {
                button: {
                  control: 'createButton',
                  value: 'Continue',
                  type: 'submit',
                  classes: '',
                  onEvent: 'continue'
                }
              }
            ]
          }
        }
      };
      const anInitialState = { ...initialState, pages };
      const state = reducer(anInitialState, action);
      expect(state.pages['organisation-pba'].meta.groups.length).toEqual(4);
      expect(state.pages['organisation-pba'].meta.groups[1].inputButton.control).toBe('PBANumber3');
    });
  });

  describe('SAVE_FORM_DATA action', () => {
    it('should remove last input button element from page groups', () => {
      const payload = {
        value: {
          PBANumber1: 'PBA1111111',
          PBANumber2: 'PBA3333333',
          addAnotherPBANumber: 'Add another PBA number',
          createButton: 'Continue'
        },
        pageId: 'organisation-pba'
      };
      const action = new SaveFormData(payload);
      const pages = {
        'organisation-pba': {
          formValues: {},
          loading: false,
          loaded: true,
          init: false,
          meta: {
            groups: [
              {
                inputButton: {
                  label: {
                    text: 'PBA number (optional)',
                    classes: 'govuk-label--m'
                  },
                  control: 'PBANumber1',
                  type: 'inputButton',
                  validators: [
                    'pbaNumberPattern',
                    'pbaNumberMaxLength',
                    'pbaNumberMinLength'
                  ],
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
              },
              {
                inputButton: {
                  label: {
                    text: 'PBA number (optional)',
                    classes: 'govuk-label--m'
                  },
                  control: 'PBANumber2',
                  type: 'inputButton',
                  validators: [
                    'pbaNumberPattern',
                    'pbaNumberMaxLength',
                    'pbaNumberMinLength'
                  ],
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
              },
              {
                button: {
                  control: 'addAnotherPBANumber',
                  value: 'Add another PBA number',
                  type: 'button',
                  classes: 'hmcts-button--secondary  hmcts-add-another__add-button',
                  onEvent: 'addAnotherPBANumber'
                }
              },
              {
                button: {
                  control: 'createButton',
                  value: 'Continue',
                  type: 'submit',
                  classes: '',
                  onEvent: 'continue'
                }
              }
            ]
          }
        }
      };
      const anInitialState = { ...initialState, pages };
      const state = reducer(anInitialState, action);
      expect(state.pages['organisation-pba'].init).toBe(false);
      expect(state.pagesValues.hasOwnProperty('PBANumber1')).toBeTruthy();
      expect(state.pagesValues.hasOwnProperty('PBANumber2')).toBeTruthy();
    });
  });
});
