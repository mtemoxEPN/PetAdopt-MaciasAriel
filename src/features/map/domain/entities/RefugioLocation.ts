export interface RefugioLocation {
  id:          string;
  name:        string;
  address?:    string;
  lat:         number;
  lng:         number;
  phone?:      string;
  description?: string;
}