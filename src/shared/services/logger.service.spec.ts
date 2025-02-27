import { LoggerService } from './logger.service';
import { UserInterface } from 'src/user-profile/models/user.model';

const userDetails: UserInterface = {
  email: 'hardcoded@user.com',
  orgId: '12345',
  roles: ['pui-case-manager', 'pui-user-manager', 'pui-finance-manager', 'pui-organisation-manager'],
  userId: '1',
  sessionTimeout: {
    idleModalDisplayTime: 10,
    totalIdleTime: 50
  }
};

describe('Logger service', () => {
  const mockedMonitoringService = jasmine.createSpyObj('mockedMonitoringService', ['logEvent', 'logException']);
  const mockedNgxLogger = jasmine.createSpyObj('mockedNgxLogger', ['trace', 'debug', 'info',
    'log', 'warn', 'error', 'fatal']);
  const mockedSessionStorageService = jasmine.createSpyObj('mockedSessionStorageService', ['getItem']);

  it('should be Truthy', () => {
    const service = new LoggerService(mockedMonitoringService, mockedNgxLogger, mockedSessionStorageService);
    expect(service).toBeTruthy();
  });

  it('should be able to call info', () => {
    mockedSessionStorageService.getItem.and.returnValue(JSON.stringify(userDetails));
    const service = new LoggerService(mockedMonitoringService, mockedNgxLogger, mockedSessionStorageService);
    service.info('message');
    expect(mockedMonitoringService.logEvent).toHaveBeenCalled();
    expect(mockedNgxLogger.info).toHaveBeenCalled();
  });

  it('should be able to call warn', () => {
    mockedSessionStorageService.getItem.and.returnValue(JSON.stringify(userDetails));
    const service = new LoggerService(mockedMonitoringService, mockedNgxLogger, mockedSessionStorageService);
    service.warn('message');
    expect(mockedMonitoringService.logEvent).toHaveBeenCalled();
    expect(mockedNgxLogger.warn).toHaveBeenCalled();
  });

  it('should be able to call error', () => {
    mockedSessionStorageService.getItem.and.returnValue(JSON.stringify(userDetails));
    const service = new LoggerService(mockedMonitoringService, mockedNgxLogger, mockedSessionStorageService);
    service.error('message');
    expect(mockedMonitoringService.logException).toHaveBeenCalled();
    expect(mockedNgxLogger.error).toHaveBeenCalled();
    expect(mockedSessionStorageService.getItem).toHaveBeenCalled();
  });

  it('should be able to call fatal', () => {
    mockedSessionStorageService.getItem.and.returnValue(JSON.stringify(userDetails));
    const service = new LoggerService(mockedMonitoringService, mockedNgxLogger, mockedSessionStorageService);
    service.fatal('message');
    expect(mockedMonitoringService.logException).toHaveBeenCalled();
    expect(mockedNgxLogger.fatal).toHaveBeenCalled();
    expect(mockedSessionStorageService.getItem).toHaveBeenCalled();
  });

  it('should be able to call debug', () => {
    mockedSessionStorageService.getItem.and.returnValue(JSON.stringify(userDetails));
    const service = new LoggerService(mockedMonitoringService, mockedNgxLogger, mockedSessionStorageService);
    service.debug('message');
    expect(mockedMonitoringService.logEvent).toHaveBeenCalled();
    expect(mockedSessionStorageService.getItem).toHaveBeenCalled();
  });

  it('should be able to call trace', () => {
    mockedSessionStorageService.getItem.and.returnValue(JSON.stringify(userDetails));
    const service = new LoggerService(mockedMonitoringService, mockedNgxLogger, mockedSessionStorageService);
    service.trace('message');
    expect(mockedMonitoringService.logEvent).toHaveBeenCalled();
    expect(mockedNgxLogger.trace).toHaveBeenCalled();
  });
});
