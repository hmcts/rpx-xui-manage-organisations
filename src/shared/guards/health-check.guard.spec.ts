import { HttpClient } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { HealthCheckService } from '../services/health-check.service';
import { HealthCheckGuard } from './health-check.guard';

class HttpClientMock {

    public get() {
        return 'response';
    }
}

describe('HealthCheckGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({})
            ],
            providers: [
                HealthCheckGuard,
                HealthCheckService,
                { provide: HttpClient, useClass: HttpClientMock }
            ]
        });
    });

    it('should exist', inject([HealthCheckGuard], (guard: HealthCheckGuard) => {
        expect(guard).toBeTruthy();
    }));

});
