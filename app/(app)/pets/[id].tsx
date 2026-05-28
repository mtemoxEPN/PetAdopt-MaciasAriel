import { usePets } from '@features/pets/presentation/hooks/usePets';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator, Image, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

export default function PetDetailScreen() {
  const { id }   = useLocalSearchParams<{ id: string }>();
  const { pets, isLoading } = usePets();
  const user     = useAuthStore((s) => s.user);
  const router   = useRouter();
  const pet      = pets.find(p => p.id === id);

  if (isLoading) return <View style={styles.centered}><ActivityIndicator color="#f97316" /></View>;
  if (!pet)      return <View style={styles.centered}><Text>Mascota no encontrada</Text></View>;

  return (
    <ScrollView style={styles.container}>
      {pet.photoUrl ? (
        <Image source={{ uri: pet.photoUrl }} style={styles.photo} />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoEmoji}>
            {pet.species === 'perro' ? '🐶' : pet.species === 'gato' ? '🐱' : '🐾'}
          </Text>
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
          {pet.breed    && <View style={styles.tag}><Text style={styles.tagText}>🦴 {pet.breed}</Text></View>}
          {pet.gender   && <View style={styles.tag}><Text style={styles.tagText}>{pet.gender === 'macho' ? '♂️' : '♀️'} {pet.gender}</Text></View>}
          {pet.ageYears && <View style={styles.tag}><Text style={styles.tagText}>🎂 {pet.ageYears} año{pet.ageYears > 1 ? 's' : ''}</Text></View>}
        </View>

        {pet.description && (
          <View style={styles.descBox}>
            <Text style={styles.descLabel}>SOBRE {pet.name.toUpperCase()}</Text>
            <Text style={styles.desc}>{pet.description}</Text>
          </View>
        )}

        {user?.role === 'adoptante' && (
          <TouchableOpacity
            style={styles.btnAdopt}
            onPress={() => router.push({ pathname: '/(app)/solicitudes/nueva', params: { petId: pet.id, refugioId: pet.refugioId } })}
            activeOpacity={0.85}
          >
            <Text style={styles.btnAdoptText}>🐾 Solicitar Adopción</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#fef7f0' },
  centered:         { flex: 1, justifyContent: 'center', alignItems: 'center' },
  photo:            { width: '100%', height: 280 },
  photoPlaceholder: { width: '100%', height: 280, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center' },
  photoEmoji:       { fontSize: 80 },
  content:          { padding: 24, gap: 16 },
  row:              { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name:             { fontSize: 28, fontWeight: '700', color: '#1c1917' },
  speciesBadge:     { backgroundColor: '#fff7ed', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 100, borderWidth: 1.5, borderColor: '#fed7aa' },
  speciesText:      { fontSize: 13, color: '#f97316', fontWeight: '700' },
  detailRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag:              { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, borderWidth: 1.5, borderColor: '#e7e5e4' },
  tagText:          { fontSize: 13, color: '#78716c', fontWeight: '500' },
  descBox:          { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 8 },
  descLabel:        { fontSize: 10, fontWeight: '700', color: '#a8a29e', letterSpacing: 2 },
  desc:             { fontSize: 15, color: '#44403c', lineHeight: 24 },
  btnAdopt: {
    backgroundColor: '#f97316', borderRadius: 100,
    paddingVertical: 18, alignItems: 'center',
    shadowColor: '#f97316', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  btnAdoptText: { color: '#fff', fontWeight: '700', fontSize: 17 },
});