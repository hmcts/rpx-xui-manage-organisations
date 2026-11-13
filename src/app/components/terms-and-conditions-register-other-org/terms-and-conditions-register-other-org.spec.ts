import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TermsAndConditionsRegisterOtherOrgComponent } from './terms-and-conditions-register-other-org.component';

describe('TermsAndConditionsRegisterOtherOrgComponent', () => {
  let component: TermsAndConditionsRegisterOtherOrgComponent;
  let fixture: ComponentFixture<TermsAndConditionsRegisterOtherOrgComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TermsAndConditionsRegisterOtherOrgComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionsRegisterOtherOrgComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('announces when every external link opens in a new tab', () => {
    fixture.detectChanges();

    const links: NodeListOf<HTMLAnchorElement> = fixture.nativeElement.querySelectorAll('a[target="_blank"]');

    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link.querySelector('.govuk-visually-hidden')?.textContent).toContain('opens in a new tab');
    });
  });
});
