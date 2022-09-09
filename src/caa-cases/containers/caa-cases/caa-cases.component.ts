import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableConfig } from '@hmcts/ccd-case-ui-toolkit/dist/shared/components/case-list/case-list.component';
import { User } from '@hmcts/rpx-xui-common-lib';
import { SharedCase } from '@hmcts/rpx-xui-common-lib/lib/models/case-share.model';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Organisation } from '../../../organisation/organisation.model';
import * as fromOrganisationStore from '../../../organisation/store';
import * as fromUserStore from '../../../users/store';
import * as converters from '../../converters/case-converter';
import { CaaCasesFilterType, CaaCasesPageTitle, CaaCasesPageType, CaaShowHideFilterButtonText } from '../../models/caa-cases.enum';
import { CaaCases, ErrorMessage } from '../../models/caa-cases.model';
import * as fromStore from '../../store';

@Component({
  selector: 'app-caa-cases-component',
  templateUrl: './caa-cases.component.html',
  styleUrls: ['./caa-cases.component.scss']
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
  public paginationPageSize: number = 10;
  public totalCases: number = 0;
  public pageTitle: string;
  public caaCasesPageType: string;
  public caaCasesPageTypeLookup = CaaCasesPageType;
  public caaShowHideFilterButtonText: string;
  public caaShowHideFilterButtonTextLookup = CaaShowHideFilterButtonText;
  public selectedFilterType: string;
  public selectedFilterValue: string;
  public errorMessages: ErrorMessage[];

  constructor(private readonly store: Store<fromStore.CaaCasesState>,
              private readonly organisationStore: Store<fromOrganisationStore.OrganisationState>,
              private readonly userStore: Store<fromUserStore.UserState>,
              private readonly router: Router) {
    // Identify whether user selected to view assigned cases or unassigned cases
    this.caaCasesPageType = this.router && this.router.url && this.router.url.includes('unassigned-cases')
      ? CaaCasesPageType.UnassignedCases
      : CaaCasesPageType.AssignedCases;
    // Set page title
    this.pageTitle = this.caaCasesPageType === CaaCasesPageType.UnassignedCases
      ? CaaCasesPageTitle.UnassignedCases
      : CaaCasesPageTitle.AssignedCases;
    // Set show hide filter button text
    this.caaShowHideFilterButtonText = this.caaCasesPageType === CaaCasesPageType.UnassignedCases
      ? CaaShowHideFilterButtonText.UnassignedCasesShow
      : CaaShowHideFilterButtonText.AssignedCasesShow;
    // Set filter type to "all-assignees" for assigned cases and "none" for unassigned cases
    this.setSelectedFilterTypeAndValue();
  }

  public ngOnInit(): void {
    this.store.dispatch(new fromStore.LoadCaseTypes({caaCasesPageType: this.caaCasesPageType}));
    this.organisationStore.dispatch(new fromOrganisationStore.LoadOrganisation());
    this.userStore.dispatch(new fromUserStore.LoadUsers(0));
    if (this.caaCasesPageType === CaaCasesPageType.UnassignedCases) {
      this.store.pipe(select(fromStore.getAllUnassignedCases)).subscribe((config: CaaCases) => {
        if (config !== null) {
          this.tableConfig =  {
            idField: config.idField,
            columnConfigs: config.columnConfigs
          };
        }
      });
    } else if (this.caaCasesPageType === CaaCasesPageType.AssignedCases) {
      this.store.pipe(select(fromStore.getAllAssignedCases)).subscribe((config: CaaCases) => {
        if (config !== null) {
          this.tableConfig =  {
            idField: config.idField,
            columnConfigs: config.columnConfigs
          };
        }
      });
    }
    this.store.pipe(select(fromStore.getAllCaseTypes)).subscribe(items => this.fixCurrentTab(items));
    this.shareCases$ = this.store.pipe(select(fromStore.getShareCaseListState));
    this.shareCases$.subscribe(shareCases => this.selectedCases = converters.toSearchResultViewItemConverter(shareCases));
    this.selectedOrganisation$ = this.organisationStore.pipe(select(fromOrganisationStore.getOrganisationSel));
    this.selectedOrganisationUsers$ = this.userStore.pipe(select(fromUserStore.getGetUserList));
  }

  public setSelectedFilterTypeAndValue(): void {
    this.selectedFilterType = this.caaCasesPageType === CaaCasesPageType.UnassignedCases
      ? CaaCasesFilterType.None
      : CaaCasesFilterType.AllAssignees;
    this.selectedFilterValue = null;
  }

  private fixCurrentTab(items: any): void {
    this.navItems = items;
    if (items && items.length > 0) {
      this.totalCases = items[0].total ? items[0].total : 0;
      this.setTabItems(items[0].text);
    }
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
    this.totalCases = this.navItems.find(data => data.text === event.tab.textLabel) ? this.navItems.find(data => data.text === event.tab.textLabel).total : 0;
    this.setTabItems(event.tab.textLabel);
  }

  private setTabItems(tabName: string): void {
    this.resetPaginationParameters();
    this.store.pipe(select(fromStore.getAllUnassignedCases));
    this.shareCases$ = this.store.pipe(select(fromStore.getShareCaseListState));
    this.currentCaseType = tabName;
    this.loadDataFromStore();
  }

  public onPaginationHandler(pageNo: number): void {
    this.currentPageNo = pageNo;
    this.loadDataFromStore();
  }

  public loadDataFromStore(): void {
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
      this.selectedFilterType = this.selectedFilterValue.length > 0
        ? CaaCasesFilterType.CaseReferenceNumber
        : CaaCasesFilterType.None;
    }
    this.loadDataFromStore();
  }

  public onErrorMessages(errorMessages: ErrorMessage[]): void {
    this.errorMessages = errorMessages;
  }

  /**
   * Function to check if any error exists
   */
  public isAnyError(): boolean {
    return Array.isArray(this.errorMessages) && this.errorMessages.length > 0;
  }
}
