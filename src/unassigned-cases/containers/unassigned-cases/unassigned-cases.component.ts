import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchResultViewItem } from '@hmcts/ccd-case-ui-toolkit';
import { TableConfig } from '@hmcts/ccd-case-ui-toolkit/dist/shared/components/case-list/case-list.component';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../../app/store';
import * as converters from '../../converters/case-converter';
import * as fromStore from '../../store';
import { UnAssignedCases } from '../../store/reducers/unassigned-cases.reducer';

@Component({
  selector: 'app-unassigned-cases-component',
  templateUrl: './unassigned-cases.component.html',
  styleUrls: ['./unassigned-cases.component.scss']
})
export class UnassignedCasesComponent implements OnInit {
public caseTypeStr = 'caseType';
public cases$: Observable<any>;
public selectedCases$: Observable<any>;
public tableConfig: TableConfig;
public selectedCases: SearchResultViewItem[] = [];
public enableButton$: Observable<boolean>;
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
  this.enableButton$ = this.store.pipe(select(fromStore.anySelectedCases));
  this.selectedCases$ = this.store.pipe(select(fromStore.getSelectedCasesList)).take(1);
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

  public onCaseSelection(selectedCases: any []) {
    this.selectedCases = selectedCases.filter(c => c[this.caseTypeStr] === this.currentCaseType);
    this.store.dispatch(new fromStore.UpdateSelectionForCaseType({casetype: this.currentCaseType, cases: this.selectedCases}));
  }

  public tabChanged(event) {
    this.setTabItems(event.tab.textLabel);
  }

  private setTabItems(tabName: string) {
    this.store.pipe(select(fromStore.getAllUnassignedCases));
    this.store.dispatch(new fromStore.LoadUnassignedCases(tabName));
    this.cases$ = this.store.pipe(select(fromStore.getAllUnassignedCaseData));
    this.currentCaseType = tabName;
  }
}
