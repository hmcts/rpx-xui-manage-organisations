import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SingleFeeAccountComponent } from './single-fee-account.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StoreModule, Store, select } from '@ngrx/store';
import { reducers as feeAccountsReducers} from 'src/fee-accounts/store/reducers';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RouterReducerState } from '@ngrx/router-store';
import { getRouterState } from 'src/app/store/reducers/router.reducer';

describe('SingleFeeAccountComponent', () => {
    let component: SingleFeeAccountComponent;
    let fixture: ComponentFixture<SingleFeeAccountComponent>;
    let store: Store<RouterReducerState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SingleFeeAccountComponent],
            imports: [
                StoreModule.forRoot({}),
                StoreModule.forFeature('feeAccounts', feeAccountsReducers),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({ id: 1 }),
                    },
                },
            ]
        })
        .compileComponents();
        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SingleFeeAccountComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should handle route change when transactions', () => {
        const param = 'transactions';
        expect(component.setActivePath(param)).toEqual({ sectionHeader: 'Transactions', activeTab: 'transactions' });
    });

    it('should handle route change when summary', () => {
        const param = 'summary';
        expect(component.setActivePath(param)).toEqual({ sectionHeader: 'Summary', activeTab: 'summary' });
    });
});
