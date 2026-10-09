import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom } from 'rxjs';
import { ENVIRONMENT_CONFIG } from '../../../models/environmentConfig.model';
import * as fromUserProfile from '../../../user-profile/store';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  @Component({
    selector: 'app-host-dummy-component',
    template: '<app-footer></app-footer>',
    standalone: false
  })
  class TestDummyHostComponent {
    @ViewChild(FooterComponent, { static: true })
    public footerComponent: FooterComponent;
  }

  let testHostComponent: TestDummyHostComponent;
  let testHostFixture: ComponentFixture<TestDummyHostComponent>;
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let element: DebugElement;
  let store: MockStore;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [FooterComponent, TestDummyHostComponent],
      providers: [
        provideMockStore(),
        { provide: ENVIRONMENT_CONFIG, useValue: { environment: 'aat' } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestDummyHostComponent);
    testHostComponent = testHostFixture.componentInstance;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be created by angular', () => {
    expect(fixture).not.toBeNull();
  });

  it('should hide the sitemap link throughout the new registration journey', () => {
    const routerUrl = spyOnProperty(TestBed.inject(Router), 'url', 'get');
    routerUrl.and.returnValue('/register-org-new/register');
    expect(component.navigationData.items.map((item) => item.href)).not.toContain('sitemap');

    routerUrl.and.returnValue('/register-org-new/organisation-type');
    expect(component.navigationData.items.map((item) => item.href)).not.toContain('sitemap');
  });

  it('should hide the sitemap link on the legacy registration route', () => {
    spyOnProperty(TestBed.inject(Router), 'url', 'get').and.returnValue('/register-org/register');

    expect(component.navigationData.items.map((item) => item.href)).not.toContain('sitemap');
  });

  it('should keep the sitemap link outside the registration journeys', () => {
    spyOnProperty(TestBed.inject(Router), 'url', 'get').and.returnValue('/home');

    expect(component.navigationData.items.map((item) => item.href)).toContain('sitemap');
  });

  it('should keep the sitemap link when the current URL has no primary route segment', () => {
    spyOnProperty(TestBed.inject(Router), 'url', 'get').and.returnValue('');

    expect(component.navigationData.items.map((item) => item.href)).toContain('sitemap');
  });

  it('should provide the logged-in user email in a lower environment', async () => {
    store.overrideSelector(fromUserProfile.getUser, { email: 'user@example.com' } as any);
    store.refreshState();

    await expectAsync(firstValueFrom(component.userEmail$)).toBeResolvedTo('user@example.com');
  });

  it('should not provide the logged-in user email in production', async () => {
    const productionFooter = new FooterComponent(store as any, { environment: 'prod' } as any, TestBed.inject(Router));

    await expectAsync(firstValueFrom(productionFooter.userEmail$)).toBeResolvedTo(null);
  });
});
