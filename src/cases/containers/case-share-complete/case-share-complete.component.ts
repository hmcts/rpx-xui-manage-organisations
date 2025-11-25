import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { SharedCase } from '@hmcts/rpx-xui-common-lib';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import * as organisationStore from '../../../organisation/store';
import * as fromCasesFeature from '../../store';
import * as fromCaseList from '../../store/reducers';
import { OrganisationDetails } from 'src/models';
import { CaaCasesPageType } from 'src/cases/models/caa-cases.enum';

@Component({
  selector: 'app-exui-case-share-complete',
  templateUrl: './case-share-complete.component.html',
  styleUrls: ['case-share-complete.component.scss'],
  standalone: false
})
export class CaseShareCompleteComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public shareCases$: Observable<SharedCase[]>;
  public shareCases: SharedCase[];
  public newShareCases$: Observable<SharedCase[]>;
  public newShareCases: SharedCase[];
  public shareCaseState$: Observable<fromCasesFeature.ShareCasesState>;
  public selectedOrganisation$: Observable<OrganisationDetails>;
  public pageType: string;
  public isLoading: boolean;
  public completeScreenMode: string;
  public removeUserFromCaseToggleOn$: Observable<boolean>;
  public confirmPageType: string;

  constructor(
    private readonly store: Store<fromCaseList.CaaCasesState>,
    private readonly organisationStore: Store<organisationStore.OrganisationState>,
    private readonly featureToggleService: FeatureToggleService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.pageType = this.route.snapshot.params.pageType;
  }

  public ngOnInit(): void {
    const newCasesSessionStorage = sessionStorage.getItem('newCases');
    if (newCasesSessionStorage) {
      const newCases = JSON.parse(newCasesSessionStorage);
      this.confirmPageType = newCases.assignCases;
      if (this.confirmPageType === 'assigning') {
        this.pageType = CaaCasesPageType.UnassignedCases;
      }
    }
    this.shareCaseState$ = this.store.pipe(select(fromCasesFeature.getCaseShareState));
    this.shareCaseState$.pipe(takeUntil(this.destroy$)).subscribe((state) => this.isLoading = state.loading);
    this.shareCases$ = this.store.pipe(select(fromCasesFeature.getShareCaseListState));
    this.shareCases$.pipe(takeUntil(this.destroy$)).subscribe((shareCases) => this.shareCases = shareCases);
    this.organisationStore.dispatch(new organisationStore.LoadOrganisation());
    this.selectedOrganisation$ = this.organisationStore.pipe(select(organisationStore.getOrganisationSel));
    // Use first() to ensure this only runs once
    this.selectedOrganisation$.pipe(
      first(),
      takeUntil(this.destroy$)
    ).subscribe((organisation) => {
      if (organisation) {
        const orgIdentifier = organisation?.organisationIdentifier;
        this.store.dispatch(new fromCasesFeature.AssignUsersToCase(this.shareCases, this.pageType, orgIdentifier));
        this.newShareCases$ = this.store.pipe(select(fromCasesFeature.getShareCaseListState));
        this.newShareCases$.pipe(takeUntil(this.destroy$)).subscribe((shareCases) => {
          if (this.pageType !== CaaCasesPageType.NewCases) {
            this.completeScreenMode = this.checkIfIncomplete(shareCases);
            this.newShareCases = shareCases;
          }
        });

        this.removeUserFromCaseToggleOn$ = this.featureToggleService.getValue('remove-user-from-case-mo', false);
        this.removeUserFromCaseToggleOn$.pipe(takeUntil(this.destroy$)).subscribe();

        this.completeScreenMode = 'COMPLETE';
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.completeScreenMode === 'COMPLETE') {
      this.store.dispatch(new fromCasesFeature.ResetCaseSelection());
    }
    sessionStorage.removeItem('newCases');
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
