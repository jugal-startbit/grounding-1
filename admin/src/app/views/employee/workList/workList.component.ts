import { Component, OnInit, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { MatDialog, MatDialogRef  } from '@angular/material';
import { WorkListService} from './workList.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { ClientService } from '../../settings/client/client.service';
import { UserService } from '../../settings/user/user.service';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {Angular5Csv} from 'angular5-csv/dist/Angular5-csv';
import { DatePipe} from '@angular/common';
import { AuthenticationService} from '../../../containers/_services/authentication.service';

@Component({
  selector: 'app-work-list',
  templateUrl: './workList.component.html',
  styleUrls: ['./workList.component.scss']
})
export class WorkListComponent implements OnInit {
  WorkStatusArray = ['Assign', 'Pending(E)', 'Pending(D)', 'Pending(C)', 'Working', 'Running', 'Overdue', 'Reassign', 'Completed'];
  displayedColumns: string[] = ['TaskName', 'ClientName', 'Time', 'Start', 'DueDate', 'Status', 'Cost', 'PaidAmount', 'DueAmount']; /*  */
  dataSource: MatTableDataSource<any>;
  isLoadingResults: any;
  isRateLimitReached: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  allWorks: any = [];
  selectedWorkArray: any = [];
  allStatus: any = [];
  localStorage: any;
  WorkStatus = new FormControl([1 , 2 , 3 , 4 , 6 , 5]);
  showSpinner: boolean;
  allEmployees: any = [];
  selectedEmployee = new FormControl('0');
  selectedClient = new FormControl('0');
  allClients: any = [];
  viewActive = 'All';
  selectedWork: any = {};
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService,
    public workListService: WorkListService,
    public clientService: ClientService,
    public userService: UserService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService
  ) {
    setTimeout(() => {
      this.authenticationService.checkSelectedComponentVisiblity('Work List');
    }, 100);
    this.localStorage = JSON.parse(localStorage.getItem('currentUser'));
    this.showSpinner = false;
  }

  ngOnInit() {
    this.getAllStatus();
    let role = 0;
    let leader = 0;
    if (this.localStorage.role === 'Super Admin') {
      role = 0;
      leader = 0;
      this.getAllEmployeeByLeader('0');
    } else if (this.localStorage.role === 'Manager') {
      leader = this.localStorage.id;
      this.getAllEmployeeByLeader(this.localStorage.id);
    } else {
      role = this.localStorage.id;
      leader = 0;
    }
    // this.getAllWorks(0, role, leader);
    this.getAllClients();
    this.getAllWorkByFilter();
  }

  getAllClients() {
    this.spinnerService.show();
    this.clientService.getAllClients().subscribe((data) => {
      if (data['status']) {
        this.spinnerService.hide();
        this.allClients = data['result'];
      }
    }, (err) => {
      this.spinnerService.hide();
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  getAllEmployeeByLeader(selectedLeaderID) {
    this.userService.getAllUserByLeader(selectedLeaderID).subscribe((data) => {
      if (data['status']) {
        this.allEmployees = data['result'];
      }
    });
  }

  getAllWorks(status, role, leader) {
    if (status === 'undefined') {
      this.spinnerService.hide();
      return 0;
    }
    this.spinnerService.show();
    this.workListService.getAllWorkByEmployeeLeader(status, role, leader).subscribe((data) => {
        if (data['status']) {
          this.allWorks = data['result'];
          this.selectedWorkArray = data['result'];
          this.dataSource = new MatTableDataSource(this.allWorks);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinnerService.hide();
        }
      });
  }
  getAllStatus() {
    this.workListService.getAllStatus().subscribe((data) => {
      if (data['status']) {
        this.allStatus = data['result'];
      }
    });
  }
  getTotalCost() {
    return this.selectedWorkArray.map(t => t.Cost).reduce((acc, value) => Number(acc) + Number(value), 0);
  }
  getTotalPaid() {
    return this.selectedWorkArray.reduce((summ, v) => summ += Number(v['PaidAmount']), 0);
  }
  getTotalDue() {
    return this.selectedWorkArray.reduce((summ, v) => summ += Number(v['DueAmount']), 0);
  }
  getAllWorkByFilter() {
    const localData = {
      date: this.viewActive,
      status: this.WorkStatus.value,
      client: this.selectedClient.value,
      employee: this.selectedEmployee.value
    };
      this.spinnerService.show();
      this.workListService.getAllWorkByFilter(localData).subscribe((data) => {
        if (data['status']) {
          this.selectedWorkArray = data['result'];
          this.dataSource = new MatTableDataSource(data['result']);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinnerService.hide();
        }
      });
  }
  onReset() {
    this.viewActive = 'All';
    this.WorkStatus = new FormControl([ 1 , 2 , 3 , 4 , 6 , 5]);
    this.selectedEmployee = new FormControl('0');
    this.selectedClient = new FormControl('0');
    this.getAllWorkByFilter();
  }
  onChangeDay(val) {
    this.viewActive = val;
  }
  onClickWork(work) {
    this.selectedWork = {};
    this.selectedWork = work;
    this.router.navigate(['/dashboard/workDetail/' + work._id]);
  }
  exportToExcel() {
    const pipe = new DatePipe('en-US');
    const localArray = this.dataSource.data.map((row) => {
      return {
        WorkName: row.TaskID.Name,
        ClientName: row.ClientID.Name,
        Time: row.Time,
        StartDate: pipe.transform(row.StartDate, 'dd-MMM-yyyy'),
        DueDate: pipe.transform(row.Modified, 'dd-MMM-yyyy'),
        Status: this.WorkStatusArray[row.StatusID],
        // Total: row.Cost,
        // PaidAmount: row.PaidAmount,
        // DueAmount: row.DueAmount,
      };
    });
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Work List',
      useBom: true,
      noDownload: false,
      headers: ['Work Name', 'Client Name', 'Time(days)', 'Start Date', 'Due Date', 'Status']  /*, 'Total Cost', 'Paid Amount', 'Due Amount'*/
    };
    new Angular5Csv(localArray, 'Work List', options);
  }
  getStatusName(status) {
    if (this.allStatus.length > 0) {
      const index = this.allStatus.findIndex(x => x.StatusID === status);
      return this.allStatus[index].Name;
    } else {
      return '';
    }
  }
}

