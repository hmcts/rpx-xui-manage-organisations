import { InviteUserComponent } from './invite-user.component';

describe('User Details Component', () => {

    let component: InviteUserComponent;
    let userStoreSpyObject;

    beforeEach(() => {
        userStoreSpyObject = jasmine.createSpyObj('Store', ['pipe', 'select', 'dispatch']);
        const actionSpy = jasmine.createSpyObj('actionSpy', ['pipe']);
        component = new InviteUserComponent(userStoreSpyObject, actionSpy);
    });

    it('Is Truthy', () => {
        expect(component).toBeTruthy();
    });

    it('unsubscribe', () => {
        const mockSubscription = jasmine.createSpyObj('subscription', ['unsubscribe']);
        component.unSubscribe(mockSubscription);
        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('getBackLink', () => {
        let link = component.getBackLink(null);
        expect(link).toEqual('/users');

        const user = {
            routerLink: '',
            fullName: 'name',
            email: 'someemail',
            status: 'active',
            resendInvite: false,
            userIdentifier: 'id1234'
          };
        link = component.getBackLink(user);
        expect(link).toEqual('/users/user/id1234');
    });

    it('dispathAction', () => {
        const mockAction = jasmine.createSpyObj('action', ['payload']);
        const mockStore = jasmine.createSpyObj('store', ['dispatch']);
        component.dispathAction(mockAction, mockStore);
        expect(mockStore.dispatch).toHaveBeenCalledWith(mockAction);
    });
});
