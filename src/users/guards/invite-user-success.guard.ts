import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../store';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import * as fromRoot from '../../app/store';


@Injectable()
export class InviteUserSuccessGuard implements CanActivate {
    constructor(
        private store: Store<fromStore.UserState>
    ) {
    }

    canActivate() {
        return this.checkStore().pipe(
            switchMap(() => of(true)),
            catchError(() => of(false))
        );
    }

    checkStore(): Observable<boolean> {
        return this.store.pipe(select(fromStore.getInviteUserIsUserConfirmed),
            tap(isUserConfirmed => {
                if (!isUserConfirmed) {
                    this.store.dispatch(new fromRoot.Go({ path: ['users/invite-user'] }));
                }
            }),
            take(1)
        );
    }
}

