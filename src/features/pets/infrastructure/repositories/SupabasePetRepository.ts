import { supabase } from '@shared/infrastructure/supabase/client';
import { Pet } from '@features/pets/domain/entities/Pet';
import { IPetRepository } from '@features/pets/domain/repositories/IPetRepository';

export class SupabasePetRepository implements IPetRepository {

  async getAll(): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('mascotas')
      .select('*')
      .eq('status', 'disponible')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(this.map);
  }

  async getByRefugio(refugioId: string): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('mascotas')
      .select('*')
      .eq('refugio_id', refugioId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(this.map);
  }

  async getById(id: string): Promise<Pet> {
    const { data, error } = await supabase
      .from('mascotas')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return this.map(data);
  }

  async create(pet: Omit<Pet, 'id' | 'createdAt'>): Promise<Pet> {
    const { data, error } = await supabase
      .from('mascotas')
      .insert({
        refugio_id:  pet.refugioId,
        name:        pet.name,
        species:     pet.species,
        breed:       pet.breed,
        age_years:   pet.ageYears,
        gender:      pet.gender,
        description: pet.description,
        photo_url:   pet.photoUrl,
        status:      pet.status,
      })
      .select()
      .single();
    if (error) throw error;
    return this.map(data);
  }

  async update(id: string, pet: Partial<Pet>): Promise<Pet> {
    const { data, error } = await supabase
      .from('mascotas')
      .update({
        name:        pet.name,
        species:     pet.species,
        breed:       pet.breed,
        age_years:   pet.ageYears,
        gender:      pet.gender,
        description: pet.description,
        photo_url:   pet.photoUrl,
        status:      pet.status,
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return this.map(data);
  }

  async delete(id: string): Promise<void> {
    // 1. Buscar solicitudes relacionadas
    const { data: solicitudes } = await supabase
      .from('solicitudes')
      .select('id')
      .eq('mascota_id', id);

    // 2. Por cada solicitud, eliminar room y mensajes asociados
    for (const sol of solicitudes ?? []) {
      const roomName = `solicitud-${sol.id}`;
      const { data: room } = await supabase
        .from('rooms')
        .select('id')
        .eq('name', roomName)
        .single();

      if (room) {
        await supabase.from('messages').delete().eq('room_id', room.id);
        await supabase.from('rooms').delete().eq('id', room.id);
      }
    }

    // 3. Eliminar solicitudes
    await supabase.from('solicitudes').delete().eq('mascota_id', id);

    // 4. Eliminar mascota
    const { error } = await supabase.from('mascotas').delete().eq('id', id);
    if (error) throw error;
  }

  private map = (raw: any): Pet => ({
    id:          raw.id,
    refugioId:   raw.refugio_id,
    name:        raw.name,
    species:     raw.species,
    breed:       raw.breed       ?? undefined,
    ageYears:    raw.age_years   ?? undefined,
    gender:      raw.gender      ?? undefined,
    description: raw.description ?? undefined,
    photoUrl:    raw.photo_url   ?? undefined,
    status:      raw.status,
    createdAt:   new Date(raw.created_at),
  });
}