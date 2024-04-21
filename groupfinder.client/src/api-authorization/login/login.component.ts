import { Component, OnDestroy, OnInit } from '@angular/core';
import { ILoginModel } from '../../interfaces/ILoginModel';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthenticateService } from '../../services/authenticate.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginStatusService } from '../../services/loginStatus.serivce';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
  message$ = new BehaviorSubject<string>('Message'); // TODO: not showing
  private sub?: Subscription | undefined;
  pageTitle: string = 'Login';
  loggedIn?: boolean; // For login form div in html
  credentials: ILoginModel = {
    email: '', password: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loginStatusService: LoginStatusService,
    private authenticateService: AuthenticateService) { }

  async ngOnInit(): Promise<void> { // TODO: Why async promise?
    // eslint-disable-next-line no-extra-boolean-cast
    if (!window.history.state.local) {
      // This prevents regular links to <app>/authentication/login, [state]='{ local: true } in login-menu html
      this.message$.next('The login was not initiated from within the page.');
      this.loggedIn = false;
    }
  }

  login(form: NgForm) {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/'; // get return url from query parameters or default to home page

    if (!form.valid)
      this.message$.next('The login form was invalid.');

    this.sub = this.authenticateService.login(this.credentials)
      .subscribe(loginSuccess => {
        if (loginSuccess) {
          this.loggedIn = true;
          this.message$.next('The login was successful.');
          console.log('The login was successful.');
          this.loginStatusService.syncAuthenticatedStatus(); // Sync status for menu bar display etc
          this.navigateTo(returnUrl, true ); // When loginSuccess = true, navigate while replacing the current state in history
        }
        else {
          this.message$.next('The login was invalid.');
          this.loggedIn = false;
        }
      });
  }

  private navigateTo(path: string, replaceUrl: boolean) {
    this.router.navigateByUrl(path, { replaceUrl: replaceUrl, state: { local: true } })
      .then(nav => {
        console.log('Navigate from login succes: ' + nav); // true if navigation is successful
      }, err => {
        console.error('Navigate from login failure: ' + err) // when there's an error
      });
  }

  ngOnDestroy()  {
    if (this.sub)
      this.sub.unsubscribe
  }
}
