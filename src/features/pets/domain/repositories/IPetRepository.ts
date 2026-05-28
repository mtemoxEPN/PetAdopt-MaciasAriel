import { Pet } from '../entities/Pet';

export interface IPetRepository {
  getAll():                                    Promise<Pet[]>;
  getByRefugio(refugioId: string):             Promise<Pet[]>;
  getById(id: string):                         Promise<Pet>;
  create(pet: Omit<Pet, 'id' | 'createdAt'>): Promise<Pet>;
  update(id: string, pet: Partial<Pet>):       Promise<Pet>;
  delete(id: string):                          Promise<void>;
}