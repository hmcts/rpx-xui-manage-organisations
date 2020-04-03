'use strict';

let CreateOrganisationObjects = require('../pageObjects/createOrganisationObjects');
const { defineSupportCode } = require('cucumber');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
const { config } = require('../../config/common.conf.js');
const approveOrganizationService = require('../pageObjects/approveOrganizationService');
const mailinatorService = require('../pageObjects/mailinatorService');

const EC = protractor.ExpectedConditions;


defineSupportCode(function ({ Given, When, Then }) {
    let createOrganisationObject = new CreateOrganisationObjects();

    Given('I create test read write organisation', async function () {

        if (global.testorgStatus >= 1){
            return;
        }
        global.TestOrg_rw_name = "AUTOTEST_RW_" + Date.now();
        global.testorg_rw_superuser_email = "autotest_user" + Date.now() + '@mailinator.com'

        await browser.get(config.config.baseUrl + '/register-org/register');
        await createOrganisationObject.createOrganisation(global.TestOrg_rw_name, global.testorg_rw_superuser_email);

        global.testorgStatus = "1";
    });

    Given('I approve test read write  organisation', { timeout: 300 * 1000 }, async function () {
        if (global.testorgStatus >= 2) {
            return;
        }
        await approveOrganizationService.init();
        try{
            await approveOrganizationService.approveOrg(global.TestOrg_rw_name);
            global.testorgStatus = "2";
            await approveOrganizationService.destroy();
        }
        catch(err){
            this.attach("Error occured Approving organisation");
            await approveOrganizationService.destroy();
            throw err;
        }
    });

    When("I activate test read write approved organisation super user", { timeout: 300 * 1000 }, async function () {
        if (global.testorgStatus >= 3) {
            return;
        }
        await mailinatorService.init();
        mailinatorService.setLogger((message, isScreenshot) => logger(this, message, isScreenshot));
        await mailinatorService.openRegistrationEmailForUser(global.testorg_rw_superuser_email);
        await mailinatorService.completeUserRegistrationFromEmail();;
        await mailinatorService.destroy();
        global.testorgStatus = "3";
    });

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