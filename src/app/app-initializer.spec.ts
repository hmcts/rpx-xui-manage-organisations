import { initApplication } from './app-initializer';

describe('App initializer', () => {
    let store: any;
    beforeEach(() => {
        store = jasmine.createSpyObj('store', ['dispatch', 'pipe']);
    });
    it('is truthy', () => {
        const fn = initApplication(store);
        expect(fn).toBeTruthy();
        fn();
        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.pipe).toHaveBeenCalled();
    });
});
