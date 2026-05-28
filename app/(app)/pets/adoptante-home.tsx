import { usePets } from '@features/pets/presentation/hooks/usePets';
import { Pet } from '@features/pets/domain/entities/Pet';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator, FlatList, Image, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useState } from 'react';
import LottieView from 'lottie-react-native';

export default function AdoptanteHomeScreen() {
  const { pets, isLoading } = usePets();
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = pets.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.species.toLowerCase().includes(search.toLowerCase()) ||
    (p.breed ?? '').toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Buscando mascotas...</Text>
      </View>
    );
  }

  const renderPet = ({ item }: { item: Pet }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(app)/pets/${item.id}`)}
      activeOpacity={0.85}
    >
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
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.speciesBadge}>
            <Text style={styles.speciesText}>{item.species}</Text>
          </View>
        </View>
        {item.breed && <Text style={styles.breed}>{item.breed}</Text>}
        <Text style={styles.age}>
          {item.ageYears ? `${item.ageYears} año${item.ageYears > 1 ? 's' : ''}` : 'Edad desconocida'}
          {item.gender ? ` · ${item.gender}` : ''}
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, especie o raza..."
          placeholderTextColor="#a8a29e"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        renderItem={renderPet}
        contentContainerStyle={filtered.length === 0 ? { flex: 1 } : { paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.centered}>
            <LottieView
              source={require('../../../assets/animations/empty-pets.json')}
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
            <Text style={styles.emptyTitle}>No hay mascotas disponibles</Text>
            <Text style={styles.emptySubtitle}>Vuelve pronto, llegan nuevos amigos</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef7f0' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  loadingText: { color: '#a8a29e', marginTop: 8 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    margin: 16, paddingHorizontal: 16,
    backgroundColor: '#fff', borderRadius: 16,
    borderWidth: 1.5, borderColor: '#e7e5e4', gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: '#1c1917' },

  card: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff', gap: 12,
  },
  photo: { width: 72, height: 72, borderRadius: 16 },
  photoPlaceholder: { width: 72, height: 72, borderRadius: 16, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center' },
  photoEmoji: { fontSize: 32 },
  info: { flex: 1, gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 17, fontWeight: '700', color: '#1c1917' },
  speciesBadge: { backgroundColor: '#fff7ed', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 100, borderWidth: 1, borderColor: '#fed7aa' },
  speciesText: { fontSize: 11, color: '#f97316', fontWeight: '600' },
  breed: { fontSize: 13, color: '#78716c' },
  age: { fontSize: 13, color: '#a8a29e' },
  chevron: { fontSize: 22, color: '#d6d3d1' },
  separator: { height: 1, backgroundColor: '#f5f5f4', marginLeft: 100 },

  emptyIcon: { fontSize: 48, marginBottom: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1c1917' },
  emptySubtitle: { fontSize: 14, color: '#a8a29e' },
});