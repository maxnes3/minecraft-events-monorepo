import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { ILoggerService } from '../domain/logger-service.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger implements ILoggerService {
  public log(message: string, context?: string): void {
    super.log(message, context || this.context);
  }

  public error(message: string, stack?: string, context?: string): void {
    super.error(message, stack, context || this.context);
  }

  public warn(message: string, context?: string): void {
    super.warn(message, context || this.context);
  }

  public debug(message: string, context?: string): void {
    super.debug(message, context || this.context);
  }

  public verbose(message: string, context?: string): void {
    super.verbose(message, context || this.context);
  }
}
