export const sraNumber = {
  formValues: {},
  meta: {
    idPrefix: 'tbc',
    name: 'sraNumber',
    header: 'Enter your organisation Solicitors Regulation Authority (SRA) ID',
    formGroupValidators: [],
    validationHeaderErrorMessages: [
      {
        validationLevel: 'formControl',
        controlId: 'sraNumber',
        text: 'Enter your organisation SRA ID',
        href: '/register/sra-number',
      },
    ],
    groups: [
      {
        hiddenInput: {
          control: 'pageId',
          value: 'check',
        },
      },
      {
        input: {
          label: {
            text: 'Enter your organisation SRA ID',
            classes: 'govuk-label--m govuk-visually-hidden'
          },
          validators: ['required'],
          validationError: {
            value: 'Enter your organisation SRA ID',
            controlId: 'sraNumber',
          },
          control: 'sraNumber',
          classes: '',
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
