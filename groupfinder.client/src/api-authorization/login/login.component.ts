import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private route: ActivatedRoute,
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
          const accessToken: string = response.accessToken;
          const tokenExpiry: string = response.expiresIn;
          const refreshToken: string = response.refreshToken;

          console.log('accessToken: ' + accessToken);
          console.log('tokenExpiry: ' + tokenExpiry);
          console.log('refreshToken: ' + refreshToken);

          localStorage.setItem(environment.localAccessToken, accessToken);
          localStorage.setItem(environment.localTokenExpiry, this.authService.calculateTokenExpiry(tokenExpiry)); // secs since Unix Epoch
          localStorage.setItem(environment.localRefreshToken, refreshToken);

          this.invalidLogin = false;

          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/'; // get return url from query parameters or default to home page
          this.router.navigateByUrl(returnUrl, { replaceUrl: true }); // When true, navigates while replacing the current state in history.
        },
        error: err => {
          this.errorMessage = err,
            this.invalidLogin = true
        }
      })
    }
  }


}
