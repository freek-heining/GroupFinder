import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ILoginModel } from '../../interfaces/ILoginModel';
import { BehaviorSubject } from 'rxjs';
import { AuthenticateService } from '../../services/authenticate.service';
import { NgForm } from '@angular/forms';
import { IAuthenticatedResponse } from '../../interfaces/IAuthenticatedResponse';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public message = new BehaviorSubject<string | null>(null);

  pageTitle: string = 'Login';
  errorMessage: string = '';
  invalidLogin?: boolean;
  credentials: ILoginModel = {
    email: '', password: ''
  };

  constructor(
    private router: Router,
    private authService: AuthenticateService) { }

  async ngOnInit(): Promise<void> {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!window.history.state.local) {
      // This prevents regular links to <app>/authentication/login, [state]='{ local: true } in menu html
      this.message.next('The login was not initiated from within the page.');
      this.invalidLogin = true;
    }
  }

  login(form: NgForm) {
    if (form.valid) {
      console.log('logging in');
      this.authService.getToken(this.credentials).subscribe({
        next: (response: IAuthenticatedResponse) => {
          const token: string = response.accessToken;
          const expiry: string = response.expiry;
          const refreshToken: string = response.refreshToken;

          localStorage.setItem(environment.localToken, token);
          localStorage.setItem(environment.localTokenExpiry, this.calculateExpiry(expiry));
          localStorage.setItem(environment.localRefreshToken, refreshToken);

          this.invalidLogin = false;
          this.router.navigate(["/"], { replaceUrl: true }); // When true, navigates while replacing the current state in history.
        },
        error: err => {
          this.errorMessage = err,
            this.invalidLogin = true
        }
      })
    }
  }

  private calculateExpiry(expiry: string): string {
    const currentTimeInSeconds: number = Math.floor((new Date).getTime() / 1000); // secs since Unix Epoch
    const expiryTimeInSeconds: number = parseInt(expiry) + currentTimeInSeconds; // secs since Unix Epoch + token expiry in secs
    return expiryTimeInSeconds.toString();
  }
}
