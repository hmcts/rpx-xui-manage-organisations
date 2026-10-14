import { FormGroup } from '@angular/forms';
import { FormBuilderComponent } from './form-builder.component';

describe('FormBuilderComponent', () => {
  let component: FormBuilderComponent;
  let formsService: any;
  let validationService: any;

  beforeEach(() => {
    formsService = { defineFormControls: jasmine.createSpy('defineFormControls').and.returnValue({}) };
    validationService = {
      createFormGroupValidators: jasmine.createSpy('createFormGroupValidators').and.returnValue([])
    };
    component = new FormBuilderComponent(formsService, validationService);
  });

  it('exposes the first fieldset containing the page legend', () => {
    component.pageItems = {
      groups: [
        { fieldset: [{ input: { id: 'name' } }] },
        { fieldset: [{ legend: { text: 'Organisation details' } }] }
      ]
    };

    expect(component.pageHeadingFieldset).toBe(component.pageItems.groups[1].fieldset);
  });

  it('does not expose a page heading fieldset when the page has a header', () => {
    component.pageItems = { header: 'Organisation details', groups: [] };
    expect(component.pageHeadingFieldset).toBeUndefined();
  });

  it('creates the form and applies group validators when page items change', () => {
    component.pageItems = { formGroupValidators: ['required'] };
    component.pageValues = {};
    component.ngOnChanges({ pageItems: { currentValue: component.pageItems } } as any);

    expect(formsService.defineFormControls).toHaveBeenCalledWith(component.pageItems, {});
    expect(validationService.createFormGroupValidators).toHaveBeenCalledWith(
      jasmine.any(FormGroup),
      ['required']
    );
  });

  it('emits submit, button and blur events', () => {
    component.formDraft = new FormGroup({});
    spyOn(component.submitPage, 'emit');
    spyOn(component.btnClick, 'emit');
    spyOn(component.blurCast, 'emit');

    component.onFormSubmit();
    component.onBtnClick('continue');
    component.onBlur('email');

    expect(component.submitPage.emit).toHaveBeenCalledWith(component.formDraft);
    expect(component.btnClick.emit).toHaveBeenCalledWith({ eventId: 'continue', data: component.formDraft });
    expect(component.blurCast.emit).toHaveBeenCalledWith('email');
  });

  it('creates stable keys for form groups', () => {
    expect(component.trackByFormGroup(2, { id: 'contact' })).toBe('contact#2');
    expect(component.trackByFormGroup(2, {})).toBe(2);
  });
});
