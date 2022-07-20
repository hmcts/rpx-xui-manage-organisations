import { Component, OnInit } from '@angular/core';
import { TableConfig } from '@hmcts/ccd-case-ui-toolkit/dist/shared/components/case-list/case-list.component';
import { SharedCase } from '@hmcts/rpx-xui-common-lib/lib/models/case-share.model';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../../app/store';
import * as converters from '../../converters/case-converter';
import { CaaCases } from '../../models/caa-cases.model';
import * as fromStore from '../../store';

@Component({
  selector: 'app-caa-cases-component',
  templateUrl: './caa-cases.component.html',
  styleUrls: ['./caa-cases.component.scss']
})
export class CaaCasesComponent implements OnInit {

  public cases$: Observable<any>;
  // this shareCases$ will be passed to case share component
  public shareCases$: Observable<SharedCase[]>;
  public tableConfig: TableConfig;
  // this selectedCases is emitted from the ccd-case-list
  // ideally the any[] should be mapped with the unassigned case payload
  public selectedCases: any[] = [];
  public currentCaseType: string;

  public navItems: any [];
  public currentPageNo: number;
  public paginationPageSize: number = 25;
  public totalCases: number = 0;
  public caaCasesFilterType: string;

  constructor(
    private readonly store: Store<fromStore.CaaCasesState>,
    private readonly appRoute: Store<fromRoot.State>
  ) {
  }

  public ngOnInit(): void {
    this.store.dispatch(new fromStore.LoadCaseTypes());
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
    this.store.pipe(select(fromStore.getAllAssignedCases));
    this.shareCases$ = this.store.pipe(select(fromStore.getShareCaseListState));
    this.store.dispatch(new fromStore.LoadUnassignedCases({caseType: tabName, pageNo: this.currentPageNo, pageSize: this.paginationPageSize}));
    this.cases$ = this.store.pipe(select(fromStore.getAllAssignedCaseData));
    this.currentCaseType = tabName;
  }

  public onPaginationHandler(pageNo: number): void {
    this.currentPageNo = pageNo;
    this.store.dispatch(new fromStore.LoadUnassignedCases({caseType: this.currentCaseType, pageNo: this.currentPageNo, pageSize: this.paginationPageSize}));
    this.cases$ = this.store.pipe(select(fromStore.getAllAssignedCaseData));
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
}
