import { RefugioLocation } from '../../domain/entities/RefugioLocation';
import { IMapRepository } from '../../domain/repositories/IMapRepository';

export class GetRefugiosLocationsUseCase {
  constructor(private readonly repo: IMapRepository) {}

  execute(): Promise<RefugioLocation[]> {
    return this.repo.getRefugiosLocations();
  }
}