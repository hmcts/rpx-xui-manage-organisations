import { Component, OnInit } from '@angular/core';
import { CaaCasesService } from 'src/cases/services';

import * as organisationStore from '../../../organisation/store';
import * as userStore from '../../../users/store';
import * as caaCasesStore from '../../store';
import { Store, select } from '@ngrx/store';
import { OrganisationDetails } from 'src/models/organisation.model';
import { Observable, take } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorMessage } from 'src/shared/models/error-message.model';
import { SubNavigation, User } from '@hmcts/rpx-xui-common-lib';
import { SelectedCaseFilter } from 'src/cases/models/selected-case-filter.model';
import { CaaCases, CaaCasesSessionState, CaaCasesSessionStateValue } from 'src/cases/models/caa-cases.model';
import { CaaCasesFilterType, CaaCasesPageType } from 'src/cases/models/caa-cases.enum';
import { HttpErrorResponse } from '@angular/common/http';
import * as converters from '../../converters/case-converter';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.scss']
})
export class CasesComponent implements OnInit {
  // private caaCasesPageType = 'all-cases-filter'; // todo: this will be all cases since it's a merge of both assigned and unassigned cases
  private caaCasesPageType = CaaCasesPageType.UnassignedCases; // todo: this will be all cases since it's a merge of both assigned and unassigned cases

  public selectedOrganisation$: Observable<OrganisationDetails>;
  public selectedOrganisationUsers$: Observable<User[]>;

  public pageTitle = 'Cases';
  public showFilterSection = false;
  public errorMessages: ErrorMessage[] = [];
  public sessionStateValue: CaaCasesSessionStateValue;
  public sessionStateKey = 'casesPage';

  public selectedFilterType: CaaCasesFilterType = CaaCasesFilterType.None;
  public selectedFilterValue: string = null;
  public selectedCaseType: string;

  // for the results table
  public allCaseTypes: SubNavigation[] = [];
  public currentPageNo: number = 1;
  public paginationPageSize: number = 25;
  public casesConfig: CaaCases;
  public cases: any; // can we type this?
  public casesError$: Observable<HttpErrorResponse>;
  public caseResultsTableShareButtonText: string = 'Share cases';
  private selectedCases: any[] = [];

  constructor(private readonly caaCasesStore: Store<caaCasesStore.CaaCasesState>,
    private readonly organisationStore: Store<organisationStore.OrganisationState>,
    private readonly userStore: Store<userStore.UserState>,
    private readonly router: Router,
    private readonly service: CaaCasesService) {
  }

  public ngOnInit(): void {
    console.log('oninit...');
    // Retrieve session state to check and pre-populate the previous state if any
    this.retrieveSessionState();
    // if session state is found, then filter component will emit filter values to avoid double query
    if (!this.sessionStateValue) {
      this.loadCaseTypes();
    }

    // Load selected organisation details from store
    this.organisationStore.dispatch(new organisationStore.LoadOrganisation());
    this.selectedOrganisation$ = this.organisationStore.pipe(select(organisationStore.getOrganisationSel));

    // Load users of selected organisation from store
    this.userStore.dispatch(new userStore.LoadAllUsersNoRoleData());
    this.selectedOrganisationUsers$ = this.userStore.pipe(select(userStore.getGetUserList));

    // TODO: clean this up to get all cases
    this.caaCasesStore.pipe(select(caaCasesStore.getAllUnassignedCases)).subscribe((config: CaaCases) => {
      if (config){
        this.casesConfig = config;
      }
    });
    this.caaCasesStore.pipe(select(caaCasesStore.getAllUnassignedCaseData)).subscribe((items) => {
      if (items){
        this.cases = items;
      }
    });
    this.caaCasesStore.pipe(select(caaCasesStore.getAllAssignedCases)).subscribe((config: CaaCases) => {
      if (config){
        this.casesConfig = config;
      }
    });
    this.caaCasesStore.pipe(select(caaCasesStore.getAllAssignedCaseData)).subscribe((items) => {
      if (items){
        this.cases = items;
      }
    });

    this.casesError$ = this.caaCasesStore.pipe(select(caaCasesStore.getAllUnassignedCasesError));
    this.casesError$ = this.caaCasesStore.pipe(select(caaCasesStore.getAllAssignedCasesError));
  }

  /**
   * This will load all case types based on the selected filter type and value
   */
  public loadCaseTypes() {
    this.caaCasesStore.dispatch(new caaCasesStore.LoadCaseTypes({
      caaCasesPageType: this.caaCasesPageType,
      caaCasesFilterType: this.selectedFilterType,
      caaCasesFilterValue: this.selectedFilterValue
    }));

    this.caaCasesStore.pipe(
      select(caaCasesStore.getAllCaseTypes),
      take(1)
    ).subscribe((items) => {
      console.log(items);
      this.allCaseTypes = items;
      if (this.allCaseTypes && this.allCaseTypes.length > 0) {
        this.selectedCaseType = this.allCaseTypes[0].text;
        this.loadCaseData();
      }
    });
  }

  /**
   * This will load cases (i.e. unassigned or assigned) from the API with the selected filter type and value
   */
  public loadCaseData(){
    if (this.allCaseTypes && this.allCaseTypes.length > 0) {
      if (this.caaCasesPageType === CaaCasesPageType.AssignedCases) {
        console.log('loadCaseData: loadAssignedCases');
        this.caaCasesStore.dispatch(new caaCasesStore.LoadAssignedCases({
          caseType: this.selectedCaseType,
          pageNo: this.currentPageNo,
          pageSize: this.paginationPageSize,
          caaCasesFilterType: this.selectedFilterType,
          caaCasesFilterValue: this.selectedFilterValue
        }));
      }
      if (this.caaCasesPageType === CaaCasesPageType.UnassignedCases){
        this.caaCasesStore.dispatch(new caaCasesStore.LoadUnassignedCases({
          caseType: this.selectedCaseType,
          pageNo: this.currentPageNo,
          pageSize: this.paginationPageSize,
          caaCasesFilterType: this.selectedFilterType,
          caaCasesFilterValue: this.selectedFilterValue
        }));
      }
    }
  }

  public onSelectedFilter(selectedFilter: SelectedCaseFilter): void {
    console.log('Selected filter:', selectedFilter);
    this.selectedFilterType = selectedFilter.filterType;
    this.selectedFilterValue = selectedFilter.filterValue;

    if (selectedFilter.filterType === CaaCasesFilterType.None) {
      this.removeSessionState(this.caaCasesPageType);
    } else {
      this.storeSessionState(selectedFilter);
    }

    // load cases types based on filter and value
    if (selectedFilter.filterType === CaaCasesFilterType.CaseReferenceNumber) {
      // dispatch action to load case by ref number
      this.caseResultsTableShareButtonText = 'Accept and assign cases';
    }
    if (selectedFilter.filterType === CaaCasesFilterType.CasesAssignedToAUser) {
      // dispatch action to load case by assignee name
      this.caaCasesPageType = CaaCasesPageType.AssignedCases;
      this.caseResultsTableShareButtonText = 'Manage cases';
    }
    if (selectedFilter.filterType === CaaCasesFilterType.AllAssignedCases) {
      // dispatch action to load all cases
      this.caaCasesPageType = CaaCasesPageType.AssignedCases;
      this.caseResultsTableShareButtonText = 'Manage case sharing';
    }
    if (selectedFilter.filterType === CaaCasesFilterType.NewCasesToAccept) {
      // dispatch action to load new cases to accept
      this.caaCasesPageType = CaaCasesPageType.UnassignedCases;
      this.caseResultsTableShareButtonText = 'Accept cases';
    }
    if (selectedFilter.filterType === CaaCasesFilterType.UnassignedCases) {
      // dispatch action to load unassigned cases
      this.caaCasesPageType = CaaCasesPageType.UnassignedCases;
      this.caseResultsTableShareButtonText = 'Share Case';
    }
    this.loadCaseTypes();
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
    if (this.sessionStateValue) {
      this.toggleFilterSection();
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
    if (this.caaCasesPageType === CaaCasesPageType.AssignedCases){
      this.caaCasesStore.dispatch(new caaCasesStore.SynchronizeStateToStoreAssignedCases(
        converters.toShareCaseConverter(selectedCases, CaaCasesPageType.AssignedCases)
      ));
    }

    if (this.caaCasesPageType === CaaCasesPageType.UnassignedCases){
      this.caaCasesStore.dispatch(new caaCasesStore.SynchronizeStateToStoreUnassignedCases(
        converters.toShareCaseConverter(selectedCases, CaaCasesPageType.UnassignedCases)
      ));
    }
    this.selectedCases = selectedCases;
  }

  public onPageChanged(pageNo: number): void {
    console.log('is the page being changed somehow?');
    this.currentPageNo = pageNo;
    this.loadCaseData();
  }

  onShareButtonClicked($event: string) {
    console.log(this.selectedFilterType);
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
    // load cases types based on filter and value
    if (this.selectedFilterType === CaaCasesFilterType.CaseReferenceNumber) {
      // TODO: need to handle the `new_case` flag
      // if returning new case then go to add recipient page
      // else if returning non-new case then go to manage case assignments
      this.caaCasesStore.dispatch(new caaCasesStore.AddShareAssignedCases({
        sharedCases: converters.toShareCaseConverter(this.selectedCases, this.selectedCaseType)
      }));
    }
    if (this.selectedFilterType === CaaCasesFilterType.CasesAssignedToAUser) {
      // todo: go to manage case assignments
      this.caaCasesStore.dispatch(new caaCasesStore.AddShareAssignedCases({
        sharedCases: converters.toShareCaseConverter(this.selectedCases, this.selectedCaseType)
      }
      ));
    }
    if (this.selectedFilterType === CaaCasesFilterType.AllAssignedCases) {
      this.caaCasesStore.dispatch(new caaCasesStore.AddShareAssignedCases({
        sharedCases: converters.toShareCaseConverter(this.selectedCases, this.selectedCaseType)
      }
      ));
    }
    if (this.selectedFilterType === CaaCasesFilterType.NewCasesToAccept) {
      // dispatch action to load new cases to accept
      // if group_access is enabled then go to accept cases page
      // else go to add recipient
      if (groupAccessEnabled) {
        this.caaCasesStore.dispatch(new caaCasesStore.AddShareUnassignedCases({
          sharedCases: converters.toShareCaseConverter(this.selectedCases, this.selectedCaseType),
          group_access: true
        }
        ));
      }
    }
    if (this.selectedFilterType === CaaCasesFilterType.UnassignedCases) {
      this.caaCasesStore.dispatch(new caaCasesStore.AddShareUnassignedCases({
        sharedCases: converters.toShareCaseConverter(this.selectedCases, this.selectedCaseType)
      }));
    }
  }
}
