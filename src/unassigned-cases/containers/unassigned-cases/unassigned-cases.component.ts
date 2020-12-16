import { Component, OnInit } from '@angular/core';
import { TableConfig } from '@hmcts/ccd-case-ui-toolkit/dist/shared/components/case-list/case-list.component';
import { SharedCase } from '@hmcts/rpx-xui-common-lib/lib/models/case-share.model';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../../app/store';
import * as converters from '../../converters/case-converter';
import * as fromStore from '../../store';
import { UnAssignedCases } from '../../store/reducers';

@Component({
  selector: 'app-unassigned-cases-component',
  templateUrl: './unassigned-cases.component.html',
  styleUrls: ['./unassigned-cases.component.scss']
})
export class UnassignedCasesComponent implements OnInit {

public cases$: Observable<any>;
// this shareCases$ will be passed to case share component
public shareCases$: Observable<SharedCase[]>;
public tableConfig: TableConfig;
// this selectedCases is emitted from the ccd-case-list
// ideally the any[] should be mapped with the unassigned case payload
public selectedCases: any[] = [];
public currentCaseType: string;

public navItems: any [];

constructor(private readonly store: Store<fromStore.UnassignedCasesState>,
            private  readonly appRoute: Store<fromRoot.State>) {}

public ngOnInit(): void {
  this.store.dispatch(new fromStore.LoadUnassignedCaseTypes());
  this.store.pipe(select(fromStore.getAllUnassignedCases)).subscribe((config: UnAssignedCases) => {
    if (config !== null) {
      this.tableConfig =  {
        idField: config.idField,
        columnConfigs: config.columnConfigs
      };
    }
  });
  this.store.pipe(select(fromStore.getAllUnassignedCaseTypes)).subscribe(items => this.fixCurrentTab(items));
  this.shareCases$ = this.store.pipe(select(fromStore.getShareCaseListState));
  this.shareCases$.subscribe(shareCases => this.selectedCases = converters.toSearchResultViewItemConverter(shareCases));
}

  private fixCurrentTab(items: any): void {
    this.navItems = items;
    if (items && items.length > 0) {
      this.setTabItems(items[0].text);
    }
  }

  public shareCaseSubmit() {
    this.store.dispatch(new fromStore.AddShareCases({
      sharedCases: converters.toShareCaseConverter(this.selectedCases, this.currentCaseType)
    }));
  }

  public onCaseSelection(selectedCases: any[]) {
    this.selectedCases = selectedCases;
    this.store.dispatch(new fromStore.SynchronizeStateToStore(
      converters.toShareCaseConverter(this.selectedCases, this.currentCaseType)
    ));
  }

  public tabChanged(event) {
    this.setTabItems(event.tab.textLabel);
  }

  private setTabItems(tabName: string) {
    this.store.pipe(select(fromStore.getAllUnassignedCases));
    this.shareCases$ = this.store.pipe(select(fromStore.getShareCaseListState));
    this.store.dispatch(new fromStore.LoadUnassignedCases(tabName));
    this.cases$ = this.store.pipe(select(fromStore.getAllUnassignedCaseData));
    this.currentCaseType = tabName;
  }
}
