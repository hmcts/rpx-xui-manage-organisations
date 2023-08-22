import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IPayment } from '../../interfaces/IPayment';
import { PaymentLibService } from '../../payment-lib.service';
import { WebComponentHttpClient } from '../shared/httpclient/webcomponent.http.client';
import { ErrorHandlerService } from '../shared/error-handler.service';
import { LoggerService } from '../shared/logger/logger.service';
import { IPaymentGroup } from '../../interfaces/IPaymentGroup';
import { AddRemissionRequest } from '../../interfaces/AddRemissionRequest';
import { PaymentToPayhubRequest } from '../../interfaces/PaymentToPayhubRequest';
import { PayhubAntennaRequest } from '../../interfaces/PayhubAntennaRequest';
import { UnidentifiedPaymentsRequest } from '../../interfaces/UnidentifiedPaymentsRequest';
import { UnsolicitedPaymentsRequest } from '../../interfaces/UnsolicitedPaymentsRequest';
import { AllocatePaymentRequest } from '../../interfaces/AllocatePaymentRequest';
import { IAllocationPaymentsRequest } from '../../interfaces/IAllocationPaymentsRequest';
import { IOrderReferenceFee } from '../../interfaces/IOrderReferenceFee';
import { BehaviorSubject } from 'rxjs';
import { IserviceRequestPbaPayment } from '../../interfaces/IserviceRequestPbaPayment';
import { IserviceRequestCardPayment } from '../../interfaces/IserviceRequestCardPayment';
import { AddRetroRemissionRequest } from '../../interfaces/AddRetroRemissionRequest';
import { PostRefundRetroRemission } from '../../interfaces/PostRefundRetroRemission';
import { PostIssueRefundRetroRemission } from '../../interfaces/PostIssueRefundRetroRemission';
import * as i0 from "@angular/core";
export declare class PaymentViewService {
    private http;
    private https;
    private logger;
    private errorHandlerService;
    private paymentLibService;
    private ordersList;
    private meta;
    constructor(http: HttpClient, https: WebComponentHttpClient, logger: LoggerService, errorHandlerService: ErrorHandlerService, paymentLibService: PaymentLibService);
    getPaymentDetails(paymentReference: string, paymentMethod?: string): Observable<IPayment>;
    getPaymentGroupDetails(paymentGroupReference: string): Observable<IPaymentGroup>;
    getApportionPaymentDetails(paymentReference: string): Observable<IPaymentGroup>;
    getPBAaccountDetails(): Observable<any>;
    postWays2PayCardPayment(serviceRef: string, body: IserviceRequestCardPayment): Observable<any>;
    postPBAaccountPayment(serviceRef: string, body: IserviceRequestPbaPayment): Observable<any>;
    postBSPayments(body: AllocatePaymentRequest): Observable<any>;
    postBSUnidentifiedPayments(body: UnidentifiedPaymentsRequest): Observable<any>;
    postBSUnsolicitedPayments(body: UnsolicitedPaymentsRequest): Observable<any>;
    postBSAllocationPayments(body: IAllocationPaymentsRequest): Observable<any>;
    postPaymentGroupWithRemissions(paymentGroupReference: string, feeId: number, body: AddRemissionRequest): Observable<any>;
    deleteFeeFromPaymentGroup(feeId: number): Observable<any>;
    postPaymentToPayHub(body: PaymentToPayhubRequest, paymentGroupRef: string): Observable<any>;
    postPaymentAntennaToPayHub(body: PayhubAntennaRequest, paymentGroupRef: string): Observable<any>;
    downloadSelectedReport(reportName: string, startDate: string, endDate: string): Observable<any>;
    downloadFailureReport(startDate: string, endDate: string): Observable<any>;
    getBSfeature(): Observable<any>;
    getSiteID(): Observable<any>;
    getPartyDetails(caseNumber: string): Observable<any>;
    setOrdersList(orderLevelFees: IOrderReferenceFee[]): void;
    getOrdersList(): BehaviorSubject<IOrderReferenceFee[]>;
    postRefundsReason(body: PostRefundRetroRemission): Observable<any>;
    postPaymentGroupWithRetroRemissions(paymentGroupReference: string, feeId: number, body: AddRetroRemissionRequest): Observable<any>;
    postRefundRetroRemission(body: PostIssueRefundRetroRemission): Observable<any>;
    getPaymentFailure(paymentReference: string): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<PaymentViewService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PaymentViewService>;
}
//# sourceMappingURL=payment-view.service.d.ts.map