import { APP_BASE_HREF } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { reducers } from '../../../fee-accounts/store/reducers';
import { DateFormatAtTimePipe } from '../../../shared/components/custom-pipe/date-pipe-with-to';
import { AccountTransactionsComponent } from './account-transactions.component';

describe('AccountTransactionsComponent', () => {
  let component: AccountTransactionsComponent;
  let fixture: ComponentFixture<AccountTransactionsComponent>;

  let activatedRoute: any;

  beforeEach(waitForAsync(() => {
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
      declarations: [AccountTransactionsComponent, DateFormatAtTimePipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ActivatedRoute, useValue: activatedRoute }
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
