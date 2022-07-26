import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CaaFilterAssignedComponent } from './caa-filter-assigned.component';

describe('CaaFilterAssignedComponent', () => {
  let component: CaaFilterAssignedComponent;
  let fixture: ComponentFixture<CaaFilterAssignedComponent>;
  let nativeElement: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [CaaFilterAssignedComponent],
      providers: [
        FormBuilder
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaaFilterAssignedComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.querySelector('#caa-filter-all-assignees')).toBeDefined();
    expect(nativeElement.querySelector('#caa-filter-assignee-name')).toBeDefined();
    expect(nativeElement.querySelector('#caa-filter-case-reference-number')).toBeDefined();
  });

  it('should set selected filter type', () => {
    spyOn(component.emitSelectedFilterType, 'emit');
    component.selectFilterOption('assignee-name');
    expect(component.selectedFilterType).toEqual('assignee-name');
    expect(component.emitSelectedFilterType.emit).toHaveBeenCalled();
  });
});
