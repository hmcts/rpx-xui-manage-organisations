import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppConstants } from '../../app.constants';
import { Helper, Navigation } from '../../containers/footer/footer.model';
import { HmctsGlobalFooterComponent } from './hmcts-global-footer.component';

describe('HmctsGlobalFooterComponent', () => {
  let component: HmctsGlobalFooterComponent;
  let fixture: ComponentFixture<HmctsGlobalFooterComponent>;

  const helpData: Helper = AppConstants.FOOTER_DATA;
  const navigationData: Navigation = AppConstants.FOOTER_DATA_NAVIGATION;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HmctsGlobalFooterComponent],
      imports: [
        RouterTestingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmctsGlobalFooterComponent);
    component = fixture.componentInstance;
    component.help = helpData;
    component.navigation = navigationData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be created by angular', () => {
    expect(fixture).not.toBeNull();
  });

  it('should display the logged-in user email when provided', () => {
    component.userEmail = 'user@example.com';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Logged in as: user@example.com');
  });

  it('should not display the logged-in user label without an email', () => {
    component.userEmail = null;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Logged in as:');
  });
});
