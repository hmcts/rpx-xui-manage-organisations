import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PhaseBannerComponent } from './phase-banner.component';

describe('PhaseBannerComponent', () => {
  let component: PhaseBannerComponent;
  let fixture: ComponentFixture<PhaseBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PhaseBannerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaseBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the feedback link', () => {
    const feedbackLinkElement = fixture.debugElement.query(By.css('.govuk-phase-banner .govuk-link')).nativeElement;

    expect(feedbackLinkElement.getAttribute('target')).toBe('_blank');
    expect(feedbackLinkElement.innerHTML).toContain('feedback');
    expect(feedbackLinkElement.getAttribute('aria-label')).toBe('provide your feedback - opens in a new window');
  });

});
