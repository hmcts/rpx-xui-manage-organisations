import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store';

@Component({
    selector: 'app-unassigned-cases-component',
    templateUrl: './unassigned-cases.component.html',
  })
export class UnassignedCasesComponent implements OnInit {

  private rows: any[];
  private columnConfig: any[];

  constructor(private readonly store: Store<fromStore.UnassignedCasesState>) {}
  public ngOnInit(): void {
    this.store.dispatch(new fromStore.LoadUnassignedCases());
    // Static column names for now
    this.columnConfig = [
      { header: 'Case created date', key: 'caseCreatedDate', type: 'date' },
      { header: 'Case due date', key: 'caseDueDate', type: 'date' },
      { header: 'Case reference', key: 'caseRef' },
      { header: 'Pet. First name', key: 'petFirstName' },
      { header: 'Pet. Last name', key: 'petLastName' },
      { header: 'Resp. First name', key: 'respFirstName' },
      { header: 'Resp. Last name', key: 'respLastName' },
      { header: 'Solicitor reference', key: 'sRef' }
    ];
    this.store.pipe(select(fromStore.getUnassignedCasesState)).subscribe((data) => {
      console.log(data);
      this.rows = data.unassignedCases;
    });
  }
}
