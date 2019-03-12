import { FormGroup, ValidatorFn } from '@angular/forms';

export function dateValidator(): ValidatorFn {
  return function validate (formGroup: FormGroup) {

    const d = new Date(
      parseInt(formGroup.controls.day.value, 10),
      parseInt(formGroup.controls.month.value, 10) - 1,
      parseInt(formGroup.controls.year.value, 10) - 1
    );

    function isValidDate(d) {
      return d instanceof Date && !isNaN( +d );
    }

    if (!isValidDate(d)) {
      return {
        dateIsInvalid: true,
      };
    }

    return null;
  };
}
