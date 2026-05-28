import { Pet } from '../../domain/entities/Pet';
import { IPetRepository } from '../../domain/repositories/IPetRepository';

export class GetPetsUseCase {
  constructor(private readonly repo: IPetRepository) {}
  execute(): Promise<Pet[]> { return this.repo.getAll(); }
}