export const organisationName = {
  formValues: {},
  meta: {
    idPrefix: 'tbc',
    name: 'organisation-name',
    header: 'What\'s the name of your organisation?',
    formGroupValidators: [],
    validationHeaderErrorMessages: [
      {
        validationLevel: 'formControl',
        controlId: 'orgName',
        text: 'Enter Organisation name',
        href: '/register/organisation-name'
      }
    ],
    groups: [
      {
        id: 'orgName',
        input: {
          label: {
            text: 'what is the name of your organisation',
            classes: 'govuk-label--m govuk-visually-hidden'
          },
          validators: ['required'],
          validationError: {
            value: 'Enter Organisation Name',
            controlId: 'orgName'
          },
          control: 'orgName',
          classes: ''
        }
      },
      {
        id: 'createButtonOrgName',
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
