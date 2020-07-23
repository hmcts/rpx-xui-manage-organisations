import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromStore from '../../store';
import { UnassignedCase } from '../../store/reducers/unassigned-cases.reducer';

@Component({
    selector: 'app-unassigned-cases-component',
    templateUrl: './unassigned-cases.component.html',
  })
export class UnassignedCasesComponent implements OnInit {

  private rows$: Observable<UnassignedCase []>;
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
    this.rows$ = this.store.pipe(select(fromStore.getUnassignedCases));
  }
}
