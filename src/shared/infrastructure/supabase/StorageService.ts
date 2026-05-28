import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from './client';
import { decode } from 'base64-arraybuffer';

export async function pickAndUploadPetImage(refugioId: string): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') throw new Error('Se necesita permiso para acceder a la galería');

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
    base64: true,
  });

  if (result.canceled || !result.assets?.length) return null;

  const asset = result.assets[0];
  let base64: string;

  if (asset.base64) {
    base64 = asset.base64;
  } else if (asset.uri) {
    base64 = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  } else {
    throw new Error('No se pudo obtener la imagen');
  }

  const ext      = asset.uri?.split('.').pop()?.toLowerCase() ?? 'jpg';
  const fileName = `${refugioId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from('mascotas')
    .upload(fileName, decode(base64), {
      contentType: `image/${ext}`,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('mascotas').getPublicUrl(fileName);
  return data.publicUrl;
}