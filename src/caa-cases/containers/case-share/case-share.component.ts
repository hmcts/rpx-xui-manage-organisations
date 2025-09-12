import { Component, OnInit } from '@angular/core';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { SharedCase } from '@hmcts/rpx-xui-common-lib/lib/models/case-share.model';
import { UserDetails } from '@hmcts/rpx-xui-common-lib/lib/models/user-details.model';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { initAll } from 'govuk-frontend';
import { Observable } from 'rxjs';
import { getRouterState, RouterStateUrl } from '../../../app/store/reducers';
import { CaaCasesPageType } from '../../models/caa-cases.enum';
import * as fromCasesFeature from '../../store';
import { LoadShareAssignedCases, LoadShareUnassignedCases, LoadUserFromOrgForCase } from '../../store/actions';
import * as fromCaseList from '../../store/reducers';

@Component({
  selector: 'app-exui-case-share',
  templateUrl: './case-share.component.html',
  styleUrls: ['./case-share.component.scss']
})
export class CaseShareComponent implements OnInit {
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
    this.routerState$.subscribe((router) => {
      console.log(router.state);
      this.init = router.state.queryParams.init;
      this.pageType = router.state.queryParams.pageType;
      // Set backLink, fnTitle, title, confirmLink, addUserLabel, and showRemoveUsers depending on whether navigation
      // is via the Unassigned Cases or Assigned Cases page
      const url = router.state.url.substring(0, router.state.url.indexOf('/', 1));
      // Set backLink and confirmLink only if the URL is either "/unassigned-cases" or "/assigned-cases"
      if (url === '/unassigned-cases' || url === '/assigned-cases') {
        this.backLink = `${url}`;
        this.confirmLink = `${url}/case-share-confirm/${this.pageType}`;
      }
      if (url === '/unassigned-cases') {
        this.fnTitle = 'Share a case';
        this.title = 'Add recipient';
        this.addUserLabel = 'Enter email address';
        this.showRemoveUsers = false;
      } else if (url === '/assigned-cases') {
        this.fnTitle = 'Manage case sharing';
        this.title = 'Manage shared access to a case';
        this.addUserLabel = 'Add people to share access to the selected cases';
        this.showRemoveUsers = true;
      }

      this.shareCases$ = this.pageType === CaaCasesPageType.UnassignedCases
        ? this.store.pipe(select(fromCasesFeature.getShareUnassignedCaseListState))
        : this.store.pipe(select(fromCasesFeature.getShareAssignedCaseListState));
      this.shareCases$.subscribe((shareCases) => this.shareCases = shareCases);
    });

    this.orgUsers$ = this.store.pipe(select(fromCasesFeature.getOrganisationUsersState));
    if (this.init) {
      // call api to retrieve case share users
      if (this.pageType === CaaCasesPageType.UnassignedCases) {
        this.store.dispatch(new LoadShareUnassignedCases(this.shareCases));
      } else {
        this.store.dispatch(new LoadShareAssignedCases(this.shareCases));
      }
      // call api to retrieve users in the same organisation
      this.store.dispatch(new LoadUserFromOrgForCase());
    }
    this.removeUserFromCaseToggleOn$ = this.featureToggleService.getValue('remove-user-from-case-mo', false);

    // initialize javascript for accordion component to enable open/close button
    setTimeout(() => initAll(), 1000);
  }

  public deselect($event): void {
    if (this.pageType === CaaCasesPageType.UnassignedCases) {
      this.store.dispatch(new fromCasesFeature.DeleteAShareUnassignedCase($event));
    } else {
      this.store.dispatch(new fromCasesFeature.DeleteAShareAssignedCase($event));
    }
  }

  public synchronizeStore($event): void {
    if (this.pageType === CaaCasesPageType.UnassignedCases) {
      this.store.dispatch(new fromCasesFeature.SynchronizeStateToStoreUnassignedCases($event));
    } else {
      this.store.dispatch(new fromCasesFeature.SynchronizeStateToStoreAssignedCases($event));
    }
  }
}
