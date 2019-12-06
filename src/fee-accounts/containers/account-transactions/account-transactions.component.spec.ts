import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTransactionsComponent } from './account-transactions.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducers } from 'src/fee-accounts/store/reducers';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('AccountTransactionsComponent', () => {
  let component: AccountTransactionsComponent;
  let fixture: ComponentFixture<AccountTransactionsComponent>;

  let activatedRoute: any;

  beforeEach(async(() => {
    activatedRoute = {
        snapshot: {
          params: of({})
      }
    };
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('feeAccounts', reducers),
        RouterTestingModule
      ],
      declarations: [ AccountTransactionsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return back url', () => {
    const backUrl = component.getBackUrl('1234');
    expect(backUrl).toEqual('/fee-accounts/account/1234');
  });

  it('should unsubscribe', () => {
    const subscription = jasmine.createSpyObj('subscription', ['unsubscribe']);
    component.unsubscribe(subscription);
    expect(subscription.unsubscribe).toHaveBeenCalled();
  });
});
