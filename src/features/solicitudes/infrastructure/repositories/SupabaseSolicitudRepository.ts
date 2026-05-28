import { supabase } from '@shared/infrastructure/supabase/client';
import { Solicitud, SolicitudStatus } from '@features/solicitudes/domain/entities/Solicitud';
import { ISolicitudRepository } from '@features/solicitudes/domain/repositories/ISolicitudRepository';

export class SupabaseSolicitudRepository implements ISolicitudRepository {

  async getByAdoptante(adoptanteId: string): Promise<Solicitud[]> {
    const { data, error } = await supabase
      .from('solicitudes')
      .select(`
        *,
        mascotas(name, photo_url),
        refugio:profiles!solicitudes_refugio_id_fkey(username)
      `)
      .eq('adoptante_id', adoptanteId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(this.map);
  }

  async getByRefugio(refugioId: string): Promise<Solicitud[]> {
    const { data, error } = await supabase
      .from('solicitudes')
      .select(`
        *,
        mascotas(name, photo_url),
        adoptante:profiles!solicitudes_adoptante_id_fkey(username)
      `)
      .eq('refugio_id', refugioId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(this.map);
  }

  async create(data: {
    mascotaId:   string;
    adoptanteId: string;
    refugioId:   string;
    message?:    string;
  }): Promise<Solicitud> {
    const { data: result, error } = await supabase
      .from('solicitudes')
      .insert({
        mascota_id:   data.mascotaId,
        adoptante_id: data.adoptanteId,
        refugio_id:   data.refugioId,
        message:      data.message,
      })
      .select()
      .single();
    if (error) throw error;
    return this.map(result);
  }

  async updateStatus(id: string, status: SolicitudStatus): Promise<Solicitud> {
    const { data, error } = await supabase
      .from('solicitudes')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return this.map(data);
  }

  private map = (raw: any): Solicitud => ({
    id:                 raw.id,
    mascotaId:          raw.mascota_id,
    adoptanteId:        raw.adoptante_id,
    refugioId:          raw.refugio_id,
    status:             raw.status,
    message:            raw.message ?? undefined,
    createdAt:          new Date(raw.created_at),
    mascotaName:        raw.mascotas?.name ?? undefined,
    mascotaPhoto:       raw.mascotas?.photo_url ?? undefined,
    adoptanteUsername:  raw.adoptante?.username ?? undefined,
    refugioUsername:    raw.refugio?.username ?? undefined,
  });
}