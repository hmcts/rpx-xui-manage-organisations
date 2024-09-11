import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import * as RouterActions from '../actions/router.action';

@Injectable()
export class RouterEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly location: Location
  ) {}

  public navigate$ = createEffect(() => this.actions$.pipe(
    ofType(RouterActions.GO),
    map((action: RouterActions.Go) => action.payload),
    tap(({ path, query: queryParams, extras }) => {
      this.router.navigate(path, { queryParams, ...extras });
    })
  ), { dispatch: false });

  public navigateBack$ = createEffect(() => this.actions$.pipe(
    ofType(RouterActions.BACK),
    tap(() => this.location.back())
  ), { dispatch: false });

  public navigateForward$ = createEffect(() => this.actions$.pipe(
    ofType(RouterActions.FORWARD),
    tap(() => this.location.forward())
  ), { dispatch: false });
}
