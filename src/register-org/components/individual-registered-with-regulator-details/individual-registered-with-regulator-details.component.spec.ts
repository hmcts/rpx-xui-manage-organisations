import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { RegulatorDetailsComponent } from '../regulator-details/regulator-details.component';
import { IndividualRegisteredWithRegulatorDetailsComponent } from './individual-registered-with-regulator-details.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('IndividualRegisteredWithRegulatorDetailsComponent', () => {
  let component: IndividualRegisteredWithRegulatorDetailsComponent;
  let fixture: ComponentFixture<IndividualRegisteredWithRegulatorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndividualRegisteredWithRegulatorDetailsComponent, RegulatorDetailsComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, ExuiCommonLibModule],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();
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
