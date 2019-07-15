import { HttpClient } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { MonitoringService, IMonitoringService } from './monitoring.service';

describe('Monitoring service', () => {
    const mockedHttpClient = jasmine.createSpyObj(['mockedHttpClient', 'get']);
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: HttpClient, useValue: mockedHttpClient },
            ]
        });

        it('should be created', inject([MonitoringService], (service: IMonitoringService) => {
            expect(service).toBeTruthy();
        }));

        it('should be able to LogException', inject([MonitoringService], (service: IMonitoringService) => {
            expect(service).toBeTruthy();
            service.logException(new Error('Some ErrorMesssage'));
            expect(mockedHttpClient.get).toHaveBeenCalled();
        }));

        it('should be able to LogEvent', inject([MonitoringService], (service: IMonitoringService) => {
            expect(service).toBeTruthy();
            service.logEvent('name', [], []);
            expect(mockedHttpClient.get).toHaveBeenCalled();
        }));

        it('should be able to LogPageview', inject([MonitoringService], (service: IMonitoringService) => {
            expect(service).toBeTruthy();
            service.logPageView('name', null, [], [], 1);
            expect(mockedHttpClient.get).toHaveBeenCalled();
        }));
    });

});
