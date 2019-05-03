import { Component, OnInit ,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {MatPaginator, MatSort, MatTableDataSource , MatSnackBar,MatDialog, MatDialogRef} from '@angular/material';
import {DashboardService} from '../dashboard/dashboard.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {Angular5Csv} from 'angular5-csv/dist/Angular5-csv';
import {ConfirmationDialogComponent} from '../../containers/confirmation-dialog/confirmation-dialog.component';
@Component({
  templateUrl: 'user.component.html'
})
export class UserComponent implements OnInit {

  localStorage: any;
  Entries: any;
  StudyInitials: any;
  StudyID: any;
  FromDate: Date;
  ToDate: Date;

  displayedColumns: string[] = [ 'StudyID' ,'StudyInitials', 'Action' ];
  dataSource: MatTableDataSource<any>;
  isLoadingResults: any;
  isRateLimitReached: any;
  currentUser: any;
  date: any;
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public router: Router,
    public dashboardService: DashboardService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService,

  ) {
    this.localStorage = JSON.parse(localStorage.getItem('currentUser'));
    this.date = new Date();
  }
  ngOnInit(): void {
    //  -
    this.getAllUsers();
  }

  getAllUsers() {
    this.StudyInitials = null;
    this.StudyID = null;
    this.dashboardService.getAllUser().subscribe((data: {}) => {
      this.dataSource = new MatTableDataSource(data['result']);
      this.Entries = data['result'];
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.spinnerService.hide();
      if (this.Entries.length === 0) {
        this.snackBar.open('Record not found', 'warning', {
          duration: 5000,
          panelClass: ['warning-snackbar'],
          verticalPosition: 'top'
        });
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


  filter(){
    let condition = {
      'StudyInitials': this.StudyInitials,
      'StudyID': this.StudyID,
    }

    this.dashboardService.addUser(condition).subscribe((data: {}) => {
      this.dataSource = new MatTableDataSource(data['result']);
      this.Entries = data['result'];
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.spinnerService.hide();
      if (this.Entries.length === 0) {
        this.snackBar.open('This record already exist!', 'warning', {
          duration: 5000,
          panelClass: ['warning-snackbar'],
          verticalPosition: 'top'
        });

      }this.getAllUsers();
    }, err => {
      this.spinnerService.hide();
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }
  deleteExisting(id) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {disableClose: false});
    this.dialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete ?';

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerService.show();
        this.dashboardService.deleteUser(id).subscribe((data: {}) => {
          if (data['status']) {
            this.snackBar.open(data['message'], 'success', {
              duration: 5000,
              panelClass: ['success-snackbar'],
              verticalPosition: 'top'
            });
          } else {
            this.serverError();
          }
          this.getAllUsers();
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
  exportToExcel() {
    const localArray = this.dataSource.data.map((row) => {
      return {
        StudyInitials: row.StudyInitials,
        StudyID: row.StudyID,
      };
    });
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'User',
      useBom: true,
      noDownload: false,
      headers: [ 'Study ID', 'Study Initial']
    };
    new Angular5Csv(localArray, 'User', options);
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
