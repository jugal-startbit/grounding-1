import { Component, OnInit ,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {MatPaginator, MatSort, MatTableDataSource , MatSnackBar} from '@angular/material';
import {DashboardService} from '../dashboard/dashboard.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {Angular5Csv} from 'angular5-csv/dist/Angular5-csv';

@Component({
  templateUrl: 'aboutusEvents.component.html'
})
export class AboutusEventsComponent implements OnInit {

  localStorage: any;
  Entries: any;
  StudyCode: any;
  UserInitial: any;
  FromDate: Date;
  ToDate: Date;

  displayedColumns: string[] = ['UserInitial' , 'StudyCode' , 'Event' , 'DateTime' , 'Time'];
  dataSource: MatTableDataSource<any>;
  isLoadingResults: any;
  isRateLimitReached: any;
  currentUser: any;
  date: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public router: Router,
    public dashboardService: DashboardService,
    private snackBar: MatSnackBar,
    private spinnerService: Ng4LoadingSpinnerService,

  ) {
    this.localStorage = JSON.parse(localStorage.getItem('currentUser'));

    this.date = new Date();
    // var currentTime = new Date();
    // var currentTimezone = currentTime.getTimezoneOffset();
    // currentTimezone = (currentTimezone/60) * -1;
    // var gmt = 'GMT';
    // if (currentTimezone !== 0) {
    //   gmt += currentTimezone > 0 ? ' +' : ' ';
    //   gmt += currentTimezone;
    // }
  }
  ngOnInit(): void {
    //  -
    this.getAllDashboardEvents();
  }
  ngOnLoad(): void {
    this.getAllDashboardEvents();
  }
  getAllDashboardEvents() {
    this.FromDate = null;
    this.ToDate = null;
    this.StudyCode = null;
    this.UserInitial = null;
    this.dashboardService.getAllAboutUsEvents().subscribe((data: {}) => {
      this.dataSource = new MatTableDataSource(data['Group']);
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
    if(this.FromDate && (this.ToDate == null || this.ToDate == undefined)){
      this.snackBar.open('Please Enter ToDate', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
      return 0;
    }
    if(this.ToDate ){
      if(this.FromDate == null || this.FromDate == undefined){
        this.snackBar.open('Please Enter FromDate', 'Error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
          verticalPosition: 'top'
        });
        return 0;
      }
    }
    if(this.FromDate && this.ToDate){
      if(new Date(this.FromDate) > new Date(this.ToDate)){
        this.snackBar.open('Please Enter FromDate less than ToDate', 'Error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
          verticalPosition: 'top'
        });
        return 0;
      }
    }

    let condition = {
      'FromDate': this.FromDate,
      'ToDate': this.ToDate,
      'StudyCode': this.StudyCode,
      'UserInitial': this.UserInitial,
    }

    this.dashboardService.getAllAboutUsByFilter(condition).subscribe((data: {}) => {
      this.dataSource = new MatTableDataSource(data['Group']);
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


  exportToExcel() {
    console.log(this.dataSource.data)
    const localArray = this.dataSource.data.map((row) => {
      return {
        UserInitial: row._id.UserInitial,
        StudyCode: row._id.StudyCode,
        Event: 'AboutUs',
        Day: row._id.day,
        Time: row.Time,
      };
    });
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'AboutUs',
      useBom: true,
      noDownload: false,
      headers: ['Study Initials', 'Study ID', 'Event', 'Date & Time of Logged', 'Time Spend']  /*, 'Total Cost', 'Paid Amount', 'Due Amount'*/
    };
    new Angular5Csv(localArray, 'AboutUs', options);
  }
}
