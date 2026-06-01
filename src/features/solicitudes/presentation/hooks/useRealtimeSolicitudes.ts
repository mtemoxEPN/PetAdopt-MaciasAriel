import { supabase } from '@shared/infrastructure/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useRealtimeSolicitudes() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const solicitudesChannel = supabase
      .channel('realtime:solicitudes:global')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'solicitudes' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
          queryClient.invalidateQueries({ queryKey: ['solicitud'] });
          queryClient.invalidateQueries({ queryKey: ['rooms'] });
        }
      )
      .subscribe();

    const mascotasChannel = supabase
      .channel('realtime:mascotas:global')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mascotas' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['pets'] });
          queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
          queryClient.invalidateQueries({ queryKey: ['rooms'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(solicitudesChannel);
      supabase.removeChannel(mascotasChannel);
    };
  }, [queryClient]);
}
