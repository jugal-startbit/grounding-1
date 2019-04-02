import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CompanyService} from './company.service';
import { Router} from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {MatSnackBar} from '@angular/material';
import { slideToLeft } from '../../../router.animations';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company.component.scss'],
  animations: [slideToLeft()]
})
export class CompanyFormComponent implements OnInit {
  CompanyForm: FormGroup;
  companyID: String;
  showSpinner: boolean;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private snackBar: MatSnackBar
  ) {
    this.showSpinner = false;
    this.companyID = this.route.params['value'].id;
    this.CompanyForm = fb.group({
      Name: [ '', [Validators.required ] ],
      Email: [ '', [Validators.required, Validators.email ] ],
      Phone: [ '', [Validators.required, Validators.min(1000000000), Validators.max(9999999999)] ],
      Address: [''],
      WebSite: [''],
      HeaderLine: [],
      CopyRights: [],
      Lang: [],
      Lat: [],
      Logo: []
    });
    if (this.companyID !== '-1') {
      this.getOne(this.companyID);
    }
  }

  ngOnInit() {
  }

  onSubmitForm() {
    if (this.CompanyForm.invalid) {
      return 0;
    }
    this.showSpinner = true;
    if (this.companyID === '-1') {
      this.createNew();
    } else {
      this.editExisting();
    }
  }

  createNew() {
    this.companyService.addCompany(this.CompanyForm.value).subscribe((data: {}) => {
      if ( data['status']) {
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/settings/company']);
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
    this.companyService.updateCompany(this.companyID, this.CompanyForm.value).subscribe((data: {}) => {
      if ( data['status']) {
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/settings/company']);
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
    this.companyService.getOneCompany(id).subscribe((data: {}) => {
      if ( data['status']) {
        this.CompanyForm = this.fb.group({
          Name: [ {value: data['result'].Name, disabled: true}, [Validators.required ] ],
          Email: [ data['result'].Email, [Validators.required, Validators.email ] ],
          Phone: [ data['result'].Phone, [Validators.required, Validators.min(1000000000), Validators.max(9999999999)] ],
          Address: [data['result'].Address],
          WebSite: [data['result'].WebSite],
          HeaderLine: [data['result'].HeaderLine],
          CopyRights: [data['result'].CopyRights],
          Lang: [data['result'].Lang],
          Lat: [data['result'].Lat],
          Logo: [data['result'].Logo]
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
    this.router.navigate(['/settings/company']);
  }
  reset() {
    this.CompanyForm.reset();
  }

}
