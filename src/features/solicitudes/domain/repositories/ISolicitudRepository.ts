import { Solicitud, SolicitudStatus } from '../entities/Solicitud';

export interface ISolicitudRepository {
  getByAdoptante(adoptanteId: string):              Promise<Solicitud[]>;
  getByRefugio(refugioId: string):                  Promise<Solicitud[]>;
  create(data: {
    mascotaId:   string;
    adoptanteId: string;
    refugioId:   string;
    message?:    string;
  }):                                               Promise<Solicitud>;
  updateStatus(id: string, status: SolicitudStatus): Promise<Solicitud>;
  delete(id: string): Promise<void>;
  getByAdoptanteAndPet(adoptanteId: string, mascotaId: string): Promise<Solicitud | null>;
}