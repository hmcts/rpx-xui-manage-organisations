import { UnassignedCasesComponent } from './unassigned-cases.component';

describe('UnassignedCasesComponent', () => {
    let component: UnassignedCasesComponent;
    let store: any;
    let appStore: any;
    beforeEach(() => {
        store = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
        appStore = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
        component = new UnassignedCasesComponent(store, appStore);
    });

    it('is truthy', () => {
        expect(component).toBeTruthy();
    });
});
