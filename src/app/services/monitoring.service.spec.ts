import { HttpClient } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { MonitoringService, IMonitoringService, MonitorConfig } from './monitoring.service';
import { AppInsights } from 'applicationinsights-js';

describe('Monitoring service', () => {
    const mockedHttpClient = jasmine.createSpyObj(['mockedHttpClient', 'get']);
    const mockedAppInsights = jasmine.createSpyObj(['mockedAppInsights', 'downloadAndSetup', 'trackException', 'trackEvent',
    'trackPageView']);
    const mockedConfig = new MonitorConfig();
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: HttpClient, useValue: mockedHttpClient },
                { provide: AppInsights, useValue: mockedAppInsights },
                { provide: MonitorConfig, useValue: mockedConfig}
            ]
        });

        it('should be created', inject([MonitoringService], (service: IMonitoringService) => {
            expect(service).toBeTruthy();
        }));

        it('should be able to LogException and Should not call the http service', () => {
            const service = new MonitoringService(mockedHttpClient, mockedConfig);
            mockedConfig.instrumentationKey = 'somevalue';
            expect(service).toBeTruthy();
            service.logException(new Error('Some ErrorMesssage'));
            expect(mockedHttpClient.get).not.toHaveBeenCalled();
            expect(mockedAppInsights.downloadAndSetup).toHaveBeenCalled();
            expect(mockedAppInsights.trackException).toHaveBeenCalled();
        });

        it('should be able to LogException', () => {
            const service = new MonitoringService(mockedHttpClient, mockedConfig);
            expect(service).toBeTruthy();
            service.logException(new Error('Some ErrorMesssage'));
            expect(mockedHttpClient.get).toHaveBeenCalled();
            expect(mockedAppInsights.downloadAndSetup).toHaveBeenCalled();
            expect(mockedAppInsights.trackException).toHaveBeenCalled();
        });

        it('should be able to LogEvent', () => {
            const service = new MonitoringService(mockedHttpClient, mockedConfig);
            expect(service).toBeTruthy();
            service.logEvent('name', [], []);
            expect(mockedHttpClient.get).toHaveBeenCalled();
            expect(mockedAppInsights.downloadAndSetup).toHaveBeenCalled();
            expect(mockedAppInsights.trackEvent).toHaveBeenCalled();
        });

        it('should be able to LogPageview', () => {
            const service = new MonitoringService(mockedHttpClient, mockedConfig);
            expect(service).toBeTruthy();
            service.logPageView('name', null, [], [], 1);
            expect(mockedHttpClient.get).toHaveBeenCalled();
            expect(mockedAppInsights.downloadAndSetup).toHaveBeenCalled();
            expect(mockedAppInsights.trackPageView).toHaveBeenCalled();
        });
    });
});
