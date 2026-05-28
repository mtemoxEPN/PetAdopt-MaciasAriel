import { User } from '../entities/User';

export interface IAuthRepository {
  login(email: string, password: string):                    Promise<User>;
  loginWithGoogle():                                         Promise<void>;
  register(
    email:     string,
    password:  string,
    username:  string,
    role?:     'adoptante' | 'refugio',
    fullName?: string,
  ):                                                         Promise<User>;
  logout():                                                  Promise<void>;
  getCurrentUser():                                          Promise<User | null>;
}