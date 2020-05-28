const conf = {
    reportPath: "reports/tests/a11y/",
    appName:"Manage Organisation",
    baseUrl:'https://manage-org.aat.platform.hmcts.net/',
    params:{
        username:'sreekanth_su@mailinator.com',
        password:'Monday01'
    },
    authenticatedUrls: [
        'organisation',
        'users',
        'users/invite-user'
    ],
    unauthenticatedUrls: [
        'register-org/register',
        'register-org/register/organisation-name',
        'register-org/register/organisation-address',
        'register-org/register/organisation-pba',
        'register-org/register/organisation-have-dx',
        'register-org/register/haveSra',
        'register-org/register/name',
        'register-org/register/email-address',
        'register-org/register/check'
    ],

}

module.exports = {conf}

