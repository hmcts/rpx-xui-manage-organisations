export class DummyAppInsights implements Microsoft.ApplicationInsights.IAppInsights {
    public config: Microsoft.ApplicationInsights.IConfig;  public context: Microsoft.ApplicationInsights.ITelemetryContext;
    public queue: (() => void)[];
    public startTrackPage(name?: string) {
      throw new Error('Method not implemented.');
    }
    public stopTrackPage(name?: string, url?: string, properties?: { [name: string]: string; }, measurements?: { [name: string]: number; }) {
      throw new Error('Method not implemented.');
    }
    public trackPageView(name?: string, url?: string, properties?: { [name: string]: string; }, measurements?: { [name: string]: number; },
                  duration?: number) {
      throw new Error('Method not implemented.');
    }
    public startTrackEvent(name: string) {
      throw new Error('Method not implemented.');
    }
    public stopTrackEvent(name: string, properties?: { [name: string]: string; }, measurements?: { [name: string]: number; }) {
      throw new Error('Method not implemented.');
    }
    public trackEvent(name: string, properties?: { [name: string]: string; }, measurements?: { [name: string]: number; }) {
      throw new Error('Method not implemented.');
    }
    public trackDependency(id: string, method: string, absoluteUrl: string, pathName: string, totalTime: number, success: boolean,
                    resultCode: number, properties?: { [name: string]: string; }, measurements?: { [name: string]: number; }) {
      throw new Error('Method not implemented.');
    }
    public trackException(exception: Error, handledAt?: string, properties?: { [name: string]: string; },
                   measurements?: { [name: string]: number; }, severityLevel?: AI.SeverityLevel) {
      throw new Error('Method not implemented.');
    }
    public trackMetric(name: string, average: number, sampleCount?: number, min?: number, max?: number, properties?: { [name: string]: string; }) {
      throw new Error('Method not implemented.');
    }
    public trackTrace(message: string, properties?: { [name: string]: string; }, severityLevel?: AI.SeverityLevel) {
      throw new Error('Method not implemented.');
    }
    public flush() {
      throw new Error('Method not implemented.');
    }
    public setAuthenticatedUserContext(authenticatedUserId: string, accountId?: string, storeInCookie?: boolean) {
      throw new Error('Method not implemented.');
    }
    public clearAuthenticatedUserContext() {
      throw new Error('Method not implemented.');
    }
    public downloadAndSetup?(config: Microsoft.ApplicationInsights.IConfig) {
      throw new Error('Method not implemented.');
    }
    public _onerror(message: string, url: string, lineNumber: number, columnNumber: number, error: Error) {
      throw new Error('Method not implemented.');
    }
  }
