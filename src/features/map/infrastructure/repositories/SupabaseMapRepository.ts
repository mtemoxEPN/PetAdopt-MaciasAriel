import { supabase } from '@shared/infrastructure/supabase/client';
import { RefugioLocation } from '@features/map/domain/entities/RefugioLocation';
import { IMapRepository } from '@features/map/domain/repositories/IMapRepository';

export class SupabaseMapRepository implements IMapRepository {

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
}