import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticateService } from '../../services/authenticate.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})

export class LogoutComponent implements OnInit {
  public message = new BehaviorSubject<string | null>(null);

  constructor(
    private authenticateService: AuthenticateService,
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

  private async logout(): Promise<void> {
    const isauthenticated = await this.authenticateService.isAuthenticated$();

    if (isauthenticated) {
      console.log('logging off');
      localStorage.removeItem(environment.localAccessToken);
      localStorage.removeItem(environment.localTokenExpiry);
      localStorage.removeItem(environment.localRefreshToken);
      await this.router.navigate(["/"], { replaceUrl: true });
    }
  }
}
