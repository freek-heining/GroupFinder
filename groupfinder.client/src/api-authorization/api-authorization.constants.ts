export const ApplicationName = 'LookingForGroup.AngularApp';

export const ReturnUrlType = 'returnUrl';

export const LogoutActions = {
  Logout: 'logout',
  LoggedOut: 'logged-out'
};

export const LoginActions = {
  Login: 'login',
  Profile: 'profile',
  Register: 'register'
};

let applicationPaths: ApplicationPathsType = {
  DefaultLoginRedirectPath: '/',
  Login: `authentication/${LoginActions.Login}`,
  Register: `authentication/${LoginActions.Register}`,
  Profile: `authentication/${LoginActions.Profile}`,
  LogOut: `authentication/${LogoutActions.Logout}`,
  Unauthorized: 'unauthorized',
  IdentityRegisterPath: `identity/${LoginActions.Register}`,
  IdentityLoginPath: `identity/${LoginActions.Login}`,
  IdentityManagePath: 'identity/manage/info'
};

applicationPaths = {
  ...applicationPaths
};

interface ApplicationPathsType {
  readonly DefaultLoginRedirectPath: string;
  readonly Login: string;
  readonly Register: string;
  readonly Profile: string;
  readonly LogOut: string;
  readonly Unauthorized: string;
  readonly IdentityRegisterPath: string;
  readonly IdentityLoginPath: string;
  readonly IdentityManagePath: string;
}

export const ApplicationPaths: ApplicationPathsType = applicationPaths;
