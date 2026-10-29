import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceMessageAccessibilityDirective } from './service-message-accessibility.directive';

@Component({
  template: `
    <div appServiceMessageAccessibility>
      <xuilib-service-message>
        <div class="hmcts-banner__message">
          <h2>We are aware that some representatives are experiencing an issue.</h2>
          <a href="/organisation">Hide message</a>
        </div>
      </xuilib-service-message>
      <xuilib-service-message>
        <div class="hmcts-banner__message">
          <h2 id="existing-message-heading">A second service message.</h2>
          <a href="/organisation">Hide message</a>
        </div>
      </xuilib-service-message>
      <xuilib-service-message>
        <div class="hmcts-banner__message">
          <h2></h2>
          <a href="/organisation">Hide message</a>
        </div>
      </xuilib-service-message>
      <xuilib-service-message>
        <div class="hmcts-banner__message">
          <h2>A message without a hide link.</h2>
        </div>
      </xuilib-service-message>
    </div>
  `,
  standalone: false
})
class TestComponent {}

describe('ServiceMessageAccessibilityDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, ServiceMessageAccessibilityDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('gives each hide link a descriptive accessible name and associates it with the message', () => {
    const heading = fixture.nativeElement.querySelector('h2');
    const link = fixture.nativeElement.querySelector('a');

    expect(heading.id).toBe('service-message-0');
    expect(link.getAttribute('aria-label'))
      .toBe('Hide service message: We are aware that some representatives are experiencing an issue.');
    expect(link.getAttribute('aria-describedby')).toBe(heading.id);

    const secondHeading = fixture.nativeElement.querySelectorAll('h2')[1];
    const secondLink = fixture.nativeElement.querySelectorAll('a')[1];
    expect(secondHeading.id).toBe('existing-message-heading');
    expect(secondLink.getAttribute('aria-describedby')).toBe('existing-message-heading');
  });

  it('updates links when a service message is added after initial rendering', async () => {
    const container = fixture.nativeElement.querySelector('div');
    const message = document.createElement('xuilib-service-message');
    message.innerHTML = '<div class="hmcts-banner__message"><h2>New service message.</h2>' +
      '<a href="/organisation">Hide message</a></div>';
    container.appendChild(message);

    await new Promise((resolve) => setTimeout(resolve, 0));

    const links = fixture.nativeElement.querySelectorAll('a');
    expect(links[links.length - 1].getAttribute('aria-label'))
      .toBe('Hide service message: New service message.');
  });
});
