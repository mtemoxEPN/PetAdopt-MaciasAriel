import { useRefugioPets } from '@features/pets/presentation/hooks/usePets';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { pickAndUploadPetImage } from '@shared/infrastructure/supabase/StorageService';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator, Image, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { PetSpecies, PetGender, PetStatus } from '@features/pets/domain/entities/Pet';

export default function NewPetScreen() {
  const user       = useAuthStore((s) => s.user);
  const { createPet, isCreating } = useRefugioPets();
  const router     = useRouter();

  const [name, setName]             = useState('');
  const [species, setSpecies]       = useState<PetSpecies>('perro');
  const [breed, setBreed]           = useState('');
  const [ageYears, setAgeYears]     = useState('');
  const [gender, setGender]         = useState<PetGender>('macho');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl]     = useState<string | null>(null);
  const [uploading, setUploading]   = useState(false);

  const handlePickImage = async () => {
    try {
      setUploading(true);
      const url = await pickAndUploadPetImage(user!.id);
      if (url) setPhotoUrl(url);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = () => {
    if (!name.trim()) return alert('El nombre es requerido');
    createPet(
      {
        refugioId:   user!.id,
        name:        name.trim(),
        species,
        breed:       breed.trim() || undefined,
        ageYears:    ageYears ? parseInt(ageYears) : undefined,
        gender,
        description: description.trim() || undefined,
        photoUrl:    photoUrl ?? undefined,
        status:      'disponible',
      },
      { onSuccess: () => router.back() }
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nueva Mascota</Text>

      {/* Foto */}
      <TouchableOpacity style={styles.photoBtn} onPress={handlePickImage} disabled={uploading}>
        {uploading ? (
          <ActivityIndicator color="#f97316" />
        ) : photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.photoPreview} />
        ) : (
          <View style={styles.photoEmpty}>
            <Text style={styles.photoEmptyIcon}>📷</Text>
            <Text style={styles.photoEmptyText}>Agregar foto</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Nombre */}
      <Text style={styles.label}>NOMBRE *</Text>
      <TextInput style={styles.input} placeholder="Ej: Max" value={name} onChangeText={setName} />

      {/* Especie */}
      <Text style={styles.label}>ESPECIE</Text>
      <View style={styles.optionRow}>
        {(['perro', 'gato', 'otro'] as PetSpecies[]).map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.option, species === s && styles.optionActive]}
            onPress={() => setSpecies(s)}
          >
            <Text style={styles.optionText}>{s === 'perro' ? '🐶' : s === 'gato' ? '🐱' : '🐾'} {s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Género */}
      <Text style={styles.label}>GÉNERO</Text>
      <View style={styles.optionRow}>
        {(['macho', 'hembra'] as PetGender[]).map(g => (
          <TouchableOpacity
            key={g}
            style={[styles.option, gender === g && styles.optionActive]}
            onPress={() => setGender(g)}
          >
            <Text style={styles.optionText}>{g === 'macho' ? '♂️' : '♀️'} {g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Raza */}
      <Text style={styles.label}>RAZA (opcional)</Text>
      <TextInput style={styles.input} placeholder="Ej: Labrador" value={breed} onChangeText={setBreed} />

      {/* Edad */}
      <Text style={styles.label}>EDAD EN AÑOS (opcional)</Text>
      <TextInput
        style={styles.input} placeholder="Ej: 2"
        value={ageYears} onChangeText={setAgeYears}
        keyboardType="numeric" maxLength={2}
      />

      {/* Descripción */}
      <Text style={styles.label}>DESCRIPCIÓN (opcional)</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Cuéntanos sobre esta mascota..."
        value={description} onChangeText={setDescription}
        multiline numberOfLines={4} maxLength={300}
      />

      <TouchableOpacity
        style={[styles.btnCreate, isCreating && styles.btnDisabled]}
        onPress={handleCreate}
        disabled={isCreating}
      >
        {isCreating
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnCreateText}>Registrar Mascota</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef7f0' },
  content:   { padding: 24, gap: 10 },
  title:     { fontSize: 24, fontWeight: '700', color: '#1c1917', marginBottom: 8 },

  photoBtn:      { alignSelf: 'center', marginBottom: 8 },
  photoPreview:  { width: 140, height: 140, borderRadius: 20 },
  photoEmpty: {
    width: 140, height: 140, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 2, borderColor: '#fed7aa',
    borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  photoEmptyIcon: { fontSize: 32 },
  photoEmptyText: { fontSize: 13, color: '#f97316', fontWeight: '600' },

  label: { fontSize: 10, fontWeight: '700', color: '#78716c', letterSpacing: 2, marginTop: 6 },
  input: {
    borderWidth: 1.5, borderColor: '#e7e5e4', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 13,
    fontSize: 15, color: '#1c1917', backgroundColor: '#fff',
  },
  textarea: { height: 100, textAlignVertical: 'top' },

  optionRow: { flexDirection: 'row', gap: 10 },
  option: {
    flex: 1, paddingVertical: 10, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#e7e5e4',
    backgroundColor: '#fff', alignItems: 'center',
  },
  optionActive: { borderColor: '#f97316', backgroundColor: '#fff7ed' },
  optionText:   { fontSize: 13, fontWeight: '600', color: '#1c1917' },

  btnCreate: {
    backgroundColor: '#f97316', borderRadius: 100,
    paddingVertical: 16, alignItems: 'center', marginTop: 12,
  },
  btnDisabled:    { opacity: 0.6 },
  btnCreateText:  { color: '#fff', fontWeight: '700', fontSize: 16 },
});