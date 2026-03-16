export * from "../../../shared/types/User";

export interface UserEntity {
  id: string;
  firstName: string;
  lastName: string;
  hash: string;
  email: string;
}
