import { of } from 'rxjs';
import { UpdateOrganisationAddressDraft } from '../../store';
import { UpdateAddressDocumentExchangeDetailsComponent } from './update-address-document-exchange-details.component';

describe('UpdateAddressDocumentExchangeDetailsComponent', () => {
  let router;
  let store;
  let component: UpdateAddressDocumentExchangeDetailsComponent;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    store = jasmine.createSpyObj('Store', ['pipe', 'dispatch']);
    store.pipe.and.returnValue(of({ dxNumber: '123', dxExchange: 'LONDON' }));
    component = new UpdateAddressDocumentExchangeDetailsComponent(router, store);
    component.ngOnInit();
  });

  afterEach(() => component.ngOnDestroy());

  it('should expose existing DX details to the shared details component', () => {
    expect(component.dxNumber).toBe('123');
    expect(component.dxExchange).toBe('LONDON');
  });

  it('should save submitted DX details and continue to check answers', () => {
    component.onContinue({ dxNumber: '456', dxExchange: 'MANCHESTER' });

    expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(UpdateOrganisationAddressDraft));
    expect(router.navigate).toHaveBeenCalledWith(['/organisation/update-address/check']);
  });
});
