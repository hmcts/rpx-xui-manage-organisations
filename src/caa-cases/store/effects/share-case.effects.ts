import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as fromRoot from '../../../app/store/index';
import { CaaCasesPageType } from '../../models/caa-cases.enum';
import { CaseShareService } from '../../services';
import * as shareCaseActions from '../actions/share-case.action';
import * as shareCases from '../reducers/share-case.reducer';

@Injectable()
export class ShareCaseEffects {
  public payload: any;

  constructor(
    private readonly actions$: Actions,
    private readonly caseShareService: CaseShareService,
    private readonly router: Router,
    private readonly store: Store<shareCases.ShareCasesState>
  ) {
  }

  public addShareAssignedCases$ = createEffect(() =>
    this.actions$.pipe(
      ofType(shareCaseActions.ADD_SHARE_ASSIGNED_CASES),
      map((action: shareCaseActions.AddShareAssignedCases) => action.payload),
      map((newCases) => {
        return new shareCaseActions.AddShareAssignedCaseGo({
          path: [`${this.router.url}/case-share`],
          sharedCases: newCases.sharedCases
        });
      })
    )
  );

  public addShareUnassignedCases$ = createEffect(() =>
    this.actions$.pipe(
      ofType(shareCaseActions.ADD_SHARE_UNASSIGNED_CASES),
      map((action: shareCaseActions.AddShareUnassignedCases) => action.payload),
      map((newCases) => {
        return new shareCaseActions.AddShareUnassignedCaseGo({
          path: [`${this.router.url}/case-share`],
          sharedCases: newCases.sharedCases
        });
      })
    )
  );

  public navigateToAddShareAssignedCase$ = createEffect(() =>
    this.actions$.pipe(
      ofType(shareCaseActions.ADD_SHARE_ASSIGNED_CASES_GO),
      map((action: shareCaseActions.AddShareAssignedCaseGo) => action.payload),
      tap(({ path, query: queryParams, extras, sharedCases }) => {
        const thatSharedCases = sharedCases;
        queryParams = { init: true, pageType: CaaCasesPageType.AssignedCases };
        return this.router.navigate(path, { queryParams, ...extras }).then(() => {
          this.store.dispatch(new shareCaseActions.NavigateToShareAssignedCases(thatSharedCases));
        });
      })
    ),
  { dispatch: false }
  );

  public navigateToAddShareUnassignedCase$ = createEffect(() =>
    this.actions$.pipe(
      ofType(shareCaseActions.ADD_SHARE_UNASSIGNED_CASES_GO),
      map((action: shareCaseActions.AddShareUnassignedCaseGo) => action.payload),
      tap(({ path, query: queryParams, extras, sharedCases }) => {
        const thatSharedCases = sharedCases;
        queryParams = { init: true, pageType: CaaCasesPageType.UnassignedCases };
        return this.router.navigate(path, { queryParams, ...extras }).then(() => {
          this.store.dispatch(new shareCaseActions.NavigateToShareUnassignedCases(thatSharedCases));
        });
      })
    ),
  { dispatch: false }
  );

  public loadShareAssignedCases$ = createEffect(() =>
    this.actions$.pipe(
      ofType(shareCaseActions.LOAD_SHARE_ASSIGNED_CASES),
      map((action: shareCaseActions.LoadShareAssignedCases) => action.payload),
      switchMap((payload) => {
        this.payload = payload;
        return this.caseShareService.getShareCases(payload).pipe(
          map((response) => new shareCaseActions.LoadShareAssignedCasesSuccess(response)),
          catchError(() => of(new fromRoot.Go({ path: ['/service-down'] })))
        );
      })
    )
  );

  public loadShareUnassignedCases$ = createEffect(() =>
    this.actions$.pipe(
      ofType(shareCaseActions.LOAD_SHARE_UNASSIGNED_CASES),
      map((action: shareCaseActions.LoadShareUnassignedCases) => action.payload),
      switchMap((payload) => {
        this.payload = payload;
        return this.caseShareService.getShareCases(payload).pipe(
          map((response) => new shareCaseActions.LoadShareUnassignedCasesSuccess(response)),
          catchError(() => of(new fromRoot.Go({ path: ['/service-down'] })))
        );
      })
    )
  );

  public loadOrgUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(shareCaseActions.LOAD_USERS_FROM_ORG_FOR_CASE),
      switchMap(() => {
        return this.caseShareService.getUsersFromOrg().pipe(
          map((response) => new shareCaseActions.LoadUserFromOrgForCaseSuccess(response)),
          catchError(() => of(new fromRoot.Go({ path: ['/service-down'] })))
        );
      })
    )
  );

  public assignUsersToAssignedCases$ = createEffect(() =>
    this.actions$.pipe(
      ofType(shareCaseActions.ASSIGN_USERS_TO_ASSIGNED_CASE),
      map((action: shareCaseActions.AssignUsersToAssignedCase) => action.payload),
      switchMap((payload) => {
        this.payload = payload;
        return this.caseShareService.assignUsersWithCases(payload).pipe(
          map((response) => new shareCaseActions.AssignUsersToAssignedCaseSuccess(response)),
          catchError(() => of(new fromRoot.Go({ path: ['/service-down'] })))
        );
      })
    )
  );

  public assignUsersToUnassignedCases$ = createEffect(() =>
    this.actions$.pipe(
      ofType(shareCaseActions.ASSIGN_USERS_TO_UNASSIGNED_CASE),
      map((action: shareCaseActions.AssignUsersToUnassignedCase) => action.payload),
      switchMap((payload) => {
        this.payload = payload;
        return this.caseShareService.assignUsersWithCases(payload).pipe(
          map((response) => new shareCaseActions.AssignUsersToUnassignedCaseSuccess(response)),
          catchError(() => of(new fromRoot.Go({ path: ['/service-down'] })))
        );
      })
    )
  );
}
