import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be created by angular', () => {
    expect(fixture).not.toBeNull();
  });

  it('should provide the logged-in user email in a lower environment', async () => {
    store.overrideSelector(fromUserProfile.getUser, { email: 'user@example.com' } as any);
    store.refreshState();

    await expectAsync(firstValueFrom(component.userEmail$)).toBeResolvedTo('user@example.com');
  });

  it('should not provide the logged-in user email in production', async () => {
    const productionFooter = new FooterComponent(store as any, { environment: 'prod' } as any);

    await expectAsync(firstValueFrom(productionFooter.userEmail$)).toBeResolvedTo(null);
  });
});
