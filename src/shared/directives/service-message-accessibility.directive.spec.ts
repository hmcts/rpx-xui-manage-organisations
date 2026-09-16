import { ElementRef, Renderer2 } from '@angular/core';
import { ServiceMessageAccessibilityDirective } from './service-message-accessibility.directive';

describe('ServiceMessageAccessibilityDirective', () => {
  it('labels service-message hide links and disconnects its observer', () => {
    const link = document.createElement('a');
    link.className = 'govuk-link--no-visited-state';
    const host = document.createElement('xuilib-service-messages');
    host.appendChild(link);
    const renderer = { setAttribute: jasmine.createSpy('setAttribute') } as unknown as Renderer2;
    const observer = { observe: jasmine.createSpy('observe'), disconnect: jasmine.createSpy('disconnect') };
    const originalMutationObserver = window.MutationObserver;
    window.MutationObserver = jasmine.createSpy('MutationObserver').and.returnValue(observer) as any;

    try {
      const directive = new ServiceMessageAccessibilityDirective(new ElementRef(host), renderer);
      directive.ngAfterViewInit();

      expect(renderer.setAttribute).toHaveBeenCalledWith(link, 'aria-label', 'Hide this service message');
      expect(observer.observe).toHaveBeenCalledWith(host, { childList: true, subtree: true });

      directive.ngOnDestroy();
      expect(observer.disconnect).toHaveBeenCalled();
    } finally {
      window.MutationObserver = originalMutationObserver;
    }
  });
});
