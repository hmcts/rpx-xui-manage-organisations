import { OrganisationAccountsComponent } from './account-overview.component';

describe('OrganisationAccountsComponent', () => {
    let component: OrganisationAccountsComponent;
    const feeStore = jasmine.createSpyObj('feeStore', ['pipe']);
    const organisationStore = jasmine.createSpyObj('feeStore', ['pipe']);
    const actions = jasmine.createSpyObj('feeStore', ['pipe']);
    const routerStore = jasmine.createSpyObj('feeStore', ['pipe']);


    beforeEach(() => {
        component = new OrganisationAccountsComponent(feeStore, organisationStore, actions, routerStore);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});
