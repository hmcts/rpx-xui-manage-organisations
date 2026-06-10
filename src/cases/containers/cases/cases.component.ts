import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CaaCasesService } from 'src/cases/services';

import * as organisationStore from '../../../organisation/store';
import * as userStore from '../../../users/store';
import * as caaCasesStore from '../../store';
import { Store, select } from '@ngrx/store';
import { OrganisationDetails } from 'src/models/organisation.model';
import { BehaviorSubject, combineLatest, Observable, of, skip, Subject, take, takeUntil, timer } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorMessage } from 'src/shared/models/error-message.model';
import { LoaderService } from 'src/shared/modules/loader/services/loader.service';
import { User } from '@hmcts/rpx-xui-common-lib';
import { SelectedCaseFilter } from 'src/cases/models/selected-case-filter.model';
import { CaaCaseTypeNavigation, CaaCases, CaaCasesSessionState, CaaCasesSessionStateValue } from 'src/cases/models/caa-cases.model';
import { CaaCasesFilterType, CaaCasesPageType } from 'src/cases/models/caa-cases.enum';
import { HttpErrorResponse } from '@angular/common/http';
import * as converters from '../../converters/case-converter';
import { ENVIRONMENT_CONFIG, EnvironmentConfig } from '../../../models/environmentConfig.model';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.scss'],
  standalone: false
})
export class CasesComponent implements OnInit {
  // private caaCasesPageType = 'all-cases-filter'; // todo: this will be all cases since it's a merge of both assigned and unassigned cases
  private caaCasesPageType = CaaCasesPageType.UnassignedCases; // todo: this will be all cases since it's a merge of both assigned and unassigned cases

  public selectedOrganisation$: Observable<OrganisationDetails>;
  public selectedOrganisationUsers$: Observable<User[]>;
  public isPageLoading$: Observable<boolean>;
  public showCasesLoadingOverlay$: Observable<boolean>;

  public pageTitle = 'Cases';
  public showFilterSection = false;
  public errorMessages: ErrorMessage[] = [];
  public sessionStateValue: CaaCasesSessionStateValue;
  public sessionStateKey = 'casesPage';

  public selectedFilterType: CaaCasesFilterType = CaaCasesFilterType.UnassignedCases;
  public selectedFilterValue: string = null;
  public selectedCaseType: string;
  private readonly destroy$ = new Subject<void>();
  private hasLoadedCaseTypesForCurrentFilter = false;

  // for the results table
  public allCaseTypes: CaaCaseTypeNavigation[] = [];
  public currentPageNo: number = 1;
  public paginationPageSize: number = 25;
  public casesConfig: CaaCases;
  public cases: any; // can we type this?
  public casesError$: Observable<HttpErrorResponse>;
  public caseResultsTableShareButtonText: string = 'Share cases';
  public selectedCases: any[] = [];
  public orgIdentifier: string | null = null;
  public caseDataWithSupplementary: any[];
  public ogdUpdateRefreshUserEnabled: boolean = false;
  private readonly caseTypesLoaded$ = new BehaviorSubject<boolean>(false);
  private readonly casesLoaded$ = new BehaviorSubject<boolean>(false);

  public get casesWarningText(): string[] {
    if (this.caaCasesPageType === CaaCasesPageType.NewCases ||
      this.selectedFilterType === CaaCasesFilterType.NewCasesToAccept) {
      return [
        'The tabs below list all of your organisation\'s new cases which need to be accepted.',
        'You can accept cases by selecting \'Accept cases\'.'
      ];
    }

    if (this.caaCasesPageType === CaaCasesPageType.AssignedCases ||
      this.selectedFilterType === CaaCasesFilterType.AllAssignedCases ||
      this.selectedFilterType === CaaCasesFilterType.CasesAssignedToAUser) {
      return [
        'The tabs below list all of your organisation\'s cases which are assigned to users.',
        'You can manage case sharing by selecting \'Manage case sharing\'.'
      ];
    }

    const warningText = [
      'The tabs below list all of your organisation\'s cases which are not assigned to any users. You can assign cases to users by selecting \'Share Case\'.'
    ];

    if (this.ogdUpdateRefreshUserEnabled) {
      warningText.push('You do not need to assign cases to users if they have \'Access all cases in the organisation\' enabled for that case type.');
    }

    return warningText;
  }

  constructor(private readonly caaCasesStore: Store<caaCasesStore.CaaCasesState>,
    private readonly organisationStore: Store<organisationStore.OrganisationState>,
    private readonly userStore: Store<userStore.UserState>,
    private readonly router: Router,
    private readonly service: CaaCasesService,
    private readonly loaderService: LoaderService,
    private cdr: ChangeDetectorRef,
    @Inject(ENVIRONMENT_CONFIG) private readonly environmentConfig: EnvironmentConfig) {
  }

  public ngOnInit(): void {
    this.ogdUpdateRefreshUserEnabled = this.environmentConfig.ogdUpdateRefreshUserEnabled;
    console.log('OGD update refresh user enabled: ', this.ogdUpdateRefreshUserEnabled);
    this.loadOrganisationFromStore();

    this.caaCasesStore.pipe(
      select(caaCasesStore.getCaseDataWithSupplementary),
      takeUntil(this.destroy$)
    ).subscribe((items) => {
      this.caseDataWithSupplementary = items;
    });

    // Load users of selected organisation from store
    this.userStore.dispatch(new userStore.CheckUserListLoaded());
    this.selectedOrganisationUsers$ = this.userStore.pipe(select(userStore.getGetUserList));
    this.isPageLoading$ = combineLatest([
      this.userStore.pipe(select(userStore.getGetUserLoaded)),
      this.caseTypesLoaded$,
      this.casesLoaded$
    ]).pipe(
      map(([isUserListLoaded, isCaseTypesLoaded, isCasesLoaded]) => {
        return !isUserListLoaded || !isCaseTypesLoaded || !isCasesLoaded;
      })
    );
    this.showCasesLoadingOverlay$ = combineLatest([
      this.isPageLoading$,
      this.loaderService.loaderState.pipe(map((loaderState) => loaderState.show))
    ]).pipe(
      map(([isPageLoading, isGlobalLoaderShowing]) => isPageLoading && !isGlobalLoaderShowing),
      distinctUntilChanged(),
      switchMap((showOverlay) => showOverlay ? timer(300).pipe(map(() => true)) : of(false))
    );
    sessionStorage.removeItem('newCases');
    this.caaCasesStore.pipe(
      select(caaCasesStore.getAllCases),
      takeUntil(this.destroy$)
    ).subscribe((config: CaaCases) => {
      if (config) {
        this.casesConfig = config;
        this.casesLoaded$.next(true);
      }
    });

    this.caaCasesStore.pipe(
      select(caaCasesStore.getAllCaseData),
      takeUntil(this.destroy$)
    ).subscribe((items) => {
      if (items) {
        this.cases = items;
        if (this.selectedFilterType === CaaCasesFilterType.CaseReferenceNumber){
          this.checkShareButtonText();
        }
      }
    });
    // as this returns an [] as default first call and this could be possible for acutal load we should skip running
    // the code inside as to not double load when user gets to page
    this.caaCasesStore.pipe(
      select(caaCasesStore.getAllCaseTypes),
      skip(1),
      takeUntil(this.destroy$)
    ).subscribe((items) => {
      this.hasLoadedCaseTypesForCurrentFilter = true;
      this.allCaseTypes = items;
      if (this.allCaseTypes && this.caaCasesPageType === CaaCasesPageType.NewCases) {
        // if the casetype does not have a caseConfig or new_cases is false, then filter it out
        this.allCaseTypes = this.allCaseTypes.filter(
          (caseType) => caseType.caseConfig && caseType.caseConfig.new_cases
        );
      }
      if (this.allCaseTypes && this.allCaseTypes.length > 0) {
        this.selectedCaseType = this.allCaseTypes[0].text;
        this.casesLoaded$.next(false);
      } else {
        this.casesLoaded$.next(true);
      }
      this.caseTypesLoaded$.next(true);
    });
    this.populateFirstLoad();
  }

  private loadOrganisationFromStore(): void {
    this.selectedOrganisation$ = this.organisationStore.pipe(select(organisationStore.getOrganisationSel));

    this.selectedOrganisation$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((org) => {
      this.orgIdentifier = org?.organisationIdentifier;
    });

    this.selectedOrganisation$.pipe(
      take(1)
    ).subscribe((org) => {
      if (!org?.organisationIdentifier) {
        this.organisationStore.dispatch(new organisationStore.LoadOrganisation());
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public populateFirstLoad() {
    // Retrieve session state to check and pre-populate the previous state if any
    this.retrieveSessionState();
    // if session state is found, then filter component will emit filter values to avoid double query
    if (!this.sessionStateValue) {
      this.loadCaseTypes();
    }
  }

  /**
   * This will load all case types based on the selected filter type and value
   */
  public loadCaseTypes() {
    this.hasLoadedCaseTypesForCurrentFilter = false;
    this.caseTypesLoaded$.next(false);
    this.casesLoaded$.next(false);
    this.caaCasesStore.dispatch(new caaCasesStore.LoadCaseTypes({
      caaCasesPageType: this.caaCasesPageType,
      caaCasesFilterType: this.selectedFilterType,
      caaCasesFilterValue: this.selectedFilterValue
    }));
  }

  /**
   * This will load cases (i.e. unassigned or assigned) from the API with the selected filter type and value
   */
  public loadCaseData(){
    if (this.allCaseTypes && this.allCaseTypes.length > 0) {
      this.casesLoaded$.next(false);
      this.caaCasesStore.dispatch(new caaCasesStore.LoadCases({
        caseType: this.selectedCaseType,
        pageNo: this.currentPageNo,
        pageSize: this.paginationPageSize,
        caaCasesFilterType: this.selectedFilterType,
        caaCasesPage: this.caaCasesPageType,
        caaCasesFilterValue: this.selectedFilterValue
      }));
    }
  }

  public onTabChanged(tabName: string): void {
    this.selectedCaseType = tabName;
    this.resetPagination();
    this.loadCaseData();
    this.checkShareButtonText();
  }

  public getCaseType() {
    const caseType = this.selectedCaseType;
    let caseTypeConfig;
    for (const caseTypeItem of this.allCaseTypes) {
      if (caseTypeItem.text === caseType) {
        caseTypeConfig = caseTypeItem;
        break;
      }
    }
    console.log(caseTypeConfig);
    return caseTypeConfig;
  }

  public checkShareButtonText(): void {
    if (this.cases && this.allCaseTypes) {
      if (this.selectedFilterType === CaaCasesFilterType.CaseReferenceNumber) {
        const foundCase = this.caseDataWithSupplementary[0];
        console.log(foundCase);
        if (foundCase.supplementary_data?.new_case?.[this.orgIdentifier]) {
          this.caseResultsTableShareButtonText = 'Accept cases';
          this.caaCasesPageType = CaaCasesPageType.NewCases;
          this.selectedFilterType = CaaCasesFilterType.NewCasesToAccept;
        } else if (foundCase.supplementary_data?.orgs_assigned_users[this.orgIdentifier] > 0) {
          this.caseResultsTableShareButtonText = 'Manage case sharing';
          this.caaCasesPageType = CaaCasesPageType.AssignedCases;
        } else {
          this.caseResultsTableShareButtonText = 'Share Case';
          this.caaCasesPageType = CaaCasesPageType.UnassignedCases;
          this.selectedFilterType = CaaCasesFilterType.UnassignedCases;
        }
      }
      this.cdr.detectChanges();
    }
  }

  public onSelectedFilter(selectedFilter: SelectedCaseFilter): void {
    const nextPageType = this.getPageTypeForFilter(selectedFilter.filterType);
    const selectedFilterChanged = this.hasSelectedFilterChanged(selectedFilter, nextPageType);
    const filterAlreadyLoaded = this.isFilterAlreadyLoaded(selectedFilter, nextPageType);

    this.selectedFilterType = selectedFilter.filterType;
    this.selectedFilterValue = selectedFilter.filterValue;
    if (selectedFilterChanged) {
      this.resetPagination();
    }
    this.storeSessionState(selectedFilter);

    if (selectedFilter.filterType === CaaCasesFilterType.None) {
      this.removeSessionState(this.caaCasesPageType);
    } else {
      this.storeSessionState(selectedFilter);
    }
    if (this.selectedFilterType === CaaCasesFilterType.CaseReferenceNumber) {
      this.caseResultsTableShareButtonText = 'Accept cases';
    }
    if (selectedFilter.filterType === CaaCasesFilterType.CasesAssignedToAUser) {
      // dispatch action to load case by assignee name
      this.caseResultsTableShareButtonText = 'Manage cases';
      this.caaCasesPageType = CaaCasesPageType.AssignedCases;
    }
    if (selectedFilter.filterType === CaaCasesFilterType.AllAssignedCases) {
      // dispatch action to load all cases
      this.caseResultsTableShareButtonText = 'Manage case sharing';
      this.caaCasesPageType = CaaCasesPageType.AssignedCases;
    }
    if (selectedFilter.filterType === CaaCasesFilterType.NewCasesToAccept) {
      // dispatch action to load new cases to accept
      this.caseResultsTableShareButtonText = 'Accept cases';
      this.caaCasesPageType = CaaCasesPageType.NewCases;
    }
    if (selectedFilter.filterType === CaaCasesFilterType.UnassignedCases) {
      // dispatch action to load unassigned cases
      this.caseResultsTableShareButtonText = 'Share Case';
      this.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    }
    this.cdr.detectChanges();
    if (!filterAlreadyLoaded) {
      this.loadCaseTypes();
    }
  }

  private getPageTypeForFilter(filterType: CaaCasesFilterType): CaaCasesPageType {
    if (filterType === CaaCasesFilterType.CasesAssignedToAUser || filterType === CaaCasesFilterType.AllAssignedCases) {
      return CaaCasesPageType.AssignedCases;
    }
    if (filterType === CaaCasesFilterType.NewCasesToAccept) {
      return CaaCasesPageType.NewCases;
    }
    if (filterType === CaaCasesFilterType.UnassignedCases) {
      return CaaCasesPageType.UnassignedCases;
    }
    return this.caaCasesPageType;
  }

  private isFilterAlreadyLoaded(selectedFilter: SelectedCaseFilter, nextPageType: CaaCasesPageType): boolean {
    return this.hasLoadedCaseTypesForCurrentFilter &&
      this.selectedFilterType === selectedFilter.filterType &&
      this.selectedFilterValue === selectedFilter.filterValue &&
      this.caaCasesPageType === nextPageType;
  }

  private hasSelectedFilterChanged(selectedFilter: SelectedCaseFilter, nextPageType: CaaCasesPageType): boolean {
    return this.selectedFilterType !== selectedFilter.filterType ||
      this.selectedFilterValue !== selectedFilter.filterValue ||
      this.caaCasesPageType !== nextPageType;
  }

  private resetPagination(): void {
    this.currentPageNo = 1;
  }

  public onErrorMessages(errorMessages: ErrorMessage[]): void {
    this.errorMessages = errorMessages;
  }

  public toggleFilterSection(): void {
    this.showFilterSection = !this.showFilterSection;
  }

  public isAnyError(): boolean {
    return Array.isArray(this.errorMessages) && this.errorMessages.length > 0;
  }

  public removeSessionState(key: string): void {
    this.service.removeSessionState(key);
  }

  public retrieveSessionState(): void {
    this.sessionStateValue = this.service.retrieveSessionState(this.sessionStateKey);
    console.log(this.sessionStateValue);
    if (this.sessionStateValue) {
      this.toggleFilterSection();
    } else {
      //if there is no session state, set default values to avoid confusion on UI
      this.selectedFilterType = CaaCasesFilterType.UnassignedCases;
      this.selectedFilterValue = null;
      this.onSelectedFilter({
        filterType: this.selectedFilterType,
        filterValue: this.selectedFilterValue
      });
    }
  }

  public storeSessionState(selectedFilter: SelectedCaseFilter): void {
    const sessionStateToUpdate: CaaCasesSessionState = {
      key: this.sessionStateKey,
      value: {
        filterType: selectedFilter.filterType,
        caseReferenceNumber: selectedFilter.filterType === CaaCasesFilterType.CaseReferenceNumber ? selectedFilter.filterValue : null,
        assigneeName: selectedFilter.filterType === CaaCasesFilterType.CasesAssignedToAUser ? selectedFilter.filterValue : null
      }
    };
    this.sessionStateValue = sessionStateToUpdate.value;
    this.service.storeSessionState(sessionStateToUpdate);
  }

  public onCaseSelected(selectedCases: any[]): void {
    // do i need the line below? and remove the selector in ngOnInit
    // this.selectedUnassignedCases = selectedCases;
    this.caaCasesStore.dispatch(new caaCasesStore.SynchronizeStateToStoreCases(
      converters.toShareCaseConverter(selectedCases, CaaCasesPageType.AssignedCases)
    ));
    this.selectedCases = selectedCases;
  }

  public onPageChanged(pageNo: number): void {
    this.currentPageNo = pageNo;
    this.loadCaseData();
  }

  onShareButtonClicked($event: string) {
    let newCasesEnabled = false;
    let groupAccessEnabled = false;
    //match the caseType ($event) to any in the allCaseTypes
    this.allCaseTypes.forEach((caseType) => {
      const { text, caseConfig } = caseType;
      if (text === $event && caseConfig) {
        newCasesEnabled = caseConfig.new_cases;
        groupAccessEnabled = caseConfig.group_access;
      }
    });
    console.log(this.selectedCaseType, this.selectedFilterType, this.selectedCases, newCasesEnabled, groupAccessEnabled);
    // load cases types based on filter and value
    if (this.selectedFilterType === CaaCasesFilterType.CaseReferenceNumber) {
      // TODO: need to handle the `new_case` flag
      // if returning new case then go to add recipient page
      // else if returning non-new case then go to manage case assignments
      this.caaCasesStore.dispatch(new caaCasesStore.AddShareCases({
        sharedCases: converters.toShareCaseConverter(this.selectedCases, this.selectedCaseType),
        caaPageType: this.caaCasesPageType
      }));
    }
    if (this.selectedFilterType === CaaCasesFilterType.CasesAssignedToAUser) {
      // todo: go to manage case assignments
      this.caaCasesStore.dispatch(new caaCasesStore.AddShareCases({
        sharedCases: converters.toShareCaseConverter(this.selectedCases, this.selectedCaseType),
        caaPageType: this.caaCasesPageType
      }
      ));
    }
    if (this.selectedFilterType === CaaCasesFilterType.AllAssignedCases) {
      this.caaCasesStore.dispatch(new caaCasesStore.AddShareCases({
        sharedCases: converters.toShareCaseConverter(this.selectedCases, this.selectedCaseType),
        caaPageType: this.caaCasesPageType
      }
      ));
    }
    if (this.selectedFilterType === CaaCasesFilterType.NewCasesToAccept) {
      // dispatch action to load new cases to accept
      // if group_access is enabled then go to accept cases page
      // else go to add recipient
      this.caaCasesStore.dispatch(new caaCasesStore.AddShareCases({
        sharedCases: converters.toShareCaseConverter(this.selectedCases, this.selectedCaseType),
        caaPageType: this.caaCasesPageType,
        group_access: true,
        caseTypeId: this.selectedCaseType
      }
      ));
    }
    if (this.selectedFilterType === CaaCasesFilterType.UnassignedCases || this.selectedFilterType === 'none') {
      this.caaCasesStore.dispatch(new caaCasesStore.AddShareCases({
        sharedCases: converters.toShareCaseConverter(this.selectedCases, this.selectedCaseType),
        caaPageType: this.caaCasesPageType
      }));
    }
  }
}
