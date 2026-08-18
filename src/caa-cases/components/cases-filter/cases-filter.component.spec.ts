import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesFilterComponent } from './cases-filter.component';
import { CaaCasesService } from 'src/caa-cases/services';
import { provideMockStore } from '@ngrx/store/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { SimpleChange } from '@angular/core';
import { CaaCasesFilterErrorMessage, CaaCasesFilterType } from 'src/caa-cases/models/caa-cases.enum';
import { User } from '@hmcts/rpx-xui-common-lib';

describe('CasesFilterComponent', () => {
  let component: CasesFilterComponent;
  let fixture: ComponentFixture<CasesFilterComponent>;
  let caaCasesService: jasmine.SpyObj<CaaCasesService>;
  const users: User[] = [
    {
      userIdentifier: 'active-user-id',
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      status: 'active'
    },
    {
      userIdentifier: 'inactive-user-id',
      fullName: 'Grace Hopper',
      email: 'grace@example.com',
      status: 'pending'
    }
  ];

  beforeEach(async () => {
    caaCasesService = jasmine.createSpyObj<CaaCasesService>(
      'caaCasesService',
      [
        'getCaaCases',
        'getCaaCaseTypes',
        'storeSessionState',
        'retrieveSessionState',
        'removeSessionState'
      ]
    );
    await TestBed.configureTestingModule({
      declarations: [CasesFilterComponent],
      providers: [provideMockStore(),
        { provide: CaaCasesService, useValue: caaCasesService }
      ],
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CasesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should group active and inactive organisation users on changes', () => {
    component.selectedOrganisationUsers = users;

    component.ngOnChanges({
      selectedOrganisationUsers: new SimpleChange([], users, false)
    });

    expect(component.filteredAndGroupedUsers.get(component.ACTIVE_USER_GROUP_HEADING)).toEqual([users[0]]);
    expect(component.filteredAndGroupedUsers.get(component.INACTIVE_USER_GROUP_HEADING)).toEqual([users[1]]);
  });

  it('should populate assignee filter from session state and emit selected filter', () => {
    spyOn(component.selectedFilter, 'emit');
    component.selectedOrganisationUsers = users;
    component.sessionStateValue = {
      filterType: CaaCasesFilterType.AssigneeName,
      caseReferenceNumber: null,
      assigneeName: 'active-user-id'
    };

    component.populateFormFromSessionState();

    expect(component.form.controls.assigneePerson.value).toEqual('Ada Lovelace - ada@example.com');
    expect(component.selectedFilterType).toEqual(CaaCasesFilterType.AssigneeName);
    expect(component.filterApplied).toBe(true);
    expect(component.selectedFilter.emit).toHaveBeenCalledWith({
      filterType: CaaCasesFilterType.AssigneeName,
      filterValue: 'active-user-id'
    });
  });

  it('should populate case reference filter from session state', () => {
    spyOn(component.selectedFilter, 'emit');
    component.selectedOrganisationUsers = users;
    component.sessionStateValue = {
      filterType: CaaCasesFilterType.CaseReferenceNumber,
      caseReferenceNumber: '1234567812345678',
      assigneeName: null
    };

    component.populateFormFromSessionState();

    expect(component.form.controls.caseReferenceNumber.value).toEqual('1234567812345678');
    expect(component.selectedFilter.emit).toHaveBeenCalledWith({
      filterType: CaaCasesFilterType.CaseReferenceNumber,
      filterValue: '1234567812345678'
    });
  });

  it('should filter users by string and selected user', (done) => {
    component.selectedOrganisationUsers = users;

    component.filterSelectedOrganisationUsers('ada').subscribe((groupedUsers) => {
      expect(groupedUsers.get(component.ACTIVE_USER_GROUP_HEADING)).toEqual([users[0]]);
      component.filterSelectedOrganisationUsers({ ...users[1], length: 1 } as any).subscribe((selectedUserGroup) => {
        expect(selectedUserGroup.get(component.INACTIVE_USER_GROUP_HEADING)).toEqual([users[1]]);
        done();
      });
    });
  });

  it('should emit case reference filter on search', () => {
    spyOn(component.selectedFilter, 'emit');
    component.form.controls.filterOption.setValue(CaaCasesFilterType.CaseReferenceNumber);
    component.form.controls.caseReferenceNumber.setValue('1234 5678 1234 5678');

    component.onSearch();

    expect(component.filterApplied).toBe(true);
    expect(component.selectedFilter.emit).toHaveBeenCalledWith({
      filterType: CaaCasesFilterType.CaseReferenceNumber,
      filterValue: '1234 5678 1234 5678'
    });
  });

  it('should emit validation errors for invalid assignee and case reference filters', () => {
    spyOn(component.emitErrorMessages, 'emit');
    component.form.controls.filterOption.setValue(CaaCasesFilterType.AssigneeName);
    component.form.controls.assigneePerson.setValue('');

    component.onSearch();

    expect(component.errorMessages).toContain({
      title: '',
      description: CaaCasesFilterErrorMessage.InvalidAssigneeName,
      fieldId: 'assigneePerson'
    });

    component.form.controls.filterOption.setValue(CaaCasesFilterType.CaseReferenceNumber);
    component.form.controls.caseReferenceNumber.setValue('1234');

    component.onSearch();

    expect(component.errorMessages).toContain({
      title: '',
      description: CaaCasesFilterErrorMessage.InvalidCaseReference,
      fieldId: 'caseReferenceNumber'
    });
    expect(component.emitErrorMessages.emit).toHaveBeenCalled();
  });

  it('should set selected user display value and reset the form', () => {
    spyOn(component.selectedFilter, 'emit');

    component.onUserSelectionChange(users[0]);
    expect(component.form.controls.assigneePerson.value).toEqual('Ada Lovelace - ada@example.com');

    component.onReset();

    expect(component.filterApplied).toBe(false);
    expect(component.selectedFilter.emit).toHaveBeenCalledWith({
      filterType: component.selectedFilterType,
      filterValue: ''
    });
  });
});
