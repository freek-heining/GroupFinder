import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GameService } from '../../services/game.service';
import { EditGameComponent } from './edit-game.component';
import { filter, firstValueFrom } from 'rxjs';
import { IGame } from '../../interfaces/IGame';
import { gameSystems } from '../../enums/gameSystem.enum';

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})
export class GameDetailComponent implements OnInit {

  constructor(private gamesService: GameService,
              private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog  ) { }

  pageTitle: string = 'Game Detail';
  errorMessage: string = '';
  game!: IGame;
  gameSystems = gameSystems;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pageTitle += `: ${id}`;
    this.getGameData(id);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getGameData(id: number) {
    this.gamesService.getGame(id).subscribe({
      next: game => this.game = game,
      error: err => this.errorMessage = err
    });
  }

  // Back
  onBack(): void {
    this.router.navigate(['/games']);
  }

  // Edit Game
  openEditDialog(game: IGame) {
    const dialogRef = this.dialog.open(EditGameComponent, {
      data: game,
    });

    dialogRef.afterClosed().pipe(filter(x => !!x)).subscribe( // pipe filter skips the falsy
      async result => {
        game = result,
        await firstValueFrom(this.gamesService.editGame(game)), // async await promise from observable to make sure data is written before retrieving below
        this.getGameData(game.gameId)
      }
    );
  }
}
