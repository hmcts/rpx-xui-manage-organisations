import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { UserState } from '../../../users/store';
import { OrganisationState } from '../../../organisation/store';
import { CaaCasesComponent } from '../../containers';
import { CaaCasesState, getShareCaseListState, reducers } from '../index';
import { CaaCasesService } from '../../services';

describe('Share case selectors', () => {
  let store: Store<CaaCasesState>;
  let organisationStore: Store<OrganisationState>;
  let userStore: Store<UserState>;
  let caaCasesService: CaaCasesService
  const router: any = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('cases', reducers),
        RouterTestingModule
      ],
      providers: [
        { provide: Router, useValue: router },
        CaaCasesService
      ]
    });
    store = TestBed.get(Store);
    organisationStore = TestBed.get(Store);
    userStore = TestBed.get(Store);
    caaCasesService = TestBed.get(CaaCasesService);
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('get share case state', () => {
    xit('should return search state', () => {
      const caseListComponent = new CaaCasesComponent(store, organisationStore, userStore, router, caaCasesService);
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
