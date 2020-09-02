import { Component, OnInit } from '@angular/core';
import { SearchResultViewItem } from '@hmcts/ccd-case-ui-toolkit';
import { TableConfig } from '@hmcts/ccd-case-ui-toolkit/dist/shared/components/case-list/case-list.component';
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
public tableConfig: TableConfig;
public selectedCases: SearchResultViewItem[] = [];
public enableButton: boolean = false;

public navItems: any [];

constructor(private readonly store: Store<fromStore.UnassignedCasesState>,
            private  readonly appRoute: Store<fromRoot.State>) {}

public ngOnInit(): void {
  this.store.dispatch(new fromStore.LoadUnassignedCases());
  this.store.dispatch(new fromStore.LoadUnassignedCaseTypes());
  this.tableConfig = this.getCaveatTableConfig();
  this.store.pipe(select(fromStore.getAllUnassignedCases));

  this.store.pipe(select(fromStore.getAllUnassignedCaseTypes)).subscribe(items => this.fixCurrentTab(items));
}

  private fixCurrentTab(items: any): void {
    this.navItems = items;
    this.cases$ = this.store.pipe(select(fromStore.getAllUnassignedCases)).map(x => x.filter(y => y.caseType === items[0].text));
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

  public onCaseSelection(selectedCases: SearchResultViewItem []) {
    this.selectedCases = selectedCases;
    this.enableButton = this.selectedCases && this.selectedCases.length > 0;
  }

  public tabChanged(event) {
    this.cases$ = this.store.pipe(select(fromStore.getAllUnassignedCases)).map(x => x.filter(y => y.caseType === event.tab.textLabel));
  }
}
