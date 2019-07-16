import { Injectable, Optional } from '@angular/core';
import { AppInsights } from 'applicationinsights-js';
import { HttpClient } from '@angular/common/http';

export interface IMonitoringService {
  logPageView(name?: string, url?: string, properties?: any,
              measurements?: any, duration?: number);
  logEvent(name: string, properties?: any, measurements?: any);
  logException(exception: Error);
}

export class MonitorConfig implements Microsoft.ApplicationInsights.IConfig {
  instrumentationKey?: string;
  endpointUrl?: string;
  emitLineDelimitedJson?: boolean;
  accountId?: string;
  sessionRenewalMs?: number;
  sessionExpirationMs?: number;
  maxBatchSizeInBytes?: number;
  maxBatchInterval?: number;
  enableDebug?: boolean;
  disableExceptionTracking?: boolean;
  disableTelemetry?: boolean;
  verboseLogging?: boolean;
  diagnosticLogInterval?: number;
  samplingPercentage?: number;
  autoTrackPageVisitTime?: boolean;
  disableAjaxTracking?: boolean;
  overridePageViewDuration?: boolean;
  maxAjaxCallsPerView?: number;
  disableDataLossAnalysis?: boolean;
  disableCorrelationHeaders?: boolean;
  correlationHeaderExcludedDomains?: string[];
  disableFlushOnBeforeUnload?: boolean;
  enableSessionStorageBuffer?: boolean;
  isCookieUseDisabled?: boolean;
  cookieDomain?: string;
  isRetryDisabled?: boolean;
  url?: string;
  isStorageUseDisabled?: boolean;
  isBeaconApiDisabled?: boolean;
  sdkExtension?: string;
  isBrowserLinkTrackingEnabled?: boolean;
  appId?: string;
  enableCorsCorrelation?: boolean;
}

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

@Injectable()
export class MonitoringService implements IMonitoringService {

  constructor(private http: HttpClient, @Optional() private config?: MonitorConfig,
              @Optional() private appInsights?: DummyAppInsights) {
                if (!appInsights) {
                appInsights = AppInsights;
              }
            }

  logPageView(name?: string, url?: string, properties?: any,
              measurements?: any, duration?: number) {
    this.send(() => {
      this.appInsights.trackPageView(name, url, properties, measurements, duration);
    });
  }

  logEvent(name: string, properties?: any, measurements?: any) {
    this.send(() => {
      this.appInsights.trackEvent(name, properties, measurements);
    });
  }

  logException(exception: Error) {
    this.send(() => {
      this.appInsights.trackException(exception);
    });
  }

  private send(func: () => any): void {
    console.log('config is ' + this.config.instrumentationKey);
    if (this.config && this.config.instrumentationKey) {
      func();
    } else {
      this.http.get('/api/monitoring-tools').subscribe(it => {
        this.config = {
          instrumentationKey: it['key']
        };
        if (!AppInsights.config) {
          this.appInsights.downloadAndSetup(this.config);
        }
        func();
      });
    }
  }
}
