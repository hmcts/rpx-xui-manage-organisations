import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CaaFilterUnassignedComponent } from './caa-filter-unassigned.component';

describe('CaaFilterUnassignedComponent', () => {
  let component: CaaFilterUnassignedComponent;
  let fixture: ComponentFixture<CaaFilterUnassignedComponent>;
  let nativeElement: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [CaaFilterUnassignedComponent],
      providers: [
        FormBuilder
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaaFilterUnassignedComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.querySelector('#case-reference-number')).toBeDefined();
  });

  it('should emit selected filter value', () => {
    spyOn(component.emitSelectedFilterValue, 'emit');
    component.caaFormGroup.controls['case-reference-number'].setValue('1111-2222-3333-4444');
    component.search();
    expect(component.emitSelectedFilterValue.emit).toHaveBeenCalled();
  });
});
