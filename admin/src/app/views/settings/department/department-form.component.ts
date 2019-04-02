import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { DepartmentService} from './department.service';
import { Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import { BranchService} from '../branch/branch.service';
import { slideToLeft } from '../../../router.animations';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department.component.scss'],
  animations: [slideToLeft()]
})
export class DepartmentFormComponent implements OnInit {
  DepartmentForm: FormGroup;
  departmentID: String;
  showSpinner: boolean;
  allBranches: any;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private router: Router,
    private branchService: BranchService,
    private snackBar: MatSnackBar
  ) {
    this.showSpinner = false;
    this.departmentID = this.route.params['value'].id;
    this.DepartmentForm = fb.group({
      Name: [ '', [Validators.required ] ],
      Description: [ '', [Validators.required ] ],
      BranchID: [ '', [Validators.required ] ]
    });
    if (this.departmentID !== '-1') {
      this.getOne(this.departmentID);
    }
  }

  ngOnInit() {
    this.getAllBranches();
  }

  getAllBranches () {
    this.branchService.getAllBranchs().subscribe((data: {}) => {
      if (data['status']) {
        this.allBranches = data['result'];
      }
    }, err => {
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }
  onSubmitForm() {
    if (this.DepartmentForm.invalid) {
      return 0;
    }
    this.showSpinner = true;
    if (this.departmentID === '-1') {
      this.createNew();
    } else {
      this.editExisting();
    }
  }

  createNew() {
    this.departmentService.addDepartment(this.DepartmentForm.value).subscribe((data: {}) => {
      if ( data['status']) {
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

  editExisting() {
    this.departmentService.updateDepartment(this.departmentID, this.DepartmentForm.value).subscribe((data: {}) => {
      if ( data['status']) {
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

  getOne(id) {
    this.departmentService.getOneDepartment(id).subscribe((data: {}) => {
      if ( data['status']) {
        this.DepartmentForm = this.fb.group({
          Name: [ {value: data['result'].Name, disabled: true}, [Validators.required ] ],
          Description: [ data['result'].Description, [Validators.required] ],
          BranchID: [ data['result'].BranchID._id, [Validators.required] ],
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

  cancel() {
    this.showSpinner = true;
    this.router.navigate(['/settings/department']);
  }
  reset() {
    this.DepartmentForm.reset();
  }

}
