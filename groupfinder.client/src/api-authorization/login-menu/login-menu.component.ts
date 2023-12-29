import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../services/authenticate.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-menu',
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.css']
})
export class LoginMenuComponent implements OnInit, AfterContentChecked {
  public isUserAuthenticated$?: Observable<boolean>;
  public userName?: string;
  public returnUrl?: string;

  constructor(
    private authenticateService: AuthenticateService,
    private router: Router) { }

  ngOnInit() {
    console.log("login-menu!");
  }

  ngAfterContentChecked() {
    this.isUserAuthenticated$ = this.authenticateService.isAuthenticatedObservable();
    this.returnUrl = this.router.routerState.snapshot.url;
    console.log('returnUrl = ' + this.returnUrl);
  }
}
