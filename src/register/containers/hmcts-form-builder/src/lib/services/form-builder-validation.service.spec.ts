import { DatePipe } from '@angular/common';
import { inject, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ValidationService } from './form-builder-validation.service';

describe('ValidationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidationService, DatePipe]
    });
  });

  it('should be created', inject([ValidationService], (service: ValidationService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an array with Validators.required, if the validation for a control is ["required"]',
    inject([ValidationService], (service: ValidationService) => {
      expect(service).toBeTruthy();
    }));

  it('should create a form group validator, with type ValidationFn.', inject([ValidationService], (service: ValidationService) => {
    const formGroup = new UntypedFormGroup({
      test: new UntypedFormControl('test')
    });

    const formGroupValidators = {
      validatorFunc: 'isAnyCheckboxChecked',
      validationErrorId: 'reasonsConstentOrderNotApproved',
      checkboxes: [
        'partiesNeedAttend', 'NotEnoughInformation', 'orderNotAppearOfS25ca1973', 'd81',
        'pensionAnnex', 'applicantTakenAdvice', 'respondentTakenAdvice', 'Other2'
      ]
    };

    const formGroupValidatorFunction = service.createFormGroupValidator(formGroup, formGroupValidators.validatorFunc, formGroupValidators.checkboxes,
      formGroupValidators.validationErrorId);

    expect(formGroupValidatorFunction).toEqual(jasmine.any(Function));
  }));

  it('should return mapped simple names to Ng Validators', inject([ValidationService], (service: ValidationService) => {
    expect(service.getNgValidationFunctionMap()).toEqual(jasmine.any(Array));
  }));

  it('should take an array of simple names and map them to Ng Validation functions', inject([ValidationService], (service: ValidationService) => {
    const validators = ['required', 'email'];
    expect(service.getNgValidators(validators)).toEqual([jasmine.any(Function), jasmine.any(Function)]);
  }));

  it('control should has a validator', inject([ValidationService], (service: ValidationService) => {
    const validators = ['required', 'email'];
    expect(service.controlHasValidation(validators)).not.toBeLessThan(0);
  }));

  it('control should be valid', inject([ValidationService], (service: ValidationService) => {
    const formGroup = new UntypedFormGroup({
      test: new UntypedFormControl('test')
    });
    expect(service.isFormControlValid(formGroup, 'test')).toBe(true);
  }));

  it('form group should be not valid', inject([ValidationService], (service: ValidationService) => {
    const formGroup = {
      errors: {
        testErrorId: true
      }
    };
    const validationErrorId = 'testErrorId';
    const isFormGroupInvalidFunc = service.isFormGroupInvalid(formGroup, validationErrorId);
    expect(isFormGroupInvalidFunc).toBe(true);
  }));

  it('form group should be valid', inject([ValidationService], (service: ValidationService) => {
    const formGroup = new UntypedFormGroup({
      test: new UntypedFormControl('test')
    });
    const validationErrorId = 'testErrorId';
    const isFormGroupInvalidFunc = service.isFormGroupInvalid(formGroup, validationErrorId);
    expect(isFormGroupInvalidFunc).toBe(null);
  }));

  it('should at least one checkbox to be checked validation', inject([ValidationService], (service: ValidationService) => {
    const formGroup = new UntypedFormGroup({
      checkboxTest1: new UntypedFormControl('checkboxTest1'),
      checkboxTest2: new UntypedFormControl('checkboxTest2')
    });
    const validationIdentifier = 'isAnyCheckboxChecked';
    const checkboxes = [
      'checkboxTest1', 'checkboxTest2'
    ];
    const isAnyCheckboxChecked = service.isAnyCheckboxChecked(formGroup, checkboxes, validationIdentifier);
    formGroup.get('checkboxTest1').setValue(true);
    formGroup.get('checkboxTest2').setValue(false);
    expect(isAnyCheckboxChecked(formGroup)).toBe(null);
    formGroup.get('checkboxTest1').setValue(false);
    formGroup.get('checkboxTest2').setValue(false);
    expect(isAnyCheckboxChecked(formGroup).isAnyCheckboxChecked).toBe(true);
  }));

  it('should check if all fields required common function unit test', inject([ValidationService], (service: ValidationService) => {
    const formGroup = new UntypedFormGroup({
      test1Filed: new UntypedFormControl(),
      test2Filed: new UntypedFormControl()
    });
    const validationIdentifier = 'isAllFieldsRequiredValidationFn';
    const fields = [
      'test1Filed', 'test2Filed'
    ];
    let isAllFieldsRequiredValidationFn = service.isAllFieldsRequiredValidationFn(formGroup, fields, validationIdentifier);
    expect(isAllFieldsRequiredValidationFn[validationIdentifier]).toBe(true);
    formGroup.get('test1Filed').setValue('test value 1');
    formGroup.get('test2Filed').setValue('test value 2');
    isAllFieldsRequiredValidationFn = service.isAllFieldsRequiredValidationFn(formGroup, fields, validationIdentifier);
    expect(isAllFieldsRequiredValidationFn).toBe(null);
  }));

  it('should check if all fields required group validator returns a validation function', inject([ValidationService], (service: ValidationService) => {
    const formGroup = new UntypedFormGroup({
      test1Filed: new UntypedFormControl(),
      test2Filed: new UntypedFormControl()
    });
    const validationIdentifier = 'isAllFieldsRequiredValidationFn';
    const fields = [
      'test1Filed', 'test2Filed'
    ];
    const isAllFieldsRequired = service.isAllFieldsRequired(formGroup, fields, validationIdentifier);
    expect(isAllFieldsRequired).toEqual(jasmine.any(Function));
    expect(isAllFieldsRequired(formGroup)[validationIdentifier]).toBe(true);
  }));

  it('should check conditional validator textarea should be valid if parent checkbox checked', inject([ValidationService], (service: ValidationService) => {
    const formGroup = new UntypedFormGroup({
      testCheckbox: new UntypedFormControl(),
      testTextarea: new UntypedFormControl()
    });
    const validationIdentifier = 'isTextAreaValidWhenCheckboxChecked';
    const controls = {
      checkboxControl: 'testCheckbox',
      textareaControl: 'testTextarea'
    };
    let isTextAreaValidWhenCheckboxChecked = service.isTextAreaValidWhenCheckboxChecked(formGroup, controls, validationIdentifier);
    expect(isTextAreaValidWhenCheckboxChecked).toEqual(jasmine.any(Function));
    formGroup.get('testCheckbox').setValue(true);
    isTextAreaValidWhenCheckboxChecked = service.isTextAreaValidWhenCheckboxChecked(formGroup, controls, validationIdentifier);
    expect(isTextAreaValidWhenCheckboxChecked(formGroup)[validationIdentifier]).toBe(true);
    formGroup.get('testTextarea').setValue('Some test text');
    isTextAreaValidWhenCheckboxChecked = service.isTextAreaValidWhenCheckboxChecked(formGroup, controls, validationIdentifier);
    expect(isTextAreaValidWhenCheckboxChecked(formGroup)).toBe(null);
  }));

  it('should check conditional validator radio should be valid if one option selected', inject([ValidationService], (service: ValidationService) => {
    const formGroup = new UntypedFormGroup({
      testRadioControl: new UntypedFormControl('testOption'),
      test1: new UntypedFormControl('test1'),
      test2: new UntypedFormControl('test2'),
      test3: new UntypedFormControl('test3')
    });
    const validationIdentifier = 'isRadioValidWhenSomeOptionSelected';
    const controls = {
      radioControl: 'testRadioControl',
      selectedOptions: [
        {
          selectedOption: 'testOption',
          childValidator: {
            validatorFunc: 'isAllFieldsRequired',
            validationErrorId: 'testChildValidationErrorId',
            controls: [
              'test1', 'test2', 'test3'
            ]
          }
        }
      ]
    };
    const isRadioValidWhenSomeOptionSelected = service.isRadioValidWhenSomeOptionSelected(formGroup, controls, validationIdentifier); expect(isRadioValidWhenSomeOptionSelected).toEqual(jasmine.any(Function));
    formGroup.get('testRadioControl').setValue(true);
    expect(isRadioValidWhenSomeOptionSelected(formGroup)).toBe(null);
    formGroup.get('testRadioControl').setValue('testOption');
    expect(isRadioValidWhenSomeOptionSelected(formGroup)).toBe(null);
    formGroup.get('test1').setValue('');
    formGroup.get('test2').setValue('');
    formGroup.get('test3').setValue('');
    expect(isRadioValidWhenSomeOptionSelected(formGroup).testChildValidationErrorId).toBe(true);
  }));

  it('should check create form group validators', inject([ValidationService], (service: ValidationService) => {
    const formGroup = new UntypedFormGroup({
      testRadioControl: new UntypedFormControl('testOption'),
      test1: new UntypedFormControl('test1'),
      test2: new UntypedFormControl('test2'),
      test3: new UntypedFormControl('test3')
    });
    const formGroupValidators = [{
      validatorFunc: 'isAnyCheckboxChecked',
      validationErrorId: 'reasonsConstentOrderNotApproved',
      checkboxes: [
        'test1', 'test2', 'test3'
      ]
    }];

    const createFormGroupValidators = service.createFormGroupValidators(formGroup, formGroupValidators);
    expect(createFormGroupValidators[0]).toEqual(jasmine.any(Function));
  }));

  it('should check if date group validator returns a validation function', inject([ValidationService], (service: ValidationService) => {
    const formGroup = new UntypedFormGroup({
      dayTestFiled: new UntypedFormControl(),
      monthTestFiled: new UntypedFormControl(),
      yearTestFiled: new UntypedFormControl()
    });
    const validationIdentifier = 'isValidDate';
    const fields = [
      'yearTestFiled', 'monthTestFiled', 'dayTestFiled'
    ];
    const isValidDate = service.isValidDate(formGroup, fields, validationIdentifier);
    expect(isValidDate).toEqual(jasmine.any(Function));
    expect(isValidDate(formGroup)[validationIdentifier]).toBe(true);
  }));

  describe('isValidDateValidationFn', () => {
    const formGroup = new UntypedFormGroup({
      dayTestFiled: new UntypedFormControl(),
      monthTestFiled: new UntypedFormControl(),
      yearTestFiled: new UntypedFormControl()
    });
    const validationIdentifier = 'isValidDateValidationFn';
    const fields = [
      'yearTestFiled', 'monthTestFiled', 'dayTestFiled'
    ];

    it('should check if return invalid state for the case if at least one field is not a number value', inject([ValidationService], (service: ValidationService) => {
      formGroup.get('dayTestFiled').setValue('1');
      formGroup.get('monthTestFiled').setValue('02');
      formGroup.get('yearTestFiled').setValue('test value 2');
      const isValidDateValidationFn = service.isValidDateValidationFn(formGroup, fields, validationIdentifier);
      expect(isValidDateValidationFn[validationIdentifier]).toBe(true);
    }));

    it('should check if return invalid state for the case if month is not in range from 1 to 12', inject([ValidationService], (service: ValidationService) => {
      formGroup.get('dayTestFiled').setValue('1');
      formGroup.get('monthTestFiled').setValue('0');
      formGroup.get('yearTestFiled').setValue('2019');
      const isValidDateValidationFn = service.isValidDateValidationFn(formGroup, fields, validationIdentifier);
      expect(isValidDateValidationFn[validationIdentifier]).toBe(true);
    }));

    it('should check if return invalid state for the case if day is not in range from 1 to 31', inject([ValidationService], (service: ValidationService) => {
      formGroup.get('dayTestFiled').setValue('33');
      formGroup.get('monthTestFiled').setValue('1');
      formGroup.get('yearTestFiled').setValue('2019');
      const isValidDateValidationFn = service.isValidDateValidationFn(formGroup, fields, validationIdentifier);
      expect(isValidDateValidationFn[validationIdentifier]).toBe(true);
    }));

    it('should check if date is valid 29/02/2019 does not exist and should return error', inject([ValidationService], (service: ValidationService) => {
      formGroup.get('dayTestFiled').setValue('29');
      formGroup.get('monthTestFiled').setValue('2');
      formGroup.get('yearTestFiled').setValue('2019');
      const isValidDateValidationFn = service.isValidDateValidationFn(formGroup, fields, validationIdentifier);
      expect(isValidDateValidationFn[validationIdentifier]).toBe(true);
    }));

    it('should not return any error if date is valid and properly formatted', inject([ValidationService], (service: ValidationService) => {
      formGroup.get('dayTestFiled').setValue('2');
      formGroup.get('monthTestFiled').setValue('2');
      formGroup.get('yearTestFiled').setValue('2019');
      const isValidDateValidationFn = service.isValidDateValidationFn(formGroup, fields, validationIdentifier);
      expect(isValidDateValidationFn).toBe(null);
    }));
  });

  describe('invalidPBANumberValidatorFn', () => {
    const pbaNumber1 = new UntypedFormControl('1234567');
    pbaNumber1.setErrors({ invalidPBANumberError: true });
    const fg = new UntypedFormGroup({
      PBANumber1: pbaNumber1
    });
    const validationIdentifier = 'invalidPBANumberError';

    it('should check if invalid PBA number', inject([ValidationService], (service: ValidationService) => {
      const invalidPBANumberValidatorFn = service.invalidPBANumberValidatorFn(fg, 'PBANumber');
      expect(invalidPBANumberValidatorFn[validationIdentifier]).toBe(true);
    }));
  });

  describe('duplicatedPBAValidatorFn', () => {
    const validationIdentifier = 'duplicatedPBAError';

    it('should return duplicatedPBAError when duplicated PBA numbers found', inject([ValidationService], (service: ValidationService) => {
      const pbaNumber1 = new UntypedFormControl('PBA1234567');
      const pbaNumber2 = new UntypedFormControl('PBA1234567');
      const fg = new UntypedFormGroup({
        PBANumber1: pbaNumber1,
        PBANumber2: pbaNumber2
      });
      const invalidPBANumberValidatorFn = service.duplicatedPBAValidatorFn(fg, 'PBANumber', validationIdentifier);
      expect(invalidPBANumberValidatorFn[validationIdentifier]).toBe(true);
    }));

    it('should return null when no duplicated PBA numbers found', inject([ValidationService], (service: ValidationService) => {
      const pbaNumber1 = new UntypedFormControl('PBA1234567');
      const pbaNumber2 = new UntypedFormControl('PBA7654321');
      const fg = new UntypedFormGroup({
        PBANumber1: pbaNumber1,
        PBANumber2: pbaNumber2
      });
      const invalidPBANumberValidatorFn = service.duplicatedPBAValidatorFn(fg, 'PBANumber', validationIdentifier);
      expect(invalidPBANumberValidatorFn).toBeFalsy();
    }));
  });
});
