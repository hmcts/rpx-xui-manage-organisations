import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as fromAppStore from '../../../app/store';
import { ServiceDownComponent } from './service-down.component';

const initialState = {
  routerReducer: {},
  appState: {}
};

describe('ServiceDownComponent', () => {
  let component: ServiceDownComponent;
  let fixture: ComponentFixture<ServiceDownComponent>;
  let store: MockStore<fromAppStore.State>;
  let dispatchSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ServiceDownComponent],
      imports: [RouterTestingModule],
      providers: [
        provideMockStore({ initialState })
      ]
    }).compileComponents();
    store = TestBed.inject(Store);
    dispatchSpy = spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(ServiceDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should create component', () => {
    expect(component).toBeTruthy();
  });

  it('showErrorLinkWithNewTab', () => {
    let result = component.showErrorLinkWithNewTab(null);
    expect(result).toEqual('_self');

    result = component.showErrorLinkWithNewTab(false);
    expect(result).toEqual('_self');

    result = component.showErrorLinkWithNewTab(true);
    expect(result).toEqual('_blank');
  });

  it('should call the store dispathc', () => {
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalled();
  });
});
