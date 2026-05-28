import { Solicitud } from '../../domain/entities/Solicitud';
import { ISolicitudRepository } from '../../domain/repositories/ISolicitudRepository';

export class GetSolicitudesAdoptanteUseCase {
  constructor(private readonly repo: ISolicitudRepository) {}
  execute(adoptanteId: string): Promise<Solicitud[]> {
    return this.repo.getByAdoptante(adoptanteId);
  }
}

export class GetSolicitudesRefugioUseCase {
  constructor(private readonly repo: ISolicitudRepository) {}
  execute(refugioId: string): Promise<Solicitud[]> {
    return this.repo.getByRefugio(refugioId);
  }
}