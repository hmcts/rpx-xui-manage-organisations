;


const assert = require('assert');

const MockApp = require('../../nodeMock/app');
const { browser } = require('protractor');
const BrowserUtil = require('../util/browserUtil');
const HeaderPage = require('../../e2e/features/pageObjects/headerPage');

const OrganisationPage = require('../../e2e/features/pageObjects/viewOrganisationPage');
const UsersPage = require('../../e2e/features/pageObjects/viewUserPage');
const ViewOrganisationPage = require('../../e2e/features/pageObjects/viewOrganisationPage');
const unassignedCasesPage = require('../../e2e/features/pageObjects/unassignedCasePage');
 

describe('Header  Tabs', function () {
    headerPage = new HeaderPage();
    organisationPage = new OrganisationPage();
    usersPage = new UsersPage(); 

    beforeEach(async function (done) {
        MockApp.init();
        done();
    });
    afterEach(async function (done) {
        await MockApp.stopServer();
        done();
    });

    it('Organisation page', async function () {
        await MockApp.startServer();
        await BrowserUtil.browserInitWithAuth();
        await headerPage.clickHeaderTabWithtext("Organisation");
        expect(await organisationPage.amOnPage(),"Not on rganisation page").to.be.true;
        
    });

    it('users page', async function () {
        await MockApp.startServer();
        await BrowserUtil.browserInitWithAuth();
        await headerPage.clickHeaderTabWithtext("Users");
        expect(await usersPage.amOnPage(), "Not on Users page").to.be.true;

    });

    it('Unassigned cases', async function () {
        await MockApp.startServer();
        await BrowserUtil.browserInitWithAuth();
        await headerPage.clickHeaderTabWithtext("Unassigned cases");
        expect(await unassignedCasesPage.amOnPage(), "Not on Unassigned cases page").to.be.true;
    });


});


