import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { ENVIRONMENT_CONFIG, EnvironmentConfig } from '../../../models/environmentConfig.model';
import { PaymentByAccountDetailsComponent } from './payment-by-account-details.component';
import { buildMockStoreProviders } from '../../testing/mock-store-state';
// provideHttpClient imported above

describe('PaymentByAccountDetailsComponent', () => {
  let component: PaymentByAccountDetailsComponent;
  let fixture: ComponentFixture<PaymentByAccountDetailsComponent>;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    getCurrentNavigation: jasmine.createSpy('getCurrentNavigation')
  };

  const mockEnvironmentConfig: EnvironmentConfig = {
    idamWeb: 'http://idam-web',
    manageCaseLink: 'http://manage-case',
    manageOrgLink: 'http://manage-org',
    protocol: 'http',
    googleAnalyticsKey: 'ga-key'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentByAccountDetailsComponent],
      imports: [RouterTestingModule, ReactiveFormsModule, ExuiCommonLibModule],
      providers: [
        EnvironmentService,
        { provide: ENVIRONMENT_CONFIG, useValue: mockEnvironmentConfig },
        { provide: Router, useValue: mockRouter },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        ...buildMockStoreProviders()
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentByAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new form control to the pba form', () => {
    const currentFormArrayCount = component.pbaNumbers.length;
    component.onAddNewPBANumber();
    const newFormArrayCount = component.pbaNumbers.length;
    expect(newFormArrayCount).toEqual(currentFormArrayCount + 1);
  });

  it('should remove a new form control to the pba form', () => {
    component.onAddNewPBANumber();
    const currentFormArrayCount = component.pbaNumbers.length;
    component.onRemovePBANumber(0);
    const newFormArrayCount = component.pbaNumbers.length;
    expect(newFormArrayCount).toEqual(currentFormArrayCount - 1);
  });

  it('should fail validation for invalid pba numbers', () => {
    component.pbaNumbers.controls[0].get('pbaNumber').setValue('PBA1234');
    component.onAddNewPBANumber();
    component.pbaNumbers.controls[1].get('pbaNumber').setValue('11111111');
    component.onAddNewPBANumber();
    component.pbaNumbers.controls[2].get('pbaNumber').setValue('PBANUMBERS');
    component.onAddNewPBANumber();
    component.pbaNumbers.controls[3].get('pbaNumber').setValue('PBA1234567');
    component.onAddNewPBANumber();
    component.pbaNumbers.controls[4].get('pbaNumber').setValue('PBA1234567');
    component.onContinue();
    const actualErrors = component.validationErrors.filter((item) => item.message !== '');
    expect(actualErrors.length).toEqual(4);
  });

  it('should back link navigate to the check your answers page', () => {
    spyOnProperty(component, 'currentNavigation', 'get').and.returnValue({
      previousNavigation: {
        finalUrl: '/check-your-answers'
      }
    } as any);
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'check-your-answers']);
  });

  it('should back link navigate to the payment by account page', () => {
    spyOnProperty(component, 'currentNavigation', 'get').and.returnValue({
      previousNavigation: {
        finalUrl: '/something-else'
      }
    } as any);
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'payment-by-account']);
  });

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });
});
