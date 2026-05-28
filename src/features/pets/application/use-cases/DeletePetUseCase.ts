import { IPetRepository } from '../../domain/repositories/IPetRepository';

export class DeletePetUseCase {
  constructor(private readonly repo: IPetRepository) {}
  execute(id: string): Promise<void> { return this.repo.delete(id); }
}