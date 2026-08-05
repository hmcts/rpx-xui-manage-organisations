import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import * as fromRoot from '../../../app/store';
import * as fromStore from '../../store';
import { InviteUserSuccessComponent } from './invite-user-success.component';

describe('Invite User Success Component', () => {
  let fixture: ComponentFixture<InviteUserSuccessComponent>;
  let component: InviteUserSuccessComponent;
  let store: Store<fromStore.UserState>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({
          ...fromRoot.reducers,
          feature: combineReducers(fromStore.reducers)
        })
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      declarations: [
        InviteUserSuccessComponent
      ]
    }).compileComponents();

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(InviteUserSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should have a component', () => {
    expect(component).toBeTruthy();
  });
});
