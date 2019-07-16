export class DummyAppInsights implements Microsoft.ApplicationInsights.IAppInsights {
    config: Microsoft.ApplicationInsights.IConfig;  context: Microsoft.ApplicationInsights.ITelemetryContext;
    queue: (() => void)[];
    startTrackPage(name?: string) {
      throw new Error('Method not implemented.');
    }
    stopTrackPage(name?: string, url?: string, properties?: { [name: string]: string; }, measurements?: { [name: string]: number; }) {
      throw new Error('Method not implemented.');
    }
    trackPageView(name?: string, url?: string, properties?: { [name: string]: string; }, measurements?: { [name: string]: number; },
                  duration?: number) {
      throw new Error('Method not implemented.');
    }
    startTrackEvent(name: string) {
      throw new Error('Method not implemented.');
    }
    stopTrackEvent(name: string, properties?: { [name: string]: string; }, measurements?: { [name: string]: number; }) {
      throw new Error('Method not implemented.');
    }
    trackEvent(name: string, properties?: { [name: string]: string; }, measurements?: { [name: string]: number; }) {
      throw new Error('Method not implemented.');
    }
    trackDependency(id: string, method: string, absoluteUrl: string, pathName: string, totalTime: number, success: boolean,
                    resultCode: number, properties?: { [name: string]: string; }, measurements?: { [name: string]: number; }) {
      throw new Error('Method not implemented.');
    }
    trackException(exception: Error, handledAt?: string, properties?: { [name: string]: string; },
                   measurements?: { [name: string]: number; }, severityLevel?: AI.SeverityLevel) {
      throw new Error('Method not implemented.');
    }
    trackMetric(name: string, average: number, sampleCount?: number, min?: number, max?: number, properties?: { [name: string]: string; }) {
      throw new Error('Method not implemented.');
    }
    trackTrace(message: string, properties?: { [name: string]: string; }, severityLevel?: AI.SeverityLevel) {
      throw new Error('Method not implemented.');
    }
    flush() {
      throw new Error('Method not implemented.');
    }
    setAuthenticatedUserContext(authenticatedUserId: string, accountId?: string, storeInCookie?: boolean) {
      throw new Error('Method not implemented.');
    }
    clearAuthenticatedUserContext() {
      throw new Error('Method not implemented.');
    }
    downloadAndSetup?(config: Microsoft.ApplicationInsights.IConfig) {
      throw new Error('Method not implemented.');
    }
    _onerror(message: string, url: string, lineNumber: number, columnNumber: number, error: Error) {
      throw new Error('Method not implemented.');
    }
  }