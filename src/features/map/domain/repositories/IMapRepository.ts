import { RefugioLocation } from '../entities/RefugioLocation';

export interface IMapRepository {
  getRefugiosLocations(): Promise<RefugioLocation[]>;
}