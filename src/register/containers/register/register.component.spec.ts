import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Action, combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromRoot from '../../../app/store';
import * as fromStore from '../../../users/store';
import { RegisterComponent } from './register.component';

const storeMock = {
  pipe: () => {
  },
  dispatch: (action: Action) => {
  }
};

describe('RegisterComponent', () => {

  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let store: Store<fromStore.UserState>;
  let mockStore: any;
  let mockActions: any;
  let routermMockStore: any;
  let pipeSpy: jasmine.Spy;
  let dispatchSpy: jasmine.Spy;

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('Store', ['pipe', 'select', 'dispatch']);
    routermMockStore = jasmine.createSpyObj('Store', ['pipe', 'select', 'dispatch']);
    mockActions = jasmine.createSpyObj('Actions', ['pipe']);
    component = new RegisterComponent(mockStore, routermMockStore, mockActions);
    pipeSpy = spyOn(storeMock, 'pipe').and.returnValue(of());
    dispatchSpy = spyOn(storeMock, 'dispatch');

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        StoreModule.forRoot({
          ...fromRoot.reducers,
          feature: combineReducers(fromStore.reducers),
        }),
      ],
      declarations: [RegisterComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Store,
          useValue: storeMock,
        },
        RegisterComponent
      ]
    }).compileComponents();

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should submit page if show form validation is true', () => {
    spyOn(component, 'onClick').and.callFake(() => {
      component.pageId = 'organisation-pba';
      component.ngOnInit();
      component.onPageContinue(mockStore);
      expect(mockStore.dispatch).toHaveBeenCalled();
    });
  });

});
