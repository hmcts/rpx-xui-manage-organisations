export default {
    idPrefix: 'tbc',
    name: 'email-address',
    header: "What's your email address?",
    formGroupValidators: [],
    validationHeaderErrorMessages: [
        {
            validationLevel: 'formControl',
            controlId: 'emailAddress',
            text: 'Enter email address',
            href: '/register/organisation-address',
        },
    ],
    groups: [
        {
            input: {
                validators: ['required', 'email'],
                validationError: {
                    value: 'Enter email address',
                    controlId: 'emailAddress',
                },
                control: 'emailAddress',
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
}
