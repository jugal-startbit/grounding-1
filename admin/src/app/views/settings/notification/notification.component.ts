import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router} from '@angular/router';

import { CompanyService} from '../company/company.service';
import {MatSnackBar} from '@angular/material';
import { slideToLeft } from '../../../router.animations';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {BranchService} from '../branch/branch.service';
import {DepartmentService} from '../department/department.service';
import {UserService} from '../user/user.service';
import {FormControl} from '@angular/forms';
import {NotificationService} from './notification.service';

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
  selector: 'notification',
  templateUrl: './notification.html',
  styleUrls: ['./notification.component.scss'],
  animations: [slideToLeft()],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class NotificationComponent implements OnInit {

  showSpinner: boolean;
  whomType = 'All';
  localStorage: any;
  allBranches: any;
  allDepartments: any;
  allUsers: any;
  BranchID :any;
  DepartmentID :any;
  Message :any;
  Priority :any;
  NotificationArray :any;
  selectedWhomArray = new FormControl();
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private companyService: CompanyService,
    private branchService: BranchService,
    private departmentService: DepartmentService,
    private notificationService: NotificationService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.localStorage = JSON.parse(localStorage.getItem('currentUser'));
    let role = 0;
    let department = 0;
    if (this.localStorage.role === 'Super Admin') {

    } else if (this.localStorage.role === 'Admin') {
      this.getAllDepartmentsByID(this.localStorage.Branch._id)
    } else if (this.localStorage.role === 'Manager') {
      department = this.localStorage.Department._id;
      this.getAllUserByDepartmentID(this.localStorage.Department._id)
    } else {
      role = this.localStorage.id;
      department = this.localStorage.Department._id;
    }
  }
  ngOnInit() {
    this.getAllBranches();
  }

  getAllBranches() {
    this.branchService.getAllBranchs().subscribe((data: {}) => {
      this.allBranches = data['result'];
    }, err => {
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  getAllDepartmentsByID(selectedID) {
    // console.log(selectedID);
    this.allDepartments = [];
    this.allUsers = [];
    if (selectedID !== undefined) {
      this.departmentService.getAllDepartmentsByID(selectedID).subscribe((data: {}) => {
        this.allDepartments = data['result'];
      }, err => {
        this.snackBar.open('Server Error', 'Error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
          verticalPosition: 'top'
        });
      });
    }
  }

  getAllUserByDepartmentID(id) {
    this.allUsers = [];
    if (id !== undefined) {
      this.userService.getAllUserByDepartmentWithLeader(id).subscribe((data: {}) => {
        this.allUsers = data['result'];
      }, err => {
        this.snackBar.open('Server Error', 'Error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
          verticalPosition: 'top'
        });
      });
    }
  }

  onChangeWhomType() {
    this.BranchID = '';
    this.DepartmentID = '';
    this.allDepartments = [];
    this.allUsers = [];
    this.selectedWhomArray = new FormControl();
  }

  saveNotification() {
    if (this.whomType === 'Branch') {
      if (this.selectedWhomArray.value === null || this.selectedWhomArray.value.length === 0) {
        this.snackBar.open('Please select Branch', 'Error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
          verticalPosition: 'top'
        });
        return 0;
      }
    }
    if (this.whomType === 'Department'){
      if (this.selectedWhomArray.value === null || this.selectedWhomArray.value.length === 0){
        this.snackBar.open('Please select Department', 'Error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
          verticalPosition: 'top'
        });
        return 0;
      }
    }
    if (this.whomType === 'Employee') {
      if (this.selectedWhomArray.value === null || this.selectedWhomArray.value.length === 0) {
        this.snackBar.open('Please select Employee', 'Error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
          verticalPosition: 'top'
        });
        return 0;
      }
    }
    if (this.Priority === undefined || this.Priority === '') {
      this.snackBar.open('Please select priority type', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
      return 0;
    }
    if (this.Message === undefined || this.Message === '' ) {
      this.snackBar.open('Please fill message field.', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
      return 0;
    }
    this.NotificationArray = {
      "WhomType": this.whomType,
      "Role":this.localStorage.Role,
      "Branch":this.localStorage.Branch._id,
      "SelectedWhomArray" : this.selectedWhomArray.value,
      "Sender":this.localStorage.id,
      "Message" : this.Message,
      "Priority": this.Priority
    }
    this.notificationService.addNotification(this.NotificationArray).subscribe((data: {}) => {
      // console.log(data['result']);
      this.router.navigate(['/dashboard']);
      this.snackBar.open('Notification send successfully', 'success', {
        duration: 5000,
        panelClass: ['success-snackbar'],
        verticalPosition: 'top'
      });
    }, err => {
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }
}
