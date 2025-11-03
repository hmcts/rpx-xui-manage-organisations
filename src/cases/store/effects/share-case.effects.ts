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

  public addShareCases$ = createEffect(() =>
    this.actions$.pipe(
      ofType(shareCaseActions.ADD_SHARE_CASES),
      map((action: shareCaseActions.AddShareCases) => action.payload),
      map((newCases) => {
        return new shareCaseActions.AddShareCaseGo({
          path: this.getPathFromCaseConfig(newCases.caaPageType, newCases.group_access),
          sharedCases: newCases.sharedCases,
          caaPageType: newCases.caaPageType,
          caseTypeId: newCases.caseTypeId
        });
      })
    )
  );

  public navigateToAddShareCase$ = createEffect(() =>
    this.actions$.pipe(
      ofType(shareCaseActions.ADD_SHARE_CASES_GO),
      map((action: shareCaseActions.AddShareCaseGo) => action.payload),
      tap(({ path, query: queryParams, extras, sharedCases, caaPageType, caseTypeId }) => {
        const thatSharedCases = sharedCases;
        const currentPageType = caaPageType === CaaCasesPageType.UnassignedCases ? CaaCasesPageType.UnassignedCases : CaaCasesPageType.AssignedCases;
        queryParams = { init: true, pageType: currentPageType };
        if (caseTypeId) {
          queryParams = { ...queryParams, caseTypeId };
        }
        return this.router.navigate(path, { queryParams, ...extras }).then(() => {
          this.store.dispatch(new shareCaseActions.NavigateToShareCases(thatSharedCases));
        });
      })
    ),
  { dispatch: false }
  );

  public loadShareCases$ = createEffect(() =>
    this.actions$.pipe(
      ofType(shareCaseActions.LOAD_SHARE_CASES),
      map((action: shareCaseActions.LoadShareCases) => action.payload),
      switchMap((payload) => {
        this.payload = payload;
        return this.caseShareService.getShareCases(payload).pipe(
          map((response) => new shareCaseActions.LoadShareCasesSuccess(response)),
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

  public assignUsersToCases$ = createEffect(() =>
    this.actions$.pipe(
      ofType(shareCaseActions.ASSIGN_USERS_TO_CASE),
      map((action: shareCaseActions.AssignUsersToCase) => action),
      switchMap((action) => {
        const payload = action.payload;
        this.payload = payload;
        const newCaseSessionStorage = JSON.parse(sessionStorage.getItem('newCases'));
        if (action.pageType === CaaCasesPageType.NewCases && newCaseSessionStorage?.assignCases === 'notAssigning') {
          return this.caseShareService.acceptCaseWithoutAssignment(payload, action.orgIdentifier).pipe(
            map((response) => new shareCaseActions.AssignUsersToCaseSuccess(response)),
            catchError(() => of(new fromRoot.Go({ path: ['/service-down'] })))
          );
        }
        return this.caseShareService.assignUsersWithCases(payload).pipe(
          map((response) => new shareCaseActions.AssignUsersToCaseSuccess(response)),
          catchError(() => of(new fromRoot.Go({ path: ['/service-down'] })))
        );
      })
    )
  );

  public getPathFromCaseConfig(caaCasesPageType: string, groupAccess?: boolean, newCases?: boolean) {
    console.log(newCases);
    if (groupAccess && caaCasesPageType === CaaCasesPageType.NewCases) {
      return [`${this.router.url}/accept-cases`];
    }
    return [`${this.router.url}/case-share`];
  }
}
