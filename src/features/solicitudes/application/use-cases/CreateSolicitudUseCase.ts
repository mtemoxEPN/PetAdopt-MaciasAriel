import { Solicitud } from '../../domain/entities/Solicitud';
import { ISolicitudRepository } from '../../domain/repositories/ISolicitudRepository';

export class CreateSolicitudUseCase {
  constructor(private readonly repo: ISolicitudRepository) {}

  execute(data: {
    mascotaId:   string;
    adoptanteId: string;
    refugioId:   string;
    message?:    string;
  }): Promise<Solicitud> {
    if (!data.mascotaId || !data.adoptanteId || !data.refugioId)
      throw new Error('Datos incompletos para la solicitud');
    return this.repo.create(data);
  }
}