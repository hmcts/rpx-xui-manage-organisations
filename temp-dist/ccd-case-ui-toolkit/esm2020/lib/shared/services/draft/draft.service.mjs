import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AbstractAppConfig } from '../../../app.config';
import { Draft, DRAFT_PREFIX } from '../../domain/draft.model';
import { HttpErrorService, HttpService } from '../http';
import * as i0 from "@angular/core";
import * as i1 from "../http";
import * as i2 from "../../../app.config";
export class DraftService {
    constructor(http, appConfig, errorService) {
        this.http = http;
        this.appConfig = appConfig;
        this.errorService = errorService;
    }
    createDraft(ctid, eventData) {
        const saveDraftEndpoint = this.appConfig.getCreateOrUpdateDraftsUrl(ctid);
        const headers = new HttpHeaders()
            .set('experimental', 'true')
            .set('Accept', DraftService.V2_MEDIATYPE_DRAFT_CREATE)
            .set('Content-Type', 'application/json');
        return this.http
            .post(saveDraftEndpoint, eventData, { headers, observe: 'body' })
            .pipe(catchError((error) => {
            this.errorService.setError(error);
            return throwError(error);
        }));
    }
    updateDraft(ctid, draftId, eventData) {
        const saveDraftEndpoint = this.appConfig.getCreateOrUpdateDraftsUrl(ctid) + draftId;
        const headers = new HttpHeaders()
            .set('experimental', 'true')
            .set('Accept', DraftService.V2_MEDIATYPE_DRAFT_UPDATE)
            .set('Content-Type', 'application/json');
        return this.http
            .put(saveDraftEndpoint, eventData, { headers, observe: 'body' })
            .pipe(catchError((error) => {
            this.errorService.setError(error);
            return throwError(error);
        }));
    }
    getDraft(draftId) {
        const url = this.appConfig.getViewOrDeleteDraftsUrl(draftId.slice(DRAFT_PREFIX.length));
        const headers = new HttpHeaders()
            .set('experimental', 'true')
            .set('Accept', DraftService.V2_MEDIATYPE_DRAFT_READ)
            .set('Content-Type', 'application/json');
        return this.http
            .get(url, { headers, observe: 'body' })
            .pipe(catchError((error) => {
            this.errorService.setError(error);
            return throwError(error);
        }));
    }
    deleteDraft(draftId) {
        const url = this.appConfig.getViewOrDeleteDraftsUrl(draftId.slice(DRAFT_PREFIX.length));
        const headers = new HttpHeaders()
            .set('experimental', 'true')
            .set('Accept', DraftService.V2_MEDIATYPE_DRAFT_DELETE)
            .set('Content-Type', 'application/json');
        return this.http
            .delete(url, { headers, observe: 'body' }).pipe(catchError((error) => {
            this.errorService.setError(error);
            return throwError(error);
        }));
    }
    createOrUpdateDraft(caseTypeId, draftId, caseEventData) {
        if (!draftId) {
            return this.createDraft(caseTypeId, caseEventData);
        }
        else {
            return this.updateDraft(caseTypeId, Draft.stripDraftId(draftId), caseEventData);
        }
    }
}
DraftService.V2_MEDIATYPE_DRAFT_CREATE = 'application/vnd.uk.gov.hmcts.ccd-data-store-api.ui-draft-create.v2+json;charset=UTF-8';
DraftService.V2_MEDIATYPE_DRAFT_UPDATE = 'application/vnd.uk.gov.hmcts.ccd-data-store-api.ui-draft-update.v2+json;charset=UTF-8';
DraftService.V2_MEDIATYPE_DRAFT_READ = 'application/vnd.uk.gov.hmcts.ccd-data-store-api.ui-draft-read.v2+json;charset=UTF-8';
DraftService.V2_MEDIATYPE_DRAFT_DELETE = 'application/vnd.uk.gov.hmcts.ccd-data-store-api.ui-draft-delete.v2+json;charset=UTF-8';
DraftService.ɵfac = function DraftService_Factory(t) { return new (t || DraftService)(i0.ɵɵinject(i1.HttpService), i0.ɵɵinject(i2.AbstractAppConfig), i0.ɵɵinject(i1.HttpErrorService)); };
DraftService.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: DraftService, factory: DraftService.ɵfac });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DraftService, [{
        type: Injectable
    }], function () { return [{ type: i1.HttpService }, { type: i2.AbstractAppConfig }, { type: i1.HttpErrorService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZnQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NjZC1jYXNlLXVpLXRvb2xraXQvc3JjL2xpYi9zaGFyZWQvc2VydmljZXMvZHJhZnQvZHJhZnQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUd4RCxPQUFPLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUM7Ozs7QUFHeEQsTUFBTSxPQUFPLFlBQVk7SUFXdkIsWUFDbUIsSUFBaUIsRUFDakIsU0FBNEIsRUFDNUIsWUFBOEI7UUFGOUIsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUNqQixjQUFTLEdBQVQsU0FBUyxDQUFtQjtRQUM1QixpQkFBWSxHQUFaLFlBQVksQ0FBa0I7SUFDOUMsQ0FBQztJQUVHLFdBQVcsQ0FBQyxJQUFZLEVBQUUsU0FBd0I7UUFDdkQsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFFLE1BQU0sT0FBTyxHQUFHLElBQUksV0FBVyxFQUFFO2FBQzlCLEdBQUcsQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDO2FBQzNCLEdBQUcsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLHlCQUF5QixDQUFDO2FBQ3JELEdBQUcsQ0FB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LENBQUMsQ0FBQyxLQUFVLEVBQU8sRUFBRTtZQUM3QixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNsQyxPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ04sQ0FBQztJQUVNLG1CQUFtQixDQUFDLFVBQWtCLEVBQUUsT0FBZSxFQUFFLGFBQTRCO1FBQzFGLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1NBQ3BEO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDakY7SUFDSCxDQUFDOztBQWhGc0Isc0NBQXlCLEdBQzlDLHVGQUF1RixDQUFDO0FBQ25FLHNDQUF5QixHQUM5Qyx1RkFBdUYsQ0FBQztBQUNuRSxvQ0FBdUIsR0FDNUMscUZBQXFGLENBQUM7QUFDakUsc0NBQXlCLEdBQzlDLHVGQUF1RixDQUFDO3dFQVQvRSxZQUFZO2tFQUFaLFlBQVksV0FBWixZQUFZO3VGQUFaLFlBQVk7Y0FEeEIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEFic3RyYWN0QXBwQ29uZmlnIH0gZnJvbSAnLi4vLi4vLi4vYXBwLmNvbmZpZyc7XG5pbXBvcnQgeyBDYXNlRXZlbnREYXRhIH0gZnJvbSAnLi4vLi4vZG9tYWluL2Nhc2UtZXZlbnQtZGF0YS5tb2RlbCc7XG5pbXBvcnQgeyBDYXNlVmlldyB9IGZyb20gJy4uLy4uL2RvbWFpbi9jYXNlLXZpZXcvY2FzZS12aWV3Lm1vZGVsJztcbmltcG9ydCB7IERyYWZ0LCBEUkFGVF9QUkVGSVggfSBmcm9tICcuLi8uLi9kb21haW4vZHJhZnQubW9kZWwnO1xuaW1wb3J0IHsgSHR0cEVycm9yU2VydmljZSwgSHR0cFNlcnZpY2UgfSBmcm9tICcuLi9odHRwJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERyYWZ0U2VydmljZSB7XG5cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMl9NRURJQVRZUEVfRFJBRlRfQ1JFQVRFID1cbiAgICAnYXBwbGljYXRpb24vdm5kLnVrLmdvdi5obWN0cy5jY2QtZGF0YS1zdG9yZS1hcGkudWktZHJhZnQtY3JlYXRlLnYyK2pzb247Y2hhcnNldD1VVEYtOCc7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjJfTUVESUFUWVBFX0RSQUZUX1VQREFURSA9XG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC51ay5nb3YuaG1jdHMuY2NkLWRhdGEtc3RvcmUtYXBpLnVpLWRyYWZ0LXVwZGF0ZS52Mitqc29uO2NoYXJzZXQ9VVRGLTgnO1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYyX01FRElBVFlQRV9EUkFGVF9SRUFEID1cbiAgICAnYXBwbGljYXRpb24vdm5kLnVrLmdvdi5obWN0cy5jY2QtZGF0YS1zdG9yZS1hcGkudWktZHJhZnQtcmVhZC52Mitqc29uO2NoYXJzZXQ9VVRGLTgnO1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYyX01FRElBVFlQRV9EUkFGVF9ERUxFVEUgPVxuICAgICdhcHBsaWNhdGlvbi92bmQudWsuZ292LmhtY3RzLmNjZC1kYXRhLXN0b3JlLWFwaS51aS1kcmFmdC1kZWxldGUudjIranNvbjtjaGFyc2V0PVVURi04JztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGh0dHA6IEh0dHBTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgYXBwQ29uZmlnOiBBYnN0cmFjdEFwcENvbmZpZyxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGVycm9yU2VydmljZTogSHR0cEVycm9yU2VydmljZVxuICApIHt9XG5cbiAgcHVibGljIGNyZWF0ZURyYWZ0KGN0aWQ6IHN0cmluZywgZXZlbnREYXRhOiBDYXNlRXZlbnREYXRhKTogT2JzZXJ2YWJsZTxEcmFmdD4ge1xuICAgIGNvbnN0IHNhdmVEcmFmdEVuZHBvaW50ID0gdGhpcy5hcHBDb25maWcuZ2V0Q3JlYXRlT3JVcGRhdGVEcmFmdHNVcmwoY3RpZCk7XG4gICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpXG4gICAgICAuc2V0KCdleHBlcmltZW50YWwnLCAndHJ1ZScpXG4gICAgICAuc2V0KCdBY2NlcHQnLCBEcmFmdFNlcnZpY2UuVjJfTUVESUFUWVBFX0RSQUZUX0NSRUFURSlcbiAgICAgIC5zZXQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgcmV0dXJuIHRoaXMuaHR0cFxuICAgICAgLnBvc3Qoc2F2ZURyYWZ0RW5kcG9pbnQsIGV2ZW50RGF0YSwge2hlYWRlcnMsIG9ic2VydmU6ICdib2R5J30pXG4gICAgICAucGlwZShjYXRjaEVycm9yKChlcnJvcjogYW55KTogYW55ID0+IHtcbiAgICAgICAgdGhpcy5lcnJvclNlcnZpY2Uuc2V0RXJyb3IoZXJyb3IpO1xuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XG4gICAgICB9KSk7XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlRHJhZnQoY3RpZDogc3RyaW5nLCBkcmFmdElkOiBzdHJpbmcsIGV2ZW50RGF0YTogQ2FzZUV2ZW50RGF0YSk6IE9ic2VydmFibGU8RHJhZnQ+IHtcbiAgICBjb25zdCBzYXZlRHJhZnRFbmRwb2ludCA9IHRoaXMuYXBwQ29uZmlnLmdldENyZWF0ZU9yVXBkYXRlRHJhZnRzVXJsKGN0aWQpICsgZHJhZnRJZDtcbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKClcbiAgICAgIC5zZXQoJ2V4cGVyaW1lbnRhbCcsICd0cnVlJylcbiAgICAgIC5zZXQoJ0FjY2VwdCcsIERyYWZ0U2VydmljZS5WMl9NRURJQVRZUEVfRFJBRlRfVVBEQVRFKVxuICAgICAgLnNldCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICByZXR1cm4gdGhpcy5odHRwXG4gICAgICAucHV0KHNhdmVEcmFmdEVuZHBvaW50LCBldmVudERhdGEsIHtoZWFkZXJzLCBvYnNlcnZlOiAnYm9keSd9KVxuICAgICAgLnBpcGUoY2F0Y2hFcnJvcigoZXJyb3I6IGFueSk6IGFueSA9PiB7XG4gICAgICAgIHRoaXMuZXJyb3JTZXJ2aWNlLnNldEVycm9yKGVycm9yKTtcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xuICAgICAgfSkpO1xuICB9XG5cbiAgcHVibGljIGdldERyYWZ0KGRyYWZ0SWQ6IHN0cmluZyk6IE9ic2VydmFibGU8Q2FzZVZpZXc+IHtcbiAgICBjb25zdCB1cmwgPSB0aGlzLmFwcENvbmZpZy5nZXRWaWV3T3JEZWxldGVEcmFmdHNVcmwoZHJhZnRJZC5zbGljZShEUkFGVF9QUkVGSVgubGVuZ3RoKSk7XG4gICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpXG4gICAgICAuc2V0KCdleHBlcmltZW50YWwnLCAndHJ1ZScpXG4gICAgICAuc2V0KCdBY2NlcHQnLCBEcmFmdFNlcnZpY2UuVjJfTUVESUFUWVBFX0RSQUZUX1JFQUQpXG4gICAgICAuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgIHJldHVybiB0aGlzLmh0dHBcbiAgICAgIC5nZXQodXJsLCB7aGVhZGVycywgb2JzZXJ2ZTogJ2JvZHknfSlcbiAgICAgIC5waXBlKFxuICAgICAgICBjYXRjaEVycm9yKChlcnJvcjogYW55KTogYW55ID0+IHtcbiAgICAgICAgICB0aGlzLmVycm9yU2VydmljZS5zZXRFcnJvcihlcnJvcik7XG4gICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyb3IpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBkZWxldGVEcmFmdChkcmFmdElkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPHt9IHwgYW55PiB7XG4gICAgY29uc3QgdXJsID0gdGhpcy5hcHBDb25maWcuZ2V0Vmlld09yRGVsZXRlRHJhZnRzVXJsKGRyYWZ0SWQuc2xpY2UoRFJBRlRfUFJFRklYLmxlbmd0aCkpO1xuICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKVxuICAgICAgLnNldCgnZXhwZXJpbWVudGFsJywgJ3RydWUnKVxuICAgICAgLnNldCgnQWNjZXB0JywgRHJhZnRTZXJ2aWNlLlYyX01FRElBVFlQRV9EUkFGVF9ERUxFVEUpXG4gICAgICAuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgIHJldHVybiB0aGlzLmh0dHBcbiAgICAgIC5kZWxldGUodXJsLCB7aGVhZGVycywgb2JzZXJ2ZTogJ2JvZHknfSkucGlwZShcbiAgICAgICAgY2F0Y2hFcnJvcigoZXJyb3I6IGFueSk6IGFueSA9PiB7XG4gICAgICAgICAgdGhpcy5lcnJvclNlcnZpY2Uuc2V0RXJyb3IoZXJyb3IpO1xuICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlT3JVcGRhdGVEcmFmdChjYXNlVHlwZUlkOiBzdHJpbmcsIGRyYWZ0SWQ6IHN0cmluZywgY2FzZUV2ZW50RGF0YTogQ2FzZUV2ZW50RGF0YSk6IE9ic2VydmFibGU8RHJhZnQ+IHtcbiAgICBpZiAoIWRyYWZ0SWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmNyZWF0ZURyYWZ0KGNhc2VUeXBlSWQsIGNhc2VFdmVudERhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy51cGRhdGVEcmFmdChjYXNlVHlwZUlkLCBEcmFmdC5zdHJpcERyYWZ0SWQoZHJhZnRJZCksIGNhc2VFdmVudERhdGEpO1xuICAgIH1cbiAgfVxufVxuIl19