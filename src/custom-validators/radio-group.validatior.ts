import { FormGroup, ValidatorFn } from '@angular/forms';

export function radioGroupValidator(): ValidatorFn {
  return function validate (formGroup: FormGroup) {
    if (formGroup.controls) {
      for (const control in formGroup.controls) {
        if (!formGroup.controls[control].valid) {
          return {
            isRadioGroupInvalid: true,
          };
        }
      }
    }


    return null;
  };
}
