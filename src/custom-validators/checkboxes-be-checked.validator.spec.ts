import { FormControl, FormGroup } from '@angular/forms';
import {checkboxesBeCheckedValidator} from './checkboxes-be-checked.validator';

describe('checkboxesBeCheckedValidator', () => {
    it('validation should return true', () => {
        const validatorFn = checkboxesBeCheckedValidator();
        const formGroup = new FormGroup({
            isChecked: new FormControl(false),
            name: new FormControl('someName')
          });
        const validationError = validatorFn(formGroup);
        expect(validationError).not.toBeNull();
        expect(validationError.requireOneCheckboxToBeChecked).toBeTruthy();
    });

    it('validation should be null', () => {
        const validatorFn = checkboxesBeCheckedValidator();
        const formGroup = new FormGroup({
            isChecked: new FormControl(true),
            name: new FormControl('someName')
          });
        const validationError = validatorFn(formGroup);
        expect(validationError).toBeNull();
    });
});
