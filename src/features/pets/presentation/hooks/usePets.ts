import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { CreatePetUseCase } from '@features/pets/application/use-cases/CreatePetUseCase';
import { DeletePetUseCase } from '@features/pets/application/use-cases/DeletePetUseCase';
import { GetPetsByRefugioUseCase } from '@features/pets/application/use-cases/GetPetsByRefugioUseCase';
import { GetPetsUseCase } from '@features/pets/application/use-cases/GetPetsUseCase';
import { UpdatePetUseCase } from '@features/pets/application/use-cases/UpdatePetUseCase';
import { Pet } from '@features/pets/domain/entities/Pet';
import { SupabasePetRepository } from '@features/pets/infrastructure/repositories/SupabasePetRepository';
import { supabase } from '@shared/infrastructure/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const repo                = new SupabasePetRepository();
const getPetsUseCase      = new GetPetsUseCase(repo);
const getByRefugioUseCase = new GetPetsByRefugioUseCase(repo);
const createPetUseCase    = new CreatePetUseCase(repo);
const updatePetUseCase    = new UpdatePetUseCase(repo);
const deletePetUseCase    = new DeletePetUseCase(repo);

// Hook para adoptantes
export function usePets() {
  const queryClient = useQueryClient();

  const { data: pets = [], isLoading } = useQuery({
    queryKey: ['pets'],
    queryFn: () => getPetsUseCase.execute(),
  });

  useEffect(() => {
    const channel = supabase
      .channel('mascotas:all')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mascotas' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['pets'] });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { pets, isLoading };
}

// Hook para refugio
export function useRefugioPets() {
  const user        = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: pets = [], isLoading } = useQuery({
    queryKey: ['pets', 'refugio', user?.id],
    queryFn:  () => getByRefugioUseCase.execute(user!.id),
    enabled:  !!user,
  });

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`mascotas:refugio:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mascotas',
          filter: `refugio_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['pets', 'refugio', user.id] });
          queryClient.invalidateQueries({ queryKey: ['pets'] });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  const createMutation = useMutation({
    mutationFn: (pet: Omit<Pet, 'id' | 'createdAt'>) => createPetUseCase.execute(pet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['pets', 'refugio', user?.id] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, pet }: { id: string; pet: Partial<Pet> }) =>
      updatePetUseCase.execute(id, pet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['pets', 'refugio', user?.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePetUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['pets', 'refugio', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['solicitudes', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  return {
    pets,
    isLoading,
    createPet:  createMutation.mutate,
    updatePet:  updateMutation.mutate,
    deletePet:  deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
