import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { OrganisationState } from '../../../organisation/store';
import { CaaCasesComponent } from '../../containers';
import { getShareCaseListState, reducers, CaaCasesState } from '../index';

describe('Share case selectors', () => {
  let store: Store<CaaCasesState>;
  let organisationStore: Store<OrganisationState>;
  let router: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('cases', reducers),
        RouterTestingModule
      ]
    });
    store = TestBed.get(Store);
    organisationStore = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('get share case state', () => {
    xit('should return search state', () => {
      const caseListComponent = new CaaCasesComponent(store, organisationStore, router);
      caseListComponent.selectedCases = [{
        case_id: '1',
        case_fields: {
          solsSolicitorAppReference: 'James123'
        }
      }, {
        case_id: '2',
        case_fields: {
          solsSolicitorAppReference: 'Steve321'
        }
      }];
      caseListComponent.shareCaseSubmit();
      let result = [];
      store.pipe(select(getShareCaseListState)).subscribe(value => {
        result = value;
      });
      expect(result.length).toEqual(2);
    });
  });

});
