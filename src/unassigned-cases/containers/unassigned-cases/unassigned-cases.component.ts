import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchResultViewItem } from '@hmcts/ccd-case-ui-toolkit';
import { CaseListComponent, TableConfig } from '@hmcts/ccd-case-ui-toolkit/dist/shared/components/case-list/case-list.component';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../../app/store';
import * as converters from '../../converters/case-converter';
import * as fromStore from '../../store';
import { UnassignedCase } from '../../store/reducers/unassigned-cases.reducer';

@Component({
  selector: 'app-unassigned-cases-component',
  templateUrl: './unassigned-cases.component.html',
  styleUrls: ['./unassigned-cases.component.scss']
})
export class UnassignedCasesComponent implements OnInit {

public cases$: Observable<UnassignedCase []>;
public selectedCases$: Observable<UnassignedCase []>;
public tableConfig: TableConfig;
public selectedCases: SearchResultViewItem[] = [];
public enableButton$: Observable<boolean>;
public currentCaseType: string;

public navItems: any [];

constructor(private readonly store: Store<fromStore.UnassignedCasesState>,
            private  readonly appRoute: Store<fromRoot.State>) {}

public ngOnInit(): void {
  this.store.dispatch(new fromStore.LoadUnassignedCaseTypes());
  this.tableConfig = this.getCaveatTableConfig();
  this.store.pipe(select(fromStore.getAllUnassignedCases));

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

  public getCaveatTableConfig(): any {
    return {
      idField: 'caseRef',
      columnConfigs: [
        { header: 'Case created date', key: 'caseCreatedDate', type: 'date' },
        { header: 'Case due date', key: 'caseDueDate', type: 'date' },
        { header: 'Case reference', key: 'caseRef' },
        { header: 'Pet. First name', key: 'petFirstName' },
        { header: 'Pet. Last name', key: 'petLastName' },
        { header: 'Resp. First name', key: 'respFirstName' },
        { header: 'Resp. Last name', key: 'respLastName' },
        { header: 'Solicitor reference', key: 'sRef' },
        { header: 'Case Type', key: 'caseType' }
      ] as any[]
    };
  }

  public shareCaseSubmit() {
    this.store.dispatch(new fromStore.AddShareCases({
      sharedCases: converters.toShareCaseConverter(this.selectedCases)
    }));
  }

  public onCaseSelection(selectedCases: any []) {
    this.selectedCases = selectedCases.filter(c => c.caseType === this.currentCaseType);
    this.store.dispatch(new fromStore.UpdateSelectionForCaseType({casetype: this.currentCaseType, cases: this.selectedCases}));
  }

  public tabChanged(event) {
    this.setTabItems(event.tab.textLabel);
  }

  private setTabItems(tabName: string) {
    this.store.dispatch(new fromStore.LoadUnassignedCases(tabName));
    this.cases$ = this.store.pipe(select(fromStore.getAllUnassignedCases)).map(x => x.filter(y => y.caseType === tabName));
    this.currentCaseType = tabName;
  }
}
