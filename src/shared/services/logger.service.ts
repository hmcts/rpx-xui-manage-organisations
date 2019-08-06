import { MonitoringService } from './monitoring.service';
import { NGXLogger } from 'ngx-logger';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import config from '../../../api/lib/config';
import * as jwtDecode from 'jwt-decode';
import { CryptoWrapper } from './cryptoWrapper';

export interface ILoggerService {
    trace(message: any, ...additional: any[]): void;
    debug(message: any, ...additional: any[]): void;
    info(message: any, ...additional: any[]): void;
    log(message: any, ...additional: any[]): void;
    warn(message: any, ...additional: any[]): void;
    error(message: any, ...additional: any[]): void;
    fatal(message: any, ...additional: any[]): void;
    getMessage(message: any): string;
}

@Injectable()

export class LoggerService implements ILoggerService {
    COOKIE_KEYS;
    constructor(private monitoringService: MonitoringService,
                private cookieService: CookieService,
                private ngxLogger: NGXLogger,
                private cryptoWrapper: CryptoWrapper) {
                    this.COOKIE_KEYS = {
                        TOKEN: config.cookies.token,
                        USER: config.cookies.userId
                      };
    }

    trace(message: any, ...additional: any[]): void {
        const formattedMessage = this.getMessage(message);
        this.ngxLogger.trace(formattedMessage);
        this.monitoringService.logEvent(message);
    }
    debug(message: any, ...additional: any[]): void {
        const formattedMessage = this.getMessage(message);
        this.ngxLogger.debug(formattedMessage);
        this.monitoringService.logEvent(message);
    }
    info(message: any, ...additional: any[]): void {
        const formattedMessage = this.getMessage(message);
        this.ngxLogger.info(formattedMessage);
        this.monitoringService.logEvent(message);
    }
    log(message: any, ...additional: any[]): void {
        const formattedMessage = this.getMessage(message);
        this.ngxLogger.log(formattedMessage);
        this.monitoringService.logEvent(message);
    }
    warn(message: any, ...additional: any[]): void {
        const formattedMessage = this.getMessage(message);
        this.ngxLogger.warn(formattedMessage);
        this.monitoringService.logEvent(message);
    }
    error(message: any, ...additional: any[]): void {
       this.ngxLogger.error(message);
       const formattedMessage = this.getMessage(message);
       const error = new Error(formattedMessage);
       this.monitoringService.logException(error);
    }
    fatal(message: any, ...additional: any[]): void {
        this.ngxLogger.fatal(message);
        const formattedMessage = this.getMessage(message);
        const error = new Error(formattedMessage);
        this.monitoringService.logException(error);
    }
    getMessage(message: any): string {
        const jwt = this.cookieService.get(this.COOKIE_KEYS.TOKEN);
        const jwtData = jwtDecode(jwt);
        const userIdEncrypted = this.cryptoWrapper.encrypt(jwtData.sub);
        return `User - ${userIdEncrypted.toString()}, Message - ${message}, Timestamp - ${Date.now()}`;
    }
}
