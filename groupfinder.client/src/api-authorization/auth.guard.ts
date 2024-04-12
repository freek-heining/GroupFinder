import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticateService } from '../services/authenticate.service';

// The auth guard blocks unauthorized access to url endpoints by determing if a route can be activated.
// False will redirect to the login screen, true will continue the navigation
export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
    console.log('Inside auth.guard');
    const router: Router = inject(Router);
    const authService = inject(AuthenticateService);

    const authenticated$ = authService.isAuthenticated$();
    // TODO: not good
    if (authenticated$.subscribe()) {
      console.log('Guard OK');
      return true;
    }
    else {
      console.log('Guard FALSE');
      router.navigate(["/authentication/login"], { queryParams: { returnUrl: state.url }, state: { local: true } });
      return false;
    }
  }
