import { useRefugioPets } from '@features/pets/presentation/hooks/usePets';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { pickAndUploadPetImage } from '@shared/infrastructure/supabase/StorageService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Image, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { PetSpecies, PetGender, PetStatus } from '@features/pets/domain/entities/Pet';

export default function EditPetScreen() {
  const { id }     = useLocalSearchParams<{ id: string }>();
  const user       = useAuthStore((s) => s.user);
  const { pets, updatePet, isUpdating } = useRefugioPets();
  const router     = useRouter();

  const pet = pets.find(p => p.id === id);

  const [name, setName]             = useState(pet?.name ?? '');
  const [species, setSpecies]       = useState<PetSpecies>(pet?.species ?? 'perro');
  const [breed, setBreed]           = useState(pet?.breed ?? '');
  const [ageYears, setAgeYears]     = useState(pet?.ageYears?.toString() ?? '');
  const [gender, setGender]         = useState<PetGender>(pet?.gender ?? 'macho');
  const [description, setDescription] = useState(pet?.description ?? '');
  const [photoUrl, setPhotoUrl]     = useState<string | null>(pet?.photoUrl ?? null);
  const [status, setStatus]         = useState<PetStatus>(pet?.status ?? 'disponible');
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

  const handleUpdate = () => {
    if (!name.trim()) return alert('El nombre es requerido');
    updatePet(
      {
        id,
        pet: {
          name: name.trim(), species, breed: breed || undefined,
          ageYears: ageYears ? parseInt(ageYears) : undefined,
          gender, description: description || undefined,
          photoUrl: photoUrl ?? undefined, status,
        },
      },
      { onSuccess: () => router.back() }
    );
  };

  if (!pet) return (
    <View style={styles.centered}>
      <ActivityIndicator color="#f97316" />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Editar Mascota</Text>

      <TouchableOpacity style={styles.photoBtn} onPress={handlePickImage} disabled={uploading}>
        {uploading ? <ActivityIndicator color="#f97316" /> :
          photoUrl ? <Image source={{ uri: photoUrl }} style={styles.photoPreview} /> :
          <View style={styles.photoEmpty}>
            <Text style={styles.photoEmptyIcon}>📷</Text>
            <Text style={styles.photoEmptyText}>Cambiar foto</Text>
          </View>
        }
      </TouchableOpacity>

      <Text style={styles.label}>NOMBRE</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>ESPECIE</Text>
      <View style={styles.optionRow}>
        {(['perro', 'gato', 'otro'] as PetSpecies[]).map(s => (
          <TouchableOpacity key={s} style={[styles.option, species === s && styles.optionActive]} onPress={() => setSpecies(s)}>
            <Text style={styles.optionText}>{s === 'perro' ? '🐶' : s === 'gato' ? '🐱' : '🐾'} {s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>GÉNERO</Text>
      <View style={styles.optionRow}>
        {(['macho', 'hembra'] as PetGender[]).map(g => (
          <TouchableOpacity key={g} style={[styles.option, gender === g && styles.optionActive]} onPress={() => setGender(g)}>
            <Text style={styles.optionText}>{g === 'macho' ? '♂️' : '♀️'} {g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>ESTADO</Text>
      <View style={styles.optionRow}>
        {(['disponible', 'en_proceso', 'adoptado'] as PetStatus[]).map(s => (
          <TouchableOpacity key={s} style={[styles.option, status === s && styles.optionActive]} onPress={() => setStatus(s)}>
            <Text style={styles.optionText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>RAZA</Text>
      <TextInput style={styles.input} value={breed} onChangeText={setBreed} />

      <Text style={styles.label}>EDAD EN AÑOS</Text>
      <TextInput style={styles.input} value={ageYears} onChangeText={setAgeYears} keyboardType="numeric" maxLength={2} />

      <Text style={styles.label}>DESCRIPCIÓN</Text>
      <TextInput style={[styles.input, styles.textarea]} value={description} onChangeText={setDescription} multiline numberOfLines={4} />

      <TouchableOpacity style={[styles.btnCreate, isUpdating && styles.btnDisabled]} onPress={handleUpdate} disabled={isUpdating}>
        {isUpdating ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnCreateText}>Guardar Cambios</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef7f0' },
  content:   { padding: 24, gap: 10 },
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title:     { fontSize: 24, fontWeight: '700', color: '#1c1917', marginBottom: 8 },
  photoBtn:      { alignSelf: 'center', marginBottom: 8 },
  photoPreview:  { width: 140, height: 140, borderRadius: 20 },
  photoEmpty: { width: 140, height: 140, borderRadius: 20, backgroundColor: '#fff', borderWidth: 2, borderColor: '#fed7aa', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', gap: 8 },
  photoEmptyIcon: { fontSize: 32 },
  photoEmptyText: { fontSize: 13, color: '#f97316', fontWeight: '600' },
  label: { fontSize: 10, fontWeight: '700', color: '#78716c', letterSpacing: 2, marginTop: 6 },
  input: { borderWidth: 1.5, borderColor: '#e7e5e4', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: '#1c1917', backgroundColor: '#fff' },
  textarea: { height: 100, textAlignVertical: 'top' },
  optionRow: { flexDirection: 'row', gap: 10 },
  option: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: '#e7e5e4', backgroundColor: '#fff', alignItems: 'center' },
  optionActive: { borderColor: '#f97316', backgroundColor: '#fff7ed' },
  optionText: { fontSize: 12, fontWeight: '600', color: '#1c1917' },
  btnCreate: { backgroundColor: '#f97316', borderRadius: 100, paddingVertical: 16, alignItems: 'center', marginTop: 12 },
  btnDisabled: { opacity: 0.6 },
  btnCreateText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});