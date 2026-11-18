import { of } from 'rxjs';
import { ClearOrganisationAddressUpdate, UpdateOrganisationAddressDraft } from '../../store';
import { UpdateAddressComponent } from './update-address.component';

describe('UpdateAddressComponent', () => {
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
    hasDxReference: false,
    dxNumber: null,
    dxExchange: null,
    inInternationalMode: false,
    showExistingAddress: false
  };
  let router;
  let store;
  let component: UpdateAddressComponent;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    store = jasmine.createSpyObj('Store', ['pipe', 'dispatch']);
    store.pipe.and.returnValue(of(draftAddress));
    component = new UpdateAddressComponent(router, store);
    component.ngOnInit();
  });

  afterEach(() => component.ngOnDestroy());

  it('should expose the address update draft to the shared entry component', () => {
    expect(component.draftAddress).toBe(draftAddress as any);
  });

  it('should save a submitted address and continue', () => {
    component.onContinue({ address: draftAddress.address as any, inInternationalMode: false });

    expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(UpdateOrganisationAddressDraft));
    expect(router.navigate).toHaveBeenCalledWith([
      '/organisation/update-address/document-exchange-reference'
    ]);
  });

  it('should clear the draft when cancelled', () => {
    component.onCancel();

    expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(ClearOrganisationAddressUpdate));
    expect(router.navigate).toHaveBeenCalledWith(['/organisation']);
  });
});
