import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '../../services/game.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateGameComponent } from './create-game.component';
import { DeleteGameComponent } from './delete-game.component';
import { IRace } from '../../interfaces/IRace';
import { IUser } from '../../interfaces/IUser';
import { IGame } from '../../interfaces/IGame';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  constructor(private gamesService: GameService, public dialog: MatDialog) { }

  public pageTitle: string = 'Game List';
  private errorMessage: string = '';
  private userId?: string;
  private lowValue!: number;
  private highValue!: number;

  // TODO: Add loading spinner

  public game = {
    hostPlayer: {} as IUser, // The as keyword is a Type Assertion in TypeScript which tells the compiler to consider the object as another type than the type the compiler infers the object to be.
    hostPlayerRace: {} as IRace
  } as IGame;

  public games: IGame[] = [];
  public filteredGames: IGame[] = [];
  sub!: Subscription;

  private _listFilter: string = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    console.log('In listFilter setter', value);
    this.filteredGames = this.performFilter(value);
  }

  setLowValue(value: number): void {
    this.lowValue = value;
  }

  setHighValue(value: number): void {
    this.highValue = value;
  }

  performFilter(filterBy: string): IGame[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.games.filter((game: IGame) =>
      game.title.toLocaleLowerCase().includes(filterBy) ||
      game.hostPlayer.firstName?.toLocaleLowerCase().includes(filterBy) ||
      game.hostPlayer.lastName?.toLocaleLowerCase().includes(filterBy));
  }

  // Create Game
  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateGameComponent, {
      data: this.game,
    });

    dialogRef.afterClosed().subscribe(
      result => {
        this.game = result;
        this.game.hostPlayerId = this.userId!;
        this.gamesService.createGame$(this.game).subscribe(
          game => this.games.push(game)
        );

        console.log(`Created game: "${this.game.title}"`);
      }
    );
  }

  // Delete Game
  openDeleteDialog(game: IGame) {
    const dialogRef = this.dialog.open(DeleteGameComponent, {
      data: game,
    });

    dialogRef.afterClosed().subscribe(
      result => {
        game = result;
        this.gamesService.deleteGame$(game).subscribe();

        console.log(`Deleted game: "${this.game.title}"`);
      }
    );
  }

  ngOnInit(): void {
    console.log('Inside games.OnInit');
    const userId = localStorage.getItem(environment.localUserId);
    if (userId) {
      this.userId = userId
    }

    this.sub = this.gamesService.getGames$().subscribe({
      next: (games: IGame[]) => {
        this.games = games;
        this.filteredGames = this.games;
      },
      error: err => this.errorMessage = err
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
