export type UserRole = 'adoptante' | 'refugio';

export interface User {
  id:          string;
  email:       string;
  username:    string;
  fullName?:   string;
  avatarUrl?:  string;
  role:        UserRole;
  phone?:      string;
  address?:    string;
}