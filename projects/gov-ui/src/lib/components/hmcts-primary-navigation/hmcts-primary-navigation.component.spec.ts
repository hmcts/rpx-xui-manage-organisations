import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HmctsPrimaryNavigationComponent } from './hmcts-primary-navigation.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RpxTranslationTestingModule } from '../../../../../../src/testing/rpx-translation-testing.module';

describe('HmctsPrimaryNavigationComponent', () => {
  let component: HmctsPrimaryNavigationComponent;
  let fixture: ComponentFixture<HmctsPrimaryNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HmctsPrimaryNavigationComponent ],
      imports: [
        RouterTestingModule,
        RpxTranslationTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmctsPrimaryNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
