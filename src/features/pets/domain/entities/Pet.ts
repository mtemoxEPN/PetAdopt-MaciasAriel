export type PetSpecies = 'perro' | 'gato' | 'otro';
export type PetGender  = 'macho' | 'hembra';
export type PetStatus  = 'disponible' | 'en_proceso' | 'adoptado';

export interface Pet {
  id:          string;
  refugioId:   string;
  name:        string;
  species:     PetSpecies;
  breed?:      string;
  ageYears?:   number;
  gender?:     PetGender;
  description?: string;
  photoUrl?:   string;
  status:      PetStatus;
  createdAt:   Date;
}