import { Component, OnInit } from '@angular/core';
import { SearchResultView } from '@hmcts/ccd-case-ui-toolkit';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store';
@Component({
    selector: 'app-unassigned-cases-component',
    templateUrl: './unassigned-cases.component.html',
  })

export class UnassignedCasesComponent implements OnInit {

  private readonly resultsArr: any[] = new Array();
  private resultView: SearchResultView;

  constructor(private readonly store: Store<fromStore.UnassignedCasesState>) {}
  public ngOnInit(): void {
    this.store.dispatch(new fromStore.LoadUnassignedCases());
    this.store.pipe(select(fromStore.getUnassignedCasesState)).subscribe((data) => {
      console.log(data);
    });

    // Do a fake population of resultsArr and resultView just to get some data showing
    this.resultsArr.push({
      case_id: 'abc123',
      case_fields: {
          TextField1: '',
          TextField2: '4748-2828-7712-8233',
          TextField3: '16 Jun 2020'
      }
    });
    this.resultView = {
      hasDrafts: () => false,
      columns: [{
        label: 'Solicitor reference',
        order: 1,
        case_field_id: 'TextField1',
        case_field_type: {
          id: 'Text',
          type: 'Text',
          min: null,
          max: null,
          regular_expression: null,
          fixed_list_items: [],
          complex_fields: [],
          collection_field_type: null
        },
      },
      {
        label: 'Case reference',
        order: 2,
        case_field_id: 'TextField2',
        case_field_type: {
          id: 'Text',
          type: 'Text',
          min: null,
          max: null,
          regular_expression: null,
          fixed_list_items: [],
          complex_fields: [],
          collection_field_type: null
        }
      },
      {
        label: 'Case created date',
        order: 3,
        case_field_id: 'TextField3',
        case_field_type: {
          id: 'Text',
          type: 'Text',
          min: null,
          max: null,
          regular_expression: null,
          fixed_list_items: [],
          complex_fields: [],
          collection_field_type: null
        }
      }],
      results: this.resultsArr,
      result_error: null
    };
  }

}
