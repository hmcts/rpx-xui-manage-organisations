import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CaaCasesState } from '../../store/reducers/caa-cases.reducer';
import { CaseShareConfirmComponent } from './case-share-confirm.component';

describe('CaseShareConfirmComponent', () => {
  let component: CaseShareConfirmComponent;
  let fixture: ComponentFixture<CaseShareConfirmComponent>;
  let store: MockStore<CaaCasesState>;
  let mockRouter: any;

  mockRouter = {
    url: '/assigned-cases'
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ CaseShareConfirmComponent ],
      providers: [
        provideMockStore(),
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseShareConfirmComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
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
    expect(component.completeLink).toEqual('/assigned-cases/case-share-complete');
  });
});
