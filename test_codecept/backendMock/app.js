

const express = require('express');
var bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const minimist = require('minimist');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
axios.defaults.headers.common['Content-Type'] = 'application/json'

const healthRoutes = require('./services/health/routes')

const sessionRoutes = require('./services/session/routes')
const refDataRoutes = require('./services/refData/routes')
const ccdRoutes = require('./services/ccd/routes')
const rdCommonDataRoutes = require('./services/rdCommondata/routes')
const acseAssignmentsRoutes = require('./services/caseAssignments/routes')
const userApiData = require('./services/userApiData');

const tolerantJson = express.json({
  type: ['application/json'],   // only when Content-Type is JSON
  strict: false,
  verify: (req, res, buf) => {
    if (!buf.length) req.body = {}; // {} instead of empty buffer
  }
});

if (process.env.MOCK_ALREADY_RUNNING === 'true') {
  module.exports = {         // dummy stub with the same API
    startServer: () => Promise.resolve(),
    stopServer: () => Promise.resolve()
  };
  return;                    // skip the real implementation
}

class MockApp {

  constructor() {
    this.logMessageCallback = null;
    this.logJSONCallback = null;
    this.routesLogFile = `${__dirname}/RUNTIME_ROUTES.txt`;
    this.uniqueRoutesCalled = new Set();

    this.server = null;   // the live Server object
    this.starting = null;   // Promise while first worker is binding
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
    try {
      const probe = await new Promise((ok, fail) => {
        const s = require('net').createServer()
          .once('error', fail)      // EADDRINUSE if busy
          .once('listening', () => { s.close(); ok(); })
          .listen(8080, '::');
      });
    } catch (err) {
      if (err.code === 'EADDRINUSE') {
        console.log('[mock] 8080 already bound – assume primary running');
        return;
      }
      throw err;
    }

    if (this.server) return this.server;
    if (this.starting) return this.starting;
    const app = express();
    app.disable('etag');

    app.use(
      cors({
        origin: [/^http:\/\/localhost:(3000|8080)$/],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(cookieParser());
    app.use(tolerantJson);

    app.use((req, res, next) => {
      // console.log(`${req.method} : ${req.url}`);
      const authToken = req.headers.authorization;
      if (authToken) {
        const token = authToken.replace('Bearer ', '')
        userApiData.logSessionRequest(token, req);

      }
      next();
    })

    app.use('/client', sessionRoutes)

    app.use('/health', healthRoutes)
    app.use('/refdata/external/v1', refDataRoutes)
    app.use('/refdata/external/v2', refDataRoutes)
    app.use('/api/organisation/v1', refDataRoutes)
    app.use('/refdata/commondata/lov', rdCommonDataRoutes)
    app.use('/ccd', ccdRoutes)
    app.use('/case-assignments', acseAssignmentsRoutes)

    // ── serve the built UI from dist on :8080 ─────────────────────────────────
    const staticRoot = path.resolve(__dirname, '../../dist/rpx-xui-manage-organisations');

    // 1) static files (no index auto-serve)
    app.use(express.static(staticRoot, { index: false, cacheControl: false }));

    // 2) SPA fallback: anything not matched by API routes returns index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(staticRoot, 'index.html'));
    });

    console.log('mock server starting on :8080');
    this.starting = new Promise((resolve, reject) => {
      const srv = app.listen(8080, '::', () => {
        console.log('[mock] server listening on 8080');
        this.server = srv;   // ready for next calls
        this.starting = null;  // clear “starting” flag
        resolve(srv);
      });
      srv.on('error', (err) => {
        this.starting = null;
        reject(err);
      });
    });
    return this.starting;

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
  // nodeAppMock.userDetails = nodeAppMock.getMockLoginUserWithidentifierAndRoles("IAC_CaseOfficer_R2", "caseworker-ia,caseworker-ia-caseofficer,caseworker-ia-admofficer,task-supervisor,case-allocator");
  // bookingsMockData.bookingResponse = [];
  // setUpcaseConfig();
  // getDLCaseConfig();
  // collectionDynamicListeventConfig()
  // createCustomCaseDetails();
  mockInstance.startServer()
}
