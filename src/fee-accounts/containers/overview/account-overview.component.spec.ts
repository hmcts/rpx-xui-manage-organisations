import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganisationAccountsComponent } from './account-overview.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducers } from 'src/fee-accounts/store/reducers';
import { of } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

describe('OrganisationAccountsComponent', () => {
    let component: OrganisationAccountsComponent;
    let fixture: ComponentFixture<OrganisationAccountsComponent>;

    let activatedRoute: any;

    beforeEach(async(() => {
        activatedRoute = {
            parent: {
                params: of({})
            }
        };
        TestBed.configureTestingModule({
            declarations: [OrganisationAccountsComponent],
            imports: [
                StoreModule.forRoot({}),
                StoreModule.forFeature('feeAccounts', reducers),
                StoreModule.forFeature('org', reducers),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: APP_BASE_HREF, useValue: '/' },
                { provide: ActivatedRoute, useValue: activatedRoute },
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OrganisationAccountsComponent);
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
