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
    });

});
