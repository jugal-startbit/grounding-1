import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { Router} from '@angular/router';

import { MatDialog, MatDialogRef  } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../containers/confirmation-dialog/confirmation-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {MatSnackBar} from '@angular/material';
import { slideToLeft } from '../../../router.animations';
import { BranchService} from '../branch/branch.service';
import { DepartmentService} from '../department/department.service';
import { UserService} from '../user/user.service';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { LeaderService} from './leader.service';

@Component({
  selector: 'app-role',
  templateUrl: './leader.component.html',
  styleUrls: ['./leader.component.scss'],
  animations: [slideToLeft()]
})
export class LeaderComponent implements OnInit {
  showSpinner: boolean;
  localStorage: any = {};
  allBranches: any = [];
  allDepartments: any = [];
  allLeaders: any = [];
  allEmployees: any = [];
  LeaderForm: FormGroup;
  selectedCheckboxNo = 0;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService,
    private snackBar: MatSnackBar,
    private branchService: BranchService,
    private departmentService: DepartmentService,
    private userService: UserService,
    private fb: FormBuilder,
    private leaderService: LeaderService
  ) {
    this.showSpinner = false;
    this.localStorage = JSON.parse(localStorage.getItem('currentUser'));
    this.LeaderForm = fb.group({
      BranchID: ['', [Validators.required]],
      DepartmentID: ['', [Validators.required]],
      LeaderID: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.getAllBranches();
    if (this.localStorage.role !== 'Super Admin') {
      this.getAllDepartmentByBranchs(this.localStorage.Branch._id);
      this.getAllLeaderBydepartment(this.localStorage.Department._id);
      this.LeaderForm.patchValue({
        BranchID: this.localStorage.Branch._id,
        DepartmentID: this.localStorage.Department._id,
      });
    }
  }
  getAllBranches() {
    this.branchService.getAllBranchs().subscribe((data: {}) => {
      if (data['status']) {
        this.allBranches = data['result'];
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
  getAllDepartmentByBranchs(selectedBranchID) {
    this.departmentService.getAllDepartmentsByID(selectedBranchID).subscribe((data: {}) => {
      if (data['status']) {
        this.allDepartments = data['result'];
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
  getAllLeaderBydepartment(selectedDepartmentID) {
    this.userService.getAllUserByRoleAndDepartment(selectedDepartmentID).subscribe((data: {}) => {
      if (data['status']) {
        this.allLeaders = data['result'];
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
  getAllUserByDepartments(selectedDepartmentID, selectedRoleID) {
    this.userService.getAllUserForLeaderAssign(selectedDepartmentID, selectedRoleID).subscribe((data: {}) => {
      if (data['status']) {
        this.allEmployees = data['result'];
        const selectedLeaderID = this.LeaderForm.get('LeaderID').value;
        const index = this.allLeaders.findIndex(x => x._id === selectedLeaderID);
        this.allEmployees.map((row) => {
          if (row.Leader && row.Leader._id === this.allLeaders[index]._id) {
            row.checked = true;
          }
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
  onChangeBranch(selectedBranchID) {
    this.allEmployees = [];
    this.allLeaders = [];
    this.allDepartments = [];
    this.LeaderForm.patchValue({
      LeaderID: '',
      DepartmentID: ''
    });
    this.getAllDepartmentByBranchs(selectedBranchID);
  }
  onChangeDepartment(selectedDepartmentID) {
    this.allEmployees = [];
    this.allLeaders = [];
    this.LeaderForm.patchValue({
      LeaderID: ''
    });
    this.getAllLeaderBydepartment(selectedDepartmentID);
  }
  onChangeLeader(selectedLeaderID) {
    this.allEmployees = [];
    const index = this.allLeaders.findIndex(x => x._id === selectedLeaderID);
    const role = this.allLeaders[index].RoleID.Name;
    const department = this.LeaderForm.get('DepartmentID').value;
    this.getAllUserByDepartments(department, role);
  }
  valueChangeCheckbox(id, $event) {
    const index = this.allEmployees.findIndex(x => x._id === id);
    this.allEmployees[index].checked = $event.checked;
    this.selectedCheckboxNo = 0;
      this.allEmployees.map((row) => {
        if (row.checked) {
          this.selectedCheckboxNo++;
        }
     });
  }
  onSubmitForm() {
    this.showSpinner = true;
    const LeaderID = this.LeaderForm.get('LeaderID').value;
    this.leaderService.updateSelectedEmployeeLeader(this.allEmployees, LeaderID).subscribe((data: {}) => {
      if (data['status']) {
        this.showSpinner = false;
        this.LeaderForm.reset();
        this.allDepartments = [];
        this.allLeaders = [];
        this.allEmployees = [];
        this.snackBar.open(data['message'], 'Success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
      }
    }, err => {
      this.showSpinner = false;
      this.spinnerService.hide();
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }
}

