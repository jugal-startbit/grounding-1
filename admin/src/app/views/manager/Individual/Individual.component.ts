import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { IndividualService} from './individual.service';
import { Router} from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {MatSnackBar} from '@angular/material';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { MatDialog, MatDialogRef  } from '@angular/material';
import { DocumentService} from '../../settings/document/document.service';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { ConfirmationDialogComponent} from '../../../containers/confirmation-dialog/confirmation-dialog.component';
import {ClientService} from '../../settings/client/client.service';
import { slideToLeft } from '../../../router.animations';
import {formatDate} from '@angular/common';
import { AuthenticationService} from '../../../containers/_services/authentication.service';

export interface DocumentData {
  Name: string;
  Number: string;
  ExpiryDate: string;
}
export interface BankData {
  BankName: string;
  Branch: string;
  AccNo: string;
  IFSC: string;
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
export let refrenceArray: any = {};
@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.scss'],
  animations: [slideToLeft()],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class IndividualComponent implements OnInit {
  ClientForm: FormGroup;
  DocumentForm: FormGroup;
  BankForm: FormGroup;
  RefrenceForm: FormGroup;
  showSpinner: boolean;
  maxDate = new Date();
  firmArray: Array<any> = [];
  displayedColumnsDocument: string[] = ['Name', 'Number', 'ExpiryDate', 'Action'];
  displayedColumnsBank: string[] = ['BankName', 'Branch', 'AccNo', 'IFSC', 'Action'];
  dataSourceDocument: MatTableDataSource<DocumentData>;
  dataSourceBank: MatTableDataSource<BankData>;
  isLoadingResults: any;
  isRateLimitReached: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  bankArray: Array<any> = [];
  documentArray: Array<any> = [];
  allDocuments: any = [];
  allImages: any = [];
  chequeArray: any = {};
  ChequeImage: any;
  ChequeNumber: any;
  docMandatory = 0;
  documentUploadedArray: any = [];
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private clientService: IndividualService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public documentService: DocumentService,
    public authenticationService: AuthenticationService
  ) {
    setTimeout(() => {
      this.authenticationService.checkSelectedComponentVisiblity('New');
    }, 100);
    this.showSpinner = false;
  }

  ngOnInit() {
    this.getAllDocuments();
    this.ClientForm = this.fb.group({
      Name: ['', [Validators.required ] ],
      FatherName: ['', [Validators.required ] ],
      Email: ['', [Validators.required, Validators.email ] ],
      Phone: [ '' , [Validators.required, Validators.min(1000000000), Validators.max(9999999999) ] ],
      DOB: [ '' , [Validators.required ] ],
      Gender: [ '' , [Validators.required ] ],
      maritalStatus: [ '' , [Validators.required ] ],
      DateOfMarried: [ ''],
      Spouse: [ ''],
      Childern: [ 0, [Validators.min(0)]],
      PermanentAddress: [],
      CorrespondingAddress: [],
      addressSameAs: new FormControl(false),
    });
    this.DocumentForm = this.fb.group({
      Name: ['', [Validators.required]],
      Number: [''],
      ExpiryDate: [''],
      File: ['', [Validators.required]],
    });
    this.BankForm = this.fb.group({
      Holder: ['', [Validators.required]],
      Branch: ['', [Validators.required]],
      BankName: ['', [Validators.required]],
      AccNo: ['', [Validators.required]],
      IFSC: ['', [Validators.required]],
      MICR: [''],
    });
    this.RefrenceForm = this.fb.group({
      UID: [''],
      Name: [{value: '', disabled: true}],
      Phone: ['', [Validators.min(1000000000), Validators.max(9999999999)] ],
      Email: [{value: '', disabled: true}]
    });
  }

  sameAsAddress(val) {
    if (val) {
      this.ClientForm.patchValue({
        CorrespondingAddress: this.ClientForm.get('PermanentAddress').value
      });
    } else {
      this.ClientForm.patchValue({
        CorrespondingAddress: ''
      });
    }
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
    if (this.ClientForm.invalid) {
      return 0;
    }
    this.showSpinner = true;
      this.createNew();
  }

  createNew() {
    this.clientService.addIndividualClient(this.ClientForm.value, this.documentArray, this.bankArray, this.RefrenceForm.value, this.chequeArray).subscribe((data: {}) => {
      if ( data['status']) {
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
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
  addDocumentDetail(val, name) {
    // this.allImages
    let localArray = {};
    localArray['Name'] = name;
    localArray['Image'] = this.allImages[name];
    localArray['Number'] = val;
    let index = this.documentArray.findIndex(x => x.Name === name)
    if (index === -1) {
      if (name === 'PAN' || name === 'Aadhar') {
        this.docMandatory++;
      }
      this.documentArray.push(localArray);
      this.documentUploadedArray[name] = name;
    } else {
      this.documentArray[index].Image = this.allImages[name];
      this.documentArray[index].Number = val;
    }
    this.snackBar.open('Successfully added document', 'success', {
      duration: 5000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top'
    });
  }
  addBankDetail() {
    if (this.BankForm.invalid) {
      return 0;
    }
    this.bankArray.push(this.BankForm.value);
    this.dataSourceBank = new MatTableDataSource(this.bankArray);
    this.dataSourceBank.paginator = this.paginator;
    this.dataSourceBank.sort = this.sort;
    this.BankForm.reset();
    this.snackBar.open('Successfully added bank', 'success', {
      duration: 5000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top'
    });
  }
  deleteDocument(id) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: false});
    this.dialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete ?';

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.documentArray.splice(id);
        this.dataSourceDocument = new MatTableDataSource(this.documentArray);
        this.dataSourceDocument.paginator = this.paginator;
        this.dataSourceDocument.sort = this.sort;
        this.snackBar.open('Successfully deleted document', 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
      }
    });
  }
  deleteBank(id) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: false});
    this.dialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete ?';

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bankArray.splice(id);
        this.dataSourceBank = new MatTableDataSource(this.bankArray);
        this.dataSourceBank.paginator = this.paginator;
        this.dataSourceBank.sort = this.sort;
        this.snackBar.open('Successfully deleted bank', 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
      }
    });
  }

  onFileChange(event, name) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      let fileName = event.target.files[0].name;
      let lastIndex = fileName.lastIndexOf('.');
      let extension =  fileName.substr(lastIndex + 1);
      if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'pdf') {
        reader.onload = () => {
          this.allImages[name] = reader.result;
        };
      }
      else{
        this.snackBar.open('Invalid selected file', 'warning', {
          duration: 5000,
          panelClass: ['warning-snackbar'],
          verticalPosition: 'top'
        });
      }
    }
  }

  onFileChangeCancelCheque(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      let fileName = event.target.files[0].name;
      let lastIndex = fileName.lastIndexOf('.');
      let extension =  fileName.substr(lastIndex + 1);
      if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'pdf') {
        reader.onload = () => {
          this.ChequeImage = reader.result;
        };
      }
      else{
        this.snackBar.open('Invalid selected file', 'warning', {
          duration: 5000,
          panelClass: ['warning-snackbar'],
          verticalPosition: 'top'
        });
      }
    }
  }

  addChequeDetail() {
      this.chequeArray = {
        ChequeNumber: this.ChequeNumber,
        ChequeImage: this.ChequeImage,
      };
    this.snackBar.open('Successfully uploaded Cheque', 'success', {
      duration: 5000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top'
    });
  }

  openClientSerachDialog() {
    const dialogRef = this.dialog.open(ClientSearchComponent,{ width: '80%'});

    dialogRef.afterClosed().subscribe(result => {
        this.RefrenceForm.patchValue({
          UID: refrenceArray.uid,
          Name: refrenceArray.Name,
          Email: refrenceArray.Email,
          Phone: refrenceArray.Phone
        });
    });
  }

  setSameOnHolderName() {
    this.BankForm.patchValue({
      Holder: this.ClientForm.get('Name').value
    });
  }

  print() {
    let printContents, popupWin;
    const clientName = this.ClientForm.get('Name').value;
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
              <h4>I "${clientName}" confirm that all the provided information are correct and with my full consent.</h4>
              <table class="table">
                <tr>
                  <td style="width:50%;">
                    <span>
                      Date: ${currentDate}<br>
                      Palace: ${this.ClientForm.get('PermanentAddress').value}
                    </span>
                  </td>
                  <td style="width:50%;text-align: right">
                    <label class="text-center">
                      ${clientName}<br>
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

export interface ClientData {
  _id: string;
  Name: string;
  Phone: string;
  Email: string;
}
@Component({
  templateUrl: './openClientSerach-dialog.html',
  styleUrls: ['./individual.component.scss']
})
export class ClientSearchComponent {
  displayedColumns: string[] = ['Name', 'Email', 'Phone'];
  dataSource: MatTableDataSource<ClientData>;
  isLoadingResults: any;
  isRateLimitReached: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  RefrencePerson: FormGroup;
  selectedClients: any;
  showSpinner: boolean;
  constructor(
    public dialogRef: MatDialogRef<ClientSearchComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private spinnerService: Ng4LoadingSpinnerService,
    private clientService: ClientService
  ) {
    this.RefrencePerson = fb.group({
      Name: [''],
      Phone: ['', [Validators.min(1000000000), Validators.max(9999999999)] ],
      Email: ['']
    });
    this.showSpinner = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmitForm() {
    if (this.RefrencePerson.value.Name === '' && this.RefrencePerson.value.Phone === '' && this.RefrencePerson.value.Email === '') {
      this.snackBar.open('Please select anyone from Name, Email and Mobile No', 'warning', {
        duration: 5000,
        panelClass: ['warning-snackbar'],
        verticalPosition: 'top'
      });
      return 0;
    }
    this.spinnerService.show();
    this.clientService.getAllClientsByFilterValue(this.RefrencePerson.value).subscribe((data:{}) => {
      if (data['status']) {
        this.selectedClients = data['result'];
        this.dataSource = new MatTableDataSource(this.selectedClients);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // this.RefrencePerson.reset();
        this.spinnerService.hide();
        if (this.selectedClients.length > 0) {
          this.snackBar.open('Recorded added into table', 'success', {
            duration: 5000,
            panelClass: ['success-snackbar'],
            verticalPosition: 'top'
          });
        } else {
          this.snackBar.open('There are no record to show', 'warning', {
            duration: 5000,
            panelClass: ['warning-snackbar'],
            verticalPosition: 'top'
          });
        }
      }
    });
  }

  getRowDetail(row) {
    refrenceArray = {};
    refrenceArray = {
      uid: row.CID,
      Name: row.Name,
      Email: row.Email,
      Phone: row.Phone
    };
    this.dialogRef.close();
  }
}
