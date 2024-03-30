export interface IRefreshModel {
  /**
   * Used for:
   *  Refreshing bearer with the Identity API endpoint '/refresh'.
   *  Managaing the refresh token in db for current id/user.
   */
  id: string;
  refreshToken: string;
}
