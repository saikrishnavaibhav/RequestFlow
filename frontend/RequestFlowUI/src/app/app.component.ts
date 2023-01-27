import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';
import { TokenStorageService } from './services/token-storage.service';

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

  constructor(private tokenStorageService: TokenStorageService, private router: Router, private matDialog: MatDialog) { }

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
}
