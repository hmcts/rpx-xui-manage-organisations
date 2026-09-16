import { AfterViewInit, Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: 'xuilib-service-messages[appServiceMessageAccessibility]',
  standalone: false
})
export class ServiceMessageAccessibilityDirective implements AfterViewInit, OnDestroy {
  private observer: MutationObserver;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {}

  public ngAfterViewInit(): void {
    this.setHideMessageLabels();

    this.observer = new MutationObserver(() => this.setHideMessageLabels());
    this.observer.observe(this.elementRef.nativeElement, { childList: true, subtree: true });
  }

  public ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private setHideMessageLabels(): void {
    const links = this.elementRef.nativeElement.querySelectorAll<HTMLAnchorElement>(
      'a.govuk-link--no-visited-state'
    );

    links.forEach((link) => {
      this.renderer.setAttribute(link, 'aria-label', 'Hide this service message');
    });
  }
}
