import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { AddShareAssignedCases, CaaCasesState, getShareAssignedCaseListState, reducers } from '../index';

describe('Share case selectors', () => {
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

  describe('get share case state', () => {
    it('should return assigned share case list state', async () => {
      const sharedCases = [
        { caseId: '1', caseTitle: 'James123' },
        { caseId: '2', caseTitle: 'Steve321' }
      ];
      store.dispatch(new AddShareAssignedCases({ sharedCases }));
      const result = await firstValueFrom(store.pipe(select(getShareAssignedCaseListState)));
      expect(result).toEqual(sharedCases);
    });
  });
});
