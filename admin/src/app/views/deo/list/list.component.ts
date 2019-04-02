import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import { ListService} from './list.service';
import { Router} from '@angular/router';

import { MatDialog, MatDialogRef  } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../containers/confirmation-dialog/confirmation-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {MatSnackBar} from '@angular/material';
import { AuthenticationService} from '../../../containers/_services/authentication.service';
import { slideToLeft } from '../../../router.animations';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { CommonService} from '../../../containers/common.service';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { DatePipe} from '@angular/common';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations: [slideToLeft()],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Email', 'Phone', 'ClientType', 'Purpose', 'ToWhomMeet', 'Department' ,  'Modified'];
  dataSource: MatTableDataSource<any>;
  isLoadingResults: any;
  isRateLimitReached: any;
  currentUser: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  Entries: any = [];
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  showSpinner: boolean;
  maxDate = new Date();
  filterValue = new Date();
  constructor(
    private listService: ListService,
    private router: Router,
    public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private commonService: CommonService
  ) {
    setTimeout(() => {
      this.authenticationService.checkSelectedComponentVisiblity('View Register');
    }, 100);
    this.showSpinner = false;
    this.currentUser = localStorage.getItem('currentUser');
  }

  ngOnInit() {
    this.getAllEntries('first');
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  clear() {
    this.filterValue = new Date();
    this.getAllEntries('first');
  }
  toDate(dt) {
    return new Date(dt);
  }
  getAllEntries(selectedDate) {
    this.Entries = [];
    if (selectedDate !== 'first') {
      selectedDate = new Date(selectedDate);
    }
    this.spinnerService.show();
    this.listService.getAllEntries(selectedDate).subscribe((data: {}) => {
      this.dataSource = new MatTableDataSource(data['result']);
      this.Entries = data['result'];
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.spinnerService.hide();
      if (this.Entries.length === 0) {
        this.commonService.playNotification();
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

  addNew(id) {
    this.router.navigate(['/deos/new', id]);
  }
  editExisting(id) {
    this.router.navigate(['/deos/new', id]);
  }
  deleteExisting(id) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: false});
    this.dialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete ?';

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listService.deleteEntry(id).subscribe((data: {}) => {
          if (data['status']) {
            this.snackBar.open(data['message'], 'success', {
              duration: 5000,
              panelClass: ['success-snackbar'],
              verticalPosition: 'top'
            });
          } else {
            this.serverError();
          }
          if (this.filterValue === undefined) {
            this.getAllEntries('first');
          } else {
            this.getAllEntries(this.filterValue);
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

  filter() {
    if (this.filterValue === undefined) {
      this.snackBar.open('Please select date', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
      return 0;
    }
    this.getAllEntries(this.filterValue);
  }

  serverError() {
    this.spinnerService.show();
    this.snackBar.open('Server Error', 'Error', {
      duration: 5000,
      panelClass: ['danger-snackbar'],
      verticalPosition: 'top'
    });
  }
  exportToExcel() {
    const pipe = new DatePipe('en-US');
    const localArray = this.dataSource.data.map((row) => {
      return {
        Name: row.Name,
        Email: row.Email,
        Phone: row.Phone,
        ClientType: row.ClientType,
        Purpose: row.ClientType === 'Customer' ? row.TaskID.Name : row.Purpose,
        Modified: pipe.transform(row.Modified, 'dd-MMM-yyyy hh:mm:ss'),
      };
    });
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Entry List',
      useBom: true,
      noDownload: false,
      headers: ['Name', 'Email', 'Contact No', 'Client Type', 'Purpose', 'Entry Time']
    };
    new Angular5Csv(localArray, 'Entry', options);
  }
}

