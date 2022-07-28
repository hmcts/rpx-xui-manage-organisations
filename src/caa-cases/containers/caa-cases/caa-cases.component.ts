import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableConfig } from '@hmcts/ccd-case-ui-toolkit/dist/shared/components/case-list/case-list.component';
import { SharedCase } from '@hmcts/rpx-xui-common-lib/lib/models/case-share.model';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Organisation } from '../../../organisation/organisation.model';
import * as fromOrganisationStore from '../../../organisation/store';
import * as converters from '../../converters/case-converter';
import { CaaCasesFilterType, CaaCasesPageTitle, CaaCasesPageType, CaaShowHideFilterButtonText } from '../../models/caa-cases.enum';
import { CaaCases } from '../../models/caa-cases.model';
import * as fromStore from '../../store';

@Component({
  selector: 'app-caa-cases-component',
  templateUrl: './caa-cases.component.html',
  styleUrls: ['./caa-cases.component.scss']
})
export class CaaCasesComponent implements OnInit {

  public cases$: Observable<any>;
  public selectedOrganisation$: Observable<Organisation>;
  // this shareCases$ will be passed to case share component
  public shareCases$: Observable<SharedCase[]>;
  public tableConfig: TableConfig;
  // this selectedCases is emitted from the ccd-case-list
  // ideally the any[] should be mapped with the unassigned case payload
  public selectedCases: any[] = [];
  public currentCaseType: string;

  public navItems: any [];
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

  constructor(private readonly store: Store<fromStore.CaaCasesState>,
              private readonly organisationStore: Store<fromOrganisationStore.OrganisationState>,
              private readonly router: Router) {
    // Identify whether user selected to view assigned cases or unassigned cases
    this.caaCasesPageType = this.router && this.router.url && this.router.url.includes('unassigned-cases')
      ? CaaCasesPageType.unassignedCases
      : CaaCasesPageType.assignedCases;
    // Set page title
    this.pageTitle = this.caaCasesPageType === CaaCasesPageType.unassignedCases
      ? CaaCasesPageTitle.unassignedCases
      : CaaCasesPageTitle.assignedCases;
    // Set show hide filter button text
    this.caaShowHideFilterButtonText = this.caaCasesPageType === CaaCasesPageType.unassignedCases
      ? CaaShowHideFilterButtonText.unassignedCasesHide
      : CaaShowHideFilterButtonText.assignedCasesHide;
    // Set filter type to all assignees for assigned cases and none for unassigned cases
    this.setSelectedFilterTypeAndValue();
  }

  public ngOnInit(): void {
    this.store.dispatch(new fromStore.LoadCaseTypes());
    this.organisationStore.dispatch(new fromOrganisationStore.LoadOrganisation());
    this.store.pipe(select(fromStore.getAllUnassignedCases)).subscribe((config: CaaCases) => {
      if (config !== null) {
        this.tableConfig =  {
          idField: config.idField,
          columnConfigs: config.columnConfigs
        };
      }
    });
    this.store.pipe(select(fromStore.getAllCaseTypes)).subscribe(items => this.fixCurrentTab(items));
    this.shareCases$ = this.store.pipe(select(fromStore.getShareCaseListState));
    this.shareCases$.subscribe(shareCases => this.selectedCases = converters.toSearchResultViewItemConverter(shareCases));
    this.selectedOrganisation$ = this.organisationStore.pipe(select(fromOrganisationStore.getOrganisationSel));
  }

  public setSelectedFilterTypeAndValue(): void {
    this.selectedFilterType = this.caaCasesPageType === CaaCasesPageType.unassignedCases
      ? CaaCasesFilterType.none
      : CaaCasesFilterType.allAssignees;
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
    if (this.caaCasesPageType === CaaCasesPageType.unassignedCases) {
      this.store.dispatch(new fromStore.LoadUnassignedCases({caseType: this.currentCaseType, pageNo: this.currentPageNo, pageSize: this.paginationPageSize, caaCasesFilterType: this.selectedFilterType, caaCasesFilterValue: this.selectedFilterValue}));
      this.cases$ = this.store.pipe(select(fromStore.getAllUnassignedCaseData));
    } else {
      this.store.dispatch(new fromStore.LoadAssignedCases({caseType: this.currentCaseType, pageNo: this.currentPageNo, pageSize: this.paginationPageSize, caaCasesFilterType: this.selectedFilterType, caaCasesFilterValue: this.selectedFilterValue}));
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
    this.caaShowHideFilterButtonText = this.caaCasesPageType === CaaCasesPageType.unassignedCases
      ? this.caaShowHideFilterButtonText === CaaShowHideFilterButtonText.unassignedCasesShow
        ? CaaShowHideFilterButtonText.unassignedCasesHide
        : CaaShowHideFilterButtonText.unassignedCasesShow
      : this.caaShowHideFilterButtonText === CaaShowHideFilterButtonText.assignedCasesShow
        ? CaaShowHideFilterButtonText.assignedCasesHide
        : CaaShowHideFilterButtonText.assignedCasesShow;
  }

  public onSelectedFilterTypeChanged(selectedFilterType: string): void {
    this.selectedFilterType = selectedFilterType;
  }

  public onSelectedFilterValueChanged(selectedFilterValue: string): void {
    this.selectedFilterValue = selectedFilterValue;
    if (this.caaCasesPageType === CaaCasesPageType.unassignedCases) {
      this.selectedFilterType = this.selectedFilterValue.length > 0
        ? CaaCasesFilterType.caseReferenceNumber
        : CaaCasesFilterType.none;
    }
    this.loadDataFromStore();
  }
}
