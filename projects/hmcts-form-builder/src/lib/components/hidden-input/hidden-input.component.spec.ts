import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {InputsComponent} from '../inputs/inputs.component';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('InputsComponent', () => {
  let component: InputsComponent;
  let fixture: ComponentFixture<InputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});


