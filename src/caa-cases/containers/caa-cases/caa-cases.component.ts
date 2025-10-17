import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyTabGroup as MatTabGroup } from '@angular/material/legacy-tabs';
import { Router } from '@angular/router';
import { TableConfig } from '@hmcts/ccd-case-ui-toolkit';
import { User } from '@hmcts/rpx-xui-common-lib';
import { SharedCase } from '@hmcts/rpx-xui-common-lib';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CaaCasesService } from '../../../caa-cases/services';
import { OrganisationDetails } from '../../../models';
import * as fromOrganisationStore from '../../../organisation/store';
import { ErrorMessage } from '../../../shared/models/error-message.model';
import * as fromUserStore from '../../../users/store';
import * as converters from '../../converters/case-converter';
import {
  CaaCasesFilterType,
  CaaCasesNoDataMessage,
  CaaCasesPageTitle,
  CaaCasesPageType,
  CaaCasesShowHideFilterButtonText
} from '../../models/caa-cases.enum';
import { CaaCases, CaaCasesSessionState, CaaCasesSessionStateValue } from '../../models/caa-cases.model';
import * as fromStore from '../../store';

@Component({
  selector: 'app-caa-cases-component',
  templateUrl: './caa-cases.component.html',
  standalone: false
})
export class CaaCasesComponent implements OnInit {
  public cases$: Observable<any>;
  public casesError$: Observable<HttpErrorResponse>;
  public selectedOrganisation$: Observable<OrganisationDetails>;
  public selectedOrganisationUsers$: Observable<User[]>;
  // shareAssignedCases$ and shareUnassignedCases$ will be passed to case share component
  public shareAssignedCases$: Observable<SharedCase[]>;
  public shareUnassignedCases$: Observable<SharedCase[]>;
  public tableConfig: TableConfig;
  // this selectedCases is emitted from the ccd-case-list
  // ideally the any[] should be mapped with the unassigned case payload
  public selectedCases: any[] = [];
  public selectedAssignedCases: any[] = [];
  public selectedUnassignedCases: any[] = [];
  public currentCaseType: string;

  public navItems: any[];
  public currentPageNo: number;
  public paginationPageSize: number = 25;
  public totalCases: number = 0;
  public pageTitle: string;
  public caaCasesPageType: string;
  public caaCasesPageTypeLookup = CaaCasesPageType;
  public caaShowHideFilterButtonText: string;
  public caaShowHideFilterButtonTextLookup = CaaCasesShowHideFilterButtonText;
  public selectedFilterType: string;
  public selectedFilterValue: string;
  public sessionStateValue: CaaCasesSessionStateValue;
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
    // Retrieve session state to check and pre-populate the previous state if any
    this.retrieveSessionState();

    // Load case types from store based on current page type
    this.loadCaseTypes(this.selectedFilterType, this.selectedFilterValue);

    if (this.caaCasesPageType === CaaCasesPageType.UnassignedCases) {
      // Get selected unassigned cases to share from store
      this.shareUnassignedCases$ = this.store.pipe(select(fromStore.getShareUnassignedCaseListState));
      this.shareUnassignedCases$.subscribe((shareUnassignedCases) => {
        this.selectedUnassignedCases = converters.toSearchResultViewItemConverter(shareUnassignedCases);
        this.selectedCases = this.selectedUnassignedCases;
      });
    } else {
      // Get selected assigned cases to share from store
      this.shareAssignedCases$ = this.store.pipe(select(fromStore.getShareAssignedCaseListState));
      this.shareAssignedCases$.subscribe((shareAssignedCases) => {
        this.selectedAssignedCases = converters.toSearchResultViewItemConverter(shareAssignedCases);
        this.selectedCases = this.selectedAssignedCases;
      });
    }

    // Load selected organisation details from store
    this.organisationStore.dispatch(new fromOrganisationStore.LoadOrganisation());
    this.selectedOrganisation$ = this.organisationStore.pipe(select(fromOrganisationStore.getOrganisationSel));

    // Load users of selected organisation from store
    this.userStore.dispatch(new fromUserStore.LoadAllUsersNoRoleData());
    this.selectedOrganisationUsers$ = this.userStore.pipe(select(fromUserStore.getGetUserList));

    // Load cases based on page type and set table configuration
    this.loadCasesAndSetTableConfig();
  }

  public loadCaseTypes(selectedFilterType: string, selectedFilterValue: string): void {
    // Load case types based on current page type according to filtered value
    this.store.dispatch(new fromStore.LoadCaseTypes(
      { caaCasesPageType: this.caaCasesPageType, caaCasesFilterType: selectedFilterType, caaCasesFilterValue: selectedFilterValue }));
    this.store.pipe(select(fromStore.getAllCaseTypes)).subscribe((items) =>
      this.fixCurrentTab(items)
    );
  }

  public setCurrentPageType(): void {
    // Identify whether user selected to view assigned cases or unassigned cases
    if (this.router?.url?.includes('unassigned-cases')) {
      this.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    } else if (this.router?.url?.includes('assigned-cases')) {
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
      ? CaaCasesShowHideFilterButtonText.UnassignedCasesShow
      : CaaCasesShowHideFilterButtonText.AssignedCasesShow;
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
      this.tableConfig = {
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

  public shareAssignedCaseSubmit(): void {
    this.store.dispatch(new fromStore.AddShareAssignedCases({
      sharedCases: converters.toShareCaseConverter(this.selectedAssignedCases, this.currentCaseType)
    }));
  }

  public shareUnassignedCaseSubmit(): void {
    this.store.dispatch(new fromStore.AddShareUnassignedCases({
      sharedCases: converters.toShareCaseConverter(this.selectedUnassignedCases, this.currentCaseType)
    }));
  }

  public onCaseSelection(selectedCases: any[]): void {
    if (this.caaCasesPageType === CaaCasesPageType.UnassignedCases) {
      this.selectedUnassignedCases = selectedCases;
      this.store.dispatch(new fromStore.SynchronizeStateToStoreUnassignedCases(
        converters.toShareCaseConverter(selectedCases, this.currentCaseType)
      ));
    } else {
      this.selectedAssignedCases = selectedCases;
      this.store.dispatch(new fromStore.SynchronizeStateToStoreAssignedCases(
        converters.toShareCaseConverter(selectedCases, this.currentCaseType)
      ));
    }
  }

  public tabChanged(event: { tab: { textLabel: string }}): void {
    this.totalCases = this.navItems.find((data) => data.text === event.tab.textLabel)
      ? this.navItems.find((data) => data.text === event.tab.textLabel).total
      : 0;
    this.setTabItems(event.tab.textLabel, true);
  }

  public onPaginationHandler(pageNo: number): void {
    this.currentPageNo = pageNo;
    this.loadDataFromStore();
  }

  public loadDataFromStore(): void {
    if (this.currentCaseType) {
      this.setCurrentPageType();
      if (this.caaCasesPageType === CaaCasesPageType.UnassignedCases) {
        this.store.dispatch(new fromStore.LoadUnassignedCases({
          caseType: this.currentCaseType,
          pageNo: this.currentPageNo,
          pageSize: this.paginationPageSize,
          caaCasesFilterType: this.selectedFilterType,
          caaCasesFilterValue: this.selectedFilterValue
        }));
        this.cases$ = this.store.pipe(select(fromStore.getAllUnassignedCaseData));
        this.casesError$ = this.store.pipe(select(fromStore.getAllUnassignedCasesError));
      } else {
        this.store.dispatch(new fromStore.LoadAssignedCases({
          caseType: this.currentCaseType,
          pageNo: this.currentPageNo,
          pageSize: this.paginationPageSize,
          caaCasesFilterType: this.selectedFilterType,
          caaCasesFilterValue: this.selectedFilterValue
        }));
        this.cases$ = this.store.pipe(select(fromStore.getAllAssignedCaseData));
        this.casesError$ = this.store.pipe(select(fromStore.getAllAssignedCasesError));
      }
      // Set relevant no data message if no cases returned
      this.cases$.subscribe(() => {
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
      ? this.caaShowHideFilterButtonText === CaaCasesShowHideFilterButtonText.UnassignedCasesShow
        ? CaaCasesShowHideFilterButtonText.UnassignedCasesHide
        : CaaCasesShowHideFilterButtonText.UnassignedCasesShow
      : this.caaShowHideFilterButtonText === CaaCasesShowHideFilterButtonText.AssignedCasesShow
        ? CaaCasesShowHideFilterButtonText.AssignedCasesHide
        : CaaCasesShowHideFilterButtonText.AssignedCasesShow;
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
    if (this.selectedFilterType === CaaCasesFilterType.None) {
      // Remove unassigned cases related filter from session
      this.removeSessionState(this.caaCasesPageType);
    } else {
      // Store filter values to session
      this.storeSessionState();
    }
    // Load case types based on current page type, selected filter type and selected filter value
    this.loadCaseTypes(this.selectedFilterType, this.selectedFilterValue);
  }

  public removeSessionState(key: string): void {
    this.service.removeSessionState(key);
  }

  public retrieveSessionState(): void {
    this.sessionStateValue = this.service.retrieveSessionState(this.caaCasesPageType);
    if (this.sessionStateValue) {
      this.selectedFilterType = this.sessionStateValue.filterType ? this.sessionStateValue.filterType : null;
      if (this.selectedFilterType) {
        const caseReferenceNumber = this.sessionStateValue.caseReferenceNumber && this.sessionStateValue.caseReferenceNumber;
        const assigneeName = this.sessionStateValue.assigneeName && this.sessionStateValue.assigneeName;
        if (this.caaCasesPageType === CaaCasesPageType.UnassignedCases && caseReferenceNumber) {
          this.selectedFilterValue = caseReferenceNumber;
        } else if (this.caaCasesPageType === CaaCasesPageType.AssignedCases) {
          if (this.selectedFilterType === CaaCasesFilterType.AssigneeName && assigneeName) {
            this.selectedFilterValue = assigneeName;
          } else if (this.selectedFilterType === CaaCasesFilterType.CaseReferenceNumber && caseReferenceNumber) {
            this.selectedFilterValue = caseReferenceNumber;
          }
        }
        this.toggleFilterSection();
      }
    }
  }

  public storeSessionState(): void {
    const sessionStateValue = this.service.retrieveSessionState(this.caaCasesPageType);
    const caseReferenceNumber = sessionStateValue && sessionStateValue.caseReferenceNumber && sessionStateValue.caseReferenceNumber;
    const assigneeName = sessionStateValue && sessionStateValue.assigneeName && sessionStateValue.assigneeName;
    const sessionStateToUpdate: CaaCasesSessionState = {
      key: this.caaCasesPageType,
      value: {
        filterType: this.selectedFilterType,
        caseReferenceNumber: this.selectedFilterType === CaaCasesFilterType.CaseReferenceNumber ? this.selectedFilterValue : caseReferenceNumber,
        assigneeName: this.selectedFilterType === CaaCasesFilterType.AssigneeName ? this.selectedFilterValue : assigneeName
      }
    };
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
    this.shareAssignedCases$ = this.store.pipe(select(fromStore.getShareAssignedCaseListState));
    this.shareUnassignedCases$ = this.store.pipe(select(fromStore.getShareUnassignedCaseListState));
    this.currentCaseType = tabName;
    if (!fromTabChangedEvent && this.tabGroup) {
      this.tabGroup.selectedIndex = 0;
    }
    this.loadDataFromStore();
  }
}
