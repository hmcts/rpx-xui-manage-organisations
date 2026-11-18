import { of } from 'rxjs';
import { ClearOrganisationSraUpdate, OrganisationUpdateSra } from '../../store';
import { UpdateSraCheckComponent } from './update-sra-check.component';

describe('UpdateSraCheckComponent', () => {
  let router;
  let store;
  let component: UpdateSraCheckComponent;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    store = jasmine.createSpyObj('Store', ['pipe', 'dispatch']);
    store.pipe.and.returnValues(
      of({ sraId: 'SRA654321' }),
      of(false),
      of(null)
    );
    component = new UpdateSraCheckComponent(router, store);
    component.ngOnInit();
  });

  afterEach(() => component.ngOnDestroy());

  it('should expose the draft SRA ID for the summary', () => {
    expect(component.draft).toEqual({ sraId: 'SRA654321' });
  });

  it('should submit the draft SRA ID', () => {
    component.onSubmit();

    const action = store.dispatch.calls.mostRecent().args[0] as OrganisationUpdateSra;
    expect(action).toEqual(jasmine.any(OrganisationUpdateSra));
    expect(action.payload).toBe('SRA654321');
  });

  it('should not submit twice while an update is in progress', () => {
    component.isSubmitting = true;

    component.onSubmit();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should return to the edit page', () => {
    component.onBack();

    expect(router.navigate).toHaveBeenCalledWith(['/organisation/update-sra']);
  });

  it('should clear the draft and return to the organisation when cancelled', () => {
    component.onCancel();

    expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(ClearOrganisationSraUpdate));
    expect(router.navigate).toHaveBeenCalledWith(['/organisation']);
  });

  it('should display the service error when submission fails', () => {
    component.ngOnDestroy();
    store.pipe.and.returnValues(
      of({ sraId: 'SRA654321' }),
      of(false),
      of(new Error('failed'))
    );
    component = new UpdateSraCheckComponent(router, store);

    component.ngOnInit();

    expect(component.validationErrors).toEqual([{
      id: 'submit-sra-update',
      message: 'Sorry, there is a problem with the service. Try again later'
    }]);
  });
});
