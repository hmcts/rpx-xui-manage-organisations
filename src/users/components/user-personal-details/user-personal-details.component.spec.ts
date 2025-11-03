import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPersonalDetailsComponent } from './user-personal-details.component';
import { ExuiCommonLibModule, UserDetails } from '@hmcts/rpx-xui-common-lib';
import { ReactiveFormsModule } from '@angular/forms';
import { RpxTranslationService } from 'rpx-xui-translation';

describe('UserPersonalDetailsComponent', () => {
  const knownUser: UserDetails = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@doe.com',
    idamId: '123',
    caseRoles: null
  };

  let component: UserPersonalDetailsComponent;
  let fixture: ComponentFixture<UserPersonalDetailsComponent>;
  const translationMockService = jasmine.createSpyObj('translationMockService', ['translate', 'getTranslation$']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ExuiCommonLibModule],
      declarations: [UserPersonalDetailsComponent],
      providers: [{ provide: RpxTranslationService, useValue: translationMockService }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserPersonalDetailsComponent);
    component = fixture.componentInstance;
  });

  xdescribe('Existing user is provided', () => {
    beforeEach(() => {
      component.user = knownUser;
      fixture.detectChanges();
    });

    it('should setup component as non-editable', () => {
      expect(component).toBeTruthy();
      expect(component.user).toBeTruthy();
      expect(component.inviteMode).toBeFalse();
      expect(component.personalDetailForm).toBeTruthy();
      expect(component.personalDetailForm.controls.email.value).toBe(knownUser.email);
      expect(component.personalDetailForm.controls.firstName.value).toBe(knownUser.firstName);
      expect(component.personalDetailForm.controls.lastName.value).toBe(knownUser.lastName);

      expect(component.personalDetailForm.controls.email.disabled).toBeTrue();
      expect(component.personalDetailForm.controls.firstName.disabled).toBeTrue();
      expect(component.personalDetailForm.controls.lastName.disabled).toBeTrue();

      const firstNameElement = fixture.nativeElement.querySelector('[id="firstName"]') as HTMLInputElement;
      expect(firstNameElement.value).toBe(knownUser.firstName);

      const lastNameElement = fixture.nativeElement.querySelector('[id="lastName"]') as HTMLInputElement;
      expect(lastNameElement.value).toBe(knownUser.lastName);

      const emailElement = fixture.nativeElement.querySelector('[id="email"]') as HTMLInputElement;
      expect(emailElement.value).toBe(knownUser.email);
    });
  });

  describe('Invite mode', () => {
    beforeEach(() => {
      component.user = undefined;
      fixture.detectChanges();
    });

    it('should setup component as editable', () => {
      const spy = spyOn(component.personalDetailsChanged, 'emit');

      expect(component).toBeTruthy();
      expect(component.user).toBeFalsy();
      expect(component.inviteMode).toBeTrue();
      expect(component.personalDetailForm).toBeTruthy();

      expect(component.personalDetailForm.controls.email.disabled).toBeFalse();
      expect(component.personalDetailForm.controls.firstName.disabled).toBeFalse();
      expect(component.personalDetailForm.controls.lastName.disabled).toBeFalse();

      const firstNameElement = fixture.nativeElement.querySelector('[id="firstName"]') as HTMLInputElement;
      firstNameElement.value = 'John';
      firstNameElement.dispatchEvent(new Event('input'));

      expect(component.personalDetailForm.controls.firstName.value).toBe('John');

      const lastNameElement = fixture.nativeElement.querySelector('[id="lastName"]');
      lastNameElement.value = 'Doe';
      lastNameElement.dispatchEvent(new Event('input'));

      const emailElement = fixture.nativeElement.querySelector('[id="email"]');
      emailElement.value = 'john@doe.com';
      // need to simluate all fields being touched
      component.personalDetailForm.markAllAsTouched();
      emailElement.dispatchEvent(new Event('input'));

      expect(spy).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com'
      });
    });
  });
});
