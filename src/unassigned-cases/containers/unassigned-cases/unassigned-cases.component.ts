import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store';
@Component({
    selector: 'app-unassigned-cases-component',
    templateUrl: './unassigned-cases.component.html',
  })

export class UnassignedCasesComponent implements OnInit {
    constructor(private readonly store: Store<fromStore.UnassignedCasesState>) {}
    public ngOnInit(): void {
      this.store.dispatch(new fromStore.LoadUnassignedCases());
      this.store.pipe(select(fromStore.getUnassignedCasesState)).subscribe(( data) => {
          console.log(data);
        });
    }

}
