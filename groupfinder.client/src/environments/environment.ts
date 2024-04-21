// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // API paths
  production: false,
  gameApiUrl:                     '/api/game',
  raceApiUrl:                     '/api/race',
  userApiUrl:                     '/api/user',
  userByIdApiUrl:                 '/api/user/id/',
  tokenApiUrl:                    '/api/token',
  loginApiUrl:                    '/identity/login',
  registerApiUrl:                 '/identity/register',
  refreshApiUrl:                  '/identity/refresh',
  confirmEmailApiUrl:             '/identity/confirmEmail',
  resendConfirmationApiUrl:       '/identity/resendConfirmationEmail',
  forgotPasswordApiUrl:           '/identity/forgotPassword',
  resetPasswordApiUrl:            '/identity/resetPassword',

  // GET: Gets email address and email confirmation status of the logged-in user.
  // POST: Updates the email address and password of the logged-in user. Send NewEmail, NewPassword, and OldPassword in the request body
  manageInfoApiUrl:               '/identity/manage/info', 

  // Local storage paths
  localUserId:            'userId',
  localAccessToken:       'accessToken',
  localAccessTokenExpiry: 'accessTokenExpiry',

  // Keys
  encryptKey: '5983710380284139',
  ivKey:      '3058202590821485'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
