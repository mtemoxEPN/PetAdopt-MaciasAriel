import { useSolicitudes } from "@features/solicitudes/presentation/hooks/useSolicitudes";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { Solicitud } from "@features/solicitudes/domain/entities/Solicitud";
import { supabase } from "@shared/infrastructure/supabase/client";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import LottieView from "lottie-react-native";
import { PawPrint, Building2, User, CheckCircle, XCircle, Clock, MessageCircle, Check, X } from "lucide-react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import {
  colors,
  spacing,
  typography,
  shadows,
  radius,
} from "@shared/presentation/styles/theme";
import { ThemedCard } from "@shared/presentation/components/ThemedCard";

export default function SolicitudesScreen() {
  const user = useAuthStore((s) => s.user);
  const { solicitudes, isLoading, updateStatus, isUpdating, deleteSolicitud, isDeleting } = useSolicitudes();
  const isRefugio = user?.role === "refugio";
  const router = useRouter();
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    }, [user?.id])
  );

  // ✅ TODOS los hooks ANTES de cualquier return condicional
  const handleUpdateStatus = useCallback(
    (id: string, action: "aprobada" | "rechazada", petName: string) => {
      Alert.alert(
        action === "aprobada" ? "Aprobar solicitud" : "Rechazar solicitud",
        `¿Confirmas ${action === "aprobada" ? "aprobar" : "rechazar"} la solicitud para ${petName}?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Confirmar", onPress: () => action === 'aprobada' ? updateStatus({ id, status: action }) : deleteSolicitud(id) },
        ]
      );
    },
    [updateStatus, deleteSolicitud]
  );

  const handleOpenChat = useCallback(
    async (solicitudId: string, mascotaName: string) => {
      try {
        const roomName = `solicitud-${solicitudId}`;

        // Buscar sala existente
        const { data: existing } = await supabase
          .from("rooms")
          .select("id")
          .eq("name", roomName)
          .single();

        if (existing) {
          router.push(`/(app)/chat/${existing.id}`);
          return;
        }

        // Crear sala nueva si no existe
        const { data: newRoom, error } = await supabase
          .from("rooms")
          .insert({
            name: roomName,
            created_by: user!.id,
          })
          .select("id")
          .single();

        if (error) {
          Alert.alert("Error", "No se pudo abrir el chat");
          return;
        }

        if (newRoom) {
          router.push(`/(app)/chat/${newRoom.id}`);
        }
      } catch (e) {
        Alert.alert("Error", "No se pudo abrir el chat");
      }
    },
    [router, user]
  );

  const getStatusColor = (status: string) => {
    if (status === "aprobada") return colors.success;
    if (status === "rechazada") return colors.error;
    return colors.warning;
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "aprobada") return <CheckCircle size={14} color={colors.success} />;
    if (status === "rechazada") return <XCircle size={14} color={colors.error} />;
    return <Clock size={14} color={colors.warning} />;
  };

  const renderSolicitud = useCallback(
    ({ item, index }: { item: Solicitud; index: number }) => (
      <Animated.View entering={FadeInUp.duration(400).delay(index * 60)}>
        <ThemedCard variant="elevated" style={styles.card}>
          <View style={styles.cardInner}>
            {item.mascotaPhoto ? (
              <Image source={{ uri: item.mascotaPhoto }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <PawPrint size={36} color={colors.primary} />
              </View>
            )}

            <View style={styles.info}>
              <Text style={styles.petName}>
                {item.mascotaName ?? "Mascota"}
              </Text>

              <View style={styles.detailRow}>
                {isRefugio ? (
                  <><User size={14} color={colors.textSecondary} /><Text style={styles.detail}> {item.adoptanteUsername ?? "Adoptante"}</Text></>
                ) : (
                  <><Building2 size={14} color={colors.textSecondary} /><Text style={styles.detail}> {item.refugioUsername ?? "Refugio"}</Text></>
                )}
              </View>

              {item.message && (
                <Text style={styles.message} numberOfLines={2}>
                  "{item.message}"
                </Text>
              )}

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) + "20" },
                ]}
              >
                <StatusIcon status={item.status} />
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  {" "}{item.status}
                </Text>
              </View>

              {item.status === "aprobada" && (
                <TouchableOpacity
                  style={styles.btnChat}
                  onPress={() => handleOpenChat(item.id, item.mascotaName ?? "Mascota")}
                >
                  <MessageCircle size={14} color={colors.secondary} />
                  <Text style={styles.btnChatText}>Iniciar Chat</Text>
                </TouchableOpacity>
              )}

              {isRefugio && item.status === "pendiente" && (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.btnApprove}
                    onPress={() =>
                      handleUpdateStatus(item.id, "aprobada", item.mascotaName ?? "")
                    }
                    disabled={isUpdating || isDeleting}
                  >
                    <Text style={styles.btnApproveText}>Aprobar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnReject}
                    onPress={() =>
                      handleUpdateStatus(item.id, "rechazada", item.mascotaName ?? "")
                    }
                    disabled={isUpdating || isDeleting}
                  >
                    <Text style={styles.btnRejectText}>Rechazar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ThemedCard>
      </Animated.View>
    ),
    [isRefugio, handleUpdateStatus, isUpdating, handleOpenChat]
  );

  // ✅ return condicional DESPUÉS de todos los hooks
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <Text style={styles.headerTitle}>
          {isRefugio ? "Solicitudes Recibidas" : "Mis Solicitudes"}
        </Text>
        <Text style={styles.headerSubtitle}>
          {isRefugio
            ? "Gestiona las solicitudes de adopción"
            : "Revisa el estado de tus solicitudes"}
        </Text>
      </View>

      <FlatList
        data={solicitudes}
        keyExtractor={(s) => s.id}
        renderItem={renderSolicitud}
        contentContainerStyle={
          solicitudes.length === 0
            ? { flex: 1 }
            : {
                padding: spacing.lg,
                paddingBottom: 120,
                gap: spacing.md,
              }
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centered}>
            <LottieView
              source={require("../../assets/animations/empty-pets.json")}
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
            <Text style={styles.emptyTitle}>
              {isRefugio ? "No hay solicitudes aún" : "No has hecho solicitudes"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {isRefugio
                ? "Cuando alguien solicite adoptar una de tus mascotas, aparecerá aquí"
                : "Explora las mascotas disponibles y solicita adoptar una"}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing["2xl"],
    paddingBottom: spacing.md,
  },
  headerAccent: {
    width: 36, height: 4,
    backgroundColor: colors.secondary,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.size.h2,
    fontWeight: typography.weight.extrabold,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.tight,
  },
  headerSubtitle: {
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  cardInner: { flexDirection: "row", gap: spacing.md, padding: spacing.lg },
  photo: {
    width: 88, height: 88,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  photoPlaceholder: {
    width: 88, height: 88,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    justifyContent: "center", alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  photoEmoji: { fontSize: 36 },
  info: { flex: 1, gap: spacing.xs },
  detailRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  petName: {
    fontSize: typography.size.h4,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  detail: {
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
  },
  message: {
    fontSize: typography.size.bodySmall,
    color: colors.textTertiary,
    fontStyle: "italic",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 0.5,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.bold,
  },
  actionRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs },
  btnApprove: {
    flex: 1,
    backgroundColor: colors.successLight,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderWidth: 1, borderColor: "#86efac",
  },
  btnApproveText: { color: "#16a34a", fontWeight: typography.weight.bold, fontSize: 13 },
  btnReject: {
    flex: 1,
    backgroundColor: colors.errorLight,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderWidth: 1, borderColor: "#fca5a5",
  },
  btnRejectText: { color: colors.error, fontWeight: typography.weight.bold, fontSize: 13 },
  btnChat: {
    backgroundColor: colors.secondaryLight,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: colors.secondary + "20",
    marginTop: spacing.xs,
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
  },
  btnChatText: { color: colors.secondary, fontWeight: typography.weight.bold, fontSize: 13 },
  emptyIcon: { fontSize: 52, marginBottom: spacing.sm },
  emptyTitle: {
    fontSize: typography.size.h4,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary, textAlign: "center",
  },
  emptySubtitle: {
    fontSize: typography.size.bodySmall,
    color: colors.textTertiary,
    textAlign: "center", lineHeight: 22,
  },
  centered: {
    flex: 1, justifyContent: "center",
    alignItems: "center",
    padding: spacing["3xl"], gap: spacing.sm,
  },
});