import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ApiAuthorizationModule } from '../api-authorization/api-authorization.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { GameDetailComponent } from './games/game-detail.component';
import { GamesComponent } from './games/games.component';
import { CreateGameComponent } from './games/create-game.component';
import { DeleteGameComponent } from './games/delete-game.component';
import { EditGameComponent } from './games/edit-game.component';
import { PageNotFoundComponent } from './shared/page-not-found.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthInterceptor } from '../api-authorization/auth.interceptor';
import { AuthGuard } from '../api-authorization/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    GamesComponent,
    GameDetailComponent,
    CreateGameComponent,
    DeleteGameComponent,
    EditGameComponent
  ],
  imports: [
    ApiAuthorizationModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'games', component: GamesComponent, canActivate: [AuthGuard] },
      { path: 'games/:id', component: GameDetailComponent },
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent }
    ]),
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
