import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store';

@Component({
    selector: 'app-unassigned-cases-component',
    templateUrl: './unassigned-cases.component.html',
  })
export class UnassignedCasesComponent implements OnInit {

  private readonly resultsArr: any[] = new Array();
  private caseListItems: any;
  private columnNames: string[];

  constructor(private readonly store: Store<fromStore.UnassignedCasesState>) {}
  public ngOnInit(): void {
    this.store.dispatch(new fromStore.LoadUnassignedCases());
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
      this.caseListItems = data;
    });
  }
}
