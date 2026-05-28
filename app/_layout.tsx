import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '@shared/infrastructure/supabase/client';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { SupabaseAuthRepository } from '@features/auth/infrastructure/repositories/SupabaseAuthRepository';
import { requestNotificationPermissions } from '@shared/infrastructure/notifications/NotificationService';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } }
});
const authRepo = new SupabaseAuthRepository();

function AuthGuard() {
  const { user, setUser } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false); // 👈 clave del fix

  useEffect(() => {
    async function restoreSession() {
      const user = await authRepo.getCurrentUser();
      setUser(user);
      setIsReady(true);
    }
    restoreSession(); // ✅ función async interna, no async directo en useEffect

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        async function syncUser() {
          if (session) {
            const user = await authRepo.getCurrentUser();
            setUser(user);
          } else {
            setUser(null);
          }
          setIsReady(true); // 👈 movido aquí: cubre ambos casos (con y sin sesión)
        }
        syncUser();
      }
    );
    requestNotificationPermissions(); 
    return () => subscription.unsubscribe(); // ✅ cleanup síncrono
  }, []);

  useEffect(() => {
    if (!isReady) return; // 👈 no navegar hasta estar montado

    const inAuth = segments[0] === '(auth)';
    if (!user && !inAuth) router.replace('/(auth)/login');
    if (user && inAuth) router.replace('/(app)');
  }, [user, segments, isReady]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard />
    </QueryClientProvider>
  );
}