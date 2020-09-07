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
        controlId: 'PBAnumber1',
        text: 'Enter a valid PBA number',
      },
      {
        validationLevel: 'formControl',
        controlId: 'PBAnumber2',
        text: 'Enter a valid PBA number',
      },
    ],
    groups: [
      {
        input: {
          label: {
            text: 'PBA number 1 (optional)',
            classes: 'govuk-label--m',
          },
          control: 'PBAnumber1',
          validators: ['pbaNumberPattern', 'pbaNumberMaxLength', 'pbaNumberMinLength'],
          validationError: {
            value: 'Enter a valid PBA number',
            controlId: 'PBAnumber1',
          },
          classes: 'govuk-!-width-two-thirds',
        },
      },
      {
        input: {
          label: {
            text: 'PBA number 2 (optional)',
            classes: 'govuk-label--m',
          },
          control: 'PBAnumber2',
          validators: ['pbaNumberPattern', 'pbaNumberMaxLength', 'pbaNumberMinLength'],
          validationError: {
            value: 'Enter a valid PBA number',
            controlId: 'PBAnumber2',
          },
          classes: 'govuk-!-width-two-thirds',
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
