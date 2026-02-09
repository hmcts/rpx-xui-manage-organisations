import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { ENVIRONMENT_CONFIG, EnvironmentConfig } from '../../../models/environmentConfig.model';
import { BeforeYouStartComponent } from './before-you-start.component';

describe('BeforeYouStartComponent', () => {
  let component: BeforeYouStartComponent;
  let fixture: ComponentFixture<BeforeYouStartComponent>;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    getCurrentNavigation: jasmine.createSpy('getCurrentNavigation')
  };

  const mockEnvironmentConfig: EnvironmentConfig = {
    manageCaseLink: 'http://manage-case',
    manageOrgLink: 'http://manage-org',
    protocol: 'http',
    googleAnalyticsKey: 'ga-key'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BeforeYouStartComponent],
      imports: [RouterTestingModule, ReactiveFormsModule, ExuiCommonLibModule],
      providers: [
        EnvironmentService,
        { provide: ENVIRONMENT_CONFIG, useValue: mockEnvironmentConfig },
        { provide: Router, useValue: mockRouter },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
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
    const errorMessages = [{
      message: 'Please select the checkbox',
      id: 'confirmed-organisation-account'
    }];
    component.beforeYouStartForm.get('confirmedOrganisationAccount').setValue(null);
    component.onStart();
    expect(component.beforeYouStartErrors).toEqual(errorMessages);
    expect(scrollIntoViewSpy).toHaveBeenCalled();
  });
});
