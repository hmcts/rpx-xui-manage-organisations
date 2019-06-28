export default {
    idPrefix: 'tbc',
    name: 'organisation-name',
    header: "What's the name of your organisation?",
    formGroupValidators: [],
    'validationHeaderErrorMessages': [
      {
        validationLevel: 'formControl',
        controlId: 'orgName',
        text: 'Enter organisation name',
        href: '/register/organisation-name'
      }
    ],
    groups: [
      {
        input: {
          label: {
            text: '',
            classes: 'govuk-label--m'
          },
          validators: ['required'],
          validationError: {
            value: 'Enter Organisation Name',
            controlId: 'orgName'
          },
          control: 'orgName',
          classes: ''
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
}
