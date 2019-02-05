import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsComponent } from './transactions.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TransactionsComponent', () => {
    let component: TransactionsComponent;
    let fixture: ComponentFixture<TransactionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TransactionsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TransactionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fill tableRows', () => {
        component.transactions = [{dummy: 'something'}];
        component.ngOnChanges();
        expect(component.tableRows).toBeTruthy([{dummy: 'something'}]);
    });

});
