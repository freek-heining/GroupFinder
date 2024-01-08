import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticateService } from '../services/authenticate.service';
import { Subscription } from 'rxjs';


export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
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
