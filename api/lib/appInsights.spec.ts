import * as applicationinsights from 'applicationinsights';
import * as chai from 'chai';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as configuration from '../configuration';
import { APP_INSIGHTS_CONNECTION_STRING } from '../configuration/references';
import * as appInsights from './appInsights';

chai.use(sinonChai);

describe('appInsights', () => {
  let hasConfigValueStub: sinon.SinonStub;

  beforeEach(() => {
    hasConfigValueStub = sinon.stub(configuration, 'hasConfigValue').withArgs(APP_INSIGHTS_CONNECTION_STRING).returns(true);
    sinon.stub(configuration, 'getConfigValue').withArgs(APP_INSIGHTS_CONNECTION_STRING).returns('app_insights_connection_string');
    sinon.spy(applicationinsights, 'setup');

    // Create spies for various parts of AppInsights configuration
    sinon.spy(applicationinsights.Configuration, 'setAutoCollectConsole');
    sinon.spy(applicationinsights.Configuration, 'setAutoCollectDependencies');
    sinon.spy(applicationinsights.Configuration, 'setAutoCollectExceptions');
    sinon.spy(applicationinsights.Configuration, 'setAutoCollectPerformance');
    sinon.spy(applicationinsights.Configuration, 'setAutoCollectRequests');
    sinon.spy(applicationinsights.Configuration, 'setAutoDependencyCorrelation');
    sinon.spy(applicationinsights.Configuration, 'setSendLiveMetrics');
    sinon.spy(applicationinsights.Configuration, 'setUseDiskRetryCaching');

    // Stub the start function
    sinon.stub(applicationinsights.Configuration, 'start');

    sinon.stub(applicationinsights.TelemetryClient.prototype, 'trackTrace');
    sinon.stub(applicationinsights.TelemetryClient.prototype, 'trackNodeHttpRequest');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should initialise AppInsights', () => {
    appInsights.initialiseAppInsights();
    expect(configuration.hasConfigValue).to.be.calledWith(APP_INSIGHTS_CONNECTION_STRING);
    expect(configuration.getConfigValue).to.be.calledWith(APP_INSIGHTS_CONNECTION_STRING);
    expect(applicationinsights.setup).to.be.calledWith('app_insights_connection_string');
    expect(applicationinsights.Configuration.setAutoCollectConsole).to.be.calledWith(true);
    expect(applicationinsights.Configuration.setAutoCollectDependencies).to.be.calledWith(true);
    expect(applicationinsights.Configuration.setAutoCollectExceptions).to.be.calledWith(true);
    expect(applicationinsights.Configuration.setAutoCollectPerformance).to.be.calledWith(true);
    expect(applicationinsights.Configuration.setAutoCollectRequests).to.be.calledWith(true);
    expect(applicationinsights.Configuration.setAutoDependencyCorrelation).to.be.calledWith(true);
    expect(applicationinsights.Configuration.setSendLiveMetrics).to.be.calledWith(true);
    expect(applicationinsights.Configuration.setUseDiskRetryCaching).to.be.calledWith(true);
    expect(applicationinsights.Configuration.start).to.be.called;
    expect(applicationinsights.TelemetryClient.prototype.trackTrace).to.be.calledWith({ message: 'App Insights activated' });
  });

  it('should not activate AppInsights if the key is not defined', () => {
    hasConfigValueStub.withArgs(APP_INSIGHTS_CONNECTION_STRING).returns(false);
    const consoleSpy = sinon.spy(console, 'error');
    appInsights.initialiseAppInsights();
    expect(configuration.hasConfigValue).to.be.calledWith(APP_INSIGHTS_CONNECTION_STRING);
    expect(configuration.getConfigValue).not.to.be.called;
    expect(applicationinsights.setup).not.to.be.called;
    expect(applicationinsights.Configuration.start).not.to.be.called;
    expect(applicationinsights.TelemetryClient.prototype.trackTrace).not.to.be.called;
    expect(consoleSpy).to.be.calledWith(`App Insights not activated: connection string "${APP_INSIGHTS_CONNECTION_STRING}" is not defined!`);
  });

  it('should reset the AppInsights client if it has been initialised', () => {
    appInsights.initialiseAppInsights();
    appInsights.resetAppInsights();
    expect(appInsights.client).to.be.null;
  });

  it('should not reset the AppInsights client if it has not been initialised', () => {
    appInsights.resetAppInsights();

    // The AppInsights client won't exist the second time around
    appInsights.resetAppInsights();

    expect(appInsights.client).to.not.exist;
  });
});
