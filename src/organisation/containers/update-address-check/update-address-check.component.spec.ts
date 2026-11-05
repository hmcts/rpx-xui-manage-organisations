import { of } from 'rxjs';
import { OrganisationUpdateAddress } from '../../store';
import { UpdateAddressCheckComponent } from './update-address-check.component';

describe('UpdateAddressCheckComponent', () => {
  const draftAddress = {
    address: {
      addressLine1: '1 High Street',
      addressLine2: null,
      addressLine3: null,
      postTown: 'London',
      county: null,
      country: 'UK',
      postCode: 'SW1A 1AA'
    },
    hasDxReference: true,
    dxNumber: '123',
    dxExchange: 'LONDON',
    inInternationalMode: false
  };
  let router;
  let store;
  let component: UpdateAddressCheckComponent;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    store = jasmine.createSpyObj('Store', ['pipe', 'dispatch']);
    store.pipe.and.returnValues(of(draftAddress), of(false), of(null));
    component = new UpdateAddressCheckComponent(router, store);
    component.ngOnInit();
  });

  afterEach(() => component.ngOnDestroy());

  it('should submit mapped contact information', () => {
    component.onSubmit();

    const action = store.dispatch.calls.mostRecent().args[0] as OrganisationUpdateAddress;
    expect(action).toEqual(jasmine.any(OrganisationUpdateAddress));
    expect(action.payload.townCity).toBe('London');
    expect(action.payload.dxAddress[0].dxNumber).toBe('123');
  });

  it('should return to DX details when the draft has a DX reference', () => {
    component.onBack();

    expect(router.navigate).toHaveBeenCalledWith([
      '/organisation/update-address/document-exchange-reference-details'
    ]);
  });

  it('should show the standard service error against the submit button when the update fails', () => {
    component.ngOnDestroy();
    store.pipe.and.returnValues(of(draftAddress), of(false), of(new Error('failed')));
    component = new UpdateAddressCheckComponent(router, store);

    component.ngOnInit();

    expect(component.validationErrors).toEqual([{
      id: 'submit-address-update',
      message: 'Sorry, there is a problem with the service. Try again later'
    }]);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
