import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticateService } from '../../services/authenticate.service';
import { environment } from '../../environments/environment';
import { TokenService } from '../../services/token.service';
import { ApplicationPaths } from '../api-authorization.constants';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})

// This component handles the logout process.
// By navigating to it with [state: local] in the url, session storage and refresh token of current user will be cleared.

export class LogoutComponent implements OnInit {
  public message = new BehaviorSubject<string | null>(null);

  constructor(
    private authenticateService: AuthenticateService,
    private tokenService: TokenService,
    private router: Router) { }

  async ngOnInit() {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!window.history.state.local) { // state local given in login-menu with [state] 
      await this.logout();
    } else {
      // This prevents regular links to <app>/authentication/logout from triggering a logout
      this.message.next('The logout was not initiated from within the page.');
    }
  }

  private logout() {
    const userId: string | null = localStorage.getItem(environment.localUserId);

    if (userId) { // If no id, then nobody is logged in and no leftovers
      console.log('logging off user id: ' + userId);
      sessionStorage.removeItem(environment.sessionAccessToken);
      sessionStorage.removeItem(environment.sessionAccessTokenExpiry);
      this.tokenService.deleteRefreshToken$(userId).subscribe({ complete: () => 'Refresh token deleted' });
      localStorage.removeItem(environment.localUserId);
      this.navigateTo(ApplicationPaths.Login, true);
    }
    else {
      console.log('already logged off');
      this.navigateTo(ApplicationPaths.Login, true)
    }
  }

  private navigateTo(path: string, replaceUrl: boolean) {
    this.router.navigateByUrl(path, { replaceUrl: replaceUrl, state: { local: true } })
      .then(nav => {
        console.log('Navigate succes: ' + nav); // true if navigation is successful
      }, err => {
        console.error('Navigate failure: ' + err) // when there's an error
      });
  }
}
