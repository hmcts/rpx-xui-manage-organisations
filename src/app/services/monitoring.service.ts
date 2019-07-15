import { Injectable } from '@angular/core';
import { AppInsights } from 'applicationinsights-js';
import { HttpClient } from '@angular/common/http';

export interface IMonitoringService {
  logPageView(name?: string, url?: string, properties?: any,
              measurements?: any, duration?: number);
  logEvent(name: string, properties?: any, measurements?: any);
  logException(exception: Error);
}

@Injectable()
export class MonitoringService implements IMonitoringService {

  private config: Microsoft.ApplicationInsights.IConfig;

  constructor(private http: HttpClient) {
  }

  logPageView(name?: string, url?: string, properties?: any,
              measurements?: any, duration?: number) {
    this.send(() => {
      AppInsights.trackPageView(name, url, properties, measurements, duration);
    });
  }

  logEvent(name: string, properties?: any, measurements?: any) {
    this.send(() => {
      AppInsights.trackEvent(name, properties, measurements);
    });
  }

  logException(exception: Error) {
    this.send(() => {
      AppInsights.trackException(exception);
    });
  }

  private send(func: () => any): void {
    if (this.config && this.config.instrumentationKey) {
      func();
    } else {
      this.http.get('/api/monitoring-tools').subscribe(it => {
        this.config = {
          instrumentationKey: it['key']
        };
        if (!AppInsights.config) {
          AppInsights.downloadAndSetup(this.config);
        }
        func();
      });
    }
  }
}
