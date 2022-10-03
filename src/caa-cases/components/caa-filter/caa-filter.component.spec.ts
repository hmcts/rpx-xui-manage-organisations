import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material';
import { Observable } from 'rxjs';
import {
  CaaCasesFilterErrorMessage,
  CaaCasesFilterHeading,
  CaaCasesFilterType,
  CaaCasesPageType
} from '../../../caa-cases/models/caa-cases.enum';
import { CaaFilterComponent } from './caa-filter.component';

describe('CaaFilterComponent', () => {
  let component: CaaFilterComponent;
  let fixture: ComponentFixture<CaaFilterComponent>;
  let nativeElement: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule
      ],
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
    component.selectFilterOption(CaaCasesFilterType.AssigneeName);
    expect(component.selectedFilterType).toEqual(CaaCasesFilterType.AssigneeName);
    expect(component.emitSelectedFilterType.emit).toHaveBeenCalledWith(component.selectedFilterType);
  });

  it('should emit selected filter value when searching from the Assigned Cases page', () => {
    component.selectedOrganisationUsers = [
      { userIdentifier: 'user1', fullName: 'Andy Test', email: 'andy@test.com', status: 'active' },
      { userIdentifier: 'user2', fullName: 'Smith Test', email: 'smith@test.com', status: 'inactive' },
      { userIdentifier: 'user3', fullName: 'Lindsey Johnson', email: 'user@test.com', status: 'pending' }
    ];
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    fixture.detectChanges();
    // Values need to be set using the form elements themselves, rather than directly on the FormControls, in order to
    // trigger the validation and set form validity
    let radioButton = nativeElement.querySelector('#caa-filter-assignee-name');
    radioButton.click();
    expect(component.selectedFilterType).toEqual(CaaCasesFilterType.AssigneeName);
    let textInput = nativeElement.querySelector('#assignee-person');
    textInput.value = 'Andy Test - andy@test.com';
    textInput.dispatchEvent(new Event('input'));
    spyOn(component.emitSelectedFilterValue, 'emit');
    component.search();
    expect(component.emitSelectedFilterValue.emit).toHaveBeenCalledWith('user1');
    radioButton = nativeElement.querySelector('#caa-filter-case-reference-number');
    radioButton.click();
    expect(component.selectedFilterType).toEqual(CaaCasesFilterType.CaseReferenceNumber);
    textInput = nativeElement.querySelector('#case-reference-number');
    textInput.value = '1111-2222-3333-4444';
    textInput.dispatchEvent(new Event('input'));
    component.search();
    expect(component.emitSelectedFilterValue.emit).toHaveBeenCalledWith('1111-2222-3333-4444');
    radioButton = nativeElement.querySelector('#caa-filter-all-assignees');
    radioButton.click();
    expect(component.selectedFilterType).toEqual(CaaCasesFilterType.AllAssignees);
    component.search();
    expect(component.emitSelectedFilterValue.emit).toHaveBeenCalledWith(null);
  });

  it('should emit selected filter value when searching from the Unassigned Cases page', () => {
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    fixture.detectChanges();
    // Values need to be set using the form elements themselves, rather than directly on the FormControls, in order to
    // trigger the validation and set form validity
    const textInput = nativeElement.querySelector('#case-reference-number');
    textInput.value = '1111-2222-3333-4444';
    textInput.dispatchEvent(new Event('input'));
    spyOn(component.emitSelectedFilterValue, 'emit');
    component.search();
    expect(component.selectedFilterType).toBeUndefined();
    expect(component.emitSelectedFilterValue.emit).toHaveBeenCalledWith('1111-2222-3333-4444');
  });

  it('should show a validation error for the Case Reference Number input field on the Unassigned Cases filter', () => {
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    fixture.detectChanges();
    const caseReferenceInput = nativeElement.querySelector('#case-reference-number');
    caseReferenceInput.value = '1111-2222-3333-444';
    caseReferenceInput.dispatchEvent(new Event('input'));
    spyOn(component.emitErrorMessages, 'emit');
    const searchButton = nativeElement.querySelector('.govuk-button');
    searchButton.click();
    fixture.detectChanges();
    const errorMessageElement = nativeElement.querySelector('.govuk-error-message');
    expect(component.errorMessages.length).toBe(1);
    expect(component.caseReferenceNumberErrorMessage).toEqual(CaaCasesFilterErrorMessage.InvalidCaseReference);
    expect(errorMessageElement.textContent).toContain(component.caseReferenceNumberErrorMessage);
    expect(component.emitErrorMessages.emit).toHaveBeenCalledWith(component.errorMessages);
  });

  it('should clear the validation error for the Case Reference Number input field on the Unassigned Cases filter', () => {
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    fixture.detectChanges();
    const caseReferenceInput = nativeElement.querySelector('#case-reference-number');
    caseReferenceInput.value = '1111-2222-3333-444';
    caseReferenceInput.dispatchEvent(new Event('input'));
    spyOn(component.emitErrorMessages, 'emit');
    const searchButton = nativeElement.querySelector('.govuk-button');
    searchButton.click();
    fixture.detectChanges();
    let errorMessageElement = nativeElement.querySelector('.govuk-error-message');
    expect(component.errorMessages.length).toBe(1);
    expect(component.caseReferenceNumberErrorMessage).toEqual(CaaCasesFilterErrorMessage.InvalidCaseReference);
    expect(errorMessageElement.textContent).toContain(component.caseReferenceNumberErrorMessage);
    expect(component.emitErrorMessages.emit).toHaveBeenCalledWith(component.errorMessages);
    caseReferenceInput.value = '1111-2222-3333-4444';
    caseReferenceInput.dispatchEvent(new Event('input'));
    searchButton.click();
    fixture.detectChanges();
    errorMessageElement = nativeElement.querySelector('.govuk-error-message');
    expect(component.errorMessages.length).toBe(0);
    expect(component.caseReferenceNumberErrorMessage).toEqual('');
    expect(errorMessageElement).toBeNull();
    expect(component.emitErrorMessages.emit).toHaveBeenCalledTimes(2);
  });

  it('should show a validation error for the Case Reference Number input field on the Assigned Cases filter', () => {
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    fixture.detectChanges();
    const caseRefOptionRadioButton = nativeElement.querySelector('#caa-filter-case-reference-number');
    caseRefOptionRadioButton.click();
    const caseReferenceInput = nativeElement.querySelector('#case-reference-number');
    caseReferenceInput.value = '1111-2222-3333-444';
    caseReferenceInput.dispatchEvent(new Event('input'));
    spyOn(component.emitErrorMessages, 'emit');
    const searchButton = nativeElement.querySelector('.govuk-button');
    searchButton.click();
    fixture.detectChanges();
    const errorMessageElement = nativeElement.querySelector('.govuk-error-message');
    expect(component.errorMessages.length).toBe(1);
    expect(component.caseReferenceNumberErrorMessage).toEqual(CaaCasesFilterErrorMessage.InvalidCaseReference);
    expect(errorMessageElement.textContent).toContain(component.caseReferenceNumberErrorMessage);
    expect(component.emitErrorMessages.emit).toHaveBeenCalledWith(component.errorMessages);
  });

  it('should clear the validation error for the Case Reference Number input field on the Assigned Cases filter', () => {
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    fixture.detectChanges();
    const caseRefOptionRadioButton = nativeElement.querySelector('#caa-filter-case-reference-number');
    caseRefOptionRadioButton.click();
    const caseReferenceInput = nativeElement.querySelector('#case-reference-number');
    caseReferenceInput.value = '1111-2222-3333-444';
    caseReferenceInput.dispatchEvent(new Event('input'));
    spyOn(component.emitErrorMessages, 'emit');
    const searchButton = nativeElement.querySelector('.govuk-button');
    searchButton.click();
    fixture.detectChanges();
    let errorMessageElement = nativeElement.querySelector('.govuk-error-message');
    expect(component.errorMessages.length).toBe(1);
    expect(component.caseReferenceNumberErrorMessage).toEqual(CaaCasesFilterErrorMessage.InvalidCaseReference);
    expect(errorMessageElement.textContent).toContain(component.caseReferenceNumberErrorMessage);
    expect(component.emitErrorMessages.emit).toHaveBeenCalledWith(component.errorMessages);
    caseReferenceInput.value = '1111-2222-3333-4444';
    caseReferenceInput.dispatchEvent(new Event('input'));
    searchButton.click();
    fixture.detectChanges();
    errorMessageElement = nativeElement.querySelector('.govuk-error-message');
    expect(component.errorMessages.length).toBe(0);
    expect(component.caseReferenceNumberErrorMessage).toEqual('');
    expect(errorMessageElement).toBeNull();
    expect(component.emitErrorMessages.emit).toHaveBeenCalledTimes(2);
  });

  it('should clear the validation error for the Case Reference Number input field when a different option is chosen', () => {
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    fixture.detectChanges();
    let radioButton = nativeElement.querySelector('#caa-filter-case-reference-number');
    radioButton.click();
    const caseReferenceInput = nativeElement.querySelector('#case-reference-number');
    caseReferenceInput.value = '1111-2222-3333-444';
    caseReferenceInput.dispatchEvent(new Event('input'));
    spyOn(component.emitErrorMessages, 'emit');
    const searchButton = nativeElement.querySelector('.govuk-button');
    searchButton.click();
    fixture.detectChanges();
    let errorMessageElement = nativeElement.querySelector('.govuk-error-message');
    expect(component.errorMessages.length).toBe(1);
    expect(component.caseReferenceNumberErrorMessage).toEqual(CaaCasesFilterErrorMessage.InvalidCaseReference);
    expect(errorMessageElement.textContent).toContain(component.caseReferenceNumberErrorMessage);
    expect(component.emitErrorMessages.emit).toHaveBeenCalledWith(component.errorMessages);
    radioButton = nativeElement.querySelector('#caa-filter-all-assignees');
    radioButton.click();
    searchButton.click();
    fixture.detectChanges();
    errorMessageElement = nativeElement.querySelector('.govuk-error-message');
    expect(component.errorMessages.length).toBe(0);
    expect(component.caseReferenceNumberErrorMessage).toEqual('');
    expect(errorMessageElement).toBeNull();
    expect(component.emitErrorMessages.emit).toHaveBeenCalledTimes(2);
  });

  it('should show a validation error for the Assignee Name input field on the Assigned Cases filter', () => {
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    fixture.detectChanges();
    const assigneeNameOptionRadioButton = nativeElement.querySelector('#caa-filter-assignee-name');
    assigneeNameOptionRadioButton.click();
    const assigneeNameInput = nativeElement.querySelector('#assignee-person');
    assigneeNameInput.value = '';
    assigneeNameInput.dispatchEvent(new Event('input'));
    spyOn(component.emitErrorMessages, 'emit');
    const searchButton = nativeElement.querySelector('.govuk-button');
    searchButton.click();
    fixture.detectChanges();
    const errorMessageElement = nativeElement.querySelector('.govuk-error-message');
    expect(component.errorMessages.length).toBe(1);
    expect(component.assigneeNameErrorMessage).toEqual(CaaCasesFilterErrorMessage.InvalidAssigneeName);
    expect(errorMessageElement.textContent).toContain(component.assigneeNameErrorMessage);
    expect(component.emitErrorMessages.emit).toHaveBeenCalledWith(component.errorMessages);
  });

  fit('should clear the validation error for the Assignee Name input field on the Assigned Cases filter', () => {
    const users = [
      { userIdentifier: 'user1', fullName: 'Andy Test', email: 'andy@test.com', status: 'active' },
      { userIdentifier: 'user2', fullName: 'Smith Test', email: 'smith@test.com', status: 'inactive' },
      { userIdentifier: 'user3', fullName: 'Lindsey Johnson', email: 'lindsey@test.com', status: 'pending' }
    ];
    component.filteredAndGroupedUsers.set('Active users:', users);
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    fixture.detectChanges();
    const assigneeNameOptionRadioButton = nativeElement.querySelector('#caa-filter-assignee-name');
    assigneeNameOptionRadioButton.click();
    const assigneeNameInput = nativeElement.querySelector('#assignee-person');
    assigneeNameInput.value = '';
    assigneeNameInput.dispatchEvent(new Event('input'));
    spyOn(component.emitErrorMessages, 'emit');
    const searchButton = nativeElement.querySelector('.govuk-button');
    searchButton.click();
    fixture.detectChanges();
    let errorMessageElement = nativeElement.querySelector('.govuk-error-message');
    expect(component.errorMessages.length).toBe(1);
    expect(component.assigneeNameErrorMessage).toEqual(CaaCasesFilterErrorMessage.InvalidAssigneeName);
    expect(errorMessageElement.textContent).toContain(component.assigneeNameErrorMessage);
    expect(component.emitErrorMessages.emit).toHaveBeenCalledWith(component.errorMessages);
    // assigneeNameInput.value = 'lindsey - lindsey@test.com';
    assigneeNameInput.dispatchEvent(new Event('focusin'));
    assigneeNameInput.value = 'Lindsey Johnson - lindsey@test.com';
    assigneeNameInput.dispatchEvent(new Event('input'));
    // assigneeNameInput.click();
    console.log('ASSIGNEE NAME INPUT VALUE 1', assigneeNameInput.value)
    fixture.detectChanges();
    console.log('ASSIGNEE NAME INPUT VALUE 2', assigneeNameInput.value)
    const matOptions = nativeElement.querySelectorAll('mat-option');
    console.log('MAT OPTIONS', matOptions as HTMLElement);
    const userToSelect = matOptions[0] as HTMLElement;
    console.log('MAT OPTIONS 0', userToSelect);
    // const matOptGroupDropdown = nativeElement.querySelector('mat-optgroup');
    // console.log('MAT OPT GROUP DROP DOWN', matOptGroupDropdown.textContent);
    // nativeElement.querySelector('.mat-option-text').click();
    // fixture.detectChanges();
    searchButton.click();
    fixture.detectChanges();
    errorMessageElement = nativeElement.querySelector('.govuk-error-message');
    expect(component.errorMessages.length).toBe(0);
    expect(component.assigneeNameErrorMessage).toEqual('');
    expect(errorMessageElement).toBeNull();
    expect(component.emitErrorMessages.emit).toHaveBeenCalledTimes(2);
  });

  it('should clear the validation error for the Assignee Name input field when a different option is chosen', () => {
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    fixture.detectChanges();
    let radioButton = nativeElement.querySelector('#caa-filter-assignee-name');
    radioButton.click();
    const assigneeNameInput = nativeElement.querySelector('#assignee-person');
    assigneeNameInput.value = '';
    assigneeNameInput.dispatchEvent(new Event('input'));
    spyOn(component.emitErrorMessages, 'emit');
    const searchButton = nativeElement.querySelector('.govuk-button');
    searchButton.click();
    fixture.detectChanges();
    let errorMessageElement = nativeElement.querySelector('.govuk-error-message');
    expect(component.errorMessages.length).toBe(1);
    expect(component.assigneeNameErrorMessage).toEqual(CaaCasesFilterErrorMessage.InvalidAssigneeName);
    expect(errorMessageElement.textContent).toContain(component.assigneeNameErrorMessage);
    expect(component.emitErrorMessages.emit).toHaveBeenCalledWith(component.errorMessages);
    radioButton = nativeElement.querySelector('#caa-filter-all-assignees');
    radioButton.click();
    searchButton.click();
    fixture.detectChanges();
    errorMessageElement = nativeElement.querySelector('.govuk-error-message');
    expect(component.errorMessages.length).toBe(0);
    expect(component.assigneeNameErrorMessage).toEqual('');
    expect(errorMessageElement).toBeNull();
    expect(component.emitErrorMessages.emit).toHaveBeenCalledTimes(2);
  });

  it('should displayName return correct format', () => {
    const selectedUser = {
      userIdentifier: 'user1',
      fullName: 'User Test',
      email: 'user@test.com'
    };
    expect(component.getDisplayName(selectedUser)).toEqual('User Test - user@test.com');
  });

  it('should filter users based on search term', () => {
    component.selectedOrganisationUsers = [
      { userIdentifier: 'user1', fullName: 'Andy Test', email: 'andy@test.com', status: 'active' },
      { userIdentifier: 'user2', fullName: 'John Test', email: 'john@test.com', status: 'inactive' },
      { userIdentifier: 'user3', fullName: 'Lindsey Johnson', email: 'user@test.com', status: 'pending' }
    ];
    let groupedUsers = component.filterSelectedOrganisationUsers('test');
    groupedUsers.subscribe(users => {
      expect(users.get('Active users:').length).toEqual(1);
      expect(users.get('Inactive users:').length).toEqual(2);
      expect(users.get('Active users:')[0].fullName).toEqual('Andy Test');
      expect(users.get('Inactive users:')[0].fullName).toEqual('John Test');
    });
    groupedUsers = component.filterSelectedOrganisationUsers('Lindsey');
    groupedUsers.subscribe(users => {
      expect(users.get('Active users:').length).toEqual(0);
      expect(users.get('Inactive users:').length).toEqual(1);
      expect(users.get('Inactive users:')[0].fullName).toEqual('Lindsey Johnson');
    })
  });

  it('should unsubscribe', () => {
    component.assigneePersonFormControlSubscription = new Observable().subscribe();
    spyOn(component.assigneePersonFormControlSubscription, 'unsubscribe').and.callThrough();
    component.caaFilterFormControlSubscription = new Observable().subscribe();
    spyOn(component.caaFilterFormControlSubscription, 'unsubscribe').and.callThrough();
    component.ngOnDestroy();
    expect(component.assigneePersonFormControlSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.caaFilterFormControlSubscription.unsubscribe).toHaveBeenCalled();
  });
});
