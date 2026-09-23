import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SITEMAP_SECTIONS, SitemapComponent } from './sitemap.component';

describe('SitemapComponent', () => {
  let component: SitemapComponent;
  let fixture: ComponentFixture<SitemapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SitemapComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display every sitemap section and page link', () => {
    const sectionHeadings = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('h2'))
      .map((heading) => heading.textContent?.trim());
    const pageLinks = Array.from<HTMLAnchorElement>(fixture.nativeElement.querySelectorAll('[data-testid="sitemap-link"]'));
    const expectedLinks = SITEMAP_SECTIONS.reduce((links, section) => links.concat(section.links), []);

    expect(sectionHeadings).toEqual(SITEMAP_SECTIONS.map((section) => section.heading));
    expect(pageLinks.map((link) => ({ text: link.textContent.trim(), href: link.getAttribute('href') })))
      .toEqual(expectedLinks);
  });

  it('should identify the current page in the breadcrumb', () => {
    const currentPage = fixture.nativeElement.querySelector('.govuk-breadcrumbs__list-item[aria-current="page"]');

    expect(currentPage.textContent.trim()).toBe('Site map');
  });
});
