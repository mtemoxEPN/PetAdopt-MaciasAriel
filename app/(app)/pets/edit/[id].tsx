import { colors, spacing, typography, shadows, radius } from "@shared/presentation/styles/theme";
import { useRefugioPets } from '@features/pets/presentation/hooks/usePets';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { pickAndUploadPetImage } from '@shared/infrastructure/supabase/StorageService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, Image, KeyboardAvoidingView,
  Platform, ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { Camera } from 'lucide-react-native';
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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (!pet) return;
    setName(pet.name ?? '');
    setSpecies(pet.species ?? 'perro');
    setBreed(pet.breed ?? '');
    setAgeYears(pet.ageYears?.toString() ?? '');
    setGender(pet.gender ?? 'macho');
    setDescription(pet.description ?? '');
    setPhotoUrl(pet.photoUrl ?? null);
    setStatus(pet.status ?? 'disponible');
  }, [pet?.id]);

  const handlePickImage = async () => {
    try {
      setUploading(true);
      const url = await pickAndUploadPetImage(user!.id);
      if (url) setPhotoUrl(url);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = () => {
    if (!name.trim()) return Alert.alert('Error', 'El nombre es requerido');
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
    >
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: 120 }]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Editar Mascota</Text>

      <TouchableOpacity style={styles.photoBtn} onPress={handlePickImage} disabled={uploading}>
        {uploading ? <ActivityIndicator color="#f97316" /> :
          photoUrl ? <Image source={{ uri: photoUrl }} style={styles.photoPreview} /> :
          <View style={styles.photoEmpty}>
            <Camera size={36} color={colors.primary} />
            <Text style={styles.photoEmptyText}>Cambiar foto</Text>
          </View>
        }
      </TouchableOpacity>

      <Text style={styles.label}>NOMBRE</Text>
      <TextInput style={[styles.input, focusedField === "name" && styles.inputFocused]} value={name} onChangeText={setName} onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)} />

      <Text style={styles.label}>ESPECIE</Text>
      <View style={styles.optionRow}>
        {(['perro', 'gato', 'otro'] as PetSpecies[]).map(s => (
          <TouchableOpacity key={s} style={[styles.option, species === s && styles.optionActive]} onPress={() => setSpecies(s)}>
            <Text style={styles.optionText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>GÉNERO</Text>
      <View style={styles.optionRow}>
        {(['macho', 'hembra'] as PetGender[]).map(g => (
          <TouchableOpacity key={g} style={[styles.option, gender === g && styles.optionActive]} onPress={() => setGender(g)}>
            <Text style={styles.optionText}>{g}</Text>
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
      <TextInput style={[styles.input, focusedField === "breed" && styles.inputFocused]} value={breed} onChangeText={setBreed} onFocus={() => setFocusedField("breed")} onBlur={() => setFocusedField(null)} />

      <Text style={styles.label}>EDAD EN AÑOS</Text>
      <TextInput style={[styles.input, focusedField === "ageYears" && styles.inputFocused]} value={ageYears} onChangeText={setAgeYears} keyboardType="numeric" maxLength={2} onFocus={() => setFocusedField("ageYears")} onBlur={() => setFocusedField(null)} />

      <Text style={styles.label}>DESCRIPCIÓN</Text>
      <TextInput style={[styles.input, styles.textarea, focusedField === "description" && styles.inputFocused]} value={description} onChangeText={setDescription} multiline numberOfLines={4} onFocus={() => setFocusedField("description")} onBlur={() => setFocusedField(null)} />

      <TouchableOpacity style={[styles.btnCreate, isUpdating && styles.btnDisabled]} onPress={handleUpdate} disabled={isUpdating}>
        {isUpdating ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnCreateText}>Guardar Cambios</Text>}
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing["2xl"], gap: spacing.md },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: typography.size.h2,
    fontWeight: typography.weight.extrabold,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing.sm,
  },
  photoBtn: { alignSelf: "center", marginBottom: spacing.sm },
  photoPreview: { width: 160, height: 160, borderRadius: radius.xl },
  photoEmpty: {
    width: 160, height: 160,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryLight,
    borderWidth: 1, borderColor: colors.borderLight,
    borderStyle: "dashed",
    justifyContent: "center", alignItems: "center", gap: spacing.sm,
  },
  photoEmptyIcon: { fontSize: 36 },
  photoEmptyText: {
    fontSize: 13, color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
  label: {
    fontSize: typography.size.overline,
    fontWeight: typography.weight.bold,
    color: colors.textSecondary,
    letterSpacing: 2, marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1, borderColor: colors.borderLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg, paddingVertical: 14,
    fontSize: typography.size.body,
    color: colors.textPrimary,
    backgroundColor: "transparent",
  },
  textarea: { height: 110, textAlignVertical: "top", borderRadius: radius.xl },
  optionRow: { flexDirection: "row", gap: spacing.sm },
  option: {
    flex: 1, paddingVertical: 12,
    borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.borderLight,
    backgroundColor: "rgba(255,255,255,0.75)",
    alignItems: "center",
    ...shadows.glass,
  },
  optionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    ...shadows.primarySm,
  },
  optionText: {
    fontSize: 13,
    fontWeight: typography.weight.semibold,
    color: colors.textPrimary,
  },
  btnCreate: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: spacing.md,
    ...shadows.primary,
  },
  btnDisabled: { opacity: 0.55 },
  btnCreateText: {
    color: colors.white,
    fontWeight: typography.weight.bold,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: "rgba(255,240,237,0.50)",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
});