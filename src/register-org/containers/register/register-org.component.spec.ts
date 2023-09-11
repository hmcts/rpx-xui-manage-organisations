import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterOrgService } from '../../services';
import { RegisterComponent } from './register-org.component';

fdescribe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockRegisterOrgService: any;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async() => {
    mockRegisterOrgService = jasmine.createSpyObj('registerOrgService', ['removeRegistrationData']);
    mockRegisterOrgService.removeRegistrationData.and.callThrough();
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        RouterTestingModule
      ],
      providers: [
        { provider: Router, useValue: mockRouter },
        { provider: RegisterOrgService, useValue: mockRegisterOrgService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cancelRegistrationJourney confirmed by the user', () => {
    spyOn(window, 'confirm').and.callFake(() => {
      return true;
    });
    spyOn(component.registerOrgService, 'removeRegistrationData').and.callThrough();
    component.cancelRegistrationJourney();
    expect(component.registerOrgService.removeRegistrationData).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'register']);
  });

  it('should cancelRegistrationJourney not confirmed by the user', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.cancelRegistrationJourney();
    expect(mockRegisterOrgService.removeRegistrationData).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
