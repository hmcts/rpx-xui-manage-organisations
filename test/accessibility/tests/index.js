;

const Actions = require('../helpers/actions');
const assert = require('assert');
const { pa11ytest, getResults } = require('../helpers/pa11yUtil');

const addContext = require('mochawesome/addContext');


describe('Pa11y tests', function () {
   
    it('oragnisation page',  () =>{
        const actions = [];
        actions.push(...Actions.idamLogin("sreekanth_su@mailinator.com","Monday01"));
        actions.push(...Actions.navigateTourl("https://manage-org.aat.platform.hmcts.net/organisation"));
        pa11ytest(actions).then(result => {
            addContext(result);
            assert(result.issues.length === 0, "Acceisbility issues reported");

        });
        
    });

    it('users page' ,() => {
        let actions = [];
       actions.push(...Actions.idamLogin("sreekanth_su@mailinator.com", "Monday01"));
        actions.push(...Actions.navigateTourl("https://manage-org.aat.platform.hmcts.net/users"));

         pa11ytest(actions).then(result => {
             addContext(result);
            assert(result.issues.length === 0, "Acceisbility issues reported");
             
         });
    })

    it('invite user page', () => {
        let actions = [];
        actions.push(...Actions.idamLogin("sreekanth_su@mailinator.com", "Monday01"));
        actions.push(...Actions.navigateTourl("https://manage-org.aat.platform.hmcts.net/users/invite-user"));

        pa11ytest(actions).then(result => {
            addContext(result);
            assert(result.issues.length === 0, "Acceisbility issues reported");
        });
    })

});


