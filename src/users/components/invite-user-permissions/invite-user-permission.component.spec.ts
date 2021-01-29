import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { of } from 'rxjs';
import { InviteUserPermissionComponent } from './invite-user-permission.component';

describe('Invite User Permission Component', () => {

  let component: InviteUserPermissionComponent;
  let fixture: ComponentFixture<InviteUserPermissionComponent>;

  const mockFeatureToggleService = jasmine.createSpyObj('FeatureToggleService', ['getValue']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ InviteUserPermissionComponent ],
      providers: [
        {
          provide: FeatureToggleService,
          useValue: mockFeatureToggleService
        }
      ]
    }).compileComponents();
    mockFeatureToggleService.getValue.and.returnValue(of(true));
    fixture = TestBed.createComponent(InviteUserPermissionComponent);
    component = fixture.componentInstance;
    component.inviteUserForm = new FormGroup({});
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should not see the Case Access Administrator if feature is toggled off', () => {
    component.grantCaseAccessAdmin$ = of(false);
    fixture.detectChanges();
    const grantCaseAccessAdmin = fixture.debugElement.nativeElement.querySelector('#checkbox-grant-case-access-admin');
    expect(grantCaseAccessAdmin).toBeFalsy();
  });

  it('should see the Case Access Administrator if feature is toggled on', () => {
    component.grantCaseAccessAdmin$ = of(true);
    fixture.detectChanges();
    const grantCaseAccessAdmin = fixture.debugElement.nativeElement.querySelector('#checkbox-grant-case-access-admin');
    expect(grantCaseAccessAdmin).toBeTruthy();
  });
});
