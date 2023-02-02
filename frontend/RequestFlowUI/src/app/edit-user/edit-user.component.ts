import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { user } from '../admin/admin.component';
import { Roles } from '../signup/signup.component';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {

  local_data:any;
  action:string;

  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = data
    this.updateRequest.userName = this.local_data.userName;
    this.updateRequest.id = this.local_data.id;
    this.updateRequest.role = this.local_data.role;
    this.action = this.local_data.action;
  }

  updateRequest = new UpdateRequest();
  roles: Roles[] = [
    {value: 'REQUESTOR', viewValue: 'Requestor'},
    {value: 'APPROVER', viewValue: 'Approver'},
    {value: 'ADMIN', viewValue: 'Admin'}

  ];


  update(){
    this.dialogRef.close({event:"Update",data:this.updateRequest});
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }
}

export class UpdateRequest {
  public id: any;
  public userName: any;
  public password: any;
  public role: any;
}
