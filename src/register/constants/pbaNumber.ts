export const pbaNumber = {
  formValues: {},
  meta: {
    idPrefix: 'tbc',
    name: 'organisation-pba',
    header: 'What\'s the Payment by Account (PBA) number for your organisation?',
    formGroupValidators: [],
    validationHeaderErrorMessages: [
      {
        validationLevel: 'formControl',
        controlId: 'PBANumber1',
        text: 'Enter a valid PBA number',
      },
    ],
    groups: [
      {
        inputButton: {
          label: {
            text: 'PBA number (optional)',
            classes: 'govuk-label--m',
          },
          control: 'PBANumber1',
          type: 'inputButton',
          validators: ['pbaNumberPattern', 'pbaNumberMaxLength', 'pbaNumberMinLength'],
          validationError: {
            value: 'Enter a valid PBA number',
            controlId: 'PBANumber1',
          },
          classes: 'govuk-width-input-button',
        },
      },
      {
        button: {
          control: 'addAnotherPBANumber',
          value: 'Add another PBA number',
          type: 'button',
          classes: 'hmcts-button--secondary  hmcts-add-another__add-button',
          onEvent: 'addAnotherPBANumber',
        },
      },
      {
        extension:
          { componentDetails: {
            title: 'Why add a PBA number?',
              text: 'Adding a PBA number for your organisation will allow you to view your:',
              ul: ['account balance', 'available credit', 'transactions'],
            }
          }
      },
      {
        button: {
          control: 'createButton',
          value: 'Continue',
          type: 'submit',
          classes: '',
          onEvent: 'continue',
        },
      },
    ],
  },
  newRoute: null
};
