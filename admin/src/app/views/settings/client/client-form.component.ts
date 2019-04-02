import { Component, OnInit, Inject } from '@angular/core';

import { ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ClientService} from './client.service';
import { Router} from '@angular/router';
import { Ng4LoadingSpinnerService} from 'ng4-loading-spinner';

import { CompanyService} from '../company/company.service';
import {MatSnackBar} from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { slideToLeft } from '../../../router.animations';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

const firmArray: Array<any> = [];
let selectedID: string;
let isFirmAdded: boolean;

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
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client.component.scss'],
  animations: [slideToLeft()],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class ClientFormComponent implements OnInit {
  ClientForm: FormGroup;
  clientID: String;
  showSpinner: boolean;
  allCompanies: any;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private companyService: CompanyService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
      this.showSpinner = false;
      this.clientID = this.route.params['value'].id;
      selectedID = this.route.params['value'].id;
      this.ClientForm = fb.group({
      Name: [ '', [Validators.required ] ],
      FatherName: [ '', [Validators.required ] ],
      Mothername: [],
      Email: [ '', [Validators.required, Validators.email ] ],
      Phone: [ '', [Validators.required, Validators.min(1000000000), Validators.max(9999999999)] ],
      AlternateNo: [ '', [Validators.required, Validators.min(1000000000), Validators.max(9999999999)] ],
      DOB: [ '', [Validators.required ] ],
      Gender: [ '', [Validators.required ] ],
      Address: [ '', [Validators.required ] ],
      NOF: [ {value: 0, disabled: true}, [Validators.required ] ],
      Document: []
    });
    if (this.clientID !== '-1') {
      this.getOne(this.clientID);
    }
  }

  ngOnInit() {
    this.getAllCompanies();
    firmArray.length = 0;
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
    if (this.ClientForm.invalid) {
      return 0;
    }
    this.showSpinner = true;
    if (this.clientID === '-1') {
      this.createNew();
    } else {
      this.editExisting();
    }
  }

  createNew() {
    this.clientService.addClient(this.ClientForm.value, firmArray).subscribe((data: {}) => {
      if ( data['status']) {
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/settings/client']);
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
    this.ClientForm['value'].NOF = this.ClientForm.get('NOF').value;
    this.clientService.updateClient(this.clientID, this.ClientForm.value, firmArray).subscribe((data: {}) => {
      if ( data['status']) {
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/settings/client']);
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
    this.clientService.getOneClient(id).subscribe((data: {}) => {
      if ( data['status']) {
        this.ClientForm = this.fb.group({
          Name: [ {value: data['result'].Name, disabled: true}, [Validators.required ] ],
          FatherName: [ data['result'].FatherName, [Validators.required ] ],
          Mothername: [ data['result'].Mothername ],
          Email: [ data['result'].Email, [Validators.required, Validators.email ] ],
          Phone: [ data['result'].Phone, [Validators.required, Validators.min(1000000000), Validators.max(9999999999)] ],
          AlternateNo: [ data['result'].AlternateNo, [Validators.required, Validators.min(1000000000), Validators.max(9999999999)] ],
          DOB: [ data['result'].DOB, [Validators.required ] ],
          Gender: [ data['result'].Gender, [Validators.required ] ],
          Address: [ data['result'].Address, [Validators.required ] ],
          NOF: [ {value: data['result'].NOF, disabled: true} ],
          Document: [ data['result'].Document ]
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
    this.router.navigate(['/settings/client']);
  }
  reset() {
    this.ClientForm.reset();
  }

  addFirm () {
    isFirmAdded = false;
    const dialogRef = this.dialog.open(DialogComponent,{ width: '50%'});

    dialogRef.afterClosed().subscribe(result => {
      if (isFirmAdded) {
        let local = this.ClientForm.get('NOF').value + 1;
        this.ClientForm.patchValue({'NOF': local});
      }
    });
  }
}


@Component({
  templateUrl: './dialog-overview.html',
  styleUrls: ['./client.component.scss']
})
export class DialogComponent {
  ClientFirmForm: FormGroup;
  allClients: any;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    private fb: FormBuilder,
    private clientService: ClientService,
    private snackBar: MatSnackBar
  ) {
    this.ClientFirmForm = this.fb.group({
      Name: ['', Validators.required],
      Address: ['', Validators.required],
      PAN: ['', Validators.required],
      TIN: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmitForm() {
    if (this.ClientFirmForm.invalid) {
      return 0;
    }
    firmArray.push(this.ClientFirmForm.value);
    this.snackBar.open('Successfully added firms', 'success', {
      duration: 5000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top'
    });
    isFirmAdded = true;
    this.dialogRef.close();
  }
}
