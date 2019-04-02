import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NewService} from './new.service';
import { Router} from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {MatSnackBar} from '@angular/material';
import { slideToLeft } from '../../../router.animations';
import {DepartmentService} from '../../settings/department/department.service';
import {UserService} from '../../settings/user/user.service';
import { BranchService} from '../../settings/branch/branch.service';
import { AuthenticationService} from '../../../containers/_services/authentication.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
  animations: [slideToLeft()]
})
export class NewComponent implements OnInit {
  EntryForm: FormGroup;
  entryID: String;
  Departments: any = [];
  Users: any = [];
  allBranches: any = [];
  showSpinner: boolean;
  maxDate = new Date();
  currentUser: any;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private entryService: NewService,
    private departmentService: DepartmentService,
    private userService: UserService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private branchService: BranchService
  ) {
    setTimeout(() => {
      this.authenticationService.checkSelectedComponentVisiblity('New Visitor');
    }, 100);
    this.showSpinner = false;
    this.entryID = this.route.params['value'].id;
    this.EntryForm = fb.group({
      Name: ['', [ Validators.required ]],
      Purpose: ['', [ Validators.required ]],
      BranchID: ['', [ Validators.required ]],
      DepartmentID: ['', [ Validators.required ]],
      UserID: ['', [ Validators.required ]],
      Email: ['', [ Validators.required , Validators.email]],
      Phone: [ '', [Validators.required, Validators.min(1000000000), Validators.max(9999999999)] ]
    });
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser.role !== 'Super Admin') {
      this.EntryForm.patchValue({
        BranchID: this.currentUser.Branch._id
      });
      this.getAllDepartments(this.currentUser.Branch._id);
    }
  }

  ngOnInit() {
    if (this.entryID !== '-1') {
      this.getOne(this.entryID);
    }
    this.getAllBranches();
  }

  onSubmitForm() {
    if (this.EntryForm.invalid) {
      return 0;
    }
    // this.showSpinner = true;
    if (this.entryID === '-1') {
        this.createNew();
    } else {
      this.editExisting();
    }
  }
  getAllBranches() {
    this.spinnerService.show();
    this.branchService.getAllBranchs().subscribe((data: {}) => {
      this.allBranches = data['result'];
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
  getAllUsers(selectedDepartmentID) {
    this.spinnerService.show();
    this.Users = [];
    this.userService.getAllUserByDepartment(selectedDepartmentID).subscribe((data: {}) => {
      this.Users = data['result'];
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
  getAllDepartments(selectedBranchID) {
    this.spinnerService.show();
    this.Departments = [];
    this.departmentService.getAllDepartmentsByID(selectedBranchID).subscribe((data: {}) => {
      this.Departments = data['result'];
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
  onBranchChange() {
    if (!(this.EntryForm.get('BranchID').value)) {
      return 0;
    }
    this.getAllDepartments(this.EntryForm.get('BranchID').value);
  }
  onDepartmentChange() {
    if (!(this.EntryForm.get('DepartmentID').value)) {
      return 0;
    }
    this.getAllUsers(this.EntryForm.get('DepartmentID').value);
  }
  createNew() {
    this.entryService.addEntry(this.EntryForm.value).subscribe((data: {}) => {
      if ( data['status']) {
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/deos/list']);
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
    this.entryService.updateEntry(this.entryID, this.EntryForm.value).subscribe((data: {}) => {
      if ( data['status']) {
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/deos/list']);
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
    this.entryService.getOneEntry(id).subscribe((data: {}) => {
      if ( data['status']) {
        const dt = data['result'].DOB;
        this.EntryForm = this.fb.group({
          Name: [ {value: data['result'].Name, disabled: true}, [Validators.required ] ],
          Email: [ data['result'].Email, [Validators.required, Validators.email ] ],
          Phone: [ data['result'].Phone, [Validators.required, Validators.min(1000000000), Validators.max(9999999999)] ],
          DepartmentID: [ data['result'].DepartmentID, [Validators.required ] ],
          UserID: [ data['result'].UserID, [Validators.required ] ],
          Purpose: [ data['result'].Purpose, [Validators.required ] ],
          DOB: [new Date(dt)]
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
    this.router.navigate(['/deos/list']);
  }
  reset() {
    this.EntryForm.reset();
  }

}
