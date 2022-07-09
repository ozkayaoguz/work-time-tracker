import { AppError } from '../../utils/app.error';

export class ActiveLogRecordNotFoundError extends AppError {
  constructor() {
    super('active-log-record-not-found', 'Active log not found!');
  }
}
