import { Component, OnInit } from '@angular/core';
import { SharedCase } from '@hmcts/rpx-xui-common-lib/lib/models/case-share.model';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getRouterState, RouterStateUrl } from '../../../app/store/reducers';
import * as fromCasesFeature from '../../store';
import * as fromCaseList from '../../store/reducers';

@Component({
  selector: 'app-exui-case-share-confirm',
  templateUrl: './case-share-confirm.component.html',
  styleUrls: ['./case-share-confirm.component.scss']
})
export class CaseShareConfirmComponent implements OnInit {

  public routerState$: Observable<RouterReducerState<RouterStateUrl>>;
  public shareCases$: Observable<SharedCase[]>;
  public shareCases: SharedCase[];
  public fnTitle: string;
  public backLink: string;
  public changeLink: string;
  public completeLink: string;

  constructor(public store: Store<fromCaseList.CaaCasesState>) {}

  public ngOnInit(): void {
    this.routerState$ = this.store.pipe(select(getRouterState));
    this.routerState$.subscribe(router => {
      // Set backLink and fnTitle depending on whether navigation
      // is via the Unassigned Cases or Assigned Cases page
      const url = router.state.url.substring(0, router.state.url.indexOf('/', 1));
      // Set backLink only if the URL is either "/unassigned-cases" or "/assigned-cases"
      if (url === '/unassigned-cases' || url === '/assigned-cases') {
        this.backLink = `${url}`;
      }
      if (url === '/unassigned-cases') {
        this.fnTitle = 'Share a case';
        this.changeLink = '/unassigned-cases/case-share';
        this.completeLink = '/unassigned-cases/case-share-complete';
      } else if (url === '/assigned-cases') {
        this.fnTitle = 'Manage case sharing';
        this.changeLink = '/assigned-cases/case-share';
        this.completeLink = '/assigned-cases/case-share-complete';
      }
    });
    this.shareCases$ = this.store.pipe(select(fromCasesFeature.getShareCaseListState));
    this.shareCases$.subscribe(shareCases => {
      this.shareCases = shareCases;
    });
  }

}
