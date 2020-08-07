;

const AppActions = require('../helpers/applicationActions');
const PallyActions = require('../helpers/pallyActions');

const assert = require('assert');
const { pa11ytest, getResults } = require('../helpers/pa11yUtil');
const html = require('pa11y-reporter-html');

const { conf } = require('../config/config');

const MockApp = require('../../nodeMock/app');

describe('Pa11y tests', function () {
    beforeEach(function (done) {
        MockApp.init();
        done();
    });
    afterEach(async function (done) {
        await MockApp.stopServer();
        done();
    }); 

    it('Users page', async function () {
        await MockApp.startServer();
        const actions = [];
        actions.push(...PallyActions.navigateTourl(conf.baseUrl + 'users'));
        actions.push(...PallyActions.waitForPageWithCssLocator('app-prd-users-component'));
        await pa11ytest(this, actions);
    });

    it('Invite Users page', async function () {
        await MockApp.startServer();
        const actions = [];
        actions.push(...PallyActions.navigateTourl(conf.baseUrl + 'users/invite-user'));
        actions.push(...PallyActions.waitForPageWithCssLocator('app-prd-invite-user-component'));
        await pa11ytest(this, actions);
    });

    it('a11y test Invite user server error page', async function () {
        await MockApp.onPost('/api/inviteUser', (req, res) => {
            console.log("............... invite user error response");
            res.status(500).send({ error: 'server error occured' });
        });
        await MockApp.startServer();

        const actions = [];
        actions.push(...PallyActions.navigateTourl(conf.baseUrl + 'users/invite-user'));
        actions.push(...AppActions.fillAndSubmitInviteUsers('firstname', 'lastname', 'test@test.com'));
        actions.push(...PallyActions.waitForPageWithCssLocator('aapp-service-down'));
        const result = await pa11ytest(this, actions);
    });

    it('a11y test Invite user error page', async function () {
        await MockApp.startServer();

        const actions = [];
        actions.push(...PallyActions.navigateTourl(conf.baseUrl + 'users/invite-user'));
        actions.push(...AppActions.fillAndSubmitInviteUsers('firstname', 'lastname', 'dummyInvalid'));
        actions.push(...AppActions.waitForInviteUserError());
        await pa11ytest(this, actions);
    });

    it('a11y test Invite user Success page', async function () {
        await MockApp.startServer();

        const actions = [];
        actions.push(...PallyActions.navigateTourl(conf.baseUrl + 'users/invite-user'));
        actions.push(...AppActions.fillAndSubmitInviteUsers('firstname', 'lastname', 'test@test.com'));
        actions.push(...PallyActions.waitForPageWithCssLocator('.govuk-panel--confirmation'));
        const result = await pa11ytest(this, actions);
    });

});


