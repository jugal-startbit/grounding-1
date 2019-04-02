import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import { BranchService} from './branch.service';
import { Router} from '@angular/router';

import { MatDialog, MatDialogRef  } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../containers/confirmation-dialog/confirmation-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {MatSnackBar} from '@angular/material';
import { slideToLeft } from '../../../router.animations';

export interface UserData {
  _id: string;
  Name: string;
  Email: string;
  Phone: string;
  WebSite: string;
}

let selectedID: string;
@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
  animations: [slideToLeft()]
})
export class BranchComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Email', 'Phone', 'WebSite', 'CompanyName', 'Action'];
  dataSource: MatTableDataSource<UserData>;
  isLoadingResults: any;
  isRateLimitReached: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  Branchs: any = [];
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  showSpinner: boolean;
  constructor(
    private branchService: BranchService,
    private router: Router,
    public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService,
    private snackBar: MatSnackBar
  ) {this.showSpinner = false; }

  ngOnInit() {
    this.getAllBranchs();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAllBranchs() {
    this.spinnerService.show();
    this.Branchs = [];
    this.branchService.getAllBranchs().subscribe((data: {}) => {
      if (data['status']) {
        this.dataSource = new MatTableDataSource(data['result']);
        this.Branchs = data['result'];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinnerService.hide();
      } else {
        this.serverError();
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
    this.router.navigate(['/settings/branchForm', id]);
  }
  editExisting(id) {
    this.router.navigate(['/settings/branchForm', id]);
  }
  deleteExisting(id) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: false});
    this.dialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete ?';

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerService.show();
        this.branchService.deleteBranch(id).subscribe((data: {}) => {
          if (data['status']) {
            this.snackBar.open(data['message'], 'success', {
              duration: 5000,
              panelClass: ['success-snackbar'],
              verticalPosition: 'top'
            });
          } else {
            this.serverError();
          }
          this.getAllBranchs();
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
  showFirm (id) {
    selectedID = id;
    const dialogRef = this.dialog.open(ShowDepartmentBranchComponent,{ width: '30%'});

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  serverError() {
    this.spinnerService.hide();
    this.snackBar.open('Server Error', 'Error', {
      duration: 5000,
      panelClass: ['danger-snackbar'],
      verticalPosition: 'top'
    });
  }
}



@Component({
  templateUrl: './show-department-branch.html',
  styleUrls: ['./branch.component.scss']
})
export class ShowDepartmentBranchComponent {
  allDepartments: any;
  constructor(
    public dialogRef: MatDialogRef<ShowDepartmentBranchComponent>,
    private branchService: BranchService,
    private route: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private snackBar: MatSnackBar
  ) {
    this.getAllDepartments(selectedID);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  getAllDepartments(id) {
    this.spinnerService.show();
    this.branchService.getOneBranch(id).subscribe((data: {}) => {
      this.allDepartments = data['result'].Department;
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

}
