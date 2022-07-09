import { AppError } from '../../utils/app.error';

export class UserNotFoundError extends AppError {
  constructor() {
    super('user-not-found', 'User not found');
  }
}
