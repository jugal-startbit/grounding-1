import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { FirmService} from './firm.service';
import { Router} from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {MatSnackBar} from '@angular/material';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { MatDialog, MatDialogRef  } from '@angular/material';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { ConfirmationDialogComponent} from '../../../containers/confirmation-dialog/confirmation-dialog.component';
import { DocumentService} from '../../settings/document/document.service';
import { slideToLeft } from '../../../router.animations';
import {formatDate} from '@angular/common';
import { AuthenticationService} from '../../../containers/_services/authentication.service';

export interface KeyPersonData {
  Name: string;
  FatherName: string;
  Email: string;
  Phone: string;
  DOB: string;
  Gender: string;
  RegistrationDate: string;
  PermanentAddress: string;
  CorrespondingAddress: string;
}
export interface DocumentData {
  Name: string;
  Number: string;
  ExpiryDate: string;
}
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
const keyPerson: Array<any> = [];
let isFirmAdded: boolean;
@Component({
  selector: 'app-firm',
  templateUrl: './firm.component.html',
  styleUrls: ['./firm.component.scss'],
  animations: [slideToLeft()],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class FirmComponent implements OnInit {
  KeyPersonForm: FormGroup;
  FirmForm: FormGroup;
  showSpinner: boolean;
  maxDate = new Date();
  keyPersonArray: any = [];
  displayedColumnsKeyPerson: string[] = ['Name', 'FatherName', 'Email', 'Phone', 'DOB', 'Action'];
  displayedColumnsDocument: string[] = ['Name', 'Number', 'ExpiryDate', 'Action'];
  dataSourceKeyPerson: MatTableDataSource<KeyPersonData>;
  isLoadingResults: any;
  isRateLimitReached: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  allFirmTypes: any;
  selectedFirmType = new FormControl('', [Validators.required]);
  companyDocument: any = [];
  allDocuments: any = [];
  companyDocumentArray: any = [];
  keyPersonDocumentArray: any = [];
  allCompanyImages: any = [];
  allKeyPersonImages: any = [];
  documentKeyPersonUploadedArray: any = [];
  documentCompanyUploadedArray: any = [];
  docMandatory = 0;
  companyDocMandatoryFill = 0;
  flag = 1;
  firmFillStatus = false;
  noOfRequiredCompanyDocument = 0;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private firmService: FirmService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public documentService: DocumentService,
    private authenticationService: AuthenticationService
  ) {
      setTimeout(() => {
        this.authenticationService.checkSelectedComponentVisiblity('New');
      }, 100);
    this.showSpinner = false;
    this.FirmForm = fb.group({
      Name: ['', [Validators.required ] ],
      PAN: ['', [Validators.required, Validators.min(1000000000), Validators.max(9999999999) ]],
      TIN: [ '' , [Validators.required ] ],
      Phone: [ '' , [Validators.required, Validators.min(1000000000), Validators.max(9999999999) ]],
      RegistrationDate: [ '' , [Validators.required ] ],
      Email: [ '' , [Validators.required, Validators.email ] ],
      Address: [ '' , [Validators.required ] ],
    });
    this.KeyPersonForm = this.fb.group({
      MemberType: ['', [Validators.required ] ],
      Name: ['', [Validators.required ] ],
      FatherName: ['', [Validators.required ] ],
      Email: ['', [Validators.required, Validators.email ] ],
      Phone: [ '' , [Validators.required, Validators.min(1000000000), Validators.max(9999999999) ]],
      DOB: [ '' , [Validators.required ] ],
      Gender: [ '' , [Validators.required ] ],
      PermanentAddress: [],
      CorrespondingAddress: [],
      addressSameAs: new FormControl(false),
    });
  }

  ngOnInit() {
    this.getAllFirmTypes();
    this.getAllDocuments();
  }

  onChangeFirstStep() {
    if (this.FirmForm.invalid) {
      return 0;
    }
    this.firmFillStatus = true;
  }

  onChangeFirmType() {
    this.getAllCompanyDocuments(this.selectedFirmType.value);
  }

  sameAsAddress(val) {
    if (val) {
      this.KeyPersonForm.patchValue({
        CorrespondingAddress: this.KeyPersonForm.get('PermanentAddress').value
      });
    }
  }

  getAllFirmTypes() {
    this.firmService.getAllFirmTypes().subscribe((data: {}) =>{
      if (data['status']) {
        this.allFirmTypes = data['result'];
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
  getAllCompanyDocuments(selectedFirmType) {
      this.firmService.getAllCompanyDocuments(selectedFirmType).subscribe((data) => {
        if (data['status']) {
          this.companyDocument = data['result'];
          this.noOfRequiredCompanyDocument = 0;
          for (const row of this.companyDocument) {
            if (row.isRequired === 'Required') {
              this.noOfRequiredCompanyDocument++;
            }
          }
        }
      });
  }
  getAllDocuments() {
    this.documentService.getAllDocuments().subscribe((data: {}) => {
      if (data['status']) {
        this.allDocuments = data['result'];
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

  onSubmitForm() {
    if (this.FirmForm.invalid) {
      return 0;
    }
    this.spinnerService.show();
    this.createNew();
  }

  createNew() {
    this.firmService.addFirmKeyPerson(this.FirmForm.value, this.keyPersonArray, this.companyDocumentArray, this.selectedFirmType.value)
      .subscribe((data: {}) => {
      if ( data['status']) {
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.spinnerService.hide();
        this.router.navigate(['/settings/client']);
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
  async addKeyPerson() {
    if (this.KeyPersonForm.invalid) {
      return 0;
    }
    const array = {
      MemberType: '', Name: '', FatherName: '', Phone: '', Email: '', DOB: '',
      Gender: '', PermanentAddress: '', CorrespondingAddress: '', allDocument: {}
    };
    array.MemberType = this.KeyPersonForm.get('MemberType').value;
    array.Name = this.KeyPersonForm.get('Name').value;
    array.FatherName = this.KeyPersonForm.get('FatherName').value;
    array.Phone = this.KeyPersonForm.get('Phone').value;
    array.Email = this.KeyPersonForm.get('Email').value;
    array.DOB = this.KeyPersonForm.get('DOB').value;
    array.Gender = this.KeyPersonForm.get('Gender').value;
    array.PermanentAddress = this.KeyPersonForm.get('PermanentAddress').value;
    array.CorrespondingAddress = this.KeyPersonForm.get('CorrespondingAddress').value;
    // array.allDocument = await (this.getAllDocuments());
    array.allDocument = this.keyPersonDocumentArray;

    this.keyPersonArray.push(array);
    this.dataSourceKeyPerson = new MatTableDataSource(this.keyPersonArray);
    this.dataSourceKeyPerson.paginator = this.paginator;
    this.dataSourceKeyPerson.sort = this.sort;
    this.keyPersonDocumentArray = [];
    this.allKeyPersonImages = [];
    this.docMandatory = 0;
    this.allDocuments = [];
    this.documentKeyPersonUploadedArray = [];
    this.getAllDocuments();
    this.KeyPersonForm.reset();
    this.snackBar.open('Key Person added successfully', 'success', {
      duration: 5000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top'
    });
  }
  deleteKeyPerson(id) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: false});
    this.dialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete ?';

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.keyPersonArray.splice(id);
        this.dataSourceKeyPerson = new MatTableDataSource(this.keyPersonArray);
        this.dataSourceKeyPerson.paginator = this.paginator;
        this.dataSourceKeyPerson.sort = this.sort;
        this.snackBar.open('Key Person deleted successfully', 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
      }
    });
  }

  onFileChange(event, name, type) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      const fileName = event.target.files[0].name;
      const lastIndex = fileName.lastIndexOf('.');
      const extension =  fileName.substr(lastIndex + 1);
      if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'pdf') {
        reader.onload = () => {
          if (type === 'company') {
            this.allCompanyImages[name] = reader.result;
          } else {
            this.allKeyPersonImages[type + '' + name] = reader.result;
          }
        };
      } else {
        this.snackBar.open('Invalid selected file', 'warning', {
          duration: 5000,
          panelClass: ['warning-snackbar'],
          verticalPosition: 'top'
        });
      }
    }
  }

  addCompanyDocument(val, name, isRequired) {
    let localArray = {};
    localArray['Name'] = name;
    localArray['Image'] = this.allCompanyImages[name];
    localArray['Number'] = val;
    let index = this.companyDocumentArray.findIndex(x => x.Name === name)
    if (index === -1) {
      if (isRequired === 'Required') {
        this.companyDocMandatoryFill++;
      }
      this.companyDocumentArray.push(localArray);
      this.documentCompanyUploadedArray[name] = name;
    } else {
      this.companyDocumentArray[index].Image = this.allCompanyImages[name];
      this.companyDocumentArray[index].Number = val;
    }
    this.snackBar.open('Successfully added document "' + name + '"', 'success', {
      duration: 5000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top'
    });
  }
  addKeyPersonDocument(val, name) {
    const localArray = {};
    localArray['Name'] = name;
    localArray['Image'] = this.allKeyPersonImages[name];
    localArray['Number'] = val;
    const index = this.keyPersonDocumentArray.findIndex(x => x.Name === name);
    if (index === -1) {
      if (name === 'PAN' || name === 'Aadhar') {
        this.docMandatory++;
      }
      this.documentKeyPersonUploadedArray[name] = name;
      this.keyPersonDocumentArray.push(localArray);
    } else {
      this.keyPersonDocumentArray[index].Image = this.allKeyPersonImages[name];
      this.keyPersonDocumentArray[index].Number = val;
    }
    this.snackBar.open('Successfully added document "' + name + '"', 'success', {
      duration: 5000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top'
    });
  }

  onKeyPersoanFileChange(event, name) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      const fileName = event.target.files[0].name;
      const lastIndex = fileName.lastIndexOf('.');
      const extension =  fileName.substr(lastIndex + 1);
      if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'pdf') {
        reader.onload = () => {
            this.allKeyPersonImages[name] = reader.result;
        };
      } else {
        this.snackBar.open('Invalid selected file', 'warning', {
          duration: 5000,
          panelClass: ['warning-snackbar'],
          verticalPosition: 'top'
        });
      }
    }
  }

  print() {
    let printContents, popupWin;
    const firmName = this.FirmForm.get('Name').value;
    const currentDate = formatDate(this.maxDate, 'dd/mm/yyyy', 'en-IN', '');
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/angular-material/1.1.0-rc1/angular-material.css">
          <style>
          //........Customized style.......
          </style>
        </head>
        <body onload="window.print();window.close()" style="margin:15px;">
            ${printContents}
            <br><br>
              <h4>I "${firmName}" confirm that all the provided information are correct and with my full consent.</h4>
              <table class="table">
                <tr>
                  <td style="width:50%;">
                    <span>
                      Date: ${currentDate}<br>
                      Palace: ${this.FirmForm.get('Address').value}
                    </span>
                  </td>
                  <td style="width:50%;text-align: right">
                    <label class="text-center">
                      ${firmName}<br>
                        (signature)
                    </label>
                  </td>
                </tr>
              </table>
         </body>
      </html>`
    );
    popupWin.document.close();
  }

}
