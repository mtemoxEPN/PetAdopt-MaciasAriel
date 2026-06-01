import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { GetSolicitudByPetUseCase } from '@features/solicitudes/application/use-cases/GetSolicitudByPetUseCase';
import { SupabaseSolicitudRepository } from '@features/solicitudes/infrastructure/repositories/SupabaseSolicitudRepository';
import { useQuery } from '@tanstack/react-query';

const repo         = new SupabaseSolicitudRepository();
const getByPetCase = new GetSolicitudByPetUseCase(repo);

export function useSolicitudByPet(mascotaId: string) {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['solicitud', user?.id, mascotaId],
    queryFn: () => getByPetCase.execute(user!.id, mascotaId),
    enabled: !!user && !!mascotaId,
    refetchOnMount: 'always',
    staleTime: 0,
  });
}
