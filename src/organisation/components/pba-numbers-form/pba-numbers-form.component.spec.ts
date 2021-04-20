import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ExuiCommonLibModule } from "@hmcts/rpx-xui-common-lib";
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import { UpdatePbaNumbers } from "src/organisation/models/update-pba-numbers.model";
import { PbaNumbersFormComponent } from "..";

const mockUpdatePbaNumbers = new UpdatePbaNumbers(['PBA7777777']);

fdescribe('PbaNumbersFormComponent', () => {

    let component: PbaNumbersFormComponent;
    let fixture: ComponentFixture<PbaNumbersFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule,
                ReactiveFormsModule,
                ExuiCommonLibModule.forChild(),
                RouterTestingModule.withRoutes([]),
                RxReactiveFormsModule
            ],
            declarations: [PbaNumbersFormComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(PbaNumbersFormComponent);
        component = fixture.componentInstance;
        component.updatePbaNumbers = mockUpdatePbaNumbers;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});