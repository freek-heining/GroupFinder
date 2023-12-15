import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../services/authenticate.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit {
  public isUserAuthenticated?: boolean;
  constructor(private authenticateService: AuthenticateService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    const queryToken: string | null = this.route.snapshot.queryParamMap.get('jwt'); // If redirected with jwt in query parameter from Identiy/Login

    if (queryToken && !this.authenticateService.tokenExpired(queryToken)) {
      localStorage.setItem("jwt", queryToken);
      this.location.replaceState('/');
      this.isUserAuthenticated = true;
    }
    else
      this.isUserAuthenticated = this.authenticateService.isAuthenticated();
  }
}
