import { FormControl, FormGroup } from '@angular/forms';
import { dateValidator } from './date.validator';

describe('dateValidator', () => {
  const buildForm = (day: string, month: string, year: string): FormGroup => new FormGroup({
    day: new FormControl(day),
    month: new FormControl(month),
    year: new FormControl(year)
  });

  it('should return null when the date values produce a valid Date', () => {
    expect(dateValidator()(buildForm('1', '1', '2026'))).toBeNull();
  });

  it('should return an error when the date values do not produce a valid Date', () => {
    expect(dateValidator()(buildForm('not-a-day', '1', '2026'))).toEqual({
      dateIsInvalid: true
    });
  });
});
