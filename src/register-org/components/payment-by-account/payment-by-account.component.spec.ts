import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { PaymentByAccountComponent } from './payment-by-account.component';

describe('PaymentByAccountComponent', () => {
  let component: PaymentByAccountComponent;
  let fixture: ComponentFixture<PaymentByAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentByAccountComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [EnvironmentService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentByAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
