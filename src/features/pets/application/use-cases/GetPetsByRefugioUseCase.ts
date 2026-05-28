import { Pet } from '../../domain/entities/Pet';
import { IPetRepository } from '../../domain/repositories/IPetRepository';

export class GetPetsByRefugioUseCase {
  constructor(private readonly repo: IPetRepository) {}
  execute(refugioId: string): Promise<Pet[]> { return this.repo.getByRefugio(refugioId); }
}