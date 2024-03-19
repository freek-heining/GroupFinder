import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit {
  public isUserAuthenticated?: boolean;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService) { }

  ngOnInit(): void {
  }
}
