import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesFilterComponent } from './cases-filter.component';
import { SimpleChange } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { provideMockStore } from '@ngrx/store/testing';
import { CaaCasesService } from 'src/cases/services';
import { User } from '@hmcts/rpx-xui-common-lib';
import { CaaCasesFilterType } from 'src/cases/models/caa-cases.enum';
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
});
