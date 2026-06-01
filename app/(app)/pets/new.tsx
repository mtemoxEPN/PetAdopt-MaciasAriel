import { colors, spacing, typography, shadows, radius } from "@shared/presentation/styles/theme";
import { useRefugioPets } from '@features/pets/presentation/hooks/usePets';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { pickAndUploadPetImage } from '@shared/infrastructure/supabase/StorageService';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator, Alert, Image, KeyboardAvoidingView,
  Platform, ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { PawPrint, Camera, Mars, Venus } from 'lucide-react-native';
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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setName('');
      setSpecies('perro');
      setBreed('');
      setAgeYears('');
      setGender('macho');
      setDescription('');
      setPhotoUrl(null);
    }, [])
  );

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

  const handleCreate = () => {
    if (!name.trim()) return Alert.alert('Error', 'El nombre es requerido');
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
      <Text style={styles.title}>Nueva Mascota</Text>

      {/* Foto */}
      <TouchableOpacity style={styles.photoBtn} onPress={handlePickImage} disabled={uploading}>
        {uploading ? (
          <ActivityIndicator color="#f97316" />
        ) : photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.photoPreview} />
        ) : (
          <View style={styles.photoEmpty}>
            <Camera size={36} color={colors.primary} />
            <Text style={styles.photoEmptyText}>Agregar foto</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Nombre */}
      <Text style={styles.label}>NOMBRE *</Text>
      <TextInput style={[styles.input, focusedField === "name" && styles.inputFocused]} placeholder="Ej: Max" value={name} onChangeText={setName} onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)} />

      {/* Especie */}
      <Text style={styles.label}>ESPECIE</Text>
      <View style={styles.optionRow}>
        {(['perro', 'gato', 'otro'] as PetSpecies[]).map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.option, species === s && styles.optionActive]}
            onPress={() => setSpecies(s)}
          >
            <Text style={styles.optionText}>{s}</Text>
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
            <Text style={styles.optionText}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Raza */}
      <Text style={styles.label}>RAZA (opcional)</Text>
      <TextInput style={[styles.input, focusedField === "breed" && styles.inputFocused]} placeholder="Ej: Labrador" value={breed} onChangeText={setBreed} onFocus={() => setFocusedField("breed")} onBlur={() => setFocusedField(null)} />

      {/* Edad */}
      <Text style={styles.label}>EDAD EN AÑOS (opcional)</Text>
      <TextInput
        style={[styles.input, focusedField === "ageYears" && styles.inputFocused]} placeholder="Ej: 2"
        value={ageYears} onChangeText={setAgeYears}
        keyboardType="numeric" maxLength={2}
        onFocus={() => setFocusedField("ageYears")} onBlur={() => setFocusedField(null)}
      />

      {/* Descripción */}
      <Text style={styles.label}>DESCRIPCIÓN (opcional)</Text>
      <TextInput
        style={[styles.input, styles.textarea, focusedField === "description" && styles.inputFocused]}
        placeholder="Cuéntanos sobre esta mascota..."
        value={description} onChangeText={setDescription}
        multiline numberOfLines={4} maxLength={300}
        onFocus={() => setFocusedField("description")} onBlur={() => setFocusedField(null)}
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