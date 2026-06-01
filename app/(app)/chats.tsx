import { useRooms } from "@features/chat/presentation/hooks/useRooms";
import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { Room } from "@features/chat/domain/entities/Message";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback } from "react";
import { MessageCircle, ChevronRight } from "lucide-react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import {
  colors,
  spacing,
  typography,
  shadows,
  radius,
} from "@shared/presentation/styles/theme";
import { ThemedCard } from "@shared/presentation/components/ThemedCard";

export default function ChatsScreen() {
  const { rooms, isLoading } = useRooms();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const renderRoom = useCallback(
    ({ item, index }: { item: Room; index: number }) => (
      <Animated.View entering={FadeInUp.duration(400).delay(index * 60)}>
        <ThemedCard variant="elevated" pressable style={styles.card}>
          <TouchableOpacity
            style={styles.cardInner}
            activeOpacity={0.85}
            onPress={() => router.push(`/(app)/chat/${item.id}`)}
          >
            <View style={styles.avatar}>
              <MessageCircle size={20} color={colors.secondary} />
            </View>
            <View style={styles.info}>
              <Text style={styles.roomName}>{item.name}</Text>
              <Text style={styles.roomDate}>
                {item.createdAt.toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </ThemedCard>
      </Animated.View>
    ),
    [router]
  );

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
        <Text style={styles.headerTitle}>Chats</Text>
        <Text style={styles.headerSubtitle}>
          Conversaciones con refugios y adoptantes
        </Text>
      </View>

      <FlatList
        data={rooms}
        keyExtractor={(r) => r.id}
        renderItem={renderRoom}
        contentContainerStyle={
          rooms.length === 0
            ? { flex: 1 }
            : { paddingBottom: 120, paddingHorizontal: spacing.lg }
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centered}>
            <MessageCircle size={48} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No hay chats aún</Text>
            <Text style={styles.emptySubtitle}>
              Los chats aparecen cuando un refugio inicia una conversación contigo
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
    gap: spacing.sm,
    padding: spacing["3xl"],
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing["2xl"],
    paddingBottom: spacing.md,
  },
  headerAccent: {
    width: 36,
    height: 4,
    backgroundColor: colors.primary,
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
  },
  cardInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.secondaryLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarText: { fontSize: 22 },
  info: { flex: 1, gap: spacing.xs },
  roomName: {
    fontSize: typography.size.h4,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  roomDate: {
    fontSize: typography.size.caption,
    color: colors.textTertiary,
  },
  chevron: { fontSize: 22, color: colors.gray300 },
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