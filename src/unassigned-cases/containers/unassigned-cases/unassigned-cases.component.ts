import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store';

@Component({
    selector: 'app-unassigned-cases-component',
    templateUrl: './unassigned-cases.component.html',
  })
export class UnassignedCasesComponent implements OnInit {

  private caseListItems: any[];
  private columnNames: string[];

  constructor(private readonly store: Store<fromStore.UnassignedCasesState>) {}
  public ngOnInit(): void {
    this.store.dispatch(new fromStore.LoadUnassignedCases());
    // Static column names for now
    this.columnNames = [
      'Case created date',
      'Case due date',
      'Case reference',
      'Pet. First name',
      'Pet. Last name',
      'Resp. First name',
      'Resp. Last name',
      'Solicitor reference'
    ];
    this.store.pipe(select(fromStore.getUnassignedCasesState)).subscribe((data) => {
      console.log(data);
      // Problem is this is asynchronous and will be populated too late for Case List component
      this.caseListItems = data as unknown as any[];
    });
  }
}
