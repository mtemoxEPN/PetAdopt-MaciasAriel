import { Pet } from '../../domain/entities/Pet';
import { IPetRepository } from '../../domain/repositories/IPetRepository';

export class CreatePetUseCase {
  constructor(private readonly repo: IPetRepository) {}
  execute(pet: Omit<Pet, 'id' | 'createdAt'>): Promise<Pet> {
    if (!pet.name.trim()) throw new Error('El nombre es requerido');
    return this.repo.create(pet);
  }
}