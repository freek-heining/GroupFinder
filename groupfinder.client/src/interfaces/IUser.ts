export interface IUser {
  id: string | undefined, // Undefined is for creating a user without id
  firstName: string,
  lastName: string,
  hometown: string,
  email: string,
  biography: string,
  password: string,
  refreshToken: string | undefined
}
