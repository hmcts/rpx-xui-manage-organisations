import { of } from 'rxjs';
import { UnassignedCase } from '../../store/reducers/unassigned-cases.reducer';
import { UnassignedCasesComponent } from './unassigned-cases.component';

describe('UnassignedCasesComponent', () => {
    let component: UnassignedCasesComponent;
    let store: any;
    beforeEach(() => {
        store = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
        component = new UnassignedCasesComponent(store);
    });

    it('is truthy', () => {
        expect(component).toBeTruthy();
    });

    it('getCaveatColumnConfig', () => {
        const columnConfig = component.getCaveatColumnConfig();
        expect(columnConfig.length).toEqual(8);
        expect(columnConfig[0].header).toEqual('Case created date');
        expect(columnConfig[0].key).toEqual('caseCreatedDate');
    });

    it('ngOnInit', () => {
        const unassingedCase: UnassignedCase = {
            caseCreatedDate: new Date(2020, 1, 1),
            caseDueDate: new Date(2020, 1, 1),
            caseRef: '1234',
            petFirstName: 'first',
            petLastName: 'last',
            respFirstName: 'first1',
            respLastName: 'last1',
            sRef: 'sref'
        };
        const spyOnColumnConfig = spyOn(component, 'getCaveatColumnConfig');
        store.pipe.and.returnValue(of([unassingedCase]));
        component.ngOnInit();
        expect(store.dispatch).toHaveBeenCalled();
        expect(store.pipe).toHaveBeenCalled();
        expect(spyOnColumnConfig).toHaveBeenCalled();
    });
});
