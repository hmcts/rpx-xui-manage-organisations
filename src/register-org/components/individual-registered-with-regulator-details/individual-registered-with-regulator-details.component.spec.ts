import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndividualRegisteredWithRegulatorDetailsComponent } from './individual-registered-with-regulator-details.component';
import { RegisterOrgModule } from '../../register-org.module';
import { buildMockStoreProviders } from '../../testing/mock-store-state';
import { ReactiveFormsModule } from '@angular/forms';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('IndividualRegisteredWithRegulatorDetailsComponent', () => {
  let component: IndividualRegisteredWithRegulatorDetailsComponent;
  let fixture: ComponentFixture<IndividualRegisteredWithRegulatorDetailsComponent>;

  beforeEach(async () => {
    const mockRoute = { snapshot: { params: {} } };
    const mockLovRefDataService = {
      getRegulatoryOrganisationTypes: () => of([])
    } as Partial<LovRefDataService>;

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, ExuiCommonLibModule, RegisterOrgModule, RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: LovRefDataService, useValue: mockLovRefDataService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        ...buildMockStoreProviders()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualRegisteredWithRegulatorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
