import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import { ClientService} from './client.service';
import { Router} from '@angular/router';

import { MatDialog, MatDialogRef  } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../containers/confirmation-dialog/confirmation-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {MatSnackBar} from '@angular/material';
import { slideToLeft } from '../../../router.animations';
import { WorkExistingService} from '../../manager/workExisting/workExisting.service';
import { Angular5Csv} from 'angular5-csv/dist/Angular5-csv';
import { DatePipe} from '@angular/common';

export interface UserData {
  _id: string;
  Name: string;
  FatherName: string;
  Email: string;
  Phone: number;
  DOB: string;
  Gender: string;
  Address: string;
  NOF: string;
  Action: string;
}
let selectedClient: any = {};

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  animations: [slideToLeft()]
})
export class ClientComponent implements OnInit {
  displayedColumns: string[] = ['UID', 'Name', 'Email', 'Phone', 'DOB', 'Type', 'Address', 'Action'];
  dataSource: MatTableDataSource<UserData>;
  isLoadingResults: any;
  isRateLimitReached: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  Clients: any = [];
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  showSpinner: boolean;
  constructor(
    private clientService: ClientService,
    private router: Router,
    public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService,
    private snackBar: MatSnackBar
  ) {this.showSpinner = false; }

  ngOnInit() {
    this.getAllClients();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAllClients() {
    this.spinnerService.show();
    this.Clients = [];
    this.clientService.getAllClients().subscribe((data: {}) => {
      this.dataSource = new MatTableDataSource(data['result']);
      this.Clients = data['result'];
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
    this.router.navigate(['/managers/new']);
  }
  editExisting(id) {
    this.router.navigate(['/settings/clientForm', id]);
  }
  deleteExisting(id) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: false});
    this.dialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete ?';

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerService.show();
        this.clientService.deleteClient(id).subscribe((data: {}) => {
          if (data['status']) {
            this.snackBar.open(data['message'], 'success', {
              duration: 5000,
              panelClass: ['success-snackbar'],
              verticalPosition: 'top'
            });
          } else {
            this.serverError();
          }
          this.getAllClients();
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
  showFirm (row) {
    selectedClient = row;
    const dialogRef = this.dialog.open(ShowDialogComponent,{ width: '70%'});

    dialogRef.afterClosed().subscribe(result => {
      this.getAllClients();
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
  exportToExcel() {
    const pipe = new DatePipe('en-US');
    const localArray = this.Clients.map((row) => {
      return {
        CID: row.CID,
        Type: row.Type,
        Name: row.Name,
        MobileNo: row.Phone,
        DOB: row.DOB ? pipe.transform(row.DOB, 'dd-MMM-yyyy') : pipe.transform(row.RegistrationDate, 'dd-MMM-yyyy'),
        Address: row.Address ? row.Address : row.PermanentAddress
      };
    });
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Clients List',
      useBom: true,
      noDownload: false,
      headers: ['CID', 'Type', 'Name', 'Mobile No', 'Date Of Birth', 'Address']
    };
    new Angular5Csv(localArray, 'client', options);
  }
}


@Component({
  templateUrl: './show-dialog-overview.html',
  styleUrls: ['./client.component.scss']
})
export class ShowDialogComponent {
  clientData: any = {};
  allWorks: any = [];
  constructor(
    public dialogRef: MatDialogRef<ShowDialogComponent>,
    private workExistingService: WorkExistingService,
    private spinnerService: Ng4LoadingSpinnerService,
    private snackBar: MatSnackBar
  ) {
    this.clientData = selectedClient;
    this.getAllWorkByClient();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  getAllWorkByClient() {
    this.workExistingService.getAllWorkByClient(this.clientData._id).subscribe((data) => {
      if (data['status']) {
        this.allWorks = data['result'];
      }
    });
  }
}


