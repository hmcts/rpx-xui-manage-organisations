import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import * as fromRoot from '../../app/store';
import { Store, select } from '@ngrx/store';

@Injectable()
export class HealthCheckService implements OnDestroy {

    routeSubscription: Subscription;
    httpSubscription: Subscription;

    constructor(
        private http: HttpClient,
        private store: Store<fromRoot.State>,
    ) { }

    doHealthCheck(): Observable<boolean> {
        const healthState: boolean = false;
        let result: { healthState } = { healthState };
        let path = '';

        this.routeSubscription = this.store.pipe(select(fromRoot.getRouterUrl)).subscribe(value => {
            path = value;

            if (path !== '') {
                this.httpSubscription = this.http.get('/api/healthCheck?path=' + encodeURIComponent(path))
                    .subscribe((res: { healthState }) => {
                        result = res;
                        if (!result.healthState) {
                            this.store.dispatch(new fromRoot.Go({ path: ['/service-down'] }));
                        }
                        this.routeSubscription.unsubscribe();
                    });
            }
        });


        return of(result.healthState);
    }

    ngOnDestroy() {
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
        if (this.httpSubscription) {
            this.httpSubscription.unsubscribe();
        }
    }

}
