import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedCase } from '@hmcts/rpx-xui-common-lib/lib/models/case-share.model';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CaaCasesPageType } from '../../models/caa-cases.enum';
import * as fromCasesFeature from '../../store';
import * as fromCaseList from '../../store/reducers';

@Component({
    selector: 'app-exui-case-share-confirm',
    templateUrl: './case-share-confirm.component.html',
    styleUrls: ['./case-share-confirm.component.scss'],
    standalone: false
})
export class CaseShareConfirmComponent implements OnInit {
  public shareCases$: Observable<SharedCase[]>;
  public shareCases: SharedCase[];
  public url: string;
  public pageType: string;
  public fnTitle: string;
  public backLink: string;
  public changeLink: string;
  public completeLink: string;

  constructor(private readonly store: Store<fromCaseList.CaaCasesState>,
              private readonly route: ActivatedRoute,
              private readonly router: Router) {
    this.url = this.router?.url;
    this.pageType = this.route.snapshot.params.pageType;
  }

  public ngOnInit(): void {
    // Set fnTitle, backLink, changeLink (these two links are the same as each other) and confirmLink depending on
    // whether navigation is via the Unassigned Cases or Assigned Cases page
    if (this.url.startsWith('/unassigned-cases')) {
      this.fnTitle = 'Share a case';
      this.backLink = '/unassigned-cases/case-share';
      this.changeLink = '/unassigned-cases/case-share';
      this.completeLink = `/unassigned-cases/case-share-complete/${this.pageType}`;
    } else {
      this.fnTitle = 'Manage case sharing';
      this.backLink = '/assigned-cases/case-share';
      this.changeLink = '/assigned-cases/case-share';
      this.completeLink = `/assigned-cases/case-share-complete/${this.pageType}`;
    }
    this.shareCases$ = this.pageType === CaaCasesPageType.UnassignedCases
      ? this.store.pipe(select(fromCasesFeature.getShareUnassignedCaseListState))
      : this.store.pipe(select(fromCasesFeature.getShareAssignedCaseListState));
    this.shareCases$.subscribe((shareCases) => this.shareCases = shareCases);
  }
}
