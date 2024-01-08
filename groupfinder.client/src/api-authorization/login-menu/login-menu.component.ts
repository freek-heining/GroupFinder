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
  public isUserAuthenticated$?: Observable<boolean>; // Used with async pipe in template
  public userName?: string;
  public returnUrl?: string;

  constructor(
    private authenticateService: AuthenticateService,
    private router: Router) { }

  ngOnInit() {
    console.log("login-menu!");
  }

  ngAfterContentChecked() {
    console.log('Inside ngAfterContentChecked!')
    this.isUserAuthenticated$ = this.authenticateService.isAuthenticated$();
    this.returnUrl = this.router.routerState.snapshot.url;
    console.log('returnUrl = ' + this.returnUrl);
  }
}
