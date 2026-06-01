import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { CreateSolicitudUseCase } from '@features/solicitudes/application/use-cases/CreateSolicitudUseCase';
import { GetSolicitudesAdoptanteUseCase, GetSolicitudesRefugioUseCase } from '@features/solicitudes/application/use-cases/GetSolicitudesUseCase';
import { GetSolicitudByPetUseCase } from '@features/solicitudes/application/use-cases/GetSolicitudByPetUseCase';
import { UpdateSolicitudStatusUseCase } from '@features/solicitudes/application/use-cases/UpdateSolicitudStatusUseCase';
import { DeleteSolicitudUseCase } from '@features/solicitudes/application/use-cases/DeleteSolicitudUseCase';
import { SolicitudStatus } from '@features/solicitudes/domain/entities/Solicitud';
import { SupabaseSolicitudRepository } from '@features/solicitudes/infrastructure/repositories/SupabaseSolicitudRepository';
import { showMessageNotification } from '@shared/infrastructure/notifications/NotificationService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const repo             = new SupabaseSolicitudRepository();
const createUseCase    = new CreateSolicitudUseCase(repo);
const getAdoptanteCase = new GetSolicitudesAdoptanteUseCase(repo);
const getRefugioCase   = new GetSolicitudesRefugioUseCase(repo);
const getByPetCase     = new GetSolicitudByPetUseCase(repo);
const updateStatusCase = new UpdateSolicitudStatusUseCase(repo);
const deleteUseCase    = new DeleteSolicitudUseCase(repo);

export function useSolicitudes() {
  const user        = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const isRefugio   = user?.role === 'refugio';

  const { data: solicitudes = [], isLoading } = useQuery({
    queryKey: ['solicitudes', user?.id],
    queryFn:  () => isRefugio
      ? getRefugioCase.execute(user!.id)
      : getAdoptanteCase.execute(user!.id),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (data: { mascotaId: string; refugioId: string; message?: string }) =>
      createUseCase.execute({ ...data, adoptanteId: user!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes', user?.id] });
      showMessageNotification(
        '🐾 Solicitud enviada',
        'PetAdopt',
        'Tu solicitud fue enviada al refugio. ¡Pronto tendrás noticias!',
      );
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: SolicitudStatus }) =>
      updateStatusCase.execute(id, status),
    onSuccess: (solicitud) => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['pets', 'refugio', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });

      if (solicitud.status === 'aprobada') {
        showMessageNotification(
          '✅ Solicitud aprobada',
          'PetAdopt',
          `Aprobaste la solicitud de adopción para ${solicitud.mascotaName ?? 'la mascota'}.`,
        );
      } else if (solicitud.status === 'rechazada') {
        showMessageNotification(
          '❌ Solicitud rechazada',
          'PetAdopt',
          `Rechazaste la solicitud de adopción para ${solicitud.mascotaName ?? 'la mascota'}.`,
        );
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['pets', 'refugio', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  return {
    solicitudes,
    isLoading,
    createSolicitud:  createMutation.mutate,
    isCreating:       createMutation.isPending,
    updateStatus:     updateStatusMutation.mutate,
    isUpdating:       updateStatusMutation.isPending,
    deleteSolicitud:  deleteMutation.mutate,
    isDeleting:       deleteMutation.isPending,
  };
}
