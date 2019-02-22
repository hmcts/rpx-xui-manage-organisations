import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FeeAccountsComponent } from './account-overview.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducers } from 'src/fee-accounts/store/reducers';

describe('FeeAccountsComponent', () => {
    let component: FeeAccountsComponent;
    let fixture: ComponentFixture<FeeAccountsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FeeAccountsComponent],
            imports: [
                StoreModule.forRoot({}),
                StoreModule.forFeature('feeAccounts', reducers),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FeeAccountsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});
