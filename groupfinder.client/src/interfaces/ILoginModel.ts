export interface ILoginModel {
  /**
   * Used for:
   *  Current user credentials from login form.
   *  Logging in with the Identity API endpoint '/login'.
   */
  email: string;
  password: string;
}
