import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import { MainTaskService} from './mainTask.service';
import { Router} from '@angular/router';

import { MatDialog, MatDialogRef  } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../containers/confirmation-dialog/confirmation-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {MatSnackBar} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

let selectedID: string;
export interface UserData {
  _id: string;
  Name: string;
  Description: string;
  Days: string;
  Cost: string;
  DepartmentName: string;
}

@Component({
  selector: 'app-maintask',
  templateUrl: './mainTask.component.html',
  styleUrls: ['./mainTask.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class MainTaskComponent implements OnInit {
  displayedColumns: string[] = ['Symbol' , 'Name', 'Description', 'Days', 'Cost', 'DepartmentName', 'Action'];
  displayedColumnsParent: string[] = ['Name', 'Description', 'Days', 'Cost', 'DepartmentName', 'Action'];
  displayedColumnsChild: string[] = ['Name', 'ParentTaskName', 'Description', 'Days', 'Cost', 'DepartmentName', 'Action'];
  dataSource: MatTableDataSource<UserData>;
  dataSourceParent: MatTableDataSource<UserData>;
  dataSourceChild: MatTableDataSource<UserData>;
  isLoadingResults: any;
  isRateLimitReached: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatorParent: MatPaginator;
  @ViewChild(MatPaginator) paginatorChild: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSort) sortParent: MatSort;
  @ViewChild(MatSort) sortChild: MatSort;
  MainTasks: any = [];
  MainTasksParent: any = [];
  expandedElement: any =  this.MainTasks;
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  showSpinner: boolean;
  constructor(
    private mainTaskService: MainTaskService,
    private router: Router,
    public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService,
    private snackBar: MatSnackBar
  ) {this.showSpinner = false; }

  ngOnInit() {
    this.getAllMainTasks();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  view(id){
     selectedID = id;
    const dialogRef = this.dialog.open(ViewDialogComponent,{ width: '50%'});

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  getAllMainTasks() {
    this.spinnerService.show();
    this.MainTasks = [];
    this.mainTaskService.getAllByTask().subscribe((data: {}) => {
      if (data['status']) {
        this.dataSource = new MatTableDataSource(data['result']);
        this.MainTasks = data['result'];
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
    this.router.navigate(['/settings/TaskForm', id]);
  }
  editExisting(id) {
    this.router.navigate(['/settings/TaskForm', id]);
  }
  deleteExisting(id) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: false});
    this.dialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete ?';

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinnerService.show();
        this.mainTaskService.deleteMainTask(id).subscribe((data: {}) => {
          if (data['status']) {
            this.snackBar.open(data['message'], 'success', {
              duration: 5000,
              panelClass: ['success-snackbar'],
              verticalPosition: 'top'
            });
          } else {
            this.serverError();
          }
          this.getAllMainTasks();
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
    this.spinnerService.hide();
    this.snackBar.open('Server Error', 'Error', {
      duration: 5000,
      panelClass: ['danger-snackbar'],
      verticalPosition: 'top'
    });
  }
}

@Component({
  templateUrl: './view-overview.html',
  styleUrls:  ['./mainTask.component.scss']
})
export class ViewDialogComponent {
  Task: any = {};
  constructor(
    public dialogRef: MatDialogRef<ViewDialogComponent>,
    private mainTaskService: MainTaskService,
    private route: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private snackBar: MatSnackBar
  ) {
    this.Task.Name = '';
    this.Task.Description = '';
    this.Task.Cost = '';
    this.Task.Days = '';
    this.Task.DepartmentID = '';
    this.Task.SubTask = [];
    setTimeout(() => {
      this.getTaskByID(selectedID);
    } , 200);

  }
  printPage() {
    const printContent = document.getElementById("TaskPrint");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  getTaskByID(id) {
    this.spinnerService.show();
    this.mainTaskService.getOneTaskByID(id).subscribe((data: {}) => {
      this.Task = data['result'];
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

