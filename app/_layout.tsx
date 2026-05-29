import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@shared/infrastructure/supabase/client";
import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { SupabaseAuthRepository } from "@features/auth/infrastructure/repositories/SupabaseAuthRepository";
import { requestNotificationPermissions } from "@shared/infrastructure/notifications/NotificationService";
import SplashScreen from "./splash";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});
const authRepo = new SupabaseAuthRepository();

function AuthGuard() {
  const { user, setUser } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const user = await authRepo.getCurrentUser();
      setUser(user);
      setIsReady(true);
    }
    restoreSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      async function syncUser() {
        if (session) {
          const user = await authRepo.getCurrentUser();
          setUser(user);
        } else {
          setUser(null);
        }
        setIsReady(true);
      }
      syncUser();
    });

    requestNotificationPermissions();
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isReady || showSplash) return;

    const inAuth = segments[0] === "(auth)";
    if (!user && !inAuth) router.replace("/(auth)/login");
    if (user && inAuth) router.replace("/(app)");
  }, [user, segments, isReady, showSplash]);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard />
    </QueryClientProvider>
  );
}
