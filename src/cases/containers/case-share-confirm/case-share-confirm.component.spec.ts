import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { CaaCasesPageType } from '../../models/caa-cases.enum';
import { CaaCasesState } from '../../store/reducers';
import { CaseShareConfirmComponent } from './case-share-confirm.component';

describe('CaseShareConfirmComponent', () => {
  let component: CaseShareConfirmComponent;
  let fixture: ComponentFixture<CaseShareConfirmComponent>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let store: MockStore<CaaCasesState>;
  const mockRoute = {
    snapshot: {
      params: {
        pageType: CaaCasesPageType.AssignedCases
      },
      queryParams: {
        caseAccept: false
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
        provideMockStore(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
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

  it('should set confirmation links for case sharing', () => {
    expect(component.fnTitle).toEqual('Action a case');
    expect(component.backLink).toEqual('/cases/case-share');
    expect(component.changeLink).toEqual('/cases/case-share');
    expect(component.completeLink).toEqual('/cases/case-share-complete/assigned-cases');
  });

  it('should set confirmation links for accepted cases', () => {
    const acceptedRoute = {
      snapshot: {
        params: { pageType: CaaCasesPageType.NewCases },
        queryParams: { caseAccept: true }
      }
    } as any;
    spyOn(store, 'pipe').and.returnValue(of([]));
    const acceptedComponent = new CaseShareConfirmComponent(store, acceptedRoute, mockRouter as any);
    acceptedComponent.ngOnInit();

    expect(acceptedComponent.backLink).toEqual('/cases/accept-cases');
    expect(acceptedComponent.changeLink).toEqual('/cases/accept-cases');
    expect(acceptedComponent.completeLink).toEqual('/cases/case-share-complete/new-cases');
    acceptedComponent.ngOnDestroy();
  });

  it('should assign share cases from the store selector', () => {
    const sharedCases = [{ caseId: '1', caseTitle: 'Case 1' }];
    spyOn(store, 'pipe').and.returnValue(of(sharedCases));

    component.ngOnInit();

    expect(component.shareCases).toEqual(sharedCases);
  });

  it('should complete destroy subject on destroy', () => {
    spyOn((component as any).destroy$, 'next');
    spyOn((component as any).destroy$, 'complete');

    component.ngOnDestroy();

    expect((component as any).destroy$.next).toHaveBeenCalled();
    expect((component as any).destroy$.complete).toHaveBeenCalled();
  });
});
