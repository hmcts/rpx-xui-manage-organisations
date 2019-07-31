import { MonitoringService } from './monitoring.service';
import { NGXLogger } from 'ngx-logger';
import { Injectable } from '@angular/core';

export interface ILoggerService {
    trace(message: any, ...additional: any[]): void;
    debug(message: any, ...additional: any[]): void;
    info(message: any, ...additional: any[]): void;
    log(message: any, ...additional: any[]): void;
    warn(message: any, ...additional: any[]): void;
    error(message: any, ...additional: any[]): void;
    fatal(message: any, ...additional: any[]): void;
}

@Injectable()

export class LoggerService implements ILoggerService {
    constructor(private monitoringService: MonitoringService,
                private ngxLogger: NGXLogger) {
    }

    trace(message: any, ...additional: any[]): void {
        this.ngxLogger.trace(message);
        this.monitoringService.logEvent(message);
    }
    debug(message: any, ...additional: any[]): void {
        this.ngxLogger.debug(message);
        this.monitoringService.logEvent(message);
    }
    info(message: any, ...additional: any[]): void {
        this.ngxLogger.info(message);
        this.monitoringService.logEvent(message);
    }
    log(message: any, ...additional: any[]): void {
        this.ngxLogger.log(message);
        this.monitoringService.logEvent(message);
    }
    warn(message: any, ...additional: any[]): void {
        this.ngxLogger.warn(message);
        this.monitoringService.logEvent(message);
    }
    error(message: any, ...additional: any[]): void {
       this.ngxLogger.error(message);
       const error = new Error(message);
       this.monitoringService.logException(error);
    }
    fatal(message: any, ...additional: any[]): void {
        this.ngxLogger.fatal(message);
        const error = new Error(message);
        this.monitoringService.logException(error);
    }
}
