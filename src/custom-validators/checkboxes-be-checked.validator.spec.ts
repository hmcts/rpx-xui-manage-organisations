import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { checkboxesBeCheckedValidator } from './checkboxes-be-checked.validator';

describe('checkboxesBeCheckedValidator', () => {
  it('validation should return true', () => {
    const validatorFn = checkboxesBeCheckedValidator();
    const formGroup = new UntypedFormGroup({
      isChecked: new UntypedFormControl(false),
      name: new UntypedFormControl('someName')
    });
    const validationError = validatorFn(formGroup);
    expect(validationError).not.toBeNull();
    expect(validationError.requireOneCheckboxToBeChecked).toBeTruthy();
  });

  it('validation should be null', () => {
    const validatorFn = checkboxesBeCheckedValidator();
    const formGroup = new UntypedFormGroup({
      isChecked: new UntypedFormControl(true),
      name: new UntypedFormControl('someName')
    });
    const validationError = validatorFn(formGroup);
    expect(validationError).toBeNull();
  });
});
