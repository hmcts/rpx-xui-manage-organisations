import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CaaFilterComponent } from './caa-filter.component';

describe('CaaFilterComponent', () => {
  let component: CaaFilterComponent;
  let fixture: ComponentFixture<CaaFilterComponent>;
  let nativeElement: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [CaaFilterComponent],
      providers: [
        FormBuilder
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaaFilterComponent);
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
    const emitter = jasmine.createSpyObj('emitter', ['emit']);
    const event: any = {
      target: {
        value: 'assignee-name'
      }
    }
    component.selectFilterOption(event);
    expect(component.selectedFilterType).toEqual('assignee-name');
    expect(emitter.emit).toHaveBeenCalled();
  });
});
