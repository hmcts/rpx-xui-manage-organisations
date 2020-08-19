import { Component, Input, OnInit } from '@angular/core';
import { SharedCase } from '@hmcts/rpx-xui-common-lib/lib/models/case-share.model';
import { UserDetails } from '@hmcts/rpx-xui-common-lib/lib/models/user-details.model';
import { select, Store } from '@ngrx/store';
import { initAll } from 'govuk-frontend';
import { Observable } from 'rxjs';
import * as fromUserProfile from '../../../user-profile/store';
import * as fromCasesFeature from '../../store';
import { LoadShareCase, LoadUserFromOrgForCase } from '../../store/actions';
import * as fromCaseList from '../../store/reducers';

@Component({
  selector: 'app-exui-case-share',
  templateUrl: './case-share.component.html',
  styleUrls: ['./case-share.component.scss']
})
export class CaseShareComponent implements OnInit {

  public shareCases$: Observable<SharedCase[]>;
  public shareCases: SharedCase[];
  public orgUsers$: Observable<UserDetails[]>;

  constructor(public store: Store<fromCaseList.UnassignedCasesState>) {

  }

  public ngOnInit() {
    this.shareCases$ = this.store.pipe(select(fromCasesFeature.getShareCaseListState));
    this.shareCases$.subscribe(shareCases => {
      this.shareCases = shareCases;
    });
    // call api to retrieve case assigned users
    this.store.dispatch(new LoadShareCase(this.shareCases));

    // Hard coded Org Id as this info will come later
    this.orgUsers$ = this.store.pipe(select(fromCasesFeature.getOrganisationUsersState));
    this.store.pipe(select(fromUserProfile.getUser)).subscribe(userProfile => {
      this.store.dispatch(new LoadUserFromOrgForCase(userProfile.email));
    });
    // initialize javascript for accordion component to enable open/close button
    setTimeout(() => initAll(), 1000);
  }

  public deselect($event) {
    this.store.dispatch(new fromCasesFeature.DeleteAShareCase($event));
  }

  public synchronizeStore($event) {
    this.store.dispatch(new fromCasesFeature.SynchronizeStateToStore($event));
  }

}
