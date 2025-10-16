import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { SharedCase } from '@hmcts/rpx-xui-common-lib';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CaaCasesPageType } from '../../models/caa-cases.enum';
import * as fromCasesFeature from '../../store';
import * as fromCaseList from '../../store/reducers';

@Component({
    selector: 'app-exui-case-share-complete',
    templateUrl: './case-share-complete.component.html',
    styleUrls: ['case-share-complete.component.scss'],
    standalone: false
})
export class CaseShareCompleteComponent implements OnInit, OnDestroy {
  public shareCases$: Observable<SharedCase[]>;
  public shareCases: SharedCase[];
  public newShareCases$: Observable<SharedCase[]>;
  public newShareCases: SharedCase[];
  public shareCaseState$: Observable<fromCasesFeature.ShareCasesState>;
  public pageType: string;
  public isLoading: boolean;
  public completeScreenMode: string;
  public removeUserFromCaseToggleOn$: Observable<boolean>;
  public isFromAssignedCasesRoute: boolean = false;

  constructor(
    private readonly store: Store<fromCaseList.CaaCasesState>,
    private readonly featureToggleService: FeatureToggleService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.pageType = this.route.snapshot.params.pageType;
  }

  public ngOnInit(): void {
    this.shareCaseState$ = this.store.pipe(select(fromCasesFeature.getCaseShareState));
    this.shareCaseState$.subscribe((state) => this.isLoading = state.loading);

    this.shareCases$ = this.pageType === CaaCasesPageType.UnassignedCases
      ? this.store.pipe(select(fromCasesFeature.getShareUnassignedCaseListState))
      : this.store.pipe(select(fromCasesFeature.getShareAssignedCaseListState));
    this.shareCases$.subscribe((shareCases) => this.shareCases = shareCases);

    if (this.pageType === CaaCasesPageType.UnassignedCases) {
      this.store.dispatch(new fromCasesFeature.AssignUsersToUnassignedCase(this.shareCases));
      this.newShareCases$ = this.store.pipe(select(fromCasesFeature.getShareUnassignedCaseListState));
    } else {
      this.store.dispatch(new fromCasesFeature.AssignUsersToAssignedCase(this.shareCases));
      this.newShareCases$ = this.store.pipe(select(fromCasesFeature.getShareAssignedCaseListState));
    }

    this.newShareCases$.subscribe((shareCases) => {
      this.completeScreenMode = this.checkIfIncomplete(shareCases);
      this.newShareCases = shareCases;
    });

    this.removeUserFromCaseToggleOn$ = this.featureToggleService.getValue('remove-user-from-case-mo', false);
    this.isFromAssignedCasesRoute = this.router.url.startsWith('/assigned-cases');
  }

  public ngOnDestroy(): void {
    if (this.completeScreenMode === 'COMPLETE') {
      if (this.pageType === CaaCasesPageType.UnassignedCases) {
        this.store.dispatch(new fromCasesFeature.ResetUnassignedCaseSelection());
      } else {
        this.store.dispatch(new fromCasesFeature.ResetAssignedCaseSelection());
      }
    }
  }

  public checkIfIncomplete(shareCases: SharedCase[]): string {
    if (this.isLoading) {
      if (shareCases.some((aCase) => aCase.pendingShares && aCase.pendingShares.length > 0)
        || shareCases.some((aCase) => aCase.pendingUnshares && aCase.pendingUnshares.length > 0)) {
        return 'PENDING';
      }
      return 'COMPLETE';
    }
  }

  public showUserAccessBlock(aCase: SharedCase): boolean {
    if ((aCase.pendingShares && aCase.pendingShares.length > 0)
      || (aCase.pendingUnshares && aCase.pendingUnshares.length > 0)) {
      return true;
    }
    return false;
  }
}
