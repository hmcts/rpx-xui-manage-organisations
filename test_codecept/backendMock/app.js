

const express = require('express');
var bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const minimist = require('minimist');
const fs = require('fs');
const axios = require('axios');
const http = axios.create({})
axios.defaults.headers.common['Content-Type'] = 'application/json'

const healthRoutes = require('./services/health/routes')

const sessionRoutes = require('./services/session/routes')
const refDataRoutes = require('./services/refData/routes')
const ccdRoutes = require('./services/ccd/routes')
const rdCommonDataRoutes = require('./services/rdCommondata/routes')
const acseAssignmentsRoutes = require('./services/caseAssignments/routes')
const userApiData = require('./services/userApiData');

const retrieveAccessTypesRoutes = require('./services/accessTypes/routes')
class MockApp {

    constructor() {
        this.logMessageCallback = null;
        this.logJSONCallback = null;
        this.routesLogFile = `${__dirname}/RUNTIME_ROUTES.txt`;
        this.uniqueRoutesCalled = new Set();
    }


    init(clientPortStart) {

    }


    logRequestDetails(req) {
        this.logMessage(`${req.method} : ${req.originalUrl}`);
        if (req.method === 'POST' || req.method === 'PUT') {
            this.logJSON(req.body);
        }
    }

    getCookieFromRequest(req, cookieName) {
        const cookie = req.cookies[cookieName];
        this.scenarios[cookie] = this.scenarios[cookie] ? this.scenarios[cookie] : "";
        return cookie;
    }

    async startServer() {

        const app = express();
        app.disable('etag');
        app.use(bodyParser.urlencoded({ extended: false }));

        app.use(bodyParser.json());
        app.use(cookieParser());
        app.use(express.json({ type: '*/*' }));

        app.use((req,res,next) => {
            // console.log(`${req.method} : ${req.url}`);
            const authToken = req.headers.authorization;
            if (authToken){
                const token = authToken.replace('Bearer ','')
                userApiData.logSessionRequest(token, req);

            }
            next();
        })

        app.use('/client', sessionRoutes)

        app.use('/health', healthRoutes)
        app.use('/refdata/external/v1', refDataRoutes)
        app.use('/refdata/commondata/lov', rdCommonDataRoutes )
        app.use('/ccd', ccdRoutes)
        app.use('/case-assignments', acseAssignmentsRoutes )

        app.use('/retrieve-access-types',retrieveAccessTypesRoutes )


        // await this.stopServer();
        this.server = await app.listen(8080);

        console.log("mock server started on port : " + 8080);
        // return "Mock started successfully"

    }

    async stopServer() {
        if (this.server) {
            await this.server.close();
            this.server = null;
            console.log("Mock server stopped");

        } else {
            console.log("Mock server is null or undefined");
        }
    }


}


const mockInstance = new MockApp();
module.exports = mockInstance;

const args = minimist(process.argv)
if (args.standalone) {
    // mockInstance.setServerPort(8080);
    mockInstance.init();
    // nodeAppMock.userDetails = nodeAppMock.getMockLoginUserWithidentifierAndRoles("IAC_CaseOfficer_R2", "caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor,case-allocator");
    // bookingsMockData.bookingResponse = [];
    // setUpcaseConfig();
    // getDLCaseConfig();
    // collectionDynamicListeventConfig()
    // createCustomCaseDetails();
    mockInstance.startServer()
}
