import { ChatError } from '../../../../shared/domain/errors/AppError';
import { Room } from '../../domain/entities/Message';
import { IChatRepository } from '../../domain/repositories/IChatRepository';

export class CreateRoomUseCase {
    constructor(private readonly chatRepo: IChatRepository) { }

    async execute(
        name: string,
        userId: string,
        productName?: string,
        productDescription?: string,
        productPrice?: number,
    ): Promise<Room> {
        if (!name.trim()) throw new ChatError('El nombre de la sala es requerido');
        return this.chatRepo.createRoom(name.trim(), userId, productName, productDescription, productPrice);
    }
}