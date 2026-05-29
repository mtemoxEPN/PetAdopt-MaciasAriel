import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { LoginUseCase } from '@features/auth/application/use-cases/LoginUseCase';
import { RegisterUseCase } from '@features/auth/application/use-cases/RegisterUseCase';
import { SupabaseAuthRepository } from '@features/auth/infrastructure/repositories/SupabaseAuthRepository';
import { useAuthStore } from '../store/authStore';

type RegisterDto = {
  email:     string;
  password:  string;
  username:  string;
  role:      'adoptante' | 'refugio';
  fullName?: string;
  lat?:      number; // NUEVO
  lng?:      number; // NUEVO
  address?:  string; // NUEVO
};

const authRepo       = new SupabaseAuthRepository();
const loginUseCase   = new LoginUseCase(authRepo);
const registerUseCase = new RegisterUseCase(authRepo);

export function useAuth() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUseCase.execute(email, password),
    onSuccess: (user) => {
      setUser(user);
      router.replace('/(app)');
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ email, password, username, role, fullName, lat, lng, address }: RegisterDto) =>
      registerUseCase.execute(email, password, username, role, fullName, lat, lng, address),
  });

  const loginWithGoogle = async () => {
    try {
      await authRepo.loginWithGoogle();
    } catch (e: any) {
      console.error('Google login error:', e.message);
    }
  };

  const logout = async () => {
    try {
      await authRepo.logout();
    } finally {
      setUser(null);
      router.replace('/(auth)/login');
    }
  };

  return {
    user,
    login:           loginMutation.mutate,
    register:        registerMutation.mutate,
    loginWithGoogle,
    logout,
    isLoading:       loginMutation.isPending || registerMutation.isPending,
    error:           loginMutation.error?.message ?? registerMutation.error?.message ?? null,
  };
}