import { of } from 'rxjs';
import { UnassignedCase } from '../../store/reducers/unassigned-cases.reducer';
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

    it('getCaveatTableConfig', () => {
        const tableConfig = component.getCaveatTableConfig();
        expect(tableConfig.idField).toEqual('caseRef');
        expect(tableConfig.columnConfigs.length).toEqual(8);
        expect(tableConfig.columnConfigs[0].header).toEqual('Case created date');
        expect(tableConfig.columnConfigs[0].key).toEqual('caseCreatedDate');
    });

    it('ngOnInit', () => {
        const unassignedCase: UnassignedCase = {
            caseCreatedDate: new Date(2020, 1, 1),
            caseDueDate: new Date(2020, 1, 1),
            caseRef: '1234',
            petFirstName: 'first',
            petLastName: 'last',
            respFirstName: 'first1',
            respLastName: 'last1',
            sRef: 'sref'
        };
        const spyOnColumnConfig = spyOn(component, 'getCaveatTableConfig');
        store.pipe.and.returnValue(of([unassignedCase]));
        component.ngOnInit();
        expect(store.dispatch).toHaveBeenCalled();
        expect(store.pipe).toHaveBeenCalled();
        expect(spyOnColumnConfig).toHaveBeenCalled();
    });
});
