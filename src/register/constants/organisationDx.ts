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
        text: 'Enter DX number.',
        href: '/register/organisation-name',
      },
      {
        validationLevel: 'formControl',
        controlId: 'DXexchange',
        text: 'Enter DX exchange.',
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
          control: 'DXnumber',
          validators: ['dxNumberMaxLength'],
          validationError: {
            value: 'This can be up to 13 characters (including letters and numbers). For example 931NR. You don\'t need to include \'DX\'',
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
          control: 'DXexchange',
          validators: ['dxExchangeMaxLength'],
          validationError: {
            value: 'This can be up to 20 characters (including letters, numbers and symbols). For example: HAYES (MIDDLESEX).',
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
