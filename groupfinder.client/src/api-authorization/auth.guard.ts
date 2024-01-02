import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticateService } from '../services/authenticate.service';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
    const router: Router = inject(Router);
    const authService = inject(AuthenticateService);

    if (authService.isAuthenticated()) {
      return true;
    }

    router.navigate(["/authentication/login"], { queryParams: { returnUrl: state.url }, state: { local: true } });

    return false;
  }


