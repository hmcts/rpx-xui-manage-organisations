import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
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
        RouterTestingModule,
        ReactiveFormsModule
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

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });
});
