import { of } from 'rxjs';
import { UpdateOrganisationAddressDraft } from '../../store';
import { UpdateAddressDocumentExchangeComponent } from './update-address-document-exchange.component';

describe('UpdateAddressDocumentExchangeComponent', () => {
  let router;
  let store;
  let component: UpdateAddressDocumentExchangeComponent;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    store = jasmine.createSpyObj('Store', ['pipe', 'dispatch']);
    store.pipe.and.returnValue(of({ hasDxReference: false }));
    component = new UpdateAddressDocumentExchangeComponent(router, store);
    component.ngOnInit();
  });

  afterEach(() => component.ngOnDestroy());

  it('should expose the existing DX answer to the shared question component', () => {
    expect(component.hasDxReference).toBeFalse();
  });

  it('should clear DX details and continue to check answers when no is submitted', () => {
    component.onContinue(false);

    expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(UpdateOrganisationAddressDraft));
    expect(router.navigate).toHaveBeenCalledWith(['/organisation/update-address/check']);
  });

  it('should continue to DX details when yes is submitted', () => {
    component.onContinue(true);

    expect(router.navigate).toHaveBeenCalledWith([
      '/organisation/update-address/document-exchange-reference-details'
    ]);
  });
});
