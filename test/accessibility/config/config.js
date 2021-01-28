const conf = {
    reportPath: "reports/tests/a11y/",
    appName:"Manage Organisation",
    baseUrl1:'https://manage-org.aat.platform.hmcts.net/',
    baseUrl:'http://localhost:4200/',
    failTestOna11yIssues: false,
    headless: true,
    params:{
        username:'sreekanth_su@mailinator.com',
        password:'Monday01'
    },
    authenticatedUrls: [
        'organisation',
        'users',
        'users/invite-user',
        'unassigned-cases',
        'unassigned-cases/case-share'
    ],
    unauthenticatedUrls: [
        'register-org/register',
        'register-org/register/organisation-name',
        'register-org/register/organisation-address',
        'register-org/register/organisation-pba',
        'register-org/register/organisation-have-dx',
        'register/organisation-dx',
        'register-org/register/haveSra',
        'register-org/register/sraNumber',
        'register-org/register/name',
        'register-org/register/email-address',
        'register-org/register/check'
    ],

}

module.exports = {conf}

