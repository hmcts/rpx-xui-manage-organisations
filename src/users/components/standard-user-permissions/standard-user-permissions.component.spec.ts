import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardUserPermissionsComponent } from './standard-user-permissions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ExuiCommonLibModule, FeatureToggleService, User } from '@hmcts/rpx-xui-common-lib';
import { of } from 'rxjs';
import { RpxTranslationService } from 'rpx-xui-translation';

describe('StaticUserPermissionsComponent', () => {
  const knownUser: User = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@doe.com',
    roles: [
      'pui-case-manager',
      'pui-finance-manager',
      'pui-organisation-manager',
      'pui-caa'
    ],
    manageCases: 'Yes',
    manageUsers: 'No',
    manageOrganisations: 'Yes',
    managePayments: 'Yes'
  };
  let component: StandardUserPermissionsComponent;
  let fixture: ComponentFixture<StandardUserPermissionsComponent>;
  let featureToggleServiceSpy: jasmine.SpyObj<FeatureToggleService>;
  const translationMockService = jasmine.createSpyObj('translationMockService', ['translate', 'getTranslation$']);

  beforeEach(async () => {
    featureToggleServiceSpy = jasmine.createSpyObj('FeatureToggleService', ['getValue']);
    featureToggleServiceSpy.getValue.withArgs('mo-grant-case-access-admin', false).and.returnValue(of(true));
    featureToggleServiceSpy.getValue.withArgs('mo-grant-manage-fee-accounts', false).and.returnValue(of(true));

    await TestBed.configureTestingModule({
      declarations: [StandardUserPermissionsComponent],
      imports: [ReactiveFormsModule, ExuiCommonLibModule],
      providers: [
        { provide: FeatureToggleService, useValue: featureToggleServiceSpy },
        { provide: RpxTranslationService, useValue: translationMockService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StandardUserPermissionsComponent);
    component = fixture.componentInstance;
    component.user = knownUser;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.permissions).toBeTruthy();
    expect(component.permissions.isPuiUserManager).toBeFalse();
    expect(component.permissions.isPuiFinanceManager).toBeTrue();
    expect(component.permissions.isPuiOrganisationManager).toBeTrue();
    expect(component.permissions.isCaseAccessAdmin).toBeTrue();
  });

  it('should emit permissions when form is updated', () => {
    // arrange
    const spy = spyOn(component.selectedPermissionsChanged, 'emit');
    fixture.detectChanges();

    // act
    const inputElement = fixture.nativeElement.querySelector('[id="isPuiUserManager"]');
    inputElement.click();

    // assert
    expect(component.permissions.isPuiUserManager).toBeTrue();
    expect(spy).toHaveBeenCalledWith(component.permissions);
  });
});
