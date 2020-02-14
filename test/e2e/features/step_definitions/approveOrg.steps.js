
const approveOrganizationService = require('../pageObjects/approveOrganizationService');

const mailinatorService = require('../pageObjects/mailinatorService');


var { defineSupportCode } = require('cucumber');


defineSupportCode(function ({ And, But, Given, Then, When }) {
 

    When("I approve organisation", { timeout: 300*1000 }, async function () {
        await approveOrganizationService.approveOrg(global.latestOrgCreated);;
    },);

    When("I activate approved organisation super user", async function () {
        mailinatorService.setLogger((message) => logger(this, message));
        await mailinatorService.openRegistrationEmailForUser(global.latestOrgSuperUser);
        await mailinatorService.completeUserRegistrationFromEmail();;
    })

});

function logger(world, message) {
    world.attach(message);
    console.log(message);
}

