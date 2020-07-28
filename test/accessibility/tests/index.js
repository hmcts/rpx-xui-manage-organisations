;

const AppActions = require('../helpers/applicationActions');
const PallyActions = require('../helpers/pallyActions');

const assert = require('assert');
const { pa11ytest, getResults } = require('../helpers/pa11yUtil');
const html = require('pa11y-reporter-html');

const {conf} = require('../config/config');

const MockApp = require('../../nodeMock/app');

describe('Pa11y tests', function () {

      afterEach(async function (done) {
        await MockApp.stopServer(); 
        done();
     });

    conf.unauthenticatedUrls.forEach(  (pageUrl) => {
        it('Registration page url ' + pageUrl, async function () {

            await MockApp.startServer();
            const actions = [];
            actions.push(...PallyActions.navigateTourl(conf.baseUrl + pageUrl));
            await pa11ytest(this, actions);
        });

    });

    conf.authenticatedUrls.forEach( (pageUrl) => {
        it('a11y test page url ' + pageUrl, async function () {
                        await MockApp.startServer();

            const actions = [];
            // actions.push(...AppActions.idamLogin(conf.params.username, conf.params.password));
            actions.push(...PallyActions.navigateTourl(conf.baseUrl + pageUrl));
            await pa11ytest(this, actions);
        });
        
    });

    it('a11y test Invite user success page', async function () {
        await MockApp.startServer();

        const actions = [];
        // actions.push(...AppActions.idamLogin(conf.params.username, conf.params.password));
        actions.push(...PallyActions.navigateTourl(conf.baseUrl + 'users/invite-user'));
        actions.push(...AppActions.fillAndSubmitInviteUsers('firstname', 'lastname', Date.now() +'test@testemail.com'));
        actions.push(...AppActions.waitForInviteuserSuccess());

        const result = await pa11ytest(this, actions);
    });

    it('a11y test Invite user error page', async function () {
        await MockApp.startServer();

        const actions = [];
        // actions.push(...AppActions.idamLogin(conf.params.username, conf.params.password));
        actions.push(...PallyActions.navigateTourl(conf.baseUrl + 'users/invite-user'));
        actions.push(...AppActions.fillAndSubmitInviteUsers('firstname', 'lastname', 'dummyInvalid'));
        actions.push(...AppActions.waitForInviteUserError());

         const result = await pa11ytest(this, actions);


    });

   

});


