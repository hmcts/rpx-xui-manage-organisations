import { of } from 'rxjs';
import { ServiceDownComponent } from './service-down.component';

describe('ServiceDownComponent', () => {
    let store: any;
    let component: ServiceDownComponent;
    beforeEach((() => {
        store = jasmine.createSpyObj('store', ['dispatch', 'pipe']);
        component = new ServiceDownComponent(store);
    }));

    it('Component is truthy', () => {
        expect(component).toBeTruthy();
    });

    it('showErrorLinkWithNewTab', () => {
        let result = component.showErrorLinkWithNewTab();
        expect(result).toEqual('_self');

        result = component.showErrorLinkWithNewTab(true);
        expect(result).toEqual('_blank');

        result = component.showErrorLinkWithNewTab(false);
        expect(result).toEqual('_self');
    });

    it('ngDestroy', () => {
        component.ngOnDestroy();
        expect(store.dispatch).toHaveBeenCalled();
    });

    it('ngOnInit', () => {
        const error = {header: 'header', errors: []};
        store.pipe.and.returnValue(of(error));
        component.ngOnInit();
        expect(store.pipe).toHaveBeenCalled();
        expect(component.currentError).toEqual(error);
    });

});
