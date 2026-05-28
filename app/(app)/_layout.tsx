import { useAuth } from '@features/auth/presentation/hooks/useAuth';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function AppLayout() {
  const { logout } = useAuth();
  const user       = useAuthStore((s) => s.user);
  const isRefugio  = user?.role === 'refugio';

  return (
    <Tabs
      screenOptions={{
        tabBarStyle:           styles.tabBar,
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: '#a8a29e',
        tabBarLabelStyle:      styles.tabLabel,
        headerStyle:           { backgroundColor: '#fff' },
        headerTintColor:       '#1c1917',
        headerRight: () => (
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        ),
      }}
    >
      {/* Adoptante: explorar mascotas */}
      {!isRefugio && (
        <Tabs.Screen
          name="index"
          options={{ title: 'Explorar', tabBarIcon: () => <Text style={styles.icon}>🐾</Text> }}
        />
      )}

      {/* Refugio: gestionar sus mascotas */}
      {isRefugio && (
        <Tabs.Screen
          name="index"
          options={{ title: 'Mis Mascotas', tabBarIcon: () => <Text style={styles.icon}>🏥</Text> }}
        />
      )}

      <Tabs.Screen
        name="solicitudes"
        options={{ title: 'Solicitudes', tabBarIcon: () => <Text style={styles.icon}>📋</Text> }}
      />

      <Tabs.Screen
        name="ai-chat"
        options={{ title: 'Asistente IA', tabBarIcon: () => <Text style={styles.icon}>🤖</Text> }}
      />

      <Tabs.Screen
        name="map"
        options={{ title: 'Mapa', tabBarIcon: () => <Text style={styles.icon}>📍</Text> }}
      />

      {/* Ocultar pantallas de detalle del tab bar */}
      <Tabs.Screen name="pets/[id]"        options={{ href: null }} />
      <Tabs.Screen name="pets/new"         options={{ href: null }} />
      <Tabs.Screen name="pets/edit/[id]"   options={{ href: null }} />
      <Tabs.Screen name="chat/[roomId]"    options={{ href: null }} />
      <Tabs.Screen name="solicitudes/nueva" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar:     { backgroundColor: '#fff', borderTopColor: '#f5f5f4', height: 60 },
  tabLabel:   { fontSize: 11, fontWeight: '600' },
  icon:       { fontSize: 22 },
  logoutBtn:  { marginRight: 16, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fef3c7', borderRadius: 100 },
  logoutText: { color: '#92400e', fontWeight: '600', fontSize: 13 },
});