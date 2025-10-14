import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { State } from '../../../../../../../app/store/reducers';
import { InputButtonComponent } from './input-button.component';

describe('InputButtonComponent', () => {
  let component: InputButtonComponent;
  let fixture: ComponentFixture<InputButtonComponent>;
  let mockStore: MockStore<State>;
  let pipeSpy: jasmine.Spy;
  const VALIDATION_ERRORS = [
    {
      validationErrorId: 'duplicatedPBAError',
      validationLevel: 'formControl',
      controls: 'PBANumber',
      text: 'You have entered this PBA number more than once'
    },
    {
      validationErrorId: 'invalidPBANumberError',
      validationLevel: 'formControl',
      controls: 'PBANumber',
      text: 'Enter a valid PBA number'
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InputButtonComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule],
      providers: [
        provideMockStore(),
        DatePipe]
    })
      .compileComponents();
    mockStore = TestBed.inject(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputButtonComponent);
    component = fixture.componentInstance;
    const pbaNumber1 = new FormControl('');
    component.group = new FormGroup({ PBANumber1: pbaNumber1 });
    component.item = { control: 'PBANumber1' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show remove button when only 1 PBA box', () => {
    pipeSpy = spyOn(mockStore, 'pipe');
    const pages = {
      'organisation-pba': {
        meta: {
          groups: [
            { inputButton: {} }
          ]
        }
      }
    };
    pipeSpy.and.returnValue(of(pages));
    component.ngOnInit();
    expect(component.showRemoveButton).toBeFalsy();
  });

  it('should show remove button when more than 1 PBA box', () => {
    pipeSpy = spyOn(mockStore, 'pipe');
    const pages = {
      'organisation-pba': {
        meta: {
          groups: [
            { inputButton: {} },
            { inputButton: {} }
          ]
        }
      }
    };
    pipeSpy.and.returnValue(of(pages));
    component.ngOnInit();
    expect(component.showRemoveButton).toBeTruthy();
  });

  it('should show duplicated pba number error', () => {
    component.validationErrors = VALIDATION_ERRORS;
    const pbaNumber1 = new FormControl('');
    pbaNumber1.setErrors({ duplicatedPBAError: true });
    const formGroup = new FormGroup({ PBANumber1: pbaNumber1 });
    const hasError = component.hasValidationError(formGroup, 'PBANumber1');
    expect(component.validationError).toBe('You have entered this PBA number more than once');
    expect(hasError).toBeTruthy();
  });

  it('should show invalid pba number error', () => {
    component.validationErrors = VALIDATION_ERRORS;
    const pbaNumber1 = new FormControl('');
    pbaNumber1.setErrors({ invalidPBANumberError: true });
    const formGroup = new FormGroup({ PBANumber1: pbaNumber1 });
    const hasError = component.hasValidationError(formGroup, 'PBANumber1');
    expect(component.validationError).toBe('Enter a valid PBA number');
    expect(hasError).toBeTruthy();
  });

  it('should not show error', () => {
    const formGroup = new FormGroup({ PBANumber1: new FormControl('') });
    const hasError = component.hasValidationError(formGroup, 'PBANumber1');
    expect(hasError).toBeFalsy();
  });

  it('should convert input text with prefix PBA', () => {
    const event = {
      target: {
        id: 'PBANumber1',
        value: '1234567'
      }
    };
    component.onBlur(event);
    expect(component.group.controls.PBANumber1.value).toBe('PBA1234567');
  });

  it('should convert input text if prefix has pba', () => {
    const event = {
      target: {
        id: 'PBANumber1',
        value: 'pba1234567'
      }
    };
    component.onBlur(event);
    expect(component.group.controls.PBANumber1.value).toBe('PBA1234567');
  });

  afterEach(() => {
    fixture.destroy();
  });
});
