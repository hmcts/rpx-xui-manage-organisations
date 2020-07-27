import { Component, OnInit } from '@angular/core';
import { SearchResultViewItem } from '@hmcts/ccd-case-ui-toolkit';
import { select, Store } from '@ngrx/store';
import * as converters from '../../converters/case-converter';
import * as fromStore from '../../store';

@Component({
    selector: 'app-unassigned-cases-component',
    templateUrl: './unassigned-cases.component.html',
  })

export class UnassignedCasesComponent implements OnInit {
  public selectedCases: SearchResultViewItem[] = [];

  constructor(private readonly store: Store<fromStore.UnassignedCasesState>) {}
    public ngOnInit(): void {
      this.store.dispatch(new fromStore.LoadUnassignedCases());
      this.store.pipe(select(fromStore.getUnassignedCasesState)).subscribe(( data) => {
          console.log(data);
        });
    }

  public shareCaseSubmit() {
    this.store.dispatch(new fromStore.AddShareCases({
      sharedCases: converters.toShareCaseConverter(this.selectedCases)
    }));
  }
}
