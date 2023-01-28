import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Notification } from '../app.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit{

  notifications:Notification[] = [];
  constructor( @Inject(MAT_DIALOG_DATA) private data: Notification[]){}
  
  ngOnInit(): void {
    this.notifications = this.data;
    console.log("nots");
    console.log(this.notifications);
    this.notifications.forEach(not => console.log(not.id));
  }
}
