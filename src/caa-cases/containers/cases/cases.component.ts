import { Component, OnInit } from '@angular/core';
import { CaaCasesService } from 'src/caa-cases/services';

import * as organisationStore from '../../../organisation/store';
import * as userStore from '../../../users/store';
import * as caaCasesStore from '../../store';
import { Store, select } from '@ngrx/store';
import { OrganisationDetails } from 'src/models/organisation.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorMessage } from 'src/shared/models/error-message.model';
import { SharedCase, SubNavigation, User } from '@hmcts/rpx-xui-common-lib';
import { SelectedCaseFilter } from 'src/caa-cases/models/selected-case-filter.model';
import { CaaCases, CaaCasesSessionState, CaaCasesSessionStateValue } from 'src/caa-cases/models/caa-cases.model';
import { CaaCasesFilterType, CaaCasesPageType } from 'src/caa-cases/models/caa-cases.enum';
import { HttpErrorResponse } from '@angular/common/http';
import * as converters from '../../converters/case-converter';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.scss']
})
export class CasesComponent implements OnInit {
  private readonly caaCasesPageType = 'all-cases-filter';

  public selectedOrganisation$: Observable<OrganisationDetails>;
  public selectedOrganisationUsers$: Observable<User[]>;

  public pageTitle = 'Cases';
  public showFilterSection = false;
  public errorMessages: ErrorMessage[] = [];
  public sessionStateValue: CaaCasesSessionStateValue;

  // for the results table
  public allCaseTypes: SubNavigation[];
  public currentPageNo: number;
  public paginationPageSize: number = 25;
  public casesConfig: CaaCases;
  public cases: any; // can we type this?
  public casesError$: Observable<HttpErrorResponse>;
  public shareAssignedCases$: Observable<SharedCase[]>;
  public shareUnassignedCases$: Observable<SharedCase[]>;

  constructor(private readonly caaCasesStore: Store<caaCasesStore.CaaCasesState>,
    private readonly organisationStore: Store<organisationStore.OrganisationState>,
    private readonly userStore: Store<userStore.UserState>,
    private readonly router: Router,
    private readonly service: CaaCasesService) {
  }

  public ngOnInit(): void {
    // this.loadCaseTypes(selectedFilterType, selectedFilterValue);
    this.loadCaseTypes();

    // Load selected organisation details from store
    this.organisationStore.dispatch(new organisationStore.LoadOrganisation());
    this.selectedOrganisation$ = this.organisationStore.pipe(select(organisationStore.getOrganisationSel));

    // Load users of selected organisation from store
    this.userStore.dispatch(new userStore.LoadAllUsersNoRoleData());
    this.selectedOrganisationUsers$ = this.userStore.pipe(select(userStore.getGetUserList));

    // Retrieve session state to check and pre-populate the previous state if any
    this.retrieveSessionState();

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
    this.casesError$ = this.caaCasesStore.pipe(select(caaCasesStore.getAllUnassignedCasesError));

    this.shareAssignedCases$ = this.caaCasesStore.pipe(select(caaCasesStore.getShareAssignedCaseListState));
    this.shareUnassignedCases$ = this.caaCasesStore.pipe(select(caaCasesStore.getShareUnassignedCaseListState));
  }

  /**
   * This will load all case types based on the selected filter type and value
   */
  public loadCaseTypes() {
    // TODO: get selected filter type and selected filter value from somewhere
    const selectedFilterType = CaaCasesPageType.UnassignedCases; // todo: this will be all cases since it's a merge of both assigned and unassigned cases
    const pageType = CaaCasesPageType.UnassignedCases; // todo: this will be all cases since it's a merge of both assigned and unassigned cases
    const selectedFilterValue = null;
    // Load case types based on current page type according to filtered value
    this.caaCasesStore.dispatch(new caaCasesStore.LoadCaseTypes({
      caaCasesPageType: pageType,
      caaCasesFilterType: selectedFilterType,
      caaCasesFilterValue: selectedFilterValue })
    );
    this.caaCasesStore.pipe(select(caaCasesStore.getAllCaseTypes)).subscribe((items) => {
      this.allCaseTypes = items;
      this.loadCases();
    });
  }

  /**
   * This will load cases (i.e. unassigned or assigned) from the API with the selected filter type and value
   */
  public loadCases(){
    if (this.allCaseTypes && this.allCaseTypes.length > 0) {
      const selectedFilterType = CaaCasesFilterType.None; // todo: this will be all cases since it's a merge of both assigned and unassigned cases
      const selectedFilterValue = null;
      const currentCaseType = this.allCaseTypes[0].text;

      this.caaCasesStore.dispatch(new caaCasesStore.LoadUnassignedCases({
        caseType: currentCaseType,
        pageNo: this.currentPageNo,
        pageSize: this.paginationPageSize,
        caaCasesFilterType: selectedFilterType,
        caaCasesFilterValue: selectedFilterValue
      }));
    }
  }

  public onSelectedFilter(selectedFilter: SelectedCaseFilter): void {
    console.log('Selected filter:', selectedFilter);
    // todo: update session state (i.e. remove or store)
    if (selectedFilter.filterType === CaaCasesFilterType.None) {
      this.removeSessionState(this.caaCasesPageType);
    } else {
      this.storeSessionState(selectedFilter);
    }

    // load cases types based on filter and value
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
    this.sessionStateValue = this.service.retrieveSessionState(this.caaCasesPageType);
    if (this.sessionStateValue) {
      this.toggleFilterSection();
    }
  }

  public storeSessionState(selectedFilter: SelectedCaseFilter): void {
    const sessionStateToUpdate: CaaCasesSessionState = {
      key: this.caaCasesPageType,
      value: {
        filterType: selectedFilter.filterType,
        caseReferenceNumber: selectedFilter.filterType === CaaCasesFilterType.CaseReferenceNumber ? selectedFilter.filterValue : null,
        assigneeName: selectedFilter.filterType === CaaCasesFilterType.AssigneeName ? selectedFilter.filterValue : null
      }
    };
    this.sessionStateValue = sessionStateToUpdate.value;
    this.service.storeSessionState(sessionStateToUpdate);
  }

  public onCaseSelected(selectedCases: any[]): void {
    // if (this.caaCasesPageType === CaaCasesPageType.UnassignedCases) {
    //   this.selectedUnassignedCases = selectedCases;
    //   this.store.dispatch(new fromStore.SynchronizeStateToStoreUnassignedCases(
    //     converters.toShareCaseConverter(selectedCases, this.currentCaseType)
    //   ));
    // } else {
    //   this.selectedAssignedCases = selectedCases;
    //   this.store.dispatch(new fromStore.SynchronizeStateToStoreAssignedCases(
    //     converters.toShareCaseConverter(selectedCases, this.currentCaseType)
    //   ));
    // }

    // do i need the line below?
    // this.selectedUnassignedCases = selectedCases;
    this.caaCasesStore.dispatch(new caaCasesStore.SynchronizeStateToStoreUnassignedCases(
      converters.toShareCaseConverter(selectedCases, CaaCasesPageType.UnassignedCases)
    ));
  }

  public onPageChanged(pageNo: number): void {
    this.currentPageNo = pageNo;
    this.loadCases();
  }
}
