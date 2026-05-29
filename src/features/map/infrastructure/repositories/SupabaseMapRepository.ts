import { supabase } from '@shared/infrastructure/supabase/client';
import { RefugioLocation } from '@features/map/domain/entities/RefugioLocation';
import { IMapRepository } from '@features/map/domain/repositories/IMapRepository';

export class SupabaseMapRepository implements IMapRepository {

  // 👇 ¡ESTA ES LA FUNCIÓN QUE SE HABÍA BORRADO!
  async getRefugiosLocations(): Promise<RefugioLocation[]> {
    const { data, error } = await supabase
      .from('refugios')
      .select('id, name, address, lat, lng, phone, description')
      .not('lat', 'is', null)
      .not('lng', 'is', null);

    if (error) throw error;

    return (data ?? []).map(raw => ({
      id:          raw.id,
      name:        raw.name,
      address:     raw.address  ?? undefined,
      lat:         raw.lat,
      lng:         raw.lng,
      phone:       raw.phone    ?? undefined,
      description: raw.description ?? undefined,
    }));
  }

  async getRefugioById(id: string): Promise<RefugioLocation | null> {
    const { data, error } = await supabase
      .from('refugios')
      .select('id, name, address, lat, lng, phone, description')
      .eq('id', id)
      .single();
      
    if (error || !data) return null;
    
    return {
      id:          data.id,
      name:        data.name,
      address:     data.address ?? undefined,
      lat:         data.lat,
      lng:         data.lng,
      phone:       data.phone ?? undefined,
      description: data.description ?? undefined,
    };
  }

  async updateRefugio(id: string, data: Partial<RefugioLocation>): Promise<void> {
    const { error } = await supabase
      .from('refugios')
      .update({
        name:        data.name,
        address:     data.address,
        lat:         data.lat,
        lng:         data.lng,
        phone:       data.phone,
        description: data.description
      })
      .eq('id', id);
      
    if (error) throw error;
  }
}