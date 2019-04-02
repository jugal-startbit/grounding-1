import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { RoleService} from './role.service';
import { Router} from '@angular/router';

import { CompanyService} from '../company/company.service';
import {MatSnackBar} from '@angular/material';
import { slideToLeft } from '../../../router.animations';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role.component.scss'],
  animations: [slideToLeft()]
})
export class RoleFormComponent implements OnInit {
  RoleForm: FormGroup;
  roleID: String;
  showSpinner: boolean;
  allCompanies: any;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private roleService: RoleService,
    private router: Router,
    private companyService: CompanyService,
    private snackBar: MatSnackBar
  ) {
    this.showSpinner = false;
    this.roleID = this.route.params['value'].id;
    this.RoleForm = fb.group({
      Name: [ '', [Validators.required ] ],
      Description: [ '', [Validators.required ] ]
    });
    if (this.roleID !== '-1') {
      this.getOne(this.roleID);
    }
  }

  ngOnInit() {
    this.getAllCompanies();
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

  onSubmitForm() {
    if (this.RoleForm.invalid) {
      return 0;
    }
    this.showSpinner = true;
    if (this.roleID === '-1') {
      this.createNew();
    } else {
      this.editExisting();
    }
  }

  createNew() {
    this.roleService.addRole(this.RoleForm.value).subscribe((data: {}) => {
      if ( data['status']) {
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/settings/role']);
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
    this.roleService.updateRole(this.roleID, this.RoleForm.value).subscribe((data: {}) => {
      if ( data['status']) {
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/settings/role']);
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
    this.roleService.getOneRole(id).subscribe((data: {}) => {
      if ( data['status']) {
        this.RoleForm = this.fb.group({
          Name: [ {value: data['result'].Name, disabled: true}, [Validators.required ] ],
          Description: [ data['result'].Description, [Validators.required ] ]
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
    this.router.navigate(['/settings/role']);
  }
  reset() {
    this.RoleForm.reset();
  }

}
