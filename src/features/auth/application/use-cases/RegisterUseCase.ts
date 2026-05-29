import { AuthError } from '@shared/domain/errors/AppError';
import { User } from '../../domain/entities/User';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class RegisterUseCase {
  constructor(private readonly authRepo: IAuthRepository) {}

  async execute(
    email:     string,
    password:  string,
    username:  string,
    role:      'adoptante' | 'refugio' = 'adoptante',
    fullName?: string,
    lat?:      number, // NUEVO
    lng?:      number, // NUEVO
    address?:  string  // NUEVO
  ): Promise<User> {
    if (!email || !password || !username)
      throw new AuthError('Todos los campos son obligatorios');
    if (password.length < 6)
      throw new AuthError('La contraseña debe tener al menos 6 caracteres');
    if (username.includes(' '))
      throw new AuthError('El usuario no puede contener espacios');
    return this.authRepo.register(email, password, username, role, fullName);
  }
}