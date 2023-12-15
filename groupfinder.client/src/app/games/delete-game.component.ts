import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IGame } from '../../interfaces/IGame';

@Component({
  selector: 'app-delete-game',
  templateUrl: './delete-game.component.html',
  styleUrls: ['./delete-game.component.css']
})
export class DeleteGameComponent {

  constructor(public dialogRef: MatDialogRef<DeleteGameComponent>, @Inject(MAT_DIALOG_DATA) public data: IGame) { }

  pageTitle: string = 'Delete Game';

}
