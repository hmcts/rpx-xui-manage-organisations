import { TestBed, inject } from '@angular/core/testing';
import { HealthCheckGuard } from './health-check.guard';
import { StoreModule } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { UserRoleGuard } from './user-role.guard';

class HttpClientMock {
    get() {
        return 'response';
    }
}

describe('UserRoleGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({})
            ],
            providers: [
                UserRoleGuard,
                { provide: HttpClient, useClass: HttpClientMock }
            ]
        });
    });

    it('should exist', inject([UserRoleGuard], (guard: UserRoleGuard) => {
        expect(guard).toBeTruthy();
    }));
});
