import { Component, OnDestroy, OnInit } from '@angular/core';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { SharedCase } from '@hmcts/rpx-xui-common-lib';
import { UserDetails } from '@hmcts/rpx-xui-common-lib';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { initAll } from 'govuk-frontend';
import { Observable, Subject, takeUntil } from 'rxjs';
import { getRouterState, RouterStateUrl } from '../../../app/store/reducers';
import * as fromCasesFeature from '../../store';
import { LoadShareCases, LoadUserFromOrgForCase } from '../../store/actions';
import * as fromCaseList from '../../store/reducers';

@Component({
  selector: 'app-exui-case-share',
  templateUrl: './case-share.component.html',
  styleUrls: ['./case-share.component.scss'],
  standalone: false
})
export class CaseShareComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public routerState$: Observable<RouterReducerState<RouterStateUrl>>;
  public init: boolean;
  public pageType: string;
  public shareCases$: Observable<SharedCase[]>;
  public shareCases: SharedCase[];
  public orgUsers$: Observable<UserDetails[]>;
  public removeUserFromCaseToggleOn$: Observable<boolean>;
  public backLink: string;
  public fnTitle: string;
  public title: string;
  public confirmLink: string;
  public addUserLabel: string;
  public showRemoveUsers: boolean = false;

  constructor(
    public store: Store<fromCaseList.CaaCasesState>,
    public featureToggleService: FeatureToggleService
  ) {}

  public ngOnInit(): void {
    this.routerState$ = this.store.pipe(select(getRouterState));
    this.routerState$.pipe(takeUntil(this.destroy$)).subscribe((router) => {
      this.init = router.state.queryParams.init;
      this.pageType = router.state.queryParams.pageType;
      const cameFromAcceptCases = router.state.queryParams.caseAccept;
      const url = router.state.url.substring(0, router.state.url.indexOf('/', 1));
      if (cameFromAcceptCases) {
        this.backLink = '/cases/accept-cases';
      } else {
        this.backLink = '/cases';
      }
      if (cameFromAcceptCases) {
        this.confirmLink = `${url}/case-share-confirm/new-cases`;
      } else {
        this.confirmLink = `${url}/case-share-confirm/${this.pageType}`;
      }

      switch (this.pageType) {
        case 'unassigned-cases':
          this.fnTitle = 'Share a case';
          this.title = 'Add recipient';
          this.addUserLabel = 'Enter email address';
          this.showRemoveUsers = false;
          break;
        case 'assigned-cases':
          this.fnTitle = 'Manage case sharing';
          this.title = 'Manage shared access to a case';
          this.addUserLabel = 'Add people to share access to the selected cases';
          this.showRemoveUsers = true;
          break;
      }

      this.shareCases$ = this.store.pipe(select(fromCasesFeature.getShareCaseListState));
      this.shareCases$.pipe(takeUntil(this.destroy$)).subscribe((shareCases) => this.shareCases = shareCases);
    });

    this.orgUsers$ = this.store.pipe(select(fromCasesFeature.getOrganisationUsersState));
    this.orgUsers$.pipe(takeUntil(this.destroy$)).subscribe();

    if (this.init) {
      this.store.dispatch(new LoadShareCases(this.shareCases));
      this.store.dispatch(new LoadUserFromOrgForCase());
    }

    this.removeUserFromCaseToggleOn$ = this.featureToggleService.getValue('remove-user-from-case-mo', false);
    this.removeUserFromCaseToggleOn$.pipe(takeUntil(this.destroy$)).subscribe();

    setTimeout(() => initAll(), 1000);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public deselect($event): void {
    this.store.dispatch(new fromCasesFeature.DeleteAShareCase($event));
  }

  public synchronizeStore($event): void {
    this.store.dispatch(new fromCasesFeature.SynchronizeStateToStoreCases($event));
  }
}
