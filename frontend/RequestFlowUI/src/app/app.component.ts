import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { TokenStorageService } from './services/token-storage.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private roles: string[] = [];
  isLoggedIn = false;
  showModeratorBoard = false;
  username?: string;
  isApprover = false;
  notificationCount = 0;
  notifications:Notification[] = [];

  constructor(private tokenStorageService: TokenStorageService, private router: Router, private matDialog: MatDialog, private userService: UserService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.username = user.username;
      if(this.roles[0] === 'ROLE_APPROVER'){
        this.isApprover = true;
      }
    } else {
      this.router.navigateByUrl('/login')
    }
    this.retrieveNotifications();
  }

  logout(): void {
    
    let logoutDialog = this.matDialog.open(LogoutDialogComponent);
    logoutDialog.afterClosed().subscribe(
      result=> {
        if(result === 'true'){
          this.tokenStorageService.signOut();
          window.location.reload();
        }
      }
    );
    
  }

  retrieveNotifications():void {
    this.userService.retrieveNotifications(this.tokenStorageService.getUser().id).subscribe(
      data => {
        console.log(data);
        let notificationsRecieved:any = data;
        for(let n of notificationsRecieved){
          let notification:Notification={
            id:n.id,
            read:n.read,
            requestId:n.requestId,
            status:n.status,
            userId:n.userId
          }
          this.notifications.push(notification);
        }
        this.notificationCount = this.notifications.filter(n => !n.read).length;
        console.log(this.notificationCount);
      },
      error => {
        console.error(error);
      }
    );
  }

  showNotifications():void{
    let notificationComponent = this.matDialog.open(NotificationsComponent, {data: this.notifications});
    notificationComponent.afterClosed().subscribe();
  }
}


export interface Notification{
  id:number,
  read:boolean,
  requestId:number,
  status:string,
  userId:number
}