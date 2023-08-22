import { OnInit } from '@angular/core';
import { IPaymentGroup } from '../../interfaces/IPaymentGroup';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { BulkScaningPaymentService } from '../../services/bulk-scaning-payment/bulk-scaning-payment.service';
import { PaymentLibComponent } from '../../payment-lib.component';
import { IRemission } from '../../interfaces/IRemission';
import { IFee } from '../../interfaces/IFee';
import { SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { OrderslistService } from '../../services/orderslist.service';
import * as i0 from "@angular/core";
export declare class FeeSummaryComponent implements OnInit {
    private router;
    private bulkScaningPaymentService;
    private location;
    private paymentViewService;
    private paymentLibComponent;
    private OrderslistService;
    paymentGroupRef: string;
    ccdCaseNumber: string;
    isTurnOff: string;
    caseType: string;
    bsPaymentDcnNumber: string;
    paymentGroup: IPaymentGroup;
    errorMessage: string;
    viewStatus: string;
    currentFee: IFee;
    totalFee: number;
    payhubHtml: SafeHtml;
    service: string;
    platForm: string;
    upPaymentErrorMessage: string;
    selectedOption: string;
    isBackButtonEnable: boolean;
    outStandingAmount: number;
    isFeeAmountZero: boolean;
    totalAfterRemission: number;
    isConfirmationBtnDisabled: boolean;
    isRemoveBtnDisabled: boolean;
    isPaymentExist: boolean;
    isRemissionsExist: Boolean;
    isRemissionsMatch: boolean;
    isStrategicFixEnable: boolean;
    constructor(router: Router, bulkScaningPaymentService: BulkScaningPaymentService, location: Location, paymentViewService: PaymentViewService, paymentLibComponent: PaymentLibComponent, OrderslistService: OrderslistService);
    ngOnInit(): void;
    getUnassignedPaymentlist(): void;
    getRemissionByFeeCode(feeCode: string): IRemission;
    addRemission(fee: IFee): void;
    getPaymentGroup(): void;
    confirmRemoveFee(fee: IFee): void;
    removeFee(fee: any): void;
    loadCaseTransactionPage(): void;
    cancelRemission(): void;
    redirectToFeeSearchPage(event: any, page?: string): void;
    takePayment(): void;
    goToAllocatePage(outStandingAmount: number, isFeeAmountZero: Boolean): void;
    isCheckAmountdueExist(amountDue: any): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<FeeSummaryComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FeeSummaryComponent, "ccpay-fee-summary", never, { "paymentGroupRef": { "alias": "paymentGroupRef"; "required": false; }; "ccdCaseNumber": { "alias": "ccdCaseNumber"; "required": false; }; "isTurnOff": { "alias": "isTurnOff"; "required": false; }; "caseType": { "alias": "caseType"; "required": false; }; }, {}, never, never, false, never>;
}
//# sourceMappingURL=fee-summary.component.d.ts.map