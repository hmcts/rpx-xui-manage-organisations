import { Component, OnInit } from '@angular/core';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { SharedCase } from '@hmcts/rpx-xui-common-lib/lib/models/case-share.model';
import { UserDetails } from '@hmcts/rpx-xui-common-lib/lib/models/user-details.model';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { initAll } from 'govuk-frontend';
import { Observable } from 'rxjs';

import { getRouterState, RouterStateUrl } from '../../../app/store/reducers';
import * as fromCasesFeature from '../../store';
import { LoadShareCase, LoadUserFromOrgForCase } from '../../store/actions';
import * as fromCaseList from '../../store/reducers';

@Component({
  selector: 'app-exui-case-share',
  templateUrl: './case-share.component.html',
  styleUrls: ['./case-share.component.scss']
})
export class CaseShareComponent implements OnInit {

  public routerState$: Observable<RouterReducerState<RouterStateUrl>>;
  public init: boolean;
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
    this.routerState$.subscribe(router => {
      // Set backLink, fnTitle, title, confirmLink, addUserLabel, and showRemoveUsers depending on whether navigation
      // is via the Unassigned Cases or Assigned Cases page
      const url = router.state.url.substring(0, router.state.url.indexOf('/', 1));
      // Set backLink and confirmLink only if the URL is either "/unassigned-cases" or "/assigned-cases"
      if (url === '/unassigned-cases' || url === '/assigned-cases') {
        this.backLink = `${url}`;
        this.confirmLink = `${url}/case-share-confirm`;
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
      this.init = router.state.queryParams.init;
    });
    this.shareCases$ = this.store.pipe(select(fromCasesFeature.getShareCaseListState));
    this.shareCases$.subscribe(shareCases => {
      this.shareCases = shareCases;
    });
    this.orgUsers$ = this.store.pipe(select(fromCasesFeature.getOrganisationUsersState));
    if (this.init) {
      // call api to retrieve case assigned users
      this.store.dispatch(new LoadShareCase(this.shareCases));
      // call api to retrieve users in the same organisation
      this.store.dispatch(new LoadUserFromOrgForCase());
    }
    this.removeUserFromCaseToggleOn$ = this.featureToggleService.getValue('remove-user-from-case-mo', false);

    // initialize javascript for accordion component to enable open/close button
    setTimeout(() => initAll(), 1000);
  }

  public deselect($event): void {
    this.store.dispatch(new fromCasesFeature.DeleteAShareCase($event));
  }

  public synchronizeStore($event): void {
    this.store.dispatch(new fromCasesFeature.SynchronizeStateToStore($event));
  }

}
