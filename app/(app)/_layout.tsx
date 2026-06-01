import { useAuth } from "@features/auth/presentation/hooks/useAuth";
import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { useRealtimeSolicitudes } from "@features/solicitudes/presentation/hooks/useRealtimeSolicitudes";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, TouchableOpacity, Text, View, Platform } from "react-native";
import { colors, shadows, radius, typography, spacing } from "@shared/presentation/styles/theme";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function AppLayout() {
  const { logout } = useAuth();
  const user = useAuthStore((s) => s.user);
  useRealtimeSolicitudes();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          bottom: Platform.OS === "ios" ? 28 : 20,
          left: 20,
          right: 20,
          backgroundColor: "rgba(255,255,255,0.82)",
          borderRadius: radius["2xl"],
          height: 64,
          paddingBottom: 8,
          paddingTop: 5,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: "rgba(139,110,82,0.08)",
          ...shadows.lg,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray400,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: 0.4,
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical:0,
          alignItems: "center",
          justifyContent: "center",
        },
        headerStyle: {
          backgroundColor: colors.primary,
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: '#FFFFFF',
          fontWeight: "700",
          fontSize: 17,
        },
        headerTintColor: '#FFFFFF',
        headerRight: () => (
          <TouchableOpacity onPress={logout} style={styles.logoutBtn} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={16} color="#FFFFFF" />
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: user?.role === "refugio" ? "Mis Mascotas" : "Explorar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={user?.role === "refugio" ? "medkit-outline" : "paw-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="solicitudes"
        options={{
          title: "Solicitudes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai-chat"
        options={{
          title: "Asistente IA",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Mapa",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="chats" options={{ href: null }} />
      <Tabs.Screen name="pets/adoptante-home" options={{ href: null }} />
      <Tabs.Screen name="pets/refugio-home" options={{ href: null }} />
      <Tabs.Screen name="pets/[id]" options={{ href: null, title: "Detalle" }} />
      <Tabs.Screen name="pets/new" options={{ href: null, title: "Nueva Mascota" }} />
      <Tabs.Screen name="pets/edit/[id]" options={{ href: null, title: "Editar Mascota" }} />
      <Tabs.Screen name="chat/[roomId]" options={{ href: null, title: "Chat" }} />
      <Tabs.Screen name="solicitudes/nueva" options={{ href: null, title: "Solicitud de Adopción" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logoutBtn: {
    marginRight: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: radius.full,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.2,
  },
});
