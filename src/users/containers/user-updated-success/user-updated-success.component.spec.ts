import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';

import { UserUpdatedSuccessComponent } from './user-updated-success.component';
import { RpxTranslatePipe, RpxTranslationService } from 'rpx-xui-translation';
import { User } from '@hmcts/rpx-xui-common-lib';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as userStore from '../../store';
import { MemoizedSelector } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserUpdatedSuccessComponent', () => {
  let component: UserUpdatedSuccessComponent;
  let fixture: ComponentFixture<UserUpdatedSuccessComponent>;

  const translationMockService = jasmine.createSpyObj('translationMockService', ['translate', 'getTranslation$']);

  let mockUserStore: MockStore<userStore.UserState>;
  let mockGetSingleUserSelector: MemoizedSelector<userStore.UserState, User>;
  let defaultUser: User;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [UserUpdatedSuccessComponent, RpxTranslatePipe],
      providers: [
        provideMockStore(),
        { provide: RpxTranslationService, useValue: translationMockService }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserUpdatedSuccessComponent);
    defaultUser = { email: 'john@doe.com', firstName: 'John', lastName: 'Doe', idamStatus: 'Active', idamStatusCode: 'A', roles: ['pui-case-manager', 'pui-user-manager'], id: '123' };
    mockUserStore = TestBed.inject(MockStore);
    mockGetSingleUserSelector = mockUserStore.overrideSelector(userStore.getGetSingleUser, defaultUser);
    mockGetSingleUserSelector.setResult(defaultUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    mockUserStore.resetSelectors();
  });

  it('should create and display user updated message', fakeAsync(() => {
    expect(component).toBeTruthy();
    flushMicrotasks();
    const panelBodyElement = fixture.nativeElement.querySelector('[id="confirmationBody"]');
    expect(panelBodyElement.textContent.trim()).toBe(defaultUser.email);
  }));
});
