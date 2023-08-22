import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaymentLibComponent } from '../../payment-lib.component';
import { BulkScaningPaymentService } from '../../services/bulk-scaning-payment/bulk-scaning-payment.service';
import { IBSPayments } from '../../interfaces/IBSPayments';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import * as i0 from "@angular/core";
export declare class MarkUnsolicitedPaymentComponent implements OnInit {
    private formBuilder;
    private paymentViewService;
    private paymentLibComponent;
    private bulkScaningPaymentService;
    caseType: string;
    markPaymentUnsolicitedForm: FormGroup;
    viewStatus: string;
    reasonHasError: boolean;
    isReasonEmpty: boolean;
    reasonMinHasError: boolean;
    reasonMaxHasError: boolean;
    responsibleOfficeHasError: boolean;
    isResponsibleOfficeEmpty: boolean;
    errorMessage: {
        title: string;
        body: string;
        showError: any;
    };
    ccdCaseNumber: string;
    bspaymentdcn: string;
    unassignedRecord: IBSPayments;
    siteID: string;
    reason: string;
    responsiblePerson: string;
    responsibleOffice: string;
    emailId: string;
    isConfirmButtondisabled: Boolean;
    isContinueButtondisabled: Boolean;
    ccdReference: string;
    exceptionReference: string;
    selectedSiteId: string;
    selectedSiteName: string;
    isStrategicFixEnable: boolean;
    siteIDList: any;
    constructor(formBuilder: FormBuilder, paymentViewService: PaymentViewService, paymentLibComponent: PaymentLibComponent, bulkScaningPaymentService: BulkScaningPaymentService);
    ngOnInit(): void;
    trimUnderscore(method: string): string;
    confirmPayments(): void;
    saveAndContinue(): void;
    resetForm(val: any, field: any): void;
    cancelMarkUnsolicitedPayments(type?: string): void;
    checkingFormValue(): boolean;
    gotoCasetransationPage(): void;
    getUnassignedPayment(): void;
    getErrorMessage(isErrorExist: any): {
        title: string;
        body: string;
        showError: any;
    };
    selectchange(args: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MarkUnsolicitedPaymentComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MarkUnsolicitedPaymentComponent, "app-mark-unsolicited-payment", never, { "caseType": { "alias": "caseType"; "required": false; }; }, {}, never, never, false, never>;
}
//# sourceMappingURL=mark-unsolicited-payment.component.d.ts.map