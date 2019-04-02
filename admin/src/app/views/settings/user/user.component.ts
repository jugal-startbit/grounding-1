import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import { UserService} from './user.service';
import { Router} from '@angular/router';

import { MatDialog, MatDialogRef  } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../containers/confirmation-dialog/confirmation-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {MatSnackBar} from '@angular/material';
import { slideToLeft } from '../../../router.animations';

export interface UserData {
  _id: string;
  Name: string;
  UserName: string;
  FatherName: string;
  Mobile: number;
  Email: string;
  DOB: string;
  Address: string;
  Gender: string;
  DepartmentName: string;
  Designation: string;
  RoleName: string;
  BranchName: string;
  Action: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [slideToLeft()]
})
export class UserComponent implements OnInit {
  displayedColumns: string[] = [
    'UserName', 'Name',
    'Mobile', 'Gender',
    'DepartmentName', 'Designation', 'RoleName', 'BranchName', 'Action'
  ];
  dataSource: MatTableDataSource<UserData>;
  isLoadingResults: any;
  isRateLimitReached: any;
  localStorage: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  Users: any = [];
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  showSpinner: boolean;
  constructor(
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService,
    private snackBar: MatSnackBar
  ) {
    this.showSpinner = false;
    this.localStorage = JSON.parse(localStorage.getItem('currentUser'));
    if (this.localStorage.role === 'Super Admin') {
      this.getAllUsers(0);
    } else {
      this.getAllUsers(this.localStorage.id);
    }
  }

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAllUsers(selectedLeaderID) {
    this.spinnerService.show();
    this.Users = [];
    this.userService.getAllUsers(selectedLeaderID).subscribe((data: {}) => {
      this.dataSource = new MatTableDataSource(data['result']);
      this.Users = data['result'];
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.spinnerService.hide();
    }, err => {
      this.spinnerService.hide();
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  addNew(id) {
    this.router.navigate(['/settings/userForm', id]);
  }
  editExisting(id) {
    this.router.navigate(['/settings/userForm', id]);
  }
  deleteExisting(id) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: false});
    this.dialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete ?';

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerService.show();
        this.userService.deleteUser(id).subscribe((data: {}) => {
          if (data['status']) {
            this.snackBar.open(data['message'], 'success', {
              duration: 5000,
              panelClass: ['success-snackbar'],
              verticalPosition: 'top'
            });
          } else {
            this.serverError();
          }
	  if(this.localStorage.role == 'Super Admin'){
	      this.getAllUsers(0);
	    }
	    else if(this.localStorage.role == 'Manager'){
	      this.getAllUsers(this.localStorage.id)
	    }
        }, err => {
          this.spinnerService.hide();
          this.snackBar.open('Server Error', 'Error', {
            duration: 5000,
            panelClass: ['danger-snackbar'],
            verticalPosition: 'top'
          });
        });
      }
      this.dialogRef = null;
    });
  }
  serverError() {
    this.spinnerService.show();
    this.snackBar.open('Server Error', 'Error', {
      duration: 5000,
      panelClass: ['danger-snackbar'],
      verticalPosition: 'top'
    });
  }
}

