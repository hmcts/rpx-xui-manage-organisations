import { TestBed, inject } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { FormsService } from  './form-builder.service';
import { ValidationService } from   './form-builder-validation.service';

describe('FormsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePipe, FormsService, ValidationService]
    });
  });

  it('should be created', inject([FormsService], (service: FormsService) => {
    expect(service).toBeTruthy();
  }));

  describe('on form creation', () => {

    describe('when creating radio buttons', () => {

      it('should create radio buttons where data does not exist', inject([FormsService], (service: FormsService) => {
        const someJson = [
          {
            control: 'radio',
            radioGroup: [
              {value: 'dummy'}
            ]
          }
        ];
        const someData = {};

        service.create(someJson, someData);
        expect(service.formControls.hasOwnProperty('radio')).toBeTruthy();
      }));

      it('should create radio buttons where data does not match', inject([FormsService], (service: FormsService) => {
        const createFormControlSpy = spyOn(service, 'createFormControl');
        const someJson = [
          {
            control: 'radio',
            radioGroup: [
              {value: 'dummy'}
            ]
          }
        ];
        const someData = {
          text: 'test'
        };

        service.create(someJson, someData);
        expect(createFormControlSpy).toHaveBeenCalled();
      }));

      it('should create radio buttons where data does match', inject([FormsService], (service: FormsService) => {
        const someJson = [
          {
            control: 'radio',
            radioGroup: [
              {value: 'dummy'}
            ]
          }
        ];
        const someData = {
          radio: 'dummy'
        };

        service.create(someJson, someData);
        expect(service.formControls.hasOwnProperty('radio')).toBeTruthy();
      }));

    });

    describe('when creating non radio buttons controls', () => {

      it('should create control where data does not match', inject([FormsService], (service: FormsService) => {
        const createFormControlSpy = spyOn(service, 'createFormControl');
        const someJson = [
          {
            control: 'text'
          }
        ];
        const someData = {
          radio: 'test'
        };

        service.create(someJson, someData);
        expect(createFormControlSpy).toHaveBeenCalled();
      }));

      it('should create control where data does match', inject([FormsService], (service: FormsService) => {
        const someJson = [
          {
            control: 'text'
          }
        ];
        const someData = {
          text: 'dummy'
        };

        service.create(someJson, someData);
        expect(service.formControls.hasOwnProperty('text')).toBeTruthy();
      }));
    });

  });

});
