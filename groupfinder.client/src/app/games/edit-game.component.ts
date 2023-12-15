import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RaceService } from '../../services/race.service';
import { GameSystem, gameSystems } from '../../enums/gameSystem.enum';
import { IRace } from '../../interfaces/IRace';
import { IGame } from '../../interfaces/IGame';

@Component({
  selector: 'app-edit-game',
  templateUrl: './edit-game.component.html',
  styleUrls: ['./edit-game.component.css']
})
export class EditGameComponent {
  constructor(private raceService: RaceService, public dialogRef: MatDialogRef<EditGameComponent>, @Inject(MAT_DIALOG_DATA) public data: IGame) { }

  pageTitle: string = 'Edit Game';
  errorMessage: string = '';

  gameSystem = GameSystem;
  enumOptions = [this.gameSystem.Warhammer40K, this.gameSystem.AgeOfSigmar];
  gameSystems = gameSystems;

  races: IRace[] = [];
  sub!: Subscription;

  // Sometimes compareObjects is needed for displaying values in dropdown:
  //compareObjects(o1: any, o2: any): boolean {
  //  return o1.name === o2.name && o1.raceId === o2.raceId;
  //}

  ngOnInit(): void {
    console.log("Inside edit ngOnInit!");
    this.sub = this.raceService.getRaces().subscribe({
      next: races => this.races = races,
      error: err => this.errorMessage = err
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
