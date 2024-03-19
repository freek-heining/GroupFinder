import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticateService } from '../services/authenticate.service';
import { Subscription } from 'rxjs';

// The auth guard blocks unauthorized access to url endpoints by determing if a route can be activated.
// False will redirect to the login screen, true will continue the navigation
export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
    console.log('Inside auth.guard');
    const router: Router = inject(Router);
    let isUserAuthenticated: boolean = false;
    const authenticateService = inject(AuthenticateService);

    const sub: Subscription = authenticateService.isAuthenticated$().subscribe(
      value => isUserAuthenticated = value);

    if (isUserAuthenticated) {
      sub.unsubscribe();
      return true;
    }

    router.navigate(["/authentication/login"], { queryParams: { returnUrl: state.url }, state: { local: true } });

    sub.unsubscribe();

    return false;
  }
