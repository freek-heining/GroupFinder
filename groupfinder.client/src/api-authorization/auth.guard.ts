import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { environment } from '../environments/environment';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
    const router = inject(Router);
    const token = localStorage.getItem(environment.localToken);

    if (token) { // TODO: expired?
      return true;
    }

    router.navigate(["/authentication/login"], { queryParams: { returnUrl: state.url }, state: { local: true } });

    return false;
  }


