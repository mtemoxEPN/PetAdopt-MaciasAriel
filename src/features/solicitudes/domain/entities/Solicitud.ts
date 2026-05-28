export type SolicitudStatus = 'pendiente' | 'aprobada' | 'rechazada';

export interface Solicitud {
  id:          string;
  mascotaId:   string;
  adoptanteId: string;
  refugioId:   string;
  status:      SolicitudStatus;
  message?:    string;
  createdAt:   Date;
  // joins
  mascotaName?:      string;
  mascotaPhoto?:     string;
  adoptanteUsername?: string;
  refugioUsername?:  string;
}