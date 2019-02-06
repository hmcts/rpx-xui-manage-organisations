export default {
    "idPrefix": "tbc",
    "name": "organisation-name",
    "header": "What's the name of your organisation?",
    "formGroupValidators": [],
    "groups": [
      {
        input: {
          label: {
            text: '',
            classes: 'govuk-label--m'
          },
          control: 'orgName',
          classes: '',
        },
      },
      {
        "button": {
          "control": "createButton",
          "value": "Continue",
          "type": "submit",
          "classes": "",
          "onEvent": "continue",
        }
      }
    ]
  }