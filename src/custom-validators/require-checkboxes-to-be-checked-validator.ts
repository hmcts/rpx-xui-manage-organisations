import { FormGroup, ValidatorFn } from '@angular/forms';

export function requireCheckboxesToBeCheckedValidator(minRequired = 1): ValidatorFn {
  return function validate (formGroup: FormGroup) {
    let checked = 0;

    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];

      if (control.value === true) {
        checked ++;
      }
    });

    if (checked < minRequired) {
      return {
        requireOneCheckboxToBeChecked: true,
      };
    }

    return null;
  };
}
