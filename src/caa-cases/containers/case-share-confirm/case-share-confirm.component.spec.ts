import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { buildMockStoreProviders } from '../../../register-org/testing/mock-store-state';
import { CaaCasesPageType } from '../../models/caa-cases.enum';
import { CaaCasesState } from '../../store/reducers';
import { CaseShareConfirmComponent } from './case-share-confirm.component';

describe('CaseShareConfirmComponent', () => {
  let component: CaseShareConfirmComponent;
  let fixture: ComponentFixture<CaseShareConfirmComponent>;

  let store: Store<CaaCasesState>;
  const mockRoute = {
    snapshot: {
      params: {
        pageType: CaaCasesPageType.AssignedCases
      }
    }
  };
  const mockRouter = {
    url: '/assigned-cases'
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [CaseShareConfirmComponent],
      providers: [
        ...buildMockStoreProviders(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(CaseShareConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set correct fnTitle, backLink, changeLink and completeLink for assigned cases', () => {
    fixture.detectChanges();
    expect(component.fnTitle).toEqual('Manage case sharing');
    expect(component.backLink).toEqual('/assigned-cases/case-share');
    expect(component.changeLink).toEqual('/assigned-cases/case-share');
    expect(component.completeLink).toEqual('/assigned-cases/case-share-complete/assigned-cases');
  });
});
