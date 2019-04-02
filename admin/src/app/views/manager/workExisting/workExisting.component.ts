import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { WorkExistingService} from './workExisting.service';
import { Router} from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {MatSnackBar} from '@angular/material';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { MatDialog, MatDialogRef  } from '@angular/material';
import { slideToLeft } from '../../../router.animations';
import { ConfirmationDialogComponent} from '../../../containers/confirmation-dialog/confirmation-dialog.component';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { DepartmentService} from '../../settings/department/department.service';
import { BranchService} from '../../settings/branch/branch.service';
import { UserService} from '../../settings/user/user.service';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { AuthenticationService} from '../../../containers/_services/authentication.service';

export interface WorkExistingData {
  TaskName: string;
  SpecialNote: string;
  Cost: string;
  Time: string;
}
export let refrenceArray: any = {};
@Component({
  selector: 'app-work-assigment',
  templateUrl: './workExisting.component.html',
  styleUrls: ['./workExisting.component.scss'],
  animations: [
    slideToLeft(),
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class WorkExistingComponent implements OnInit {
  WorkExistingForm: FormGroup;
  showSpinner: boolean;
  maxDate = new Date();
  displayedColumns: string[] = ['Symbol', 'Client', 'TaskName', 'Employee', 'SpecialNote', 'Cost', 'Time', 'Action'];
  dataSource: MatTableDataSource<WorkExistingData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currentUser: any = {};
  allBranches: any = [];
  allDepartments: any = [];
  allWorks: any = [];
  allEmployees: any = [];
  allEmployeesWithoutOld: any = [];
  WorkType = 'Existing';
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  selectedEmployee: any = {};
  oldEmployee: any = {};
  previousSelectedEmployee: any = {};
  reassignmentReason: any;
  newEmployeeID: any;
  clientWorkArray: any = [];
  selectedWork: any = {};
  filteredOptions: Observable<any[]>;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private workExistingService: WorkExistingService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private branchService: BranchService,
    private departmentService: DepartmentService,
    private userService: UserService,
    public authenticationService: AuthenticationService
  ) {
    setTimeout(() => {
      this.authenticationService.checkSelectedComponentVisiblity('Reassign work');
    }, 100);
    this.showSpinner = false;
    this.WorkExistingForm = fb.group({
      BranchID: ['' , [Validators.required]],
      DepartmentID: ['', [Validators.required] ],
      WorkName: [ {value: '', disabled: true},  [Validators.required]],
      WorkID: [ '' , [Validators.required ] ],
      ChildTask: new FormControl(null),
      SpecialNote: [''],
      TaskID: [],
      Cost: [{value: '', disabled: true}],
      CostNote: [],
      Time: [{value: '', disabled: true}],
      TimeNote: [],
      ClientID: [],
      OldEmployeeID: [],
      NewEmployeeID: [],
      OldWorkID: [],
      ReassignmentReason: [],
      StatusID: 1,
      Is_Repetitive : [false],
      LastDate : [{value: '', disabled: true}],
      Occurrence : [{value: '', disabled: true}],
      GracePeriod : [{value: '', disabled: true}],
      Priority: ['']
    });
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getAllBranches();
    if (this.currentUser.role !== 'Super Admin') {
      this.getAllDepartmentByBranchs(this.currentUser.Branch._id);
      this.getAllEmployeesByLeader(this.currentUser.id);
      this.WorkExistingForm.patchValue({
        BranchID: this.currentUser.Branch._id,
        DepartmentID: this.currentUser.Department._id,
      });
    }
  }
  setAutoComplete() {
    this.filteredOptions = this.WorkExistingForm
      .get('WorkName')
      .valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
  private _filter(val: string) {
    const filterValue = val.toLowerCase();
    return this.allWorks.filter(option => option.EmployeeID.Name.toLowerCase().includes(filterValue));
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
  getAllWorksByEmployee(selectedEmployeeID) {
    this.workExistingService.getAllWorkByEmployee(selectedEmployeeID).subscribe((data: {}) => {
      if (data['status']) {
        this.allWorks = data['result'];
        this.setAutoComplete();
        if (this.allWorks.length === 0) {
          this.WorkExistingForm.patchValue({
            'WorkName': '',
            'WorkID': ''
          });
          this.WorkExistingForm.get('WorkName').disable();
        } else {
          this.WorkExistingForm.get('WorkName').enable();
        }
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

  getAllEmployeesByLeader(selectedLeaderID) {
    // if(this.currentUser.role == '')
    this.userService.getAllUserByLeader(selectedLeaderID).subscribe((data: {}) => {
      if (data['status']) {
        this.allEmployees = data['result'];
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

  getAllEmployees(selectedDepartmentID) {
    this.userService.getAllUserByDepartment(selectedDepartmentID).subscribe((data: {}) => {
      if (data['status']) {
        this.allEmployees = data['result'].map((row) => {
          return row;
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

  onBranchChange(selectedBranchID) {
    if (!selectedBranchID) {
      return 0;
    }
    this.getAllDepartmentByBranchs(selectedBranchID);
  }
  onDepartmentChange(selectedDepartmentID) {
    if (!selectedDepartmentID) {
      return 0;
    }
    this.getAllEmployees(selectedDepartmentID);
  }
  onWorkChange(WorkName) {
    if (!WorkName) {
      return 0;
    }
    const selectedWorkName = this.WorkExistingForm.get('WorkName').value;
    const index = this.allWorks.findIndex(x => x.TaskID.Name === selectedWorkName);
    this.oldEmployee = this.allWorks[index].EmployeeID;
    this.selectedWork = this.allWorks[index];
    this.WorkExistingForm.patchValue({
      WorkID: this.allWorks[index]._id,
      ChildTask: this.allWorks[index].ChildTask,
      SpecialNote: this.allWorks[index].SpecialNote,
      TaskID: this.allWorks[index].TaskID._id,
      Cost: this.allWorks[index].Cost,
      CostNote: this.allWorks[index].CostNote,
      Time: this.allWorks[index].Time,
      TimeNote: this.allWorks[index].TimeNote,
      ClientID: this.allWorks[index].ClientID._id,
      OldEmployeeID: this.allWorks[index].EmployeeID._id,
      Is_Repetitive : this.allWorks[index].Is_Repetitive,
      LastDate : this.allWorks[index].LastDate,
      Occurrence : this.allWorks[index].Occurrence,
      GracePeriod : this.allWorks[index].GracePeriod,
      Priority : this.allWorks[index].Priority,
    });
  }
  onChangeEmployee() {
    const selectedEmployeeID = this.WorkExistingForm.get('NewEmployeeID').value;
    const index = this.allEmployees.findIndex(x => x._id === selectedEmployeeID);
    this.selectedEmployee = this.allEmployees[index];
  }
  onChangeOldEmployee(selectedEmployeeID) {
    if (!selectedEmployeeID) {
      this.allWorks = [];
      return 0;
    }
    this.allEmployeesWithoutOld = this.allEmployees.filter(x => x._id !== selectedEmployeeID);
    this.getAllWorksByEmployee(selectedEmployeeID);
  }
  onSubmitForm() {
    this.WorkExistingForm.value.Cost = this.WorkExistingForm.get('Cost').value;
    this.WorkExistingForm.value.Time = this.WorkExistingForm.get('Time').value;
    this.workExistingService.addClientWork(this.WorkExistingForm.value).subscribe((data) => {
      if (data['status']) {
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/employees/workList']);
      }
    });
  }
}
