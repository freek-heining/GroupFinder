import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RaceService } from '../../services/race.service';
import { IGame } from '../../interfaces/IGame';
import { IRace } from '../../interfaces/IRace';
import { GameSystem, gameSystems } from '../../enums/gameSystem.enum';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {

  constructor(private raceService: RaceService, public dialogRef: MatDialogRef<CreateGameComponent>, @Inject(MAT_DIALOG_DATA) public data: IGame) { }

  pageTitle: string = 'Create Game';

  errorMessage: string = '';

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  matcher = new MyErrorStateMatcher();

  gameSystem = GameSystem;
  enumOptions = [this.gameSystem.Warhammer40K, this.gameSystem.AgeOfSigmar];
  gameSystems = gameSystems;

  races: IRace[] = [];
  sub!: Subscription;

  ngOnInit(): void {
    this.sub = this.raceService.getRaces$().subscribe({
      next: races => {
        this.races = races;
      },
      error: err => this.errorMessage = err
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
