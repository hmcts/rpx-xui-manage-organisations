import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { HealthCheckService } from '../services/health-check.service';


@Injectable()
export class HealthCheckGuard implements CanActivate {
    constructor(
        private healthCheck: HealthCheckService
    ) {
    }

    canActivate() {
        return this.checkStore().pipe(
            switchMap((res) => of(res)),
            catchError(() => of(false))
        );
    }

    checkStore(): Observable<boolean> {
        return this.healthCheck.doHealthCheck();
    }
}

