import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
//import { AuthenticateService } from '../services/authenticate.service';

export const AuthGuard: CanActivateFn = (): | boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
  //const authService = inject(AuthenticateService);
  const router = inject(Router);
  const token = localStorage.getItem(environment.localToken);

  if (token) { // TODO: expired?
    return true;
  }

  router.navigate(["/authentication/login"], { state: { local: true } });

  return false;
  
}
