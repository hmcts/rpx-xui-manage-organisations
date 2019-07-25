import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { HealthCheckService } from '../services/health-check.service';
import * as fromRoot from '../../app/store';
import { Store } from '@ngrx/store';


@Injectable()
export class HealthCheckGuard implements CanActivate {
    constructor(
        private healthCheck: HealthCheckService,
        private store: Store<fromRoot.State>,
    ) {
    }

    canActivate() {
        return this.checkStore().pipe(
            switchMap((res: any) => {
                const state = res.healthState;
                if (!state) {
                    this.redirectToShutter();
                }
                return of(res.healthState);
            }),
            catchError(() => {
                this.redirectToShutter();
                return of(false);
            })
        );
    }

    checkStore(): Observable<boolean> {
        return this.healthCheck.doHealthCheck();
    }

    redirectToShutter() {
        this.store.dispatch(new fromRoot.Go({ path: ['/service-down'] }));
    }
}

