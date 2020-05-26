;

const AppActions = require('../helpers/applicationActions');
const PallyActions = require('../helpers/pallyActions');

const assert = require('assert');
const { pa11ytest, getResults } = require('../helpers/pa11yUtil');
const html = require('pa11y-reporter-html');

const {conf} = require('../config/config');

describe('Pa11y tests', function () {

    conf.unauthenticatedUrls.forEach(pageUrl => {
        it('Registration page url ' + pageUrl, async function () {
            const actions = [];
            actions.push(...PallyActions.navigateTourl(conf.baseUrl + pageUrl));
            await pa11ytest(this, actions);

        }).timeout(30000);;

    });

    conf.authenticatedUrls.forEach( pageUrl => {
        it('a11y test page url ' + pageUrl, async function () {
            const actions = [];
            actions.push(...AppActions.idamLogin(conf.params.username, conf.params.password));
            actions.push(...PallyActions.navigateTourl(conf.baseUrl + pageUrl));
            await pa11ytest(this, actions);

        }).timeout(30000);;
        
    });

    it('a11y test Invite user success page', async function () {
        const actions = [];
        actions.push(...AppActions.idamLogin(conf.params.username, conf.params.password));
        actions.push(...PallyActions.navigateTourl(conf.baseUrl + 'users/invite-user'));
        actions.push(...AppActions.fillAndSubmitInviteUsers('firstname', 'lastname', Date.now() +'test@testemail.com'));
        actions.push(...AppActions.waitForInviteuserSuccess());

        await pa11ytest(this, actions,60000);

    }).timeout(60000);

    it('a11y test Invite user error page', async function () {
        const actions = [];
        actions.push(...AppActions.idamLogin(conf.params.username, conf.params.password));
        actions.push(...PallyActions.navigateTourl(conf.baseUrl + 'users/invite-user'));
        actions.push(...AppActions.fillAndSubmitInviteUsers('firstname', 'lastname', 'dummyInvalid'));
        actions.push(...AppActions.waitForInviteUserError());

        await pa11ytest(this, actions);

    }).timeout(30000);

   

});


