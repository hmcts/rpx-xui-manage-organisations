import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { TableConfig } from '@hmcts/ccd-case-ui-toolkit';
import { SubNavigation } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStore from '../../store';
import { CaaCases } from 'api/caaCases/interfaces';

@Component({
  selector: 'app-cases-results-table',
  templateUrl: './cases-results-table.component.html',
  styleUrls: ['./cases-results-table.component.scss'],
  standalone: false
})
export class CasesResultsTableComponent {
  private _allCaseTypes: SubNavigation[];
  private _cases: any; // can we type this?

  @Input() set allCaseTypes(value: SubNavigation[]) {
    this._allCaseTypes = value;
    this.fixCurrentTab(this._allCaseTypes);
  }

  @Input() set casesConfig(value: CaaCases) {
    if (value){
      this.tableConfig = value;
      this.setTableConfig(this.tableConfig);
    }
  }

  get cases(): SubNavigation[] {
    return this._cases;
  }

  @Input() set cases(value: any) {
    if (value){
      this._cases = value;
    }
  }

  @Input() paginationPageSize: number = 25;
  @Input() shareButtonText = 'Share case';

  @Output() public caseSelected = new EventEmitter<any[]>();
  @Output() public pageChanged = new EventEmitter<number>();
  @Output() public shareButtonClicked = new EventEmitter<void>();

  // Needed for the tab group
  public navItems: any[];
  public currentPageNo: number;
  public totalCases: number = 0;
  public tableConfig: TableConfig;
  public currentCaseType: string;

  public casesError$: Observable<HttpErrorResponse>;
  public noCasesFoundMessage = '';
  public enableShareButton = false;

  public selectedCases: any[] = [];
  public selectedAssignedCases: any[] = [];
  public selectedUnassignedCases: any[] = [];

  @ViewChild('tabGroup') public tabGroup: MatTabGroup;

  /**
   *
   */
  constructor(private readonly store: Store<fromStore.CaaCasesState>,) {

  }

  public tabChanged(event: { tab: { textLabel: string }}): void {
    this.totalCases = this.navItems.find((data) => data.text === event.tab.textLabel)
      ? this.navItems.find((data) => data.text === event.tab.textLabel).total
      : 0;
    this.setTabItems(event.tab.textLabel, true);
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

  public setTableConfig(config: TableConfig): void {
    if (config !== null) {
      this.tableConfig = {
        idField: config.idField,
        columnConfigs: config.columnConfigs
      };
    }
  }

  public onCaseSelection(selectedCases: any[]): void {
    this.caseSelected.emit(selectedCases);
    this.enableShareButton = selectedCases.length > 0;
  }

  public onPaginationHandler(pageNo: number): void {
    this.currentPageNo = pageNo;
    this.pageChanged.emit(pageNo);
  }

  public onShareButtonClicked(): void {
    // this.store.dispatch(new fromStore.AddShareUnassignedCases({
    //   sharedCases: converters.toShareCaseConverter(this.selectedUnassignedCases, this.currentCaseType)
    // }));
    // TODO: emit this action
    this.shareButtonClicked.emit();
  }

  private fixCurrentTab(items: any): void {
    this.navItems = items;
    if (items && items.length > 0) {
      this.totalCases = items[0].total ? items[0].total : 0;
      this.setTabItems(items[0].text);
    } else {
      this.totalCases = 0;
      // this.noCasesFoundMessage = this.getNoCasesFoundMessage();
    }
  }

  private setTabItems(tabName: string, fromTabChangedEvent?: boolean): void {
    this.resetPaginationParameters();
    // if (this.caaCasesPageType === CaaCasesPageType.UnassignedCases) {
    //   this.store.pipe(select(fromStore.getAllUnassignedCases));
    // } else {
    //   this.store.pipe(select(fromStore.getAllAssignedCases));
    // }
    // this.shareAssignedCases$ = this.store.pipe(select(fromStore.getShareAssignedCaseListState));
    // this.shareUnassignedCases$ = this.store.pipe(select(fromStore.getShareUnassignedCaseListState));
    this.currentCaseType = tabName;
    if (!fromTabChangedEvent && this.tabGroup) {
      this.tabGroup.selectedIndex = 0;
    }
    // this.loadDataFromStore();
  }
}
