import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorMessage } from '../../../shared/models/error-message.model';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { BeforeYouStartComponent } from './before-you-start.component';

describe('BeforeYouStartComponent', () => {
  let component: BeforeYouStartComponent;
  let fixture: ComponentFixture<BeforeYouStartComponent>;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BeforeYouStartComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        EnvironmentService,
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeforeYouStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to organisation type page if checkbox is checked', () => {
    component.beforeYouStartForm.get('confirmedOrganisationAccount').setValue(true);
    component.onStart();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'organisation-type']);
  });

  it('should set the error message if checkbox is not checked', () => {
    const scrollIntoViewSpy = jasmine.createSpy();
    component.mainContentElement = {
      nativeElement: {
        scrollIntoView: scrollIntoViewSpy
      }
    };
    const errorMessage: ErrorMessage = {
      description: 'Please select the checkbox',
      title: '',
      fieldId: 'confirmed-organisation-account'
    };
    component.beforeYouStartForm.get('confirmedOrganisationAccount').setValue(null);
    component.onStart();
    expect(component.beforeYouStartError).toEqual(errorMessage);
    expect(scrollIntoViewSpy).toHaveBeenCalled();
  });
});
