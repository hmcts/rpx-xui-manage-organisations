;


const assert = require('assert');

const MockApp = require('../../nodeMock/app');
const { browser } = require('protractor');
const BrowserUtil = require('../util/browserUtil');
const HeaderPage = require('../../e2e/features/pageObjects/headerPage');

const unassignedCasesPage = require('../../e2e/features/pageObjects/unassignedCasePage');


describe('Unasigned cases Page', function () {
    headerPage = new HeaderPage();


    beforeEach(async function (done) {
        MockApp.init();
        done();
    });
    afterEach(async function (done) {
        await MockApp.stopServer();
        done();
    });

    it('Unassigned cases For user with pui-caa role', async function () {
        await MockApp.startServer();
        await BrowserUtil.browserInitWithAuth();
        await BrowserUtil.waitForLD();
        let headerTabs = await headerPage.getHeaderTabs();
        expect(headerTabs.includes("Unassigned cases"), "Unassigned Cases tab should be dislayed with role pui-caa. " + JSON.stringify(headerTabs)).to.be.true;
    });
 
    it('Unassigned cases For user without pui-caa role', async function () {
        const userDetails = { "email": "test@mailinator.com", "orgId": "VRSFNPV", "roles": [  "pui-case-manager", "pui-finance-manager", "pui-organisation-manager", "pui-user-manager"], "sessionTimeout": { "idleModalDisplayTime": 10, "pattern": ".", "totalIdleTime": 20 }, "userId": "4510b778-6a9d-4c53-918a-c3f80bd7aadd" };
        MockApp.onGet('/api/user/details', (req, res) => {res.send(userDetails);});
        await MockApp.startServer();
        await BrowserUtil.browserInitWithAuth();
        await BrowserUtil.waitForLD();
        let headerTabs = await headerPage.getHeaderTabs(); 
        expect(headerTabs.includes("Unassigned cases"), "Unassigned Cases tab should not be dislayed without role pui-caa. " + JSON.stringify(headerTabs)).to.be.false;
    });


    // it('Unassigned cases when no cases returned', async function () {
    //     const UnassignedCases = [];
    //     MockApp.onGet('/api/unassignedcases', (req, res) => res.send(UnassignedCases));
    //     await MockApp.startServer();
    //     await BrowserUtil.browserInitWithAuth();
    //     await headerPage.clickHeaderTabWithtext("Unassigned cases");
    //     expect(await unassignedCasesPage.amOnPage(), "Not on Unassigned cases page").to.be.true;
    // });



});


