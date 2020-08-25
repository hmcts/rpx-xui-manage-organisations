import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from '../../../app/store/reducers';
import { CaseShareComponent } from './case-share.component';

describe('CaseShareComponent', () => {
  let component: CaseShareComponent;
  let fixture: ComponentFixture<CaseShareComponent>;

  let store: MockStore<State>;
  const mockService = jasmine.createSpyObj('FeatureToggleService', ['isEnabled']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ CaseShareComponent ],
      providers: [
        provideMockStore(),
        {
          provide: FeatureToggleService,
          useValue: mockService
        },
      ]
    }).compileComponents();
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(CaseShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(mockService.isEnabled).toHaveBeenCalled();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
