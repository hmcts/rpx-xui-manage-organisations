import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as fromRoot from '../../app/store';
import { select, Store } from '@ngrx/store';
import * as fromAuthStore from '../../user-profile/store/index';
import { UserModel } from 'src/user-profile/models/user.model';


@Injectable()
export class UserRoleGuard implements CanActivate {

    constructor(private readonly store: Store<fromAuthStore.AuthState>) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        const role = route.data.role as string;

        return this.checkRole(role).pipe(
            switchMap((response: boolean) => {
                if (!response) {
                    this.redirectToRoot();
                }

                return of(response);
            }),
            catchError(() => {
                this.redirectToRoot();
                return of(false);
            })
        );
    }

    checkRole(role: string): Observable<boolean> {
        return this.store.pipe(select(fromAuthStore.getUser)).pipe(
            map((user: UserModel) => {
                const result = user.roles.indexOf(role) !== -1;

                return result;
            })
        );
    }

    redirectToRoot(): void {
        this.store.dispatch(new fromRoot.Go({ path: ['/'] }));
    }
}
