import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CaaCasesFilterHeading, CaaCasesPageType } from '../../../caa-cases/models/caa-cases.enum';
import { CaaFilterComponent } from './caa-filter.component';

describe('CaaFilterComponent', () => {
  let component: CaaFilterComponent;
  let fixture: ComponentFixture<CaaFilterComponent>;
  let nativeElement: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ CaaFilterComponent ],
      providers: [ FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaaFilterComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    component.caaCasesPageType = component.caaCasesPageTypeLookup.AssignedCases;
    // Deliberately omitted fixture.detectChanges() here because this will trigger the component's ngOnInit() before
    // the caaCasesPageType input value has been set in each test, causing the expected HTML not to be output
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct filter heading and options for Assigned Cases', () => {
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    fixture.detectChanges();
    expect(nativeElement.querySelector('.govuk-fieldset__heading').textContent).toContain(CaaCasesFilterHeading.AssignedCases);
    expect(nativeElement.querySelector('#filter-assigned-cases-hint').textContent).toBeTruthy();
    expect(nativeElement.querySelector('#caa-filter-all-assignees')).toBeTruthy();
    expect(nativeElement.querySelector('#caa-filter-assignee-name')).toBeTruthy();
    expect(nativeElement.querySelector('#caa-filter-case-reference-number')).toBeTruthy();
    expect(nativeElement.querySelector('.govuk-heading-m')).toBeNull();
  });

  it('should display correct filter heading and single search input box for Unassigned Cases', () => {
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    fixture.detectChanges();
    expect(nativeElement.querySelector('.govuk-fieldset__heading')).toBeNull();
    expect(nativeElement.querySelector('#filter-assigned-cases-hint')).toBeNull();
    expect(nativeElement.querySelector('#caa-filter-all-assignees')).toBeNull();
    expect(nativeElement.querySelector('#caa-filter-assignee-name')).toBeNull();
    expect(nativeElement.querySelector('#caa-filter-case-reference-number')).toBeNull();
    expect(nativeElement.querySelector('.govuk-heading-m').textContent).toContain(CaaCasesFilterHeading.UnassignedCases);
    expect(nativeElement.querySelector('#case-reference-number')).toBeTruthy();
  });

  it('should set selected filter type', () => {
    spyOn(component.emitSelectedFilterType, 'emit');
    component.selectFilterOption('assignee-name');
    expect(component.selectedFilterType).toEqual('assignee-name');
    expect(component.emitSelectedFilterType.emit).toHaveBeenCalled();
  });

  it('should emit selected filter value', () => {
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    fixture.detectChanges();
    spyOn(component.emitSelectedFilterValue, 'emit');
    component.caaFormGroup.get('case-reference-number').setValue('1111-2222-3333-4444');
    component.search();
    expect(component.emitSelectedFilterValue.emit).toHaveBeenCalled();
  });
});
