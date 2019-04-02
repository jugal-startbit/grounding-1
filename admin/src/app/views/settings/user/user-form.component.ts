import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { UserService} from './user.service';
import { Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import { Ng4LoadingSpinnerService} from 'ng4-loading-spinner';

import { BranchService} from '../branch/branch.service';
import { RoleService} from '../role/role.service';
import { DepartmentService} from '../department/department.service';
import { slideToLeft } from '../../../router.animations';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {ConfirmationDialogComponent} from '../../../containers/confirmation-dialog/confirmation-dialog.component';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatDialog, MatDialogRef  } from '@angular/material';

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
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [slideToLeft()],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class UserFormComponent implements OnInit {
  UserForm: FormGroup;
  DepartmentForm: FormGroup;
  userID: String;
  showSpinner: boolean;
  allBranches: any;
  allRoles: any;
  allDepartments: Array<any>;
  allUser: any = [];
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  localStorage: any = {};
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private branchService: BranchService,
    private roleService: RoleService,
    private departmentService: DepartmentService,
    private spinnerService: Ng4LoadingSpinnerService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    this.showSpinner = false;
    this.localStorage = JSON.parse(localStorage.getItem('currentUser'));
    this.userID = this.route.params['value'].id;
    this.UserForm = fb.group({
      Name: [ '', [Validators.required ] ],
      UserName: [ '', [Validators.required ] ],
      Password: [ '', [Validators.required ] ],
      FatherName: [ '', [Validators.required ] ],
      Mothername: [],
      Email: [ '', [Validators.required, Validators.email ] ],
      Mobile: [ '', [Validators.required, Validators.min(1000000000), Validators.max(9999999999)] ],
      DOB: [ '', [Validators.required ] ],
      Gender: [ '', [Validators.required ] ],
      Address: [ '', [Validators.required ] ],
      DepartmentID: [ '', [Validators.required ] ],
      Designation: [ '', [Validators.required ] ],
      RoleID: [ '', [Validators.required ] ],
      BranchID: [ '', [Validators.required ] ],
      Leader: [],
      Document: []
    });
    this.DepartmentForm = fb.group({
      Name: [ '', [Validators.required ] ],
      Description: [ '', [Validators.required ] ],
      BranchID: [ '', [Validators.required ] ]
    });
    if (this.userID !== '-1') {
      this.getOne(this.userID);
    }
    if (this.localStorage.role !== 'Super Admin') {
      this.getAllDepartmentsByID(this.localStorage.Branch._id);
      this.UserForm.patchValue({
        DepartmentID: this.localStorage.Department._id,
        RoleID: '5c37330d05448d3e383f5037',
        BranchID: this.localStorage.Branch._id,
        Leader: this.localStorage.id
      });
      this.UserForm.controls['DepartmentID'].disable();
      this.UserForm.get('RoleID').disable();
      this.UserForm.get('BranchID').disable();
    }
    this.allDepartments = [];
  }

  ngOnInit() {
    this.getAllBranches();
    this.getAllRoles();
  }

  getAllBranches() {
    this.branchService.getAllBranchs().subscribe((data: {}) => {
      this.allBranches = data['result'];
    }, err => {
      this.spinnerService.hide();
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }
  getAllRoles() {
    this.roleService.getAllRoles().subscribe((data: {}) => {
      this.allRoles = data['result'];
    }, err => {
      this.spinnerService.hide();
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }
  getAllDepartmentsByID(selectedID) {
    this.allDepartments = [];
    if (selectedID !== undefined) {
      this.departmentService.getAllDepartmentsByID(selectedID).subscribe((data: {}) => {
        this.allDepartments = data['result'];
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

  onSubmitForm() {
    if (this.UserForm.invalid) {
      return 0;
    }
    this.showSpinner = true;
    if (this.userID === '-1') {
      this.createNew();
    } else {
      this.editExisting();
    }
  }

  createNew() {
    if (this.localStorage.role !== 'Super Admin') {
      this.UserForm.value.DepartmentID = this.UserForm.get('DepartmentID').value;
      this.UserForm.value.BranchID = this.UserForm.get('BranchID').value;
      this.UserForm.value.RoleID = this.UserForm.get('RoleID').value;
    }
    this.userService.addUser(this.UserForm.value).subscribe((data: {}) => {
      if ( data['status']) {
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/settings/user']);
      } else {
        this.showSpinner = false;
        this.snackBar.open(data['message'], 'error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
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

  editExisting() {
    this.userService.updateUser(this.userID, this.UserForm.value).subscribe((data: {}) => {
      if ( data['status']) {
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/settings/user']);
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

  getOne(id) {
    this.spinnerService.show();
    this.userService.getOneUser(id).subscribe((data: {}) => {
      if ( data['status']) {
        this.getAllDepartmentsByID(data['result'].BranchID);
        this.UserForm = this.fb.group({
          Name: [ {value: data['result'].Name, disabled: true}, [Validators.required ] ],
          UserName: [ data['result'].UserName, [Validators.required ] ],
          Password: [ {value: data['result'].Password, disabled: true}, [Validators.required ] ],
          FatherName: [ data['result'].FatherName, [Validators.required ] ],
          Mothername: [ data['result'].Mothername ],
          Email: [ data['result'].Email, [Validators.required, Validators.email ] ],
          Mobile: [ data['result'].Mobile, [Validators.required,  Validators.min(1000000000), Validators.max(9999999999)] ],
          DOB: [ data['result'].DOB, [Validators.required ] ],
          Gender: [ data['result'].Gender, [Validators.required ] ],
          Address: [ data['result'].Address, [Validators.required ] ],
          DepartmentID: [ data['result'].DepartmentID, [Validators.required ] ],
          Designation: [ data['result'].Designation, [Validators.required ] ],
          RoleID: [ data['result'].RoleID, [Validators.required ] ],
          BranchID: [ data['result'].BranchID, [Validators.required ] ],
          Document: [ data['result'].Document ]
        });
      }
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

  cancel() {
    this.showSpinner = true;
    this.router.navigate(['/settings/user']);
  }
  reset() {
    this.UserForm.reset();
  }

  getAllUserByRoleAndDepartment() {
    if (!(this.UserForm.get('DepartmentID').value)) {
      return 0;
    }
    this.userService.getAllUserByRoleAndDepartment(this.UserForm.get('DepartmentID').value).subscribe((data) => {
      if (data['status']) {
        this.allUser = data['result'];
      }
    });
  }

  onSaveDepartment() {
    this.departmentService.addDepartment(this.DepartmentForm.value).subscribe((data: {}) => {
      if ( data['status']) {
        this.getAllDepartmentsByID(this.UserForm.get('BranchID').value);
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/settings/department']);
      }
    }, err => {
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  createDepartment(){
    const dialogRef = this.dialog.open(CreateDepartmentComponent,{ width: '70%'});

    dialogRef.afterClosed().subscribe(result => {
      this.getAllDepartmentsByID(this.UserForm.get('BranchID').value);

    });
  }

}

@Component({
  templateUrl: './createDepartment.html',
  styleUrls: ['./user.component.scss']
})
export class CreateDepartmentComponent {

  SearchPerson: FormGroup;
  DepartmentForm: any;
  allBranches: any = [];
  showSpinner: boolean;
  constructor(
    public dialogRef: MatDialogRef<CreateDepartmentComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private branchService: BranchService,
    private departmentService : DepartmentService

  ) {
    this.DepartmentForm = fb.group({
      Name: [ '', [Validators.required ] ],
      Description: [ '', [Validators.required ] ],
      BranchID: [ '', [Validators.required ] ]
    });
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

  create(){
    this.departmentService.addDepartment(this.DepartmentForm.value).subscribe((data: {}) => {
      if ( data['status']) {
        this.dialogRef.close();
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
      }
    }, err => {
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }



}
