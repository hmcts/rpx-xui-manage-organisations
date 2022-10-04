export const pbaNumber = {
  formValues: {},
  meta: {
    idPrefix: 'tbc',
    name: 'organisation-pba',
    header: 'What are the Payment by Account (PBA) numbers for your organisation?',
    formGroupValidators: [],
    validationHeaderErrorMessages: [
      {
        validationLevel: 'formControl',
        controlId: 'PBANumber1',
        text: 'Enter a valid PBA number',
      },
      {
        validationLevel: 'formControl',
        controlId: 'PBANumber2',
        text: 'Enter a valid PBA number',
      },
    ],
    groups: [
      {
        fieldset: [
          {
            legend: {
              text: 'What are the Payment by Account (PBA) numbers for your organisation?',
              classes: 'govuk-fieldset__legend--xl'
            }
          },
          {
            input: {
              label: {
                text: 'PBA number 1 (Optional)',
                classes: 'govuk-label--m',
              },
              control: 'PBANumber1',
              validators: ['pbaNumberPattern', 'pbaNumberMaxLength', 'pbaNumberMinLength'],
              validationError: {
                value: 'Enter a valid PBA number',
                controlId: 'PBANumber1',
              },
              classes: 'govuk-!-width-two-thirds',
            },
          },
          {
            input: {
              label: {
                text: 'PBA number 2 (Optional)',
                classes: 'govuk-label--m',
              },
              control: 'PBANumber2',
              validators: ['pbaNumberPattern', 'pbaNumberMaxLength', 'pbaNumberMinLength'],
              validationError: {
                value: 'Enter a valid PBA number',
                controlId: 'PBANumber2',
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
          }
        ]
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
