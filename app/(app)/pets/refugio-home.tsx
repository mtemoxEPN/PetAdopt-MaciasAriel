import { useRefugioPets } from '@features/pets/presentation/hooks/usePets';
import { Pet } from '@features/pets/domain/entities/Pet';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator, Alert, FlatList, Image,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

export default function RefugioHomeScreen() {
  const { pets, isLoading, deletePet, isDeleting } = useRefugioPets();
  const router = useRouter();

  const handleDelete = (pet: Pet) => {
    Alert.alert(
      'Eliminar mascota',
      `¿Estás seguro de eliminar a ${pet.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deletePet(pet.id) },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  const renderPet = ({ item }: { item: Pet }) => (
    <View style={styles.card}>
      {item.photoUrl ? (
        <Image source={{ uri: item.photoUrl }} style={styles.photo} />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoEmoji}>
            {item.species === 'perro' ? '🐶' : item.species === 'gato' ? '🐱' : '🐾'}
          </Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.detail}>{item.species}{item.breed ? ` · ${item.breed}` : ''}</Text>
        <View style={[styles.statusBadge, styles[`status_${item.status}` as keyof typeof styles] as any]}>
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
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        keyExtractor={(p) => p.id}
        renderItem={renderPet}
        contentContainerStyle={pets.length === 0 ? { flex: 1 } : { paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyIcon}>🏥</Text>
            <Text style={styles.emptyTitle}>No tienes mascotas registradas</Text>
            <Text style={styles.emptySubtitle}>Agrega tu primera mascota</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(app)/pets/new')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef7f0' },
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },

  card: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff', gap: 12,
  },
  photo:            { width: 72, height: 72, borderRadius: 16 },
  photoPlaceholder: { width: 72, height: 72, borderRadius: 16, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center' },
  photoEmoji:       { fontSize: 32 },
  info:             { flex: 1, gap: 4 },
  name:             { fontSize: 16, fontWeight: '700', color: '#1c1917' },
  detail:           { fontSize: 13, color: '#78716c' },

  statusBadge:           { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 100 },
  statusText:            { fontSize: 11, fontWeight: '600', color: '#fff' },
  status_disponible:     { backgroundColor: '#22c55e' },
  status_en_proceso:     { backgroundColor: '#f59e0b' },
  status_adoptado:       { backgroundColor: '#6b7280' },

  actions:       { gap: 8 },
  btnEdit:       { padding: 8, backgroundColor: '#fef3c7', borderRadius: 12 },
  btnEditText:   { fontSize: 18 },
  btnDelete:     { padding: 8, backgroundColor: '#fef2f2', borderRadius: 12 },
  btnDeleteText: { fontSize: 18 },

  separator: { height: 1, backgroundColor: '#f5f5f4', marginLeft: 100 },

  emptyIcon:     { fontSize: 48, marginBottom: 8 },
  emptyTitle:    { fontSize: 18, fontWeight: '600', color: '#1c1917' },
  emptySubtitle: { fontSize: 14, color: '#a8a29e' },

  fab: {
    position: 'absolute', right: 20, bottom: 24,
    backgroundColor: '#f97316', width: 60, height: 60,
    borderRadius: 30, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#f97316', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  fabText: { color: '#fff', fontSize: 30, lineHeight: 34 },
});