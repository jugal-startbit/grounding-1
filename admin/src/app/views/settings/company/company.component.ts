import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import { CompanyService} from './company.service';
import { Router} from '@angular/router';

import { MatDialog, MatDialogRef  } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../containers/confirmation-dialog/confirmation-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {MatSnackBar} from '@angular/material';
import { AuthenticationService} from '../../../containers/_services/authentication.service';
import { slideToLeft } from '../../../router.animations';

export interface UserData {
  _id: string;
  Name: string;
  Email: string;
  Phone: string;
  WebSite: string;
}

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  animations: [slideToLeft()]
})
export class CompanyComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Email', 'Phone', 'WebSite', 'HeaderLine', 'CopyRights', 'Action'];
  dataSource: MatTableDataSource<UserData>;
  currentUser: any;
  isLoadingResults: any;
  isRateLimitReached: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  Companies: any = [];
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  showSpinner: boolean;
  constructor(
    private companyService: CompanyService,
    private router: Router,
    public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService
  ) {
    this.showSpinner = false;
    this.currentUser = localStorage.getItem('currentUser');
  }

  ngOnInit() {
    this.getAllCompanies();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAllCompanies() {
    this.Companies = [];
    this.spinnerService.show();
    this.companyService.getAllCompanies().subscribe((data: {}) => {
      this.dataSource = new MatTableDataSource(data['result']);
      this.Companies = data['result'];
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
    this.router.navigate(['/settings/companyForm', id]);
  }
  editExisting(id) {
    this.router.navigate(['/settings/companyForm', id]);
  }
  deleteExisting(id) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: false});
    this.dialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete ?';

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.companyService.deleteCompany(id).subscribe((data: {}) => {
          if (data['status']) {
            this.snackBar.open(data['message'], 'success', {
              duration: 5000,
              panelClass: ['success-snackbar'],
              verticalPosition: 'top'
            });
          } else {
            this.serverError();
          }
          this.getAllCompanies();
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

