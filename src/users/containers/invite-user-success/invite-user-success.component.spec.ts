import { InviteUserSuccessComponent } from './invite-user-success.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromRoot from '../../../app/store';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

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
                    feature: combineReducers(fromStore.reducers),
                }),
            ],
            schemas: [
              CUSTOM_ELEMENTS_SCHEMA
            ],
            declarations: [
                InviteUserSuccessComponent
            ]
        }).compileComponents();

        store = TestBed.get(Store);

        fixture = TestBed.createComponent(InviteUserSuccessComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should have a component', () => {
        expect(component).toBeTruthy();
    });
});
