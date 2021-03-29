export const pbaNumber = {
  formValues: {},
  meta: {
    idPrefix: 'tbc',
    name: 'organisation-pba',
    header: 'What payment by account (PBA) numbers does your organisation have?',
    formGroupValidators: [
      {
        validatorFunc: 'duplicatedPBACheck',
        validationErrorId: 'duplicatedPBAError',
        validationLevel: 'formGroup',
        controls: 'PBANumber',
        text: 'You have entered this PBA number more than once',
      },
      {
        validatorFunc: 'invalidPBANumberCheck',
        validationErrorId: 'invalidPBANumberError',
        validationLevel: 'formGroup',
        controls: 'PBANumber',
        text: 'Enter a valid PBA number',
      }],
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
          validationErrors: [
            {
              validationErrorId: 'duplicatedPBAError',
              validationLevel: 'formControl',
              controls: 'PBANumber',
              text: 'You have entered this PBA number more than once',
            },
            {
              validationErrorId: 'invalidPBANumberError',
              validationLevel: 'formControl',
              controls: 'PBANumber',
              text: 'Enter a valid PBA number',
            }
          ],
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
          {
            componentDetails: {
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
