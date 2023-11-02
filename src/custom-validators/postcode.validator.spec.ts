import { FormControl } from '@angular/forms';
import { postcodeValidator } from './postcode.validator';

describe('postcodeValidator', () => {
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl({});
  });

  it('validation should return true, when the first part of postcode is invalid', () => {
    control.setValue('l15');
    const validatorFn = postcodeValidator();
    const validationError = validatorFn(control);
    expect(validationError).not.toBeNull();
    expect(validationError.invalidPostcode).toBeTruthy();
  });

  it('validation should return true, when the second part of postcode is invalid', () => {
    control.setValue('l15 555');
    const validatorFn = postcodeValidator();
    const validationError = validatorFn(control);
    expect(validationError).not.toBeNull();
    expect(validationError.invalidPostcode).toBeTruthy();
  });

  it('validation should be undefined when valid postcode is entered lowercase', () => {
    control.setValue('l155ax');
    const validatorFn = postcodeValidator();
    const validationError = validatorFn(control);
    expect(validationError).toBeUndefined();
  });

  it('validation should be undefined when valid postcode is entered uppercase with space', () => {
    control.setValue('L15 5AX');
    const validatorFn = postcodeValidator();
    const validationError = validatorFn(control);
    expect(validationError).toBeUndefined();
  });

  it('validation should be undefined when a valid postcode that is not in postcode database is entered', () => {
    control.setValue('ZZ77 7ZZ');
    const validatorFn = postcodeValidator();
    const validationError = validatorFn(control);
    expect(validationError).toBeUndefined();
  });
});
