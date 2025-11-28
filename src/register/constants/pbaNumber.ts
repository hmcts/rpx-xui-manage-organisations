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
        text: 'You have entered this PBA number more than once'
      },
      {
        validatorFunc: 'invalidPBANumberCheck',
        validationErrorId: 'invalidPBANumberError',
        validationLevel: 'formGroup',
        controls: 'PBANumber',
        text: 'Enter a valid PBA number'
      }],
    validationHeaderErrorMessages: [
      {
        validationLevel: 'formControl',
        controlId: 'PBANumber1',
        text: 'Enter a valid PBA number'
      }
    ],
    groups: [
      {
        id: 'PBANumber1',
        inputButton: {
          label: {
            text: 'PBA number (Optional)',
            classes: 'govuk-label--m'
          },
          control: 'PBANumber1',
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
      },
      {
        id: 'addAnotherPBANumber',
        button: {
          control: 'addAnotherPBANumber',
          value: 'Add another PBA number',
          type: 'button',
          classes: 'hmcts-button--secondary  hmcts-add-another__add-button',
          onEvent: 'addAnotherPBANumber'
        }
      },
      {
        id: 'createButtonPBA',
        button: {
          control: 'createButton',
          value: 'Continue',
          type: 'submit',
          classes: '',
          onEvent: 'continue'
        }
      }
    ]
  },
  newRoute: null
};
