import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import * as fromRoot from '../../app/store';
import { Store, select } from '@ngrx/store';

@Injectable()
export class HealthCheckService {

    constructor(
        private http: HttpClient,
        private store: Store<fromRoot.State>,
    ) { }

    doHealthCheck(): Observable<boolean> {
        const healthState: boolean = true;
        let result: { healthState } = { healthState };
        let path = '';

        this.store.pipe(select(fromRoot.getRouterUrl)).subscribe(value => {
            path = value;
        });

        if (path !== '') {
            this.http.get('/api/healthCheck?path=' + encodeURIComponent(path)).subscribe((value: { healthState }) => {
                result = value;
            });
        }


        return of(result.healthState);
    }

}
