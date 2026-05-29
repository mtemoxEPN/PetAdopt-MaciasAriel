import { usePets } from "@features/pets/presentation/hooks/usePets";
import { Pet } from "@features/pets/domain/entities/Pet";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState, useCallback, useMemo } from "react";
import LottieView from "lottie-react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import {
  colors,
  spacing,
  typography,
  shadows,
  radius,
} from "@shared/presentation/styles/theme";
import { ThemedCard } from "@shared/presentation/components/ThemedCard";

export default function AdoptanteHomeScreen() {
  const { pets, isLoading } = usePets();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      pets.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.species.toLowerCase().includes(search.toLowerCase()) ||
          (p.breed ?? "").toLowerCase().includes(search.toLowerCase())
      ),
    [pets, search]
  );

  const renderPet = useCallback(
    ({ item, index }: { item: Pet; index: number }) => (
      <Animated.View entering={FadeInUp.duration(400).delay(index * 60)}>
        <ThemedCard variant="elevated" pressable style={styles.card}>
          <TouchableOpacity
            onPress={() => router.push(`/(app)/pets/${item.id}`)}
            activeOpacity={0.9}
            style={styles.cardInner}
          >
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
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.speciesBadge}>
                  <Text style={styles.speciesText}>{item.species}</Text>
                </View>
              </View>
              {item.breed && <Text style={styles.breed}>{item.breed}</Text>}
              <Text style={styles.age}>
                {item.ageYears
                  ? `${item.ageYears} año${item.ageYears > 1 ? "s" : ""}`
                  : "Edad desconocida"}
                {item.gender ? ` · ${item.gender}` : ""}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
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
        <Text style={styles.loadingText}>Buscando mascotas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explorar Mascotas</Text>
        <Text style={styles.headerSubtitle}>
          Encuentra a tu nuevo mejor amigo
        </Text>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, especie o raza..."
          placeholderTextColor={colors.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        renderItem={renderPet}
        contentContainerStyle={
          filtered.length === 0
            ? { flex: 1 }
            : { paddingBottom: spacing["2xl"], paddingHorizontal: spacing.lg }
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centered}>
            <LottieView
              source={require("../../../assets/animations/empty-pets.json")}
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
            <Text style={styles.emptyTitle}>No hay mascotas disponibles</Text>
            <Text style={styles.emptySubtitle}>
              Vuelve pronto, llegan nuevos amigos
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
  },
  loadingText: { color: colors.textTertiary, marginTop: spacing.sm },

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

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.sm,
    ...shadows.sm,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: typography.size.bodySmall,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.sans,
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
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  name: {
    fontSize: typography.size.h4,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
  },
  speciesBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  speciesText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
  breed: { fontSize: 13, color: colors.textSecondary },
  age: { fontSize: 13, color: colors.textTertiary },
  chevron: { fontSize: 22, color: colors.gray300 },

  emptyTitle: {
    fontSize: typography.size.h4,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: typography.size.bodySmall,
    color: colors.textTertiary,
  },
});
