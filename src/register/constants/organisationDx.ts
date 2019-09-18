export const organisationDx = {
  formValues: {},
  meta: {
    idPrefix: 'tbc',
    name: 'organisation-dx',
    header: 'What\'s the DX reference for your main office?',
    formGroupValidators: [],
    validationHeaderErrorMessages: [
      {
        validationLevel: 'formControl',
        controlId: 'DXnumber',
        text: 'Enter valid DX number.',
        href: '/register/organisation-name',
      },
      {
        validationLevel: 'formControl',
        controlId: 'DXexchange',
        text: 'Enter valid DX exchange.',
        href: '/register/organisation-name',
      }
    ],
    groups: [
      {
        input: {
          label: {
            text: 'DX number',
            classes: 'govuk-label--m',
          },
          hint: {
            text: 'This can be up to 13 characters (including letters and numbers). For example 931NR. You don\'t need to include \'DX\'.',
            classes: 'govuk-hint'
          },
          control: 'DXnumber',
          validators: ['dxNumberMaxLength'],
          validationError: {
            value: 'Enter valid DX number',
            controlId: 'DXnumber',
          },
          classes: 'govuk-!-width-two-thirds',
        },
      },
      {
        input: {
          label: {
            text: 'DX exchange',
            classes: 'govuk-label--m',
          },
          hint: {
            text: 'This can be up to 20 characters (including letters, numbers and symbols). For example: HAYES (MIDDLESEX).',
            classes: 'govuk-hint'
          },
          control: 'DXexchange',
          validators: ['dxExchangeMaxLength'],
          validationError: {
            value: 'Enter valid DX exchange',
            controlId: 'DXexchange',
          },
          classes: 'govuk-!-width-two-thirds',
        },
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
