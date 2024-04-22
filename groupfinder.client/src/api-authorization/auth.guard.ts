import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { LoginStatusService } from '../services/loginStatus.serivce';
import { Observable, take, tap } from 'rxjs';

// Functional route guard. Class bases guards are deprecated!
// This auth guard blocks unauthorized access to url endpoints by determing if a route can be activated.
// False will redirect to the login screen, true will continue the navigation
export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  console.log('Inside auth.guard');
  const router: Router = inject(Router);
  const loginStatusService = inject(LoginStatusService);
  const isUserAuthenticated$: Observable<boolean> = loginStatusService.isAuthenticatedSubject$;

  return isUserAuthenticated$.pipe(
    take(1),
    tap(success => {
      console.log('Guard authenticated = ' + success)
      if (!success) {
        router.navigate(["/authentication/login"], { queryParams: { returnUrl: state.url }, state: { local: true } });
      }
    })
  )
}
