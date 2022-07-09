import { AppError } from '../../utils/app.error';

export class LogRecordActiveError extends AppError {
  constructor() {
    super('log-record-active', 'There are active work log. You should close.');
  }
}
