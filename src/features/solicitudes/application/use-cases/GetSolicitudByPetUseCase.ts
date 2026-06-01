import { Solicitud } from '../../domain/entities/Solicitud';
import { ISolicitudRepository } from '../../domain/repositories/ISolicitudRepository';

export class GetSolicitudByPetUseCase {
  constructor(private readonly repo: ISolicitudRepository) {}
  execute(adoptanteId: string, mascotaId: string): Promise<Solicitud | null> {
    return this.repo.getByAdoptanteAndPet(adoptanteId, mascotaId);
  }
}
