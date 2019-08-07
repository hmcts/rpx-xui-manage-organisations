import { ErrorHandler, Injectable} from '@angular/core';
import { LoggerService } from '../services/logger.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class DefaultErrorHandler implements ErrorHandler {
  constructor(private loggerService: LoggerService) { }

    handleError(error: Error) {
        this.loggerService.error(error);
   }
}
