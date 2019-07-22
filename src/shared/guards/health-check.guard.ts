import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import { HealthCheckService } from '../services/health-check.service';


@Injectable()
export class HealthCheckGuard implements CanActivate {
    constructor(
        private healthCheck: HealthCheckService
    ) {
    }

    canActivate() {
        return this.checkStore().pipe(
            switchMap(() => of(true)),
            catchError(() => of(false))
        );
    }

    checkStore(): Observable<boolean> {
        // let result = true;
        // this.store.pipe(select(fromRoot.getRouterUrl),
        //     tap(path => {
        //         const healthCheckStatus = this.healthCheck.doHealthCheck(path);
        //         if (!healthCheckStatus) {
        //             result = false;
        //             this.store.dispatch(new fromRoot.Go({ path: ['/not-found'] }));
        //         }
        //     }),
        //     take(1)
        // );
        // return of(result);
        return this.healthCheck.doHealthCheck();
    }
}

