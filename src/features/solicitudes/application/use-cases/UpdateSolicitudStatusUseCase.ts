import { Solicitud, SolicitudStatus } from '../../domain/entities/Solicitud';
import { ISolicitudRepository } from '../../domain/repositories/ISolicitudRepository';

export class UpdateSolicitudStatusUseCase {
  constructor(private readonly repo: ISolicitudRepository) {}
  execute(id: string, status: SolicitudStatus): Promise<Solicitud> {
    return this.repo.updateStatus(id, status);
  }
}