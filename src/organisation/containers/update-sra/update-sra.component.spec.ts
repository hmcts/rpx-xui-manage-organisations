import { of } from 'rxjs';
import { ClearOrganisationSraUpdate, UpdateOrganisationSraDraft } from '../../store';
import { UpdateSraComponent } from './update-sra.component';

describe('UpdateSraComponent', () => {
  let router;
  let store;
  let component: UpdateSraComponent;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    store = jasmine.createSpyObj('Store', ['pipe', 'dispatch']);
    store.pipe.and.returnValue(of({ sraId: 'SRA123456' }));
    component = new UpdateSraComponent(router, store);
    component.ngOnInit();
  });

  afterEach(() => component.ngOnDestroy());

  it('should initialise the form from the store draft', () => {
    expect(component.sraFormGroup.controls.sraId.value).toBe('SRA123456');
  });

  it('should save the SRA draft and continue to check answers', () => {
    component.sraFormGroup.controls.sraId.setValue('SRA654321');

    component.onContinue();

    const action = store.dispatch.calls.mostRecent().args[0] as UpdateOrganisationSraDraft;
    expect(action).toEqual(jasmine.any(UpdateOrganisationSraDraft));
    expect(action.payload).toEqual({ sraId: 'SRA654321' });
    expect(router.navigate).toHaveBeenCalledWith(['/organisation/update-sra/check']);
  });

  it('should show an error and remain on the page when the SRA ID is empty', () => {
    component.sraFormGroup.controls.sraId.setValue('');

    component.onContinue();

    expect(component.validationErrors).toEqual([{
      id: 'sra-id',
      message: 'Enter a SRA ID'
    }]);
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should clear the draft and return to the organisation when cancelled', () => {
    component.onCancel();

    expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(ClearOrganisationSraUpdate));
    expect(router.navigate).toHaveBeenCalledWith(['/organisation']);
  });
});
