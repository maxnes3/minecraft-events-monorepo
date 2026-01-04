import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  log(message: string, context?: string) {
    super.log(message, context || this.context);
  }

  error(message: string, stack?: string, context?: string) {
    super.error(message, stack, context || this.context);
  }

  warn(message: string, context?: string) {
    super.warn(message, context || this.context);
  }

  debug(message: string, context?: string) {
    super.debug(message, context || this.context);
  }

  verbose(message: string, context?: string) {
    super.verbose(message, context || this.context);
  }
}
