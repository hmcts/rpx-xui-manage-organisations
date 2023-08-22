import { EventEmitter, OnInit } from '@angular/core';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { CaseEvent } from '../../domain/definition/case-event.model';
import { CaseTypeLite } from '../../domain/definition/case-type-lite.model';
import { Jurisdiction } from '../../domain/definition/jurisdiction.model';
import { DefinitionsService } from '../../services/definitions/definitions.service';
import { OrderService } from '../../services/order/order.service';
import { SessionStorageService } from '../../services/session/session-storage.service';
import { CreateCaseFiltersSelection } from './create-case-filters-selection.model';
import * as i0 from "@angular/core";
export declare class CreateCaseFiltersComponent implements OnInit {
    private readonly orderService;
    private readonly definitionsService;
    private readonly sessionStorageService;
    isDisabled: boolean;
    startButtonText: string;
    selectionSubmitted: EventEmitter<CreateCaseFiltersSelection>;
    selectionChanged: EventEmitter<any>;
    formGroup: UntypedFormGroup;
    selected: {
        jurisdiction?: Jurisdiction;
        caseType?: CaseTypeLite;
        event?: CaseEvent;
        formGroup?: UntypedFormGroup;
    };
    jurisdictions: Jurisdiction[];
    selectedJurisdictionCaseTypes?: CaseTypeLite[];
    selectedCaseTypeEvents?: CaseEvent[];
    filterJurisdictionControl: FormControl;
    filterCaseTypeControl: FormControl;
    filterEventControl: FormControl;
    constructor(orderService: OrderService, definitionsService: DefinitionsService, sessionStorageService: SessionStorageService);
    ngOnInit(): void;
    onJurisdictionIdChange(): void;
    onCaseTypeIdChange(): void;
    onEventIdChange(): void;
    isCreatable(): boolean;
    apply(): void;
    initControls(): void;
    emitChange(): void;
    private sortEvents;
    private retainEventsWithNoPreStates;
    private retainEventsWithCreateRights;
    private hasCreateAccess;
    private selectJurisdiction;
    private selectCaseType;
    private selectEvent;
    private findJurisdiction;
    private findCaseType;
    private findEvent;
    private resetCaseType;
    private resetEvent;
    private isEmpty;
    static ɵfac: i0.ɵɵFactoryDeclaration<CreateCaseFiltersComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CreateCaseFiltersComponent, "ccd-create-case-filters", never, { "isDisabled": "isDisabled"; "startButtonText": "startButtonText"; }, { "selectionSubmitted": "selectionSubmitted"; "selectionChanged": "selectionChanged"; }, never, never, false, never>;
}
//# sourceMappingURL=create-case-filters.component.d.ts.map