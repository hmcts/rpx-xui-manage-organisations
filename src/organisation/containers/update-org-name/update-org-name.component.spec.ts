import { of } from 'rxjs';
import { CompanyHouseDetailsMessage } from '../../../register-org/models';
import { ClearOrganisationNameUpdate, UpdateOrganisationNameDraft } from '../../store';
import { UpdateOrgNameComponent } from './update-org-name.component';

describe('UpdateOrgNameComponent', () => {
  let router;
  let store;
  let component: UpdateOrgNameComponent;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    store = jasmine.createSpyObj('Store', ['pipe', 'dispatch']);
    store.pipe.and.returnValue(of({ name: 'Current organisation' }));
    component = new UpdateOrgNameComponent(router, store);
    component.ngOnInit();
  });

  afterEach(() => component.ngOnDestroy());

  it('should initialise the form from the store draft', () => {
    expect(component.companyHouseFormGroup.controls.companyName.value).toBe('Current organisation');
  });

  it('should save the name draft and continue to check answers', () => {
    component.companyHouseFormGroup.controls.companyName.setValue('Updated organisation');

    component.onContinue();

    const action = store.dispatch.calls.mostRecent().args[0] as UpdateOrganisationNameDraft;
    expect(action).toEqual(jasmine.any(UpdateOrganisationNameDraft));
    expect(action.payload).toEqual({ name: 'Updated organisation' });
    expect(router.navigate).toHaveBeenCalledWith(['/organisation/update-org-name/check']);
  });

  it('should show an error and remain on the page when the name is empty', () => {
    component.companyHouseFormGroup.controls.companyName.setValue('');

    component.onContinue();

    expect(component.validationErrors).toEqual([{
      id: 'company-name',
      message: CompanyHouseDetailsMessage.NO_ORG_NAME
    }]);
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should clear the draft and return to the organisation when cancelled', () => {
    component.onCancel();

    expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(ClearOrganisationNameUpdate));
    expect(router.navigate).toHaveBeenCalledWith(['/organisation']);
  });
});
