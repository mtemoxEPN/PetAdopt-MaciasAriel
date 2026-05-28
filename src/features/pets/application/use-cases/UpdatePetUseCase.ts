import { Pet } from '../../domain/entities/Pet';
import { IPetRepository } from '../../domain/repositories/IPetRepository';

export class UpdatePetUseCase {
  constructor(private readonly repo: IPetRepository) {}
  execute(id: string, pet: Partial<Pet>): Promise<Pet> { return this.repo.update(id, pet); }
}