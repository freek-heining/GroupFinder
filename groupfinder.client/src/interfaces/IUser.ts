export interface IUser {
  id: string | undefined, // Undefined is for creating a user without id
  firstName: string | undefined,
  lastName: string | undefined,
  hometown: string | undefined,
  email: string,
  biography: string | undefined,
  password: string,
  refreshToken: string | undefined
}
