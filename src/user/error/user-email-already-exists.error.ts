import { AppError } from '../../utils/app.error';

export class UserEmailAlreadyExistsError extends AppError {
  constructor() {
    super('user-email-already-exists', 'Email already in use');
  }
}
