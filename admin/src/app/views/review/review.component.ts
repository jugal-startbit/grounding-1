import { Component, OnInit ,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {MatPaginator, MatSort, MatTableDataSource , MatSnackBar} from '@angular/material';
import {DashboardService} from '../dashboard/dashboard.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {Angular5Csv} from 'angular5-csv/dist/Angular5-csv';

@Component({
  templateUrl: 'review.component.html'
})
export class ReviewComponent implements OnInit {

  localStorage: any;
  Entries: any;
  StudyInitials: any;
  StudyID: any;
  FromDate: Date;
  ToDate: Date;

  displayedColumns: string[] = [ 'StudyID' ,'StudyInitials' , 'Rating' ,'GroundingRate', 'RatingComment', 'DateTime'];
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
  }
  ngOnInit(): void {
    //  -
    this.getAllReviews();
  }

  getAllReviews() {
    this.StudyInitials = null;
    this.StudyID = null;
    this.dashboardService.getAllReview().subscribe((data: {}) => {
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

    this.dashboardService.getAllReviewByFilter(condition).subscribe((data: {}) => {
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

  exportToExcel() {
    const localArray = this.dataSource.data.map((row) => {
      return {
        StudyInitials: row.StudyInitials,
        StudyID: row.StudyID,
        Rating: row.Rating,
        GroundingRate:row.GroundingRate,
        RatingComment: row.RatingComment,
        DateTime: row.DateTime,
      };
    });
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Review',
      useBom: true,
      noDownload: false,
      headers: [ 'Study ID', 'Study Initial','Rating','GroundingRate', 'RatingComment', 'Date & Time of Log']  
    };
    new Angular5Csv(localArray, 'Review', options);
  }
}
