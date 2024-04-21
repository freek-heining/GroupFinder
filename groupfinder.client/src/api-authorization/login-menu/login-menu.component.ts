import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { IUser } from '../../interfaces/IUser';
import { LoginStatusService } from '../../services/loginStatus.serivce';

@Component({
  selector: 'app-login-menu',
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.css']
})
export class LoginMenuComponent implements OnInit, AfterContentChecked {
  public isUserAuthenticated$: Observable<boolean>; // Used with async pipe in template
  public user$: Observable<IUser | null>; // Used with async pipe in template
  public returnUrl: string | undefined;

  constructor(
    private loginStatusService: LoginStatusService,
    private router: Router) {
    this.isUserAuthenticated$ = this.loginStatusService.isAuthenticatedSubject$;
    this.user$ = this.loginStatusService.authenticatedUserSubject$;
  }

  ngOnInit() {
    console.log('Menu OnInit!');
  }

  onClick() {
    this.loginStatusService.syncAuthenticatedStatus();
  }

  ngAfterContentChecked() {
    this.returnUrl = this.router.routerState.snapshot.url;
  }
}
