import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FeeAccountErrorNotificationComponent } from './fee-account-error-notification.component';

describe('FeeAccountErrorNotificationComponent', () => {
  let component: FeeAccountErrorNotificationComponent;
  let fixture: ComponentFixture<FeeAccountErrorNotificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FeeAccountErrorNotificationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeAccountErrorNotificationComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    component.errorMessages = [];
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('trackByFeeAccountError', () => {
    it('should return the error message combined with the index', () => {
      expect(component.trackByFeeAccountError(0, 'Error one')).toBe('Error one#0');
      expect(component.trackByFeeAccountError(3, 'Error two')).toBe('Error two#3');
    });

    it('should produce unique keys for duplicate messages', () => {
      expect(component.trackByFeeAccountError(0, 'Same')).not.toBe(component.trackByFeeAccountError(1, 'Same'));
    });

    it('should fall back to the index for empty or missing messages', () => {
      expect(component.trackByFeeAccountError(2, '')).toBe(2);
      expect(component.trackByFeeAccountError(4, '   ')).toBe(4);
      expect(component.trackByFeeAccountError(5, null)).toBe(5);
      expect(component.trackByFeeAccountError(6, undefined)).toBe(6);
    });
  });

  describe('template', () => {
    it('should not render the error summary when there are no errors', () => {
      component.errorMessages = [];
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.govuk-error-summary')).toBeNull();
    });

    it('should render each error message using the trackBy function', () => {
      const spy = spyOn(component, 'trackByFeeAccountError').and.callThrough();
      component.errorMessages = ['First error', 'Second error'];
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('.govuk-error-summary__list li a');
      expect(items.length).toBe(2);
      expect(items[0].textContent.trim()).toBe('First error');
      expect(items[1].textContent.trim()).toBe('Second error');
      expect(spy).toHaveBeenCalledWith(0, 'First error');
      expect(spy).toHaveBeenCalledWith(1, 'Second error');
    });
  });
});
