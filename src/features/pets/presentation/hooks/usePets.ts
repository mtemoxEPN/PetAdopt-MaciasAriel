import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { CreatePetUseCase } from '@features/pets/application/use-cases/CreatePetUseCase';
import { DeletePetUseCase } from '@features/pets/application/use-cases/DeletePetUseCase';
import { GetPetsByRefugioUseCase } from '@features/pets/application/use-cases/GetPetsByRefugioUseCase';
import { GetPetsUseCase } from '@features/pets/application/use-cases/GetPetsUseCase';
import { UpdatePetUseCase } from '@features/pets/application/use-cases/UpdatePetUseCase';
import { Pet } from '@features/pets/domain/entities/Pet';
import { SupabasePetRepository } from '@features/pets/infrastructure/repositories/SupabasePetRepository';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const repo               = new SupabasePetRepository();
const getPetsUseCase     = new GetPetsUseCase(repo);
const getByRefugioUseCase = new GetPetsByRefugioUseCase(repo);
const createPetUseCase   = new CreatePetUseCase(repo);
const updatePetUseCase   = new UpdatePetUseCase(repo);
const deletePetUseCase   = new DeletePetUseCase(repo);

// Hook para adoptantes — ve todas las mascotas disponibles
export function usePets() {
  const { data: pets = [], isLoading } = useQuery({
    queryKey: ['pets'],
    queryFn: () => getPetsUseCase.execute(),
  });
  return { pets, isLoading };
}

// Hook para refugio — gestiona sus propias mascotas
export function useRefugioPets() {
  const user        = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: pets = [], isLoading } = useQuery({
    queryKey: ['pets', 'refugio', user?.id],
    queryFn:  () => getByRefugioUseCase.execute(user!.id),
    enabled:  !!user,
  });

  const createMutation = useMutation({
    mutationFn: (pet: Omit<Pet, 'id' | 'createdAt'>) => createPetUseCase.execute(pet),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, pet }: { id: string; pet: Partial<Pet> }) =>
      updatePetUseCase.execute(id, pet),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePetUseCase.execute(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
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