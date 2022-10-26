import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable} from '@angular/core';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class DefaultErrorHandler implements ErrorHandler {
  constructor(private loggerService: LoggerService) { }

    public handleError(error: Error) {
        this.loggerService.error(error);
   }
}
