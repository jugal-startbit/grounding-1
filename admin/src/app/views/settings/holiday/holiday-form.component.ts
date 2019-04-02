import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HolidayService} from './holiday.service';
import { Router} from '@angular/router';

import { CompanyService} from '../company/company.service';
import {MatSnackBar} from '@angular/material';
import { slideToLeft } from '../../../router.animations';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

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
  selector: 'app-holiday-form',
  templateUrl: './holiday-form.component.html',
  styleUrls: ['./holiday.component.scss'],
  animations: [slideToLeft()],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class HolidayFormComponent implements OnInit {
  HolidayForm: FormGroup;
  holidayID: String;
  showSpinner: boolean;
  allCompanies: any;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private holidayService: HolidayService,
    private router: Router,
    private companyService: CompanyService,
    private snackBar: MatSnackBar
  ) {
    this.showSpinner = false;
    this.holidayID = this.route.params['value'].id;
    this.HolidayForm = fb.group({
      Name: [ '', [Validators.required ] ],
      Date: [ '', [Validators.required ] ]
    });
    if (this.holidayID !== '-1') {
      this.getOne(this.holidayID);
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
    if (this.HolidayForm.invalid) {
      return 0;
    }
    this.showSpinner = true;
    if (this.holidayID === '-1') {
      this.createNew();
    } else {
      this.editExisting();
    }
  }

  createNew() {
    const dt = new Date(this.HolidayForm.get('Date').value);
    this.HolidayForm.value.Year = dt.getFullYear();
    this.holidayService.addHoliday(this.HolidayForm.value).subscribe((data: {}) => {
      if ( data['status']) {
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/settings/holiday']);
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
    this.holidayService.updateHoliday(this.holidayID, this.HolidayForm.value).subscribe((data: {}) => {
      if ( data['status']) {
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/settings/holiday']);
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
    this.holidayService.getOneHoliday(id).subscribe((data: {}) => {
      if ( data['status']) {
        this.HolidayForm = this.fb.group({
          Name: [ data['result'].Name, [Validators.required ] ],
          Date: [ data['result'].Date, [Validators.required ] ]
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
    this.router.navigate(['/settings/holiday']);
  }
  reset() {
    this.HolidayForm.reset();
  }

}
