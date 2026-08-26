import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesFilterComponent } from './cases-filter.component';
import { SimpleChange } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { CaaCasesService } from 'src/cases/services';
import { User } from '@hmcts/rpx-xui-common-lib';
import { CaaCasesFilterErrorMessage, CaaCasesFilterType } from 'src/cases/models/caa-cases.enum';
import { ENVIRONMENT_CONFIG } from '../../../models/environmentConfig.model';

describe('CasesCasesFilterComponent', () => {
  let component: CasesFilterComponent;
  let fixture: ComponentFixture<CasesFilterComponent>;
  let caaCasesService: jasmine.SpyObj<CaaCasesService>;
  let mockEnvironmentConfig: { ogdUpdateRefreshUserEnabled: boolean };

  beforeEach(async () => {
    mockEnvironmentConfig = { ogdUpdateRefreshUserEnabled: false };
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
        { provide: CaaCasesService, useValue: caaCasesService },
        { provide: ENVIRONMENT_CONFIG, useValue: mockEnvironmentConfig }
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

  it('should hide new cases filter option when OGD update refresh user is disabled', () => {
    const newCasesOption = fixture.nativeElement.querySelector('#newCasesToAccept');

    expect(newCasesOption).toBeNull();
  });

  it('should show new cases filter option when OGD update refresh user is enabled', () => {
    mockEnvironmentConfig.ogdUpdateRefreshUserEnabled = true;
    const enabledFixture = TestBed.createComponent(CasesFilterComponent);
    enabledFixture.detectChanges();

    const newCasesOption = enabledFixture.nativeElement.querySelector('#newCasesToAccept');

    expect(newCasesOption).toBeTruthy();
  });

  it('should not re-emit a stored filter when the organisation users input is populated later', () => {
    const user = {
      userIdentifier: 'user-id-1',
      fullName: 'Test User',
      email: 'test.user@example.com',
      status: 'active'
    } as User;
    const emitSpy = spyOn(component.selectedFilter, 'emit');
    component.sessionStateValue = {
      filterType: CaaCasesFilterType.UnassignedCases,
      caseReferenceNumber: null,
      assigneeName: null
    };

    component.populateFormFromSessionState();
    component.selectedOrganisationUsers = [user];
    component.ngOnChanges({
      selectedOrganisationUsers: new SimpleChange([], [user], false)
    });

    expect(emitSpy.calls.count()).toBe(1);
    expect(emitSpy).toHaveBeenCalledWith({
      filterType: CaaCasesFilterType.UnassignedCases,
      filterValue: null
    });
  });

  it('should wait for organisation users before emitting a stored assignee filter', () => {
    const user = {
      userIdentifier: 'user-id-1',
      fullName: 'Test User',
      email: 'test.user@example.com',
      status: 'active'
    } as User;
    const emitSpy = spyOn(component.selectedFilter, 'emit');
    component.sessionStateValue = {
      filterType: CaaCasesFilterType.CasesAssignedToAUser,
      caseReferenceNumber: null,
      assigneeName: user.userIdentifier
    };

    component.populateFormFromSessionState();

    expect(emitSpy).not.toHaveBeenCalled();

    component.selectedOrganisationUsers = [user];
    component.ngOnChanges({
      selectedOrganisationUsers: new SimpleChange([], [user], false)
    });

    expect(emitSpy.calls.count()).toBe(1);
    expect(emitSpy).toHaveBeenCalledWith({
      filterType: CaaCasesFilterType.CasesAssignedToAUser,
      filterValue: user.userIdentifier
    });
  });

  it('should default a stored new cases filter to unassigned cases when OGD update refresh user is disabled', () => {
    const emitSpy = spyOn(component.selectedFilter, 'emit');
    component.sessionStateValue = {
      filterType: CaaCasesFilterType.NewCasesToAccept,
      caseReferenceNumber: null,
      assigneeName: null
    };

    component.populateFormFromSessionState();

    expect(emitSpy).toHaveBeenCalledWith({
      filterType: CaaCasesFilterType.UnassignedCases,
      filterValue: null
    });
  });

  it('should group active and inactive users and filter by search text', (done) => {
    const activeUser = {
      userIdentifier: 'user-id-1',
      fullName: 'Test User',
      email: 'test.user@example.com',
      status: 'active'
    } as User;
    const inactiveUser = {
      userIdentifier: 'user-id-2',
      fullName: 'Other User',
      email: 'other.user@example.com',
      status: 'pending'
    } as User;
    component.selectedOrganisationUsers = [activeUser, inactiveUser];

    component.filterSelectedOrganisationUsers('test').subscribe((groupedUsers) => {
      expect(groupedUsers.get(component.ACTIVE_USER_GROUP_HEADING)).toEqual([activeUser]);
      expect(groupedUsers.get(component.INACTIVE_USER_GROUP_HEADING)).toEqual([]);
      component.filterSelectedOrganisationUsers(inactiveUser).subscribe((selectedUserGroup) => {
        expect(selectedUserGroup.get(component.INACTIVE_USER_GROUP_HEADING)).toEqual([inactiveUser]);
        done();
      });
    });
  });

  it('should populate and emit a stored case reference filter', () => {
    const emitSpy = spyOn(component.selectedFilter, 'emit');
    component.sessionStateValue = {
      filterType: CaaCasesFilterType.CaseReferenceNumber,
      caseReferenceNumber: '1234567812345678',
      assigneeName: null
    };

    component.populateFormFromSessionState();

    expect(component.form.controls.caseReferenceNumber.value).toEqual('1234567812345678');
    expect(emitSpy).toHaveBeenCalledWith({
      filterType: CaaCasesFilterType.CaseReferenceNumber,
      filterValue: '1234567812345678'
    });
  });

  it('should emit validation errors for invalid assignee and case reference filters', () => {
    spyOn(component.emitErrorMessages, 'emit');

    component.form.controls.filterOption.setValue(CaaCasesFilterType.CasesAssignedToAUser);
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

  it('should emit selected assignee, reset the form and handle empty display names', () => {
    const user = {
      userIdentifier: 'user-id-1',
      fullName: 'Test User',
      email: 'test.user@example.com',
      status: 'active'
    } as User;
    const emitSpy = spyOn(component.selectedFilter, 'emit');
    component.selectedOrganisationUsers = [user];

    component.form.controls.filterOption.setValue(CaaCasesFilterType.CasesAssignedToAUser);
    component.onUserSelectionChange(user);
    component.onSearch();

    expect(emitSpy).toHaveBeenCalledWith({
      filterType: CaaCasesFilterType.CasesAssignedToAUser,
      filterValue: 'user-id-1'
    });
    expect(component.getDisplayName(null)).toEqual('');

    component.onReset();
    expect(component.filterApplied).toBe(false);
    expect(emitSpy).toHaveBeenCalledWith({
      filterType: component.selectedFilterType,
      filterValue: ''
    });
  });

  it('should allow new cases filter when OGD update refresh user is enabled', () => {
    mockEnvironmentConfig.ogdUpdateRefreshUserEnabled = true;
    const enabledFixture = TestBed.createComponent(CasesFilterComponent);
    const enabledComponent = enabledFixture.componentInstance;
    enabledFixture.detectChanges();

    enabledComponent.selectFilterOption(CaaCasesFilterType.NewCasesToAccept);

    expect(enabledComponent.selectedFilterType).toEqual(CaaCasesFilterType.NewCasesToAccept);
    enabledFixture.destroy();
  });
});
