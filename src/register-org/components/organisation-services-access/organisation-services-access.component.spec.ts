import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { OrganisationServicesMessage } from '../../../register-org/models';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { ENVIRONMENT_CONFIG } from '../../../models/environmentConfig.model';
import { OrganisationServicesAccessComponent } from './organisation-services-access.component';
import { RegisterOrgModule } from '../../register-org.module';
import { buildMockStoreProviders } from '../../testing/mock-store-state';
import { mockEnvironmentConfig } from '../../../shared/services/environment.service.spec';

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
        { provide: ENVIRONMENT_CONFIG, useValue: mockEnvironmentConfig },
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

  it('should remove a service when the checkbox is unchecked', () => {
    component.selectedServices = [{ key: 'DIVORCE', value: 'Divorce' }];

    component.onServicesSelectionChange({
      target: {
        checked: false,
        value: 'DIVORCE',
        id: 'Divorce'
      }
    });

    expect(component.selectedServices).toEqual([]);
    expect(component.showOtherServicesInput).toBe(false);
  });

  it('should persist other service details when service is not listed is selected', () => {
    component.selectedServices = [{ key: 'NONE', value: '' }];
    component.showOtherServicesInput = true;
    component.servicesFormGroup.get('otherServices').setValue('Probate');

    component.onContinue();

    expect(component.registrationData.services).toEqual([]);
    expect(component.registrationData.otherServices).toEqual('Probate');
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'payment-by-account']);
  });

  it('should hydrate other service details from registration data', () => {
    component.registrationData.services = [];
    component.registrationData.otherServices = 'Probate';

    (component as any).setFormControlValues();

    expect(component.showOtherServicesInput).toBe(true);
    expect(component.selectedServices).toContain({ key: 'NONE', value: '' });
    expect(component.servicesFormGroup.get('otherServices').value).toEqual('Probate');
    expect(component.services.find((service) => service.key === 'NONE').selected).toBe(true);
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

  it('should set other services error when service not listed has no detail', () => {
    component.selectedServices = [{ key: 'NONE', value: '' }];
    component.showOtherServicesInput = true;
    component.servicesFormGroup.get('otherServices').setValue('');

    component.onContinue();

    expect(component.otherServicesError).toEqual(OrganisationServicesMessage.OTHER_SERVICES);
    expect(component.validationErrors).toContain({
      id: 'other-services',
      message: OrganisationServicesMessage.OTHER_SERVICES
    });
  });

  it('should track services by stable key', () => {
    expect(component.trackByOrgService(0, { key: 'DIVORCE', value: 'Divorce' })).toEqual('DIVORCE#0');
  });

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });
});
