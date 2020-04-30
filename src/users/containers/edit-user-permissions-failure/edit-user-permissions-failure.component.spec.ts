import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {EditUserFailureReset} from '../../store/actions';
import {EditUserPermissionsFailureComponent} from './edit-user-permissions-failure.component';

fdescribe('EditUserPermissionsFailureComponent', () => {
  let component: EditUserPermissionsFailureComponent;
  let fixture: ComponentFixture<EditUserPermissionsFailureComponent>;

  const USER_ID = '5fe34csdf-dfs9-424c-x0sd2-23test';

  const mockUserStore = jasmine.createSpyObj('Store', [
    'dispatch',
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [EditUserPermissionsFailureComponent],
      imports: [
        RouterTestingModule
      ],
      providers: [
        {
          provide: Store,
          useValue: mockUserStore,
        },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({userId: USER_ID})) }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserPermissionsFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {

    it('should dispatch an action to the store to reset edit user failure.', () => {

      component.ngOnInit();
      expect(mockUserStore.dispatch).toHaveBeenCalledWith(new EditUserFailureReset());
    });

    it('should set userId to be the userId from url params.', () => {

      expect(component.userId).toEqual(USER_ID);
    });
  });

  describe('getEditUserPermissionsLink()', () => {

    it('should return a link to the user page', () => {

      const editUserPermissionsLink = `/users/user/${USER_ID}`;
      expect(component.getEditUserPermissionsLink(USER_ID)).toEqual(editUserPermissionsLink);
    });
  });
});
