
const AppActions = require('../helpers/applicationActions');
const PallyActions = require('../helpers/pallyActions');

const assert = require('assert');
const { pa11ytest, getResults, initBrowser } = require('../helpers/pa11yUtil');
const html = require('pa11y-reporter-html');

const { conf } = require('../config/config');

// const MockApp = require('../../nodeMock/app');

describe('Regsiter other orgs', function () {
    beforeEach(function (done) {
        // MockApp.init();
        done();
    });
    afterEach(async function (done) {
        // await MockApp.stopServer();
        done();
    });

    const registerOrgPages = [
        { route: 'register-org-new/register', cssLocator: 'app-before-you-start' },
        { route: 'register-org-new/company-house-details', cssLocator: 'app-company-house-details' },
        { route: 'register-org-new/organisation-type', cssLocator: 'app-organisation-type' },
        { route: 'register-org-new/regulatory-organisation-type', cssLocator: 'app-regulatory-organisation-type' },
        { route: 'register-org-new/document-exchange-reference', cssLocator: 'app-document-exchange-reference' },
        { route: 'register-org-new/document-exchange-reference-details', cssLocator: 'app-document-exchange-reference-details' },
        { route: 'register-org-new/organisation-services-access', cssLocator: 'app-organisation-services-access' },
        { route: 'register-org-new/payment-by-account', cssLocator: 'app-payment-by-account' },
        { route: 'register-org-new/payment-by-account-details', cssLocator: 'app-payment-by-account-details' },
        { route: 'register-org-new/registered-address/external', cssLocator: 'app-registered-address' },
        { route: 'register-org-new/individual-registered-with-regulator', cssLocator: 'app-individual-registered-with-regulator' },
        { route: 'register-org-new/individual-registered-with-regulator-details', cssLocator: 'app-individual-registered-with-regulator-details' },
        { route: 'register-org-new/registered-regulator', cssLocator: 'app-registered-regulator' },
        { route: 'register-org-new/contact-details', cssLocator: 'app-contact-details' },
        { route: 'register-org-new/registration-submitted', cssLocator: 'app-registration-submitted' },
        { route: 'register-org-new/check-your-answers', cssLocator: 'app-check-your-answers' }

    ]


    registerOrgPages.forEach((pageRoute) => {
        it('Route:/' + pageRoute.route, async function () {
            await initBrowser();
            const actions = [];
            actions.push(...PallyActions.navigateTourl(conf.baseUrl + pageRoute.route));
            actions.push(...PallyActions.waitForPageWithCssLocator(pageRoute.cssLocator));
            await pa11ytest(this, actions);
        });
    })


});

