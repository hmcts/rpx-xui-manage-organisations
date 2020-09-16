import { SearchResultViewItem } from '@hmcts/ccd-case-ui-toolkit';
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
        expect(tableConfig.columnConfigs.length).toEqual(9);
        expect(tableConfig.columnConfigs[0].header).toEqual('Case created date');
        expect(tableConfig.columnConfigs[0].key).toEqual('caseCreatedDate');
    });
});
