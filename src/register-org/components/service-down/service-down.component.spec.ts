import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpxTranslationTestingModule } from '../../../testing/rpx-translation-testing.module';
import { ServiceDownComponent } from './service-down.component';
import { buildMockStoreProviders } from '../../testing/mock-store-state';

describe('ServiceDownComponent', () => {
  let component: ServiceDownComponent;
  let fixture: ComponentFixture<ServiceDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RpxTranslationTestingModule],
      declarations: [ServiceDownComponent],
      providers: [
        ...buildMockStoreProviders()
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
