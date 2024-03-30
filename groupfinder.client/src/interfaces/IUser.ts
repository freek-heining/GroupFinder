export interface IUser {
  id: string | undefined,
  firstName: string,
  lastName: string,
  hometown: string,
  email: string,
  biography: string,
  password: string,
  refreshToken: string | undefined
}
