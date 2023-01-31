import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-submit-dialog',
  templateUrl: './submit-dialog.component.html',
  styleUrls: ['./submit-dialog.component.css']
})
export class SubmitDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any){

  }

}
