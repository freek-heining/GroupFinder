export interface IAuthenticatedResponse {
  /**
   * The success response obtained when using the Identity API endpoint '/login' and '/refresh'
   */
  accessToken: string;
  expiresIn: string;
  refreshToken: string;
}
