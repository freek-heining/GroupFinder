import { AfterContentChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticateService } from '../../services/authenticate.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-menu',
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.css']
})
export class LoginMenuComponent implements OnInit, AfterContentChecked, OnDestroy {
  private sub?: Subscription | undefined;
  public isUserAuthenticated$?: Observable<boolean>; // Used with async pipe in template
  public isUserAuthenticated?: boolean; 
  public userName?: string;
  public returnUrl?: string;

  constructor(
    private authenticateService: AuthenticateService,
    private router: Router) { }

  ngOnInit() {
  }

  ngAfterContentChecked() {
    //console.log('Inside menu ngAfterContentChecked!')
    this.isUserAuthenticated$ = this.authenticateService.isAuthenticated$();
    this.returnUrl = this.router.routerState.snapshot.url;
    //console.log('returnUrl = ' + this.returnUrl);
  }

  IsAuthenticated() {
    this.sub = this.authenticateService.isAuthenticated$().subscribe(
      result => this.isUserAuthenticated = result 
    );
  }

  ngOnDestroy() {
    if (this.sub)
      this.sub.unsubscribe
  }
}
