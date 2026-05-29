import { useRefugioPets } from "@features/pets/presentation/hooks/usePets";
import { Pet } from "@features/pets/domain/entities/Pet";
import { useRouter } from "expo-router";
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

export default function RefugioHomeScreen() {
  const { pets, isLoading, deletePet, isDeleting } = useRefugioPets();
  const router = useRouter();

  const handleDelete = useCallback(
    (pet: Pet) => {
      Alert.alert(
        "Eliminar mascota",
        `¿Estás seguro de eliminar a ${pet.name}?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: () => deletePet(pet.id),
          },
        ]
      );
    },
    [deletePet]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderPet = useCallback(
    ({ item, index }: { item: Pet; index: number }) => (
      <Animated.View entering={FadeInUp.duration(400).delay(index * 60)}>
        <ThemedCard variant="elevated" style={styles.card}>
          <View style={styles.cardInner}>
            {item.photoUrl ? (
              <Image source={{ uri: item.photoUrl }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoEmoji}>
                  {item.species === "perro"
                    ? "🐶"
                    : item.species === "gato"
                    ? "🐱"
                    : "🐾"}
                </Text>
              </View>
            )}

            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.detail}>
                {item.species}
                {item.breed ? ` · ${item.breed}` : ""}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  styles[
                    `status_${item.status}` as keyof typeof styles
                  ] as any,
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btnEdit}
                onPress={() => router.push(`/(app)/pets/edit/${item.id}`)}
              >
                <Text style={styles.btnEditText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnDelete}
                onPress={() => handleDelete(item)}
                disabled={isDeleting}
              >
                <Text style={styles.btnDeleteText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ThemedCard>
      </Animated.View>
    ),
    [router, handleDelete, isDeleting]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Mascotas</Text>
        <Text style={styles.headerSubtitle}>
          Gestiona tus mascotas en adopción
        </Text>
      </View>

      <FlatList
        data={pets}
        keyExtractor={(p) => p.id}
        renderItem={renderPet}
        contentContainerStyle={
          pets.length === 0
            ? { flex: 1 }
            : { paddingBottom: 100, paddingHorizontal: spacing.lg }
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyIcon}>🏥</Text>
            <Text style={styles.emptyTitle}>
              No tienes mascotas registradas
            </Text>
            <Text style={styles.emptySubtitle}>Agrega tu primera mascota</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/(app)/pets/new")}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.md,
  },
  photo: { width: 72, height: 72, borderRadius: radius.md },
  photoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.warningLight,
    justifyContent: "center",
    alignItems: "center",
  },
  photoEmoji: { fontSize: 32 },
  info: { flex: 1, gap: spacing.xs },
  name: {
    fontSize: typography.size.h4,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  detail: { fontSize: 13, color: colors.textSecondary },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: typography.weight.semibold,
    color: colors.white,
  },
  status_disponible: { backgroundColor: colors.success },
  status_en_proceso: { backgroundColor: colors.warning },
  status_adoptado: { backgroundColor: colors.gray400 },

  actions: { gap: spacing.sm },
  btnEdit: {
    padding: spacing.sm,
    backgroundColor: colors.warningLight,
    borderRadius: radius.md,
  },
  btnEditText: { fontSize: 18 },
  btnDelete: {
    padding: spacing.sm,
    backgroundColor: colors.errorLight,
    borderRadius: radius.md,
  },
  btnDeleteText: { fontSize: 18 },

  emptyIcon: { fontSize: 48, marginBottom: spacing.sm },
  emptyTitle: {
    fontSize: typography.size.h4,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: typography.size.bodySmall,
    color: colors.textTertiary,
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.primary,
  },
  fabText: { color: colors.white, fontSize: 30, lineHeight: 34 },
});
