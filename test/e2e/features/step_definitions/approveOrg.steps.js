
const approveOrganizationService = require('../pageObjects/approveOrganizationService');

const mailinatorService = require('../pageObjects/mailinatorService');


var { defineSupportCode } = require('cucumber');


defineSupportCode(function ({ And, But, Given, Then, When }) {
 

    When("I approve organisation", { timeout: 300*1000 }, async function () {
        await approveOrganizationService.approveOrg(global.latestOrgCreated);;
    },);

    When("I activate approved organisation super user", { timeout: 600 * 1000 },async function () {
        mailinatorService.setLogger((message, isScreenshot) => logger(this, message, isScreenshot));
        await mailinatorService.openRegistrationEmailForUser(global.latestOrgSuperUser);
        await mailinatorService.completeUserRegistrationFromEmail();;
    })

});

function logger(world, message, isScreenshot) {
    if (isScreenshot) {
        world.attach(message, 'image/png');
        console.log('Screenshot attached');
    } else {
        world.attach(message);
        console.log(message);
    }

}