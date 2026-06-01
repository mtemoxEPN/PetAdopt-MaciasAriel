import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { CreateRoomUseCase } from "@features/chat/application/use-cases/CreateRoomUseCase";
import { Room } from "@features/chat/domain/entities/Message";
import { SupabaseChatRepository } from "@features/chat/infrastructure/repositories/SupabaseChatRepository";
import { supabase } from "@shared/infrastructure/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const chatRepo = new SupabaseChatRepository();
const createRoomUseCase = new CreateRoomUseCase(chatRepo);

export function useRooms() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // useQuery obtiene la lista de salas y la cachea bajo la clave ['rooms']
  const {
    data: rooms = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => chatRepo.getRooms(),
    enabled: !!user, // Solo fetchar si hay usuario autenticado
  });

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('rooms:all')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['rooms'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // useMutation para crear una sala nueva
  const createMutation = useMutation({
    mutationFn: ({
    name, productName, productDescription, productPrice
    }: {
        name: string;
        productName?: string;
        productDescription?: string;
        productPrice?: number;
    }) => createRoomUseCase.execute(name, user!.id, productName, productDescription, productPrice),
    onSuccess: (newRoom) => {
      // Actualizar el cache 
      queryClient.setQueryData(["rooms"], (old: Room[]) => [
        newRoom,
        ...(old ?? []),
      ]);
    },
  });

  return {
    rooms,
    isLoading,
    error: error?.message ?? null,
    createRoom: (
        name: string,
        productName?: string,
        productDescription?: string,
        productPrice?: number,
        options?: { onSuccess?: () => void }
    ) => createMutation.mutate(
        { name, productName, productDescription, productPrice },
        options
    ),
    isCreating: createMutation.isPending,
    createError: createMutation.error?.message ?? null,
  };
}
