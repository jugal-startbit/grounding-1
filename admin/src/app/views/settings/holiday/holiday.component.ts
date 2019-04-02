import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import { HolidayService} from './holiday.service';
import { Router} from '@angular/router';

import { MatDialog, MatDialogRef  } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../containers/confirmation-dialog/confirmation-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {MatSnackBar} from '@angular/material';
import { slideToLeft } from '../../../router.animations';

export interface UserData {
  _id: string;
  Name: string;
  Date: string;
  Action: string;
}

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss'],
  animations: [slideToLeft()]
})
export class HolidayComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Date', 'Action'];
  dataSource: MatTableDataSource<UserData>;
  isLoadingResults: any;
  isRateLimitReached: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  Holidays: any = [];
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  showSpinner: boolean;
  constructor(
    private holidayService: HolidayService,
    private router: Router,
    public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService,
    private snackBar: MatSnackBar
  ) {this.showSpinner = false; }

  ngOnInit() {
    this.getAllHolidays();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAllHolidays() {
    this.spinnerService.show();
    this.Holidays = [];
    this.holidayService.getAllHolidays().subscribe((data: {}) => {
      this.dataSource = new MatTableDataSource(data['result']);
      this.Holidays = data['result'];
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
    this.router.navigate(['/settings/holidayForm', id]);
  }
  editExisting(id) {
    this.router.navigate(['/settings/holidayForm', id]);
  }
  deleteExisting(id) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: false});
    this.dialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete ?';

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerService.show();
        this.holidayService.deleteHoliday(id).subscribe((data: {}) => {
          if (data['status']) {
            this.snackBar.open(data['message'], 'success', {
              duration: 5000,
              panelClass: ['success-snackbar'],
              verticalPosition: 'top'
            });
          } else {
            this.serverError();
          }
          this.getAllHolidays();
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

