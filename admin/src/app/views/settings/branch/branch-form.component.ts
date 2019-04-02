import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { BranchService} from './branch.service';
import { Router} from '@angular/router';

import { CompanyService} from '../company/company.service';
import { DepartmentService} from '../department/department.service';
import {MatSnackBar} from '@angular/material';
import { slideToLeft } from '../../../router.animations';

@Component({
  selector: 'app-branch-form',
  templateUrl: './branch-form.component.html',
  styleUrls: ['./branch.component.scss'],
  animations: [slideToLeft()]
})
export class BranchFormComponent implements OnInit {
  BranchForm: FormGroup;
  branchID: String;
  showSpinner: boolean;
  allCompanies: any;
  allDepartments: any;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private branchService: BranchService,
    private router: Router,
    private companyService: CompanyService,
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar
  ) {
    this.showSpinner = false;
    this.branchID = this.route.params['value'].id;
    this.BranchForm = fb.group({
      Name: [ '', [Validators.required ] ],
      Email: [ '', [Validators.required, Validators.email ] ],
      Phone: [ '', [Validators.required, Validators.min(1000000000), Validators.max(9999999999)] ],
      CompanyID: [ '', [Validators.required ] ],
      Address: [''],
      WebSite: [''],
      Department: new FormControl(null),
      Lang: [],
      Lat: []
    });
    if (this.branchID !== '-1') {
      this.getOne(this.branchID);
    }
  }

  ngOnInit() {
    this.getAllCompanies();
    this.getAllDepartments();
  }

  getAllCompanies() {
    this.companyService.getAllCompanies().subscribe((data: {}) => {
      this.allCompanies = data['result'];
    }, err => {
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  getAllDepartments() {
    this.departmentService.getAllDepartments().subscribe((data: {}) => {
      this.allDepartments = data['result'];
    }, err => {
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  onSubmitForm() {
    if (this.BranchForm.invalid) {
      return 0;
    }
    this.showSpinner = true;
    if (this.branchID === '-1') {
      this.createNew();
    } else {
      this.editExisting();
    }
  }

  createNew() {
    this.branchService.addBranch(this.BranchForm.value).subscribe((data: {}) => {
      if ( data['status']) {
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/settings/branch']);
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
    this.branchService.updateBranch(this.branchID, this.BranchForm.value).subscribe((data: {}) => {
      if ( data['status']) {
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/settings/branch']);
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
    this.branchService.getOneBranch(id).subscribe((data: {}) => {
      if ( data['status']) {
        console.log(this.BranchForm);
        this.BranchForm = this.fb.group({
          Name: [ {value: data['result'].Name, disabled: true}, [Validators.required ] ],
          Email: [ data['result'].Email, [Validators.required, Validators.email ] ],
          Phone: [ data['result'].Phone, [Validators.required, Validators.min(1000000000), Validators.max(9999999999)] ],
          CompanyID: [ data['result'].CompanyID, [Validators.required ] ],
          Address: [data['result'].Address],
          WebSite: [data['result'].WebSite],
          Department: [data['result'].Department],
          Lang: [data['result'].Lang],
          Lat: [data['result'].Lat]
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
    this.router.navigate(['/settings/branch']);
  }
  reset() {
    this.BranchForm.reset();
  }

}
