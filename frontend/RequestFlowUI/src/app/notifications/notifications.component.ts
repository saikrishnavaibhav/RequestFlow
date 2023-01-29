import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Notification } from '../app.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit{

  notifications:Notification[] = [];
  position = new FormControl('left');
  displayedColumns = ['Notifications', 'Mark as read'];

  constructor( @Inject(MAT_DIALOG_DATA) private data: Notification[], private userService: UserService, private matScnakBar: MatSnackBar){}
  
  ngOnInit(): void {
    this.notifications = this.data;
  }

  readNotification(notification: Notification){
    this.userService.readNotification(notification.id).subscribe(
      data=>{
        console.log("Notification marked as read");
        //this.showSnakBar()
        this.notifications.map(n => {
          if(n.id === notification.id){
            n.read = true;
          }
        });
      },
      error=> {
        
      }
    );
  }
  showSnakBar() {
  }
}
