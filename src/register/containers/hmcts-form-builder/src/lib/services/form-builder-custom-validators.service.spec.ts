import {TestBed, inject} from '@angular/core/testing';
import {CustomValidatorsService} from './form-builder-custom-validators.service';

describe('CustomValidationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomValidatorsService]
    });
  });

  /**
   * In an ideal situation we should be able to test for the exact type.
   */
  it('should return a validator function from exactLengthValidator',
    inject([CustomValidatorsService], (service: CustomValidatorsService) => {

      const stringLength = 13;

      const validatorFunction = service.exactLengthValidator(stringLength);

      expect(typeof validatorFunction).toEqual('function');
    }));

  it('should take in validation error name and message, returning a ng ValidationErrors object',
    inject([CustomValidatorsService], (service: CustomValidatorsService) => {

      /**
       * Developer assigned name given to validation error.
       */
      const validationErrorName = 'lengthError';
      const validationErrorMessage = 'humanReadableErrorMessage';

      const expectedValidationError = {
        [validationErrorName]: {
          value: validationErrorMessage
        }
      };

      expect(service.validationError(validationErrorName, validationErrorMessage)).toEqual(expectedValidationError);
    }));
});
