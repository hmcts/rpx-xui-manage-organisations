import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedCase } from '@hmcts/rpx-xui-common-lib';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CaaCasesPageType } from '../../models/caa-cases.enum';
import * as fromCasesFeature from '../../store';
import * as fromCaseList from '../../store/reducers';

@Component({
  selector: 'app-exui-case-share-confirm',
  templateUrl: './case-share-confirm.component.html',
  styleUrls: ['./case-share-confirm.component.scss'],
  standalone: false
})
export class CaseShareConfirmComponent implements OnInit, OnDestroy {
  public shareCases$: Observable<SharedCase[]>;
  public shareCases: SharedCase[];
  public url: string;
  public pageType: string;
  public fnTitle: string;
  public backLink: string;
  public changeLink: string;
  public completeLink: string;
  public acceptCases: boolean = false;
  private readonly acceptLinks = '/cases/accept-cases';
  private readonly caseShareLinks = '/cases/case-share';
  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store<fromCaseList.CaaCasesState>,
              private readonly route: ActivatedRoute,
              private readonly router: Router) {
    this.url = this.router?.url;
    this.pageType = this.route.snapshot.params.pageType;
    this.acceptCases = this.route.snapshot.queryParams.caseAccept;
  }

  public ngOnInit(): void {
    this.fnTitle = 'Manage case assignments';
    this.backLink = this.acceptCases ? this.acceptLinks : this.caseShareLinks;
    this.changeLink = this.acceptCases ? this.acceptLinks : this.caseShareLinks;
    this.completeLink = `/cases/case-share-complete/${this.pageType}`;
    this.shareCases$ = this.store.pipe(select(fromCasesFeature.getShareCaseListState));
    this.shareCases$.pipe(takeUntil(this.destroy$)).subscribe((shareCases) => this.shareCases = shareCases);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
