import { useSolicitudes } from "@features/solicitudes/presentation/hooks/useSolicitudes";
import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { Solicitud } from "@features/solicitudes/domain/entities/Solicitud";
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
  const { solicitudes, isLoading, updateStatus, isUpdating } =
    useSolicitudes();
  const isRefugio = user?.role === "refugio";

  const handleUpdateStatus = useCallback(
    (id: string, action: "aprobada" | "rechazada", petName: string) => {
      Alert.alert(
        action === "aprobada" ? "✅ Aprobar solicitud" : "❌ Rechazar solicitud",
        `¿Confirmas ${
          action === "aprobada" ? "aprobar" : "rechazar"
        } la solicitud para ${petName}?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Confirmar",
            onPress: () => updateStatus({ id, status: action }),
          },
        ]
      );
    },
    [updateStatus]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    if (status === "aprobada") return colors.success;
    if (status === "rechazada") return colors.error;
    return colors.warning;
  };

  const getStatusEmoji = (status: string) => {
    if (status === "aprobada") return "✅";
    if (status === "rechazada") return "❌";
    return "⏳";
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
                <Text style={styles.photoEmoji}>🐾</Text>
              </View>
            )}

            <View style={styles.info}>
              <Text style={styles.petName}>
                {item.mascotaName ?? "Mascota"}
              </Text>

              <Text style={styles.detail}>
                {isRefugio
                  ? `👤 ${item.adoptanteUsername ?? "Adoptante"}`
                  : `🏥 ${item.refugioUsername ?? "Refugio"}`}
              </Text>

              {item.message && (
                <Text style={styles.message} numberOfLines={2}>
                  "{item.message}"
                </Text>
              )}

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      getStatusColor(item.status) + "20",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  {getStatusEmoji(item.status)} {item.status}
                </Text>
              </View>

              {isRefugio && item.status === "pendiente" && (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.btnApprove}
                    onPress={() =>
                      handleUpdateStatus(
                        item.id,
                        "aprobada",
                        item.mascotaName ?? ""
                      )
                    }
                    disabled={isUpdating}
                  >
                    <Text style={styles.btnApproveText}>✅ Aprobar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnReject}
                    onPress={() =>
                      handleUpdateStatus(
                        item.id,
                        "rechazada",
                        item.mascotaName ?? ""
                      )
                    }
                    disabled={isUpdating}
                  >
                    <Text style={styles.btnRejectText}>❌ Rechazar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ThemedCard>
      </Animated.View>
    ),
    [isRefugio, handleUpdateStatus, isUpdating]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
                paddingBottom: spacing["2xl"],
                gap: spacing.md,
              }
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>
              {isRefugio
                ? "No hay solicitudes aún"
                : "No has hecho solicitudes"}
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing["3xl"],
    gap: spacing.sm,
  },

  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing["2xl"],
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.serif,
    fontSize: typography.size.h2,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  cardInner: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
  },
  photo: { width: 80, height: 80, borderRadius: radius.md },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    backgroundColor: colors.warningLight,
    justifyContent: "center",
    alignItems: "center",
  },
  photoEmoji: { fontSize: 32 },

  info: { flex: 1, gap: spacing.xs },
  petName: {
    fontSize: typography.size.h4,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  detail: { fontSize: 13, color: colors.textSecondary },
  message: {
    fontSize: 13,
    color: colors.textTertiary,
    fontStyle: "italic",
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: 12,
    fontWeight: typography.weight.bold,
  },

  actionRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs },
  btnApprove: {
    flex: 1,
    backgroundColor: colors.successLight,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#86efac",
  },
  btnApproveText: {
    color: "#16a34a",
    fontWeight: typography.weight.bold,
    fontSize: 13,
  },
  btnReject: {
    flex: 1,
    backgroundColor: colors.errorLight,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fca5a5",
  },
  btnRejectText: {
    color: "#dc2626",
    fontWeight: typography.weight.bold,
    fontSize: 13,
  },

  emptyIcon: { fontSize: 48, marginBottom: spacing.sm },
  emptyTitle: {
    fontSize: typography.size.h4,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: typography.size.bodySmall,
    color: colors.textTertiary,
    textAlign: "center",
    lineHeight: 22,
  },
});
