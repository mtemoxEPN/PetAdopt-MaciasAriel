import { colors, spacing, typography, shadows, radius } from "@shared/presentation/styles/theme";
import { usePets } from '@features/pets/presentation/hooks/usePets';
import { useSolicitudByPet } from '@features/solicitudes/presentation/hooks/useSolicitudByPet';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator, Image, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { PawPrint, Bone, Mars, Venus, Cake, Clock, CheckCircle } from 'lucide-react-native';

export default function PetDetailScreen() {
  const { id }   = useLocalSearchParams<{ id: string }>();
  const { pets, isLoading } = usePets();
  const user     = useAuthStore((s) => s.user);
  const router   = useRouter();
  const pet      = pets.find(p => p.id === id);
  const { data: solicitud } = useSolicitudByPet(id ?? '');

  if (isLoading) return <View style={styles.centered}><ActivityIndicator color="#f97316" /></View>;
  if (!pet)      return <View style={styles.centered}><Text>Mascota no encontrada</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      {pet.photoUrl ? (
        <Image source={{ uri: pet.photoUrl }} style={styles.photo} />
      ) : (
        <View style={styles.photoPlaceholder}>
          <PawPrint size={80} color={colors.primary} />
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name}>{pet.name}</Text>
          <View style={styles.speciesBadge}>
            <Text style={styles.speciesText}>{pet.species}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          {pet.breed    && <View style={styles.tag}><Bone size={14} color={colors.textSecondary} /><Text style={styles.tagText}> {pet.breed}</Text></View>}
          {pet.gender   && <View style={styles.tag}>{pet.gender === 'macho' ? <Mars size={14} color={colors.textSecondary} /> : <Venus size={14} color={colors.textSecondary} />}<Text style={styles.tagText}> {pet.gender}</Text></View>}
          {pet.ageYears && <View style={styles.tag}><Cake size={14} color={colors.textSecondary} /><Text style={styles.tagText}> {pet.ageYears} año{pet.ageYears > 1 ? 's' : ''}</Text></View>}
        </View>

        {pet.description && (
          <View style={styles.descBox}>
            <Text style={styles.descLabel}>SOBRE {pet.name.toUpperCase()}</Text>
            <Text style={styles.desc}>{pet.description}</Text>
          </View>
        )}

        {user && user.role !== 'refugio' && (
          solicitud?.status === 'pendiente' || solicitud?.status === 'aprobada' ? (
            <View style={styles.solicitudStatus}>
              <Text style={styles.solicitudStatusText}>
                {solicitud.status === 'pendiente'
                  ? 'Solicitud pendiente'
                  : 'Solicitud aprobada'}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.btnAdopt}
              onPress={() => {
                if (pet.refugioId) {
                  router.push({ pathname: '/(app)/solicitudes/nueva', params: { petId: pet.id, refugioId: pet.refugioId } });
                }
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.btnAdoptText}>
                {solicitud?.status === 'rechazada'
                  ? 'Reintentar Solicitud'
                  : 'Solicitar Adocion'}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  photo: { width: "100%", height: 360 },
  photoPlaceholder: {
    width: "100%", height: 360,
    backgroundColor: colors.primaryLight,
    justifyContent: "center", alignItems: "center",
  },
  photoEmoji: { fontSize: 100 },
  content: { padding: spacing["3xl"], gap: spacing.lg },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  name: {
    fontSize: typography.size.h1,
    fontWeight: typography.weight.extrabold,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.tight,
  },
  speciesBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: "rgba(229,77,46,0.18)",
  },
  speciesText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: typography.weight.bold,
  },
  detailRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  tag: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: { fontSize: 13, color: colors.textSecondary, fontWeight: typography.weight.medium },
  descBox: {
    backgroundColor: colors.background,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  descLabel: {
    fontSize: typography.size.overline,
    fontWeight: typography.weight.bold,
    color: colors.textTertiary,
    letterSpacing: 2,
  },
  desc: {
    fontSize: typography.size.body,
    color: colors.textSecondary,
    lineHeight: 26,
  },
  btnAdopt: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: 18,
    alignItems: "center",
    ...shadows.primary,
  },
  btnAdoptText: {
    color: colors.white,
    fontWeight: typography.weight.bold,
    fontSize: 17,
    letterSpacing: 0.3,
  },
  solicitudStatus: {
    backgroundColor: colors.secondaryLight,
    borderRadius: radius.full,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.secondary + "20",
  },
  solicitudStatusText: {
    color: colors.secondary,
    fontWeight: typography.weight.bold,
    fontSize: 17,
    letterSpacing: 0.3,
  },
});