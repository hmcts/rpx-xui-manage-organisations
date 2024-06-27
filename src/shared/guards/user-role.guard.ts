import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserModel } from 'src/user-profile/models/user.model';
import * as fromRoot from '../../app/store';
import * as fromAuthStore from '../../user-profile/store/index';

@Injectable()
export class UserRoleGuard {
  constructor(private readonly store: Store<fromAuthStore.AuthState>) {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
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

  public checkRole(role: string): Observable<boolean> {
    return this.store.pipe(select(fromAuthStore.getUser)).pipe(
      map((user: UserModel) => {
        const result = user.roles.indexOf(role) !== -1;

        return result;
      })
    );
  }

  public redirectToRoot(): void {
    this.store.dispatch(new fromRoot.Go({ path: ['/'] }));
  }
}
