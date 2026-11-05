import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appServiceMessageAccessibility]',
  standalone: false
})
export class ServiceMessageAccessibilityDirective implements AfterViewInit, OnDestroy {
  private readonly observer: MutationObserver;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {
    this.observer = new MutationObserver(() => this.updateMessageLinks());
  }

  public ngAfterViewInit(): void {
    this.updateMessageLinks();
    this.observer.observe(this.elementRef.nativeElement, { childList: true, subtree: true });
  }

  public ngOnDestroy(): void {
    this.observer.disconnect();
  }

  private updateMessageLinks(): void {
    const messages = this.elementRef.nativeElement.querySelectorAll<HTMLElement>('xuilib-service-message');

    messages.forEach((message, index) => {
      const heading = message.querySelector<HTMLElement>('.hmcts-banner__message h2');
      const hideLink = message.querySelector<HTMLAnchorElement>('.hmcts-banner__message a');

      if (!heading || !hideLink) {
        return;
      }

      const headingText = heading.textContent?.replace(/\s+/g, ' ').trim();
      if (!headingText) {
        return;
      }

      const headingId = heading.id || `service-message-${index}`;
      heading.id = headingId;
      hideLink.setAttribute('aria-label', `Hide service message: ${headingText}`);
      hideLink.setAttribute('aria-describedby', headingId);
    });
  }
}
