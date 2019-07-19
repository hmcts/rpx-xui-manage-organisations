import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import * as fromRoot from '../../app/store';
import { HealthCheckService } from '../services/health-check.service';


@Injectable()
export class HealthCheckGuard implements CanActivate {
    constructor(
        private store: Store<fromRoot.State>,
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
        let result = true;
        this.store.pipe(select(fromRoot.getRouterUrl),
            tap(url => {
                const healthCheckStatus = this.healthCheck.doHealthCheck(url);
                if (!healthCheckStatus) {
                    result = false;
                    this.store.dispatch(new fromRoot.Go({ path: ['/not-found'] }));
                }
            }),
            take(1)
        );
        return of(result);
    }
}

