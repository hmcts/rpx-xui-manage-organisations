import { of } from 'rxjs';
import { ClearOrganisationNameUpdate, OrganisationUpdateName } from '../../store';
import { UpdateOrgNameCheckComponent } from './update-org-name-check.component';

describe('UpdateOrgNameCheckComponent', () => {
  let router;
  let store;
  let component: UpdateOrgNameCheckComponent;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    store = jasmine.createSpyObj('Store', ['pipe', 'dispatch']);
    store.pipe.and.returnValues(
      of({ name: 'Updated organisation' }),
      of(false),
      of(null)
    );
    component = new UpdateOrgNameCheckComponent(router, store);
    component.ngOnInit();
  });

  afterEach(() => component.ngOnDestroy());

  it('should expose the draft name for the summary', () => {
    expect(component.draft).toEqual({ name: 'Updated organisation' });
  });

  it('should submit the draft name', () => {
    component.onSubmit();

    const action = store.dispatch.calls.mostRecent().args[0] as OrganisationUpdateName;
    expect(action).toEqual(jasmine.any(OrganisationUpdateName));
    expect(action.payload).toBe('Updated organisation');
  });

  it('should not submit twice while an update is in progress', () => {
    component.isSubmitting = true;

    component.onSubmit();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should return to the edit page', () => {
    component.onBack();

    expect(router.navigate).toHaveBeenCalledWith(['/organisation/update-org-name']);
  });

  it('should clear the draft and return to the organisation when cancelled', () => {
    component.onCancel();

    expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(ClearOrganisationNameUpdate));
    expect(router.navigate).toHaveBeenCalledWith(['/organisation']);
  });

  it('should display the service error when submission fails', () => {
    component.ngOnDestroy();
    store.pipe.and.returnValues(
      of({ name: 'Updated organisation' }),
      of(false),
      of(new Error('failed'))
    );
    component = new UpdateOrgNameCheckComponent(router, store);

    component.ngOnInit();

    expect(component.validationErrors).toEqual([{
      id: 'submit-name-update',
      message: 'Sorry, there is a problem with the service. Try again later'
    }]);
  });
});
