import { useAuthStore } from '@features/auth/presentation/store/authStore';
import RefugioHomeScreen from './pets/refugio-home';
import AdoptanteHomeScreen from './pets/adoptante-home';

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  return user?.role === 'refugio' ? <RefugioHomeScreen /> : <AdoptanteHomeScreen />;
}