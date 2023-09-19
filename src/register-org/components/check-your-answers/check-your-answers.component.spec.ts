import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CheckYourAnswersComponent } from './check-your-answers.component';

describe('CheckYourAnswersComponent', () => {
  let component: CheckYourAnswersComponent;
  let fixture: ComponentFixture<CheckYourAnswersComponent>;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckYourAnswersComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckYourAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should back link navigate to the correct page', () => {
    component.registrationData.hasIndividualRegisteredWithRegulator = true;
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'individual-registered-with-regulator-details']);
    component.registrationData.hasIndividualRegisteredWithRegulator = false;
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'individual-registered-with-regulator']);
  });
});
