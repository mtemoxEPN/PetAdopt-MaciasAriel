import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "./client";
import { decode } from "base64-arraybuffer";

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];

export async function pickAndUploadImage(
  bucket: string,
  pathPrefix: string
): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") throw new Error("Se necesita permiso para acceder a la galería");

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
    throw new Error("No se pudo obtener la imagen");
  }

  const extMatch = asset.uri?.match(/\.([a-zA-Z0-9]+)(\?|$)/);
  const ext = extMatch?.[1]?.toLowerCase() ?? "jpg";

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(`Formato no soportado. Usa: ${ALLOWED_EXTENSIONS.join(", ")}`);
  }

  const fileName = `${pathPrefix}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, decode(base64), {
      contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

/** Alias for backward compatibility with pet uploads */
export async function pickAndUploadPetImage(refugioId: string): Promise<string | null> {
  return pickAndUploadImage("mascotas", refugioId);
}
