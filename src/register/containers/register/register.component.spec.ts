import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {Action, combineReducers, Store, StoreModule} from '@ngrx/store';
import * as fromStore from '../../../users/store';
import * as fromRoot from '../../../app/store';
import { RegisterComponent } from './register.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

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
        FormsModule,
        HttpClientTestingModule,
        StoreModule.forRoot({
          ...fromRoot.reducers,
          feature: combineReducers(fromStore.reducers),
        }),
      ],
      declarations: [RegisterComponent ],
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

        it('should submit page if show form validation is true',() =>{
          spyOn(component, 'onEvent').and.callFake(function() {
          component.pageId = 'organisation-pba';
          component.onPageContinue(mockStore);
          expect(component.onEvent).toBe(true);
          expect(mockStore.dispatch).toHaveBeenCalled();
          });
      });

        it('should set addAnotherPBANumber to on addAnotherPBANumber event', fakeAsync(() => {
           spyOn(component, 'onEvent').and.callFake(function() {
           component.pageId === 'addAnotherPBANumber';
           component.ngOnInit();
           component.onEvent;
           const element = fixture.debugElement.nativeElement.query(By.css('.classes'));
           element.btnClick();
           expect(component.onEvent).toBe(true);
           expect(mockStore.dispatch).toHaveBeenCalled();
           });
        }));

});
