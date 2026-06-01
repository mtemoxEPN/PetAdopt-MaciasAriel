import { ISolicitudRepository } from '../../domain/repositories/ISolicitudRepository';

export class DeleteSolicitudUseCase {
  constructor(private readonly repo: ISolicitudRepository) {}
  execute(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
