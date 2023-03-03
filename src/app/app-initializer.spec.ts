import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { initApplication } from './app-initializer';
import * as fromApp from './store';

describe('App initializer', () => {
    let store: any;

    beforeEach(() => {
        store = jasmine.createSpyObj<Store<fromApp.State>>('store', ['dispatch', 'pipe']);
        store.pipe.and.callFake(() => of());
    });

    it('is truthy', () => {
        const fn = initApplication(store);
        expect(fn).toBeTruthy();
        fn();
        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.pipe).toHaveBeenCalled();
    });
});
