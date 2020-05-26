;

const Actions = require('../helpers/actions');
const assert = require('assert');
const { pa11ytest, getResults } = require('../helpers/pa11yUtil');
const html = require('pa11y-reporter-html');

const addContext = require('mochawesome/addContext');


describe('Pa11y tests', function () {
    it('oragnisation page', async  function() {
        const actions = [];
        actions.push(...Actions.idamLogin("sreekanth_su@mailinator.com","Monday01"));
        actions.push(...Actions.navigateTourl("https://manage-org.aat.platform.hmcts.net/organisation"));
        
        
        await pa11ytest(this, actions); 
        
    }).timeout(30000);;

    it('users page' , async function() {

        let actions = [];
       actions.push(...Actions.idamLogin("sreekanth_su@mailinator.com", "Monday01"));
        actions.push(...Actions.navigateTourl("https://manage-org.aat.platform.hmcts.net/users"));

        await pa11ytest(this, actions);

    }).timeout(30000)

    it('invite user page',async function() {

        let actions = [];
        actions.push(...Actions.idamLogin("sreekanth_su@mailinator.com", "Monday01"));
        actions.push(...Actions.navigateTourl("https://manage-org.aat.platform.hmcts.net/users/invite-user"));

        await pa11ytest(this,actions);

    }).timeout(30000)

});


