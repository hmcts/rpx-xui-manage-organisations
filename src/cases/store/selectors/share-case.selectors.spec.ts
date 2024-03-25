import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { OrganisationState } from '../../../organisation/store';
import { UserState } from '../../../users/store';
import { CaaCasesComponent } from '../../containers';
import { CaaCasesService } from '../../services';
import { CaaCasesState, getShareAssignedCaseListState, reducers } from '../index';

describe('Share case selectors', () => {
  let store: Store<CaaCasesState>;
  let organisationStore: Store<OrganisationState>;
  let userStore: Store<UserState>;
  let caaCasesService: jasmine.SpyObj<CaaCasesService>;
  const router: any = {};

  beforeEach(() => {
    caaCasesService = jasmine.createSpyObj<CaaCasesService>(
      'caaCasesService',
      [
        'getCaaCases',
        'getCaaCaseTypes',
        'storeSessionState',
        'retrieveSessionState',
        'removeSessionState'
      ]
    );
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('cases', reducers),
        RouterTestingModule
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: CaaCasesService, useValue: caaCasesService }
      ]
    });
    store = TestBed.inject(Store);
    organisationStore = TestBed.inject(Store);
    userStore = TestBed.inject(Store);
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
      caseListComponent.shareAssignedCaseSubmit();
      let result = [];
      store.pipe(select(getShareAssignedCaseListState)).subscribe((value) => {
        result = value;
      });
      expect(result.length).toEqual(2);
    });
  });
});
