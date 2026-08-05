import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { OrganisationState } from '../../../organisation/store';
import { UserState } from '../../../users/store';
import { CasesComponent } from '../../containers';
import { CaaCasesService } from '../../services';
import { CaaCasesState, getShareCaseListState, reducers } from '../index';
import { ChangeDetectorRef } from '@angular/core';
import { LoaderService } from 'src/shared/modules/loader/services/loader.service';
import { of } from 'rxjs';
import { ENVIRONMENT_CONFIG, EnvironmentConfig } from '../../../models/environmentConfig.model';

describe('Share case selectors', () => {
  let store: Store<CaaCasesState>;
  let organisationStore: Store<OrganisationState>;
  let userStore: Store<UserState>;
  let caaCasesService: jasmine.SpyObj<CaaCasesService>;
  let loaderService: jasmine.SpyObj<LoaderService>;
  let cdr: ChangeDetectorRef;
  let mockEnvironmentConfig: EnvironmentConfig;
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
    loaderService = jasmine.createSpyObj<LoaderService>('loaderService', ['show', 'hide'], {
      loaderState: of({ show: false })
    });
    mockEnvironmentConfig = {
      idamWeb: '',
      manageCaseLink: '',
      manageOrgLink: '',
      protocol: '',
      googleAnalyticsKey: '',
      ogdUpdateRefreshUserEnabled: false
    };
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('cases', reducers),
        RouterTestingModule
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: CaaCasesService, useValue: caaCasesService },
        { provide: LoaderService, useValue: loaderService },
        { provide: ENVIRONMENT_CONFIG, useValue: mockEnvironmentConfig }
      ]
    });
    store = TestBed.inject(Store);
    organisationStore = TestBed.inject(Store);
    userStore = TestBed.inject(Store);
    cdr = TestBed.inject(ChangeDetectorRef);
    spyOn(store, 'dispatch').and.callThrough();
  });

  describe('get share case state', () => {
    xit('should return search state', () => {
      const caseListComponent = new CasesComponent(store, organisationStore, userStore, router, caaCasesService, loaderService, cdr, mockEnvironmentConfig);
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
      //caseListComponent.shareAssignedCaseSubmit();
      let result = [];
      store.pipe(select(getShareCaseListState)).subscribe((value) => {
        result = value;
      });
      expect(result.length).toEqual(2);
    });
  });
});
