import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { reducers } from '../reducers';
import { CaaCasesState, initialState } from '../reducers/caa-cases.reducer';
import {
  getAllAssignedCases,
  getAllAssignedCasesError,
  getAllCaseTypes,
  getAllUnassignedCases,
  getAllUnassignedCasesError,
  getSelectedCases
} from './caa-cases.selector';

describe('CaaCases selectors', () => {
  let store: Store<CaaCasesState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('caaCases', reducers)
      ]
    });
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should return all assigned cases', () => {
    let result;
    store.pipe(select(getAllAssignedCases)).subscribe((value) => {
      result = value;
    });
    expect(result).toEqual(initialState.assignedCases);
  });

  it('should return all assigned cases error', () => {
    let result;
    store.pipe(select(getAllAssignedCasesError)).subscribe((value) => {
      result = value;
    });
    expect(result).toEqual(initialState.assignedCasesLastError);
  });

  it('should return all unassigned cases', () => {
    let result;
    store.pipe(select(getAllUnassignedCases)).subscribe((value) => {
      result = value;
    });
    expect(result).toEqual(initialState.unassignedCases);
  });

  it('should return all unassigned cases error', () => {
    let result;
    store.pipe(select(getAllUnassignedCasesError)).subscribe((value) => {
      result = value;
    });
    expect(result).toEqual(initialState.assignedCasesLastError);
  });

  it('should return all case types', () => {
    let result;
    store.pipe(select(getAllCaseTypes)).subscribe((value) => {
      result = value;
    });
    expect(result).toEqual(initialState.caseTypes);
  });

  it('should return selected cases', () => {
    let result;
    store.pipe(select(getSelectedCases)).subscribe((value) => {
      result = value;
    });
    expect(result).toEqual(initialState.selectedCases);
  });
});
