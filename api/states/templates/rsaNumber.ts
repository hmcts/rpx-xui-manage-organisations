export default {
    idPrefix: 'tbc',
    name: 'sra_number',
    header: "SRA number",
    formGroupValidators: [],
    validationHeaderErrorMessages: [
        {
            validationLevel: 'formControl',
            controlId: 'sra_number',
            text: 'Enter SRA number',
            href: '/register/rsa-number',
        },
    ],
    groups: [
        {
            hiddenInput: {
                control: 'nextUrl',
                value: 'check',
            },
        },
        {
            input: {
                validators: ['required'],
                validationError: {
                    value: 'Enter RSA number',
                    controlId: 'sra_number',
                },
                control: 'sra_number',
                classes: '',
            },
        },
        {
            hiddenInput: {
                control: 'nextUrl',
                value: 'check',
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
