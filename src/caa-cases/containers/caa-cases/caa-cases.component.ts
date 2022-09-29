import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material';
import { Router } from '@angular/router';
import { TableConfig } from '@hmcts/ccd-case-ui-toolkit/dist/shared/components/case-list/case-list.component';
import { User } from '@hmcts/rpx-xui-common-lib';
import { SharedCase } from '@hmcts/rpx-xui-common-lib/lib/models/case-share.model';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CaaCasesService } from 'src/caa-cases/services';
import { Organisation } from '../../../organisation/organisation.model';
import * as fromOrganisationStore from '../../../organisation/store';
import * as fromUserStore from '../../../users/store';
import * as converters from '../../converters/case-converter';
import { CaaCasesFilterType, CaaCasesNoDataMessage, CaaCasesPageTitle, CaaCasesPageType, CaaShowHideFilterButtonText } from '../../models/caa-cases.enum';
import { CaaCases, CaaSessionState, ErrorMessage } from '../../models/caa-cases.model';
import * as fromStore from '../../store';

@Component({
  selector: 'app-caa-cases-component',
  templateUrl: './caa-cases.component.html'
})
export class CaaCasesComponent implements OnInit {

  public cases$: Observable<any>;
  public selectedOrganisation$: Observable<Organisation>;
  public selectedOrganisationUsers$: Observable<User[]>;
  // this shareCases$ will be passed to case share component
  public shareCases$: Observable<SharedCase[]>;
  public tableConfig: TableConfig;
  // this selectedCases is emitted from the ccd-case-list
  // ideally the any[] should be mapped with the unassigned case payload
  public selectedCases: any[] = [];
  public currentCaseType: string;

  public navItems: any[];
  public currentPageNo: number;
  public paginationPageSize: number = 25;
  public totalCases: number = 0;
  public pageTitle: string;
  public caaCasesPageType: string;
  public caaCasesPageTypeLookup = CaaCasesPageType;
  public caaShowHideFilterButtonText: string;
  public caaShowHideFilterButtonTextLookup = CaaShowHideFilterButtonText;
  public selectedFilterType: string;
  public selectedFilterValue: string;
  public errorMessages: ErrorMessage[];
  public noCasesFoundMessage = '';

  @ViewChild('tabGroup') public tabGroup: MatTabGroup;

  constructor(private readonly store: Store<fromStore.CaaCasesState>,
              private readonly organisationStore: Store<fromOrganisationStore.OrganisationState>,
              private readonly userStore: Store<fromUserStore.UserState>,
              private readonly router: Router,
              private readonly service: CaaCasesService) {
  }

  public ngOnInit(): void {
    // Set current page type
    this.setCurrentPageType();
    // Set page title
    this.setCurrentPageTitle();
    // Set show hide filter button text
    this.setShowHideFilterButtonText();
    // Set filter type to "all-assignees" for assigned cases and "none" for unassigned cases
    this.setSelectedFilterTypeAndValue();

    // Load case types from store based on current page type
    this.loadCaseTypes(this.selectedFilterType, this.selectedFilterValue);

    // Get selected cases to share from store
    this.shareCases$ = this.store.pipe(select(fromStore.getShareCaseListState));
    this.shareCases$.subscribe(shareCases => this.selectedCases = converters.toSearchResultViewItemConverter(shareCases));

    // Load selected organisation details from store
    this.organisationStore.dispatch(new fromOrganisationStore.LoadOrganisation());
    this.selectedOrganisation$ = this.organisationStore.pipe(select(fromOrganisationStore.getOrganisationSel));

    // Load users of selected organisation from store
    this.userStore.dispatch(new fromUserStore.LoadUsers(0));
    this.selectedOrganisationUsers$ = this.userStore.pipe(select(fromUserStore.getGetUserList));

    // Load cases based on page type and set table configuration
    this.loadCasesAndSetTableConfig();
  }

  public loadCaseTypes(selectedFilterType: string, selectedFilterValue: string): void {
    // Load case types based on current page type according to filtered value
    this.store.dispatch(new fromStore.LoadCaseTypes({caaCasesPageType: this.caaCasesPageType, caaCasesFilterType: selectedFilterType, caaCasesFilterValue: selectedFilterValue}));
    this.store.pipe(select(fromStore.getAllCaseTypes)).subscribe(items =>
      this.fixCurrentTab(items)
    );
  }

  public setCurrentPageType(): void {
    // Identify whether user selected to view assigned cases or unassigned cases
    if (this.router && this.router.url && this.router.url.includes('unassigned-cases')) {
      this.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    } else if (this.router && this.router.url && this.router.url.includes('assigned-cases')) {
      this.caaCasesPageType = CaaCasesPageType.AssignedCases;
    } else {
      // Invalid request, redirect to error page
      this.router.navigateByUrl('/service-down');
    }
  }

  public setCurrentPageTitle(): void {
    this.pageTitle = this.caaCasesPageType === CaaCasesPageType.UnassignedCases
      ? CaaCasesPageTitle.UnassignedCases
      : CaaCasesPageTitle.AssignedCases;
  }

  public setShowHideFilterButtonText(): void {
    this.caaShowHideFilterButtonText = this.caaCasesPageType === CaaCasesPageType.UnassignedCases
      ? CaaShowHideFilterButtonText.UnassignedCasesShow
      : CaaShowHideFilterButtonText.AssignedCasesShow;
  }

  public loadCasesAndSetTableConfig(): void {
    switch (this.caaCasesPageType) {
      case CaaCasesPageType.UnassignedCases:
        this.store.pipe(select(fromStore.getAllUnassignedCases)).subscribe((config: CaaCases) => {
          this.setTableConfig(config);
        });
        break;

      case CaaCasesPageType.AssignedCases:
        this.store.pipe(select(fromStore.getAllAssignedCases)).subscribe((config: CaaCases) => {
          this.setTableConfig(config);
        });
        break;

      default:
        this.router.navigateByUrl('/service-down');
        break;
    }
  }

  public setTableConfig(config: TableConfig): void {
    if (config !== null) {
      this.tableConfig =  {
        idField: config.idField,
        columnConfigs: config.columnConfigs
      };
    }
  }

  public setSelectedFilterTypeAndValue(): void {
    this.selectedFilterType = this.caaCasesPageType === CaaCasesPageType.UnassignedCases
      ? CaaCasesFilterType.None
      : CaaCasesFilterType.AllAssignees;
    this.selectedFilterValue = null;
  }

  public shareCaseSubmit(): void {
    this.store.dispatch(new fromStore.AddShareCases({
      sharedCases: converters.toShareCaseConverter(this.selectedCases, this.currentCaseType)
    }));
  }

  public onCaseSelection(selectedCases: any[]): void {
    this.selectedCases = selectedCases;
    this.store.dispatch(new fromStore.SynchronizeStateToStore(
      converters.toShareCaseConverter(this.selectedCases, this.currentCaseType)
    ));
  }

  public tabChanged(event: { tab: { textLabel: string }}): void {
    this.totalCases = this.navItems.find(data => data.text === event.tab.textLabel)
      ? this.navItems.find(data => data.text === event.tab.textLabel).total
      : 0;
    this.setTabItems(event.tab.textLabel, true);
  }

  public onPaginationHandler(pageNo: number): void {
    this.currentPageNo = pageNo;
    this.loadDataFromStore();
  }

  public loadDataFromStore(): void {
    if (this.currentCaseType) {
      if (this.caaCasesPageType === CaaCasesPageType.UnassignedCases) {
        this.store.dispatch(new fromStore.LoadUnassignedCases({
          caseType: this.currentCaseType,
          pageNo: this.currentPageNo,
          pageSize: this.paginationPageSize,
          caaCasesFilterType: this.selectedFilterType,
          caaCasesFilterValue: this.selectedFilterValue
        }));
        this.cases$ = this.store.pipe(select(fromStore.getAllUnassignedCaseData));
      } else {
        this.store.dispatch(new fromStore.LoadAssignedCases({
          caseType: this.currentCaseType,
          pageNo: this.currentPageNo,
          pageSize: this.paginationPageSize,
          caaCasesFilterType: this.selectedFilterType,
          caaCasesFilterValue: this.selectedFilterValue
        }));
        this.cases$ = this.store.pipe(select(fromStore.getAllAssignedCaseData));
      }
      // Set relevant no data message if no cases returned
      this.cases$.subscribe(cases => {
        this.noCasesFoundMessage = this.getNoCasesFoundMessage();
      });
    }
  }

  public resetPaginationParameters(): void {
    this.currentPageNo = 1;
  }

  public hasResults(): any {
    return this.totalCases;
  }

  public getFirstResult(): number {
    return ((this.currentPageNo - 1) * this.paginationPageSize) + 1;
  }

  public getLastResult(): number {
    const count = ((this.currentPageNo) * this.paginationPageSize);
    return count >= this.totalCases ? this.totalCases : count < this.totalCases ? count : 1;
  }

  public getTotalResults(): number {
    return this.totalCases;
  }

  public toggleFilterSection(): void {
    this.caaShowHideFilterButtonText = this.caaCasesPageType === CaaCasesPageType.UnassignedCases
      ? this.caaShowHideFilterButtonText === CaaShowHideFilterButtonText.UnassignedCasesShow
        ? CaaShowHideFilterButtonText.UnassignedCasesHide
        : CaaShowHideFilterButtonText.UnassignedCasesShow
      : this.caaShowHideFilterButtonText === CaaShowHideFilterButtonText.AssignedCasesShow
        ? CaaShowHideFilterButtonText.AssignedCasesHide
        : CaaShowHideFilterButtonText.AssignedCasesShow;
  }

  public onSelectedFilterTypeChanged(selectedFilterType: string): void {
    this.selectedFilterType = selectedFilterType;
  }

  public onSelectedFilterValueChanged(selectedFilterValue: string): void {
    this.selectedFilterValue = selectedFilterValue;
    if (this.caaCasesPageType === CaaCasesPageType.UnassignedCases) {
      this.selectedFilterType = selectedFilterValue && selectedFilterValue.length > 0
        ? CaaCasesFilterType.CaseReferenceNumber
        : CaaCasesFilterType.None;
    }
    // Store filter values to session
    this.storeSessionState();
    // Load case types based on current page type, selected filter type and selected filter value
    this.loadCaseTypes(this.selectedFilterType, this.selectedFilterValue);
  }

  public storeSessionState(): void {
    console.log('SELECTED FILTER TYPE', this.selectedFilterType);
    console.log('SELECTED FILTER VALUE', this.selectedFilterValue);
    const sessionStateValue = this.service.retrieveSessionState(this.caaCasesPageType);
    console.log('SESSION STATE VALUE', sessionStateValue);
    const caseReferenceNumber = sessionStateValue && sessionStateValue.caseReferenceNumber && sessionStateValue.caseReferenceNumber;
    const assigneeName = sessionStateValue && sessionStateValue.assigneeName && sessionStateValue.assigneeName;
    console.log('CASE REFERENCE NUMBER', caseReferenceNumber);
    console.log('ASSIGNEE NAME', assigneeName);
    const sessionStateToUpdate: CaaSessionState = {
      key: this.caaCasesPageType,
      value: {
        filterType: this.selectedFilterType,
        caseReferenceNumber: this.selectedFilterType === CaaCasesFilterType.CaseReferenceNumber ? this.selectedFilterValue : caseReferenceNumber,
        assigneeName: this.selectedFilterType === CaaCasesFilterType.AssigneeName ? this.selectedFilterValue : assigneeName
      }
    }
    console.log('SESSION TO UPDATE', sessionStateToUpdate);
    this.service.storeSessionState(sessionStateToUpdate);
  }

  public onErrorMessages(errorMessages: ErrorMessage[]): void {
    this.errorMessages = errorMessages;
  }

  public getNoCasesFoundMessage(): string {
    if (this.totalCases === 0) {
      // Return no cases found messages related to unassigned cases
      if (this.caaCasesPageType === CaaCasesPageType.UnassignedCases) {
        if (this.selectedFilterType === CaaCasesFilterType.CaseReferenceNumber) {
          return CaaCasesNoDataMessage.UnassignedCasesFilterMessage;
        }
        return CaaCasesNoDataMessage.NoUnassignedCases;
      }
      // Return no cases found messages related to assigned cases
      if (this.caaCasesPageType === CaaCasesPageType.AssignedCases) {
        if (this.selectedFilterType === CaaCasesFilterType.AssigneeName || this.selectedFilterType === CaaCasesFilterType.CaseReferenceNumber) {
          return CaaCasesNoDataMessage.AssignedCasesFilterMessage;
        }
        return CaaCasesNoDataMessage.NoAssignedCases;
      }
    }
    return '';
  }

  /**
   * Function to check if any error exists
   */
  public isAnyError(): boolean {
    return Array.isArray(this.errorMessages) && this.errorMessages.length > 0;
  }

  private fixCurrentTab(items: any): void {
    this.navItems = items;
    if (items && items.length > 0) {
      this.totalCases = items[0].total ? items[0].total : 0;
      this.setTabItems(items[0].text);
    } else {
      this.totalCases = 0;
      this.noCasesFoundMessage = this.getNoCasesFoundMessage();
    }
  }

  private setTabItems(tabName: string, fromTabChangedEvent?: boolean): void {
    this.resetPaginationParameters();
    if (this.caaCasesPageType === CaaCasesPageType.UnassignedCases) {
      this.store.pipe(select(fromStore.getAllUnassignedCases));
    } else {
      this.store.pipe(select(fromStore.getAllAssignedCases));
    }
    this.shareCases$ = this.store.pipe(select(fromStore.getShareCaseListState));
    this.currentCaseType = tabName;
    if (!fromTabChangedEvent && this.tabGroup) {
        this.tabGroup.selectedIndex = 0;
    }
    this.loadDataFromStore();
  }
}
