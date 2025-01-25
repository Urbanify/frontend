import type { UserRole } from './User';

export type TokenData = {
  user: {
    id: string;
    name: string;
    surname: string;
    role: UserRole;
    cityId: string;
  };
  iat: number;
  exp: number;
};
