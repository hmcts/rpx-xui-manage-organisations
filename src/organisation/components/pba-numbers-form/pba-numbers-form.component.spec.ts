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

    describe('onAddNewBtnClicked()', () => {
        it('should add a new form control to the pba form', () => {
            const currentFormArrayCount = component.pbaNumbers.length;
            component.onAddNewBtnClicked();

            const newFormArrayCount = component.pbaNumbers.length;
            expect(newFormArrayCount).toEqual(currentFormArrayCount + 1);
        });
    });

    describe('onRemoveNewPbaNumberClicked()', () => {
        it('should remove a new form control to the pba form', () => {
            component.onAddNewBtnClicked();

            const currentFormArrayCount = component.pbaNumbers.length;

            component.onRemoveNewPbaNumberClicked(0);

            const newFormArrayCount = component.pbaNumbers.length;
            expect(newFormArrayCount).toEqual(currentFormArrayCount - 1);
        });
    });

    describe('onRemoveExistingPaymentByAccountNumberClicked()', () => {
        it('should remove a new form control to the pba form', () => {
            component.updatePbaNumbers.existingPbaNumbers = ['PBA1234567'];

            component.onRemoveExistingPaymentByAccountNumberClicked('PBA1234567');

            expect(component.updatePbaNumbers.pendingRemovePbaNumbers).toEqual(['PBA1234567']);
        });
    });

    describe('generateSummaryErrorMessage()', () => {

        it('should display the existing organisation error when user tries to add an existing PBA', () => {
            component.updatePbaNumbers.existingPbaNumbers = ['PBA1234567'];

            component.onAddNewBtnClicked();
            component.pbaNumbers.controls[0].setValue({pbaNumber: 'PBA1234567'});

            expect(component.summaryErrors.isFromValid).toBeFalsy();
            expect(component.summaryErrors.header).toEqual('There is a problem');
            expect(component.summaryErrors.items[0].message).toEqual('This PBA number is already associated to your organisation');
        });
    });
    
});
