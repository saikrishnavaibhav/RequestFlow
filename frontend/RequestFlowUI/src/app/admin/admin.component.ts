import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';
import { SubmitDialogComponent } from '../submit-dialog/submit-dialog.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  
  showProgress = false;
  logColumns = ['Log']
  userColumns = ["Id", "User name", "Role", "Edit", "Delete"];
  logDataSource = new MatTableDataSource<string>([]);
  usersDataSource = new MatTableDataSource<user>([]);
  logs: string[] = []; 
  users:user[]=[];
  user:any;
  @ViewChild('logPaginator') logPaginator:any = MatPaginator;
  @ViewChild('userPaginator') userPaginator:any = MatPaginator;

  constructor(private tokenService: TokenStorageService, private userService: UserService, private matDialog: MatDialog){}

  ngOnInit(): void {
    this.user = this.tokenService.getUser();
    this.showProgress = true;
    this.userService.retrieveLogs().subscribe(
      data=> {
        let logs = data;
        for(let log of logs){
          this.logs.push(log.log);
        }

        this.logDataSource = new MatTableDataSource<string>(this.logs.reverse());
        this.logDataSource.paginator = this.logPaginator;
        console.log(logs);
      },
      error=> {
        console.error(error);
      }
    );

    this.userService.retrieveUsers(this.user.id).subscribe(
      data=>{
        let users = data;
        console.log(users);
        for (let us of users){
          let user:user = {
            id: us.id,
            userName: us.userName,
            role: us.roles[0].role.split("_")[1]
          }
          console.log(user);
          this.users.push(user);
        }
        console.log(this.users);
        this.usersDataSource = new MatTableDataSource<user>(this.users);
        this.usersDataSource.paginator = this.userPaginator;
      },
      error=>{
        console.error(error);
      }
    );
    this.showProgress = false;
  }

  edit(user: any){
    let editUserComponent = this.matDialog.open(EditUserComponent,{data:user});
    editUserComponent.afterClosed().subscribe(
      result=>{
        console.log(result);
        if(result.event === 'Update'){
          this.showProgress = true;
          this.updateRowData(result.data);
          this.usersDataSource = new MatTableDataSource<user>(this.users);
          this.usersDataSource.paginator = this.userPaginator;
          this.showProgress = false;
        }

      }
    );
  }

  updateRowData(data: any) {
    this.users.filter(u=>{

      if(u.id == data.id){
        u.role = data.role;
        u.userName = data.userName;
        console.log(u);
        this.userService.updateUser(u).subscribe(
          data=>{
            console.log("Updated user data");
          },
          error=>{
            console.log(error);
          }
        );
      }
      return true;
    });
  }

  delete(user: any){
    let data = [];
    
    data.push("Sure to delete user: "+user.userName+"?");
    data.push("Delete");
    let submitDialog = this.matDialog.open(SubmitDialogComponent,{data: data});
    submitDialog.afterClosed().subscribe(
      result=> {
        if(result === 'true'){
          this.showProgress = true;
          this.userService.deleteUser(user.id).subscribe(
            data=>{
              this.users = this.users.filter(u=>u.id !== user.id);
              this.usersDataSource = new MatTableDataSource<user>(this.users);
              this.usersDataSource.paginator = this.userPaginator;
              
            },
            error=>{
              console.error(error);
            }
          );
          this.showProgress = false;
        }
      }
    );
  }
}

export interface user{
  id:number;
  userName:string;
  role:String;
}

