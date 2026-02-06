import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { OrganisationServicesMessage } from '../../../register-org/models';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { OrganisationServicesAccessComponent } from './organisation-services-access.component';
import { RegisterOrgModule } from '../../register-org.module';
import { buildMockStoreProviders } from '../../testing/mock-store-state';

describe('OrganisationServicesAccessComponent', () => {
  let component: OrganisationServicesAccessComponent;
  let fixture: ComponentFixture<OrganisationServicesAccessComponent>;
  let router: Router;
  let nativeElement: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // RegisterOrgModule declares OrganisationServicesAccessComponent and dependencies.
      imports: [RouterTestingModule, ReactiveFormsModule, ExuiCommonLibModule, RegisterOrgModule],
      providers: [
        EnvironmentService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        ...buildMockStoreProviders()
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationServicesAccessComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should back link navigate to the check your answers page', () => {
    spyOnProperty(component, 'currentNavigation', 'get').and.returnValue({
      previousNavigation: {
        finalUrl: '/check-your-answers'
      }
    } as any);
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'check-your-answers']);
  });

  it('should back link navigate to the company house details page', () => {
    spyOnProperty(component, 'currentNavigation', 'get').and.returnValue({
      previousNavigation: {
        finalUrl: '/something-else'
      }
    } as any);
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'regulatory-organisation-type']);
  });

  it('should not set the error message and navigate to next the page', () => {
    // Select by data attribute (value) while id is the stable key now
    nativeElement.querySelector('[data-service-label="Damages"]').click();
    fixture.detectChanges();
    component.onContinue();
    expect(component.validationErrors.length).toEqual(0);
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'payment-by-account']);
  });

  it('should set the error message and stay on the page', () => {
    component.selectedServices = [];
    component.showOtherServicesInput = false;
    component.services.forEach((s) => s.selected = false);
    fixture.detectChanges();
    component.onContinue();
    expect(component.noServicesError).toEqual(OrganisationServicesMessage.NO_ORG_SERVICES);
    expect(component.validationErrors.length).toEqual(1);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });
});
