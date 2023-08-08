import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { PaymentByAccountDetailsComponent } from './payment-by-account-details.component';

describe('PaymentByAccountDetailsComponent', () => {
  let component: PaymentByAccountDetailsComponent;
  let fixture: ComponentFixture<PaymentByAccountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentByAccountDetailsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [EnvironmentService]
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
});
