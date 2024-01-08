import { Component, OnInit } from '@angular/core';
import { ILoginModel } from '../../interfaces/ILoginModel';
import { BehaviorSubject } from 'rxjs';
import { AuthenticateService } from '../../services/authenticate.service';
import { NgForm } from '@angular/forms';

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
    private authenticateService: AuthenticateService) { }

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
      if (this.authenticateService.login(this.credentials)) {
        this.invalidLogin = false;
      }
      else {
        this.message.next('The login was invalid.');
        this.invalidLogin = true;
      }
    }
  }
}
