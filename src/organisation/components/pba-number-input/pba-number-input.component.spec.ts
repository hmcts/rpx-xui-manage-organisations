import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { RxReactiveFormsModule, RxwebValidators } from '@rxweb/reactive-form-validators';
import { RpxTranslationService } from 'rpx-xui-translation';

import { PbaNumberInputComponent } from './pba-number-input.component';

const id: string = 'pba-number-input0';

describe('PbaNumberInputComponent', () => {
  let group: FormGroup;

  let component: PbaNumberInputComponent;
  let fixture: ComponentFixture<PbaNumberInputComponent>;
  const rpxTranslateMock = jasmine.createSpyObj('RpxTranslationService', ['getTranslation$']);

  beforeEach(() => {
    group = new FormGroup({
      pbaNumber: new FormControl('', [
        Validators.pattern(/(PBA\w*)/i),
        Validators.minLength(10),
        Validators.maxLength(10),
        RxwebValidators.noneOf({
          matchValues: ['PBA0000000', 'PBA1111111']
        }),
        RxwebValidators.unique()
      ])
    });

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ExuiCommonLibModule,
        RxReactiveFormsModule
      ],
      declarations: [PbaNumberInputComponent],
      providers: [{
        provide: RpxTranslationService,
        useValue: rpxTranslateMock
      }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PbaNumberInputComponent);
    component = fixture.componentInstance;

    component.id = id;
    component.group = group;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('formatPbaNumber()', () => {
    const testCases = [
      { input: '562', expected: 'PBA562' },
      { input: 'pba562', expected: 'PBA562' },
      { input: 'pbapba562', expected: 'PBAPBA562' },
      { input: '562pba', expected: 'PBA562PBA' },
      { input: '5pba62', expected: 'PBA5PBA62' },
      { input: 'PBA1234567', expected: 'PBA1234567' }
    ];

    testCases.forEach((testCase) => {
      it(`should convert "${testCase.input}" into "${testCase.expected}"`, () => {
        const inputElement = fixture.nativeElement.querySelector('input');
        inputElement.value = testCase.input;
        inputElement.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(inputElement.value).toBe(testCase.expected);
        });
      });
    });
  });

  describe('generateErrorMessage()', () => {
    const testCases = [
      { input: '562', expected: PbaNumberInputComponent.PBA_GENERIC_ERROR_MESSAGE },
      { input: '5pba62', expected: PbaNumberInputComponent.PBA_GENERIC_ERROR_MESSAGE },
      { input: 'PBA0000000', expected: PbaNumberInputComponent.PBA_EXISTING_ERROR_MESSAGE },
      { input: 'PBA1111111', expected: PbaNumberInputComponent.PBA_EXISTING_ERROR_MESSAGE },
      { input: 'PBA1111117', expected: [] },
      { input: '1111117', expected: [] }
    ];

    testCases.forEach((testCase) => {
      it(`should show "${testCase.expected}" error, when input "${testCase.input}"`, () => {
        const inputElement = fixture.nativeElement.querySelector('input');
        inputElement.value = testCase.input;
        inputElement.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(component.errorMessages.messages).toEqual(testCase.expected);
        });
      });
    });
  });
});
