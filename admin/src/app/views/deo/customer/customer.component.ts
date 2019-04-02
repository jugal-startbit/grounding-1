import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CustomerService } from './customer.service';
import { Router} from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {MatSnackBar} from '@angular/material';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { MatDialog, MatDialogRef  } from '@angular/material';
import {ConfirmationDialogComponent} from '../../../containers/confirmation-dialog/confirmation-dialog.component';
import {UserService} from '../../settings/user/user.service';
import {ClientService} from '../../settings/client/client.service';
import {MainTaskService} from '../../settings/mainTask/mainTask.service';
import { slideToLeft } from '../../../router.animations';
import {WorkExistingService} from '../../manager/workExisting/workExisting.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BranchService} from '../../settings/branch/branch.service';
import { DepartmentService} from '../../settings/department/department.service';
import { AuthenticationService} from '../../../containers/_services/authentication.service';

let selectedRow: any = {};

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  animations: [slideToLeft()]
})
export class CustomerComponent implements OnInit {
  CustomerForm: FormGroup;
  VisitorForm: FormGroup;
  entryID: String;
  mainTaskList: any = [];
  showSpinner: boolean;
  showCust: boolean;
  maxDate = new Date();
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  selectedClientFirm: any;
  localStorage: any;
  allBranches: any = [];
  allDepartments: any = [];
  allUsers: any = [];
  constructor(
    private modal: NgbModal,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private entryService: CustomerService,
    private clientservice: ClientService,
    private mainTaskService: MainTaskService,
    private workExistingService: WorkExistingService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public branchService: BranchService,
    public departmentService: DepartmentService,
    public userService: UserService,
    public authenticationService: AuthenticationService
  ) {
    setTimeout(() => {
      this.authenticationService.checkSelectedComponentVisiblity('Customer');
    }, 100);
    this.localStorage = JSON.parse(localStorage.getItem('currentUser'));
    this.showSpinner = false;
    this.showCust = false;
    this.entryID = this.route.params['value'].id;
    this.CustomerForm = fb.group({
      Name: ['', [ Validators.required ]],
      Purpose: ['', [ Validators.required ]],
      DepartmentID: ['', [ Validators.required ]],
      UserID: ['', [ Validators.required ]],
      Email: ['', [ Validators.required , Validators.email]],
      Phone: [ '', [Validators.required, Validators.min(1000000000), Validators.max(9999999999)] ],
      DOB: [ '', [Validators.required ] ]
    });
    this.VisitorForm = this.fb.group({
      VisitingType: [ '' ],
      Purpose: ['' ],
      PurposeDescription: ['' ],
      BranchID: ['' ],
      DepartmentID: ['' ],
      UserID: [''],
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.openPopup();
    }, 100);
    this.getAllBranch();
    if (this.localStorage.role !== 'Super Admin') {
      this.VisitorForm.patchValue({
        BranchID: this.localStorage.Branch._id
      });
      this.getAllDepartments(this.localStorage.Branch._id);
    }
  }
  getAllBranch() {
    this.spinnerService.show();
    this.branchService.getAllBranchs().subscribe((data: {}) => {
      if ( data['status']) {
        this.allBranches = data['result'];
        this.spinnerService.hide();
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

  getAllDepartments(selectedBranch) {
    if (!selectedBranch) {
      return 0;
    }
    this.spinnerService.show();
    this.departmentService.getAllDepartmentsByID(selectedBranch).subscribe((data: {}) => {
      if ( data['status']) {
        this.allDepartments = data['result'];
        this.spinnerService.hide();
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
  onChangeBranch(selectedBranch) {
    this.getAllDepartments(selectedBranch);
  }
  getAllUser(selectedDepartment) {
    if (!selectedDepartment) {
      return 0;
    }
    this.spinnerService.show();
    this.userService.getAllUserByDepartmentWithLeader(selectedDepartment).subscribe((data: {}) => {
      if ( data['status']) {
        this.allUsers = data['result'];
        this.spinnerService.hide();
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

  openPopup() {
    const dialogRef = this.dialog.open(DetailComponent,{ width: '70%'});

    dialogRef.afterClosed().subscribe(result => {
      this.spinnerService.hide();
      if (selectedRow.id !== '' && selectedRow.id !== undefined) {
        if (selectedRow.type === 'Client') {
          this.getOneClient(selectedRow.id);
        } else {
          this.getOneFirm(selectedRow.id);
        }
	      this.showCust = true;
      }
    });
  }
  onSubmitForm() {
    const local = this.CustomerForm.value;
    local['Name'] = this.CustomerForm.get('Name').value;
    console.log(local)
     this.createNew(local , this.VisitorForm.value);
  }

  createNew(local , visitorForm) {
    this.entryService.addEntry(local).subscribe((data: {}) => {
      if ( data['status']) {
        this.snackBar.open(data['message'], 'success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        console.log(data);
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
    this.entryService.updateEntry(this.entryID, this.CustomerForm.value).subscribe((data: {}) => {
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
  setDepart(depart) {
    this.CustomerForm.patchValue({
      DepartmentID : depart
    });
    this.getAllUser(depart);
  }
  setUser(user) {
    this.CustomerForm.patchValue({
      UserID : user
    });
  }
  setPurpose(Purpose) {
    console.log(Purpose)
    this.CustomerForm.patchValue({
      Purpose : Purpose
    });
  }

  getOneClient(id) {
    this.spinnerService.show();
    this.clientservice.getOneClient(id).subscribe((data: {}) => {
      if ( data['status']) {
        this.selectedClientFirm = data['result'];
        this.CustomerForm = this.fb.group({
          Name: [ {value: data['result'].Name, disabled: true}, [Validators.required ] ],
          Email: [ data['result'].Email, [Validators.required, Validators.email ] ],
          Phone: [ data['result'].Phone, [Validators.required, Validators.min(1000000000), Validators.max(9999999999) ]],
          Purpose: [data['result'].Purpose, [ Validators.required ]],
          DepartmentID: [data['result'].DepartmentID, [ Validators.required ]],
          UserID: [data['result'].UserID, [ Validators.required ]],
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

  getOneFirm(id) {
    this.spinnerService.show();
    this.clientservice.getOneFirm(id).subscribe((data: {}) => {
      if ( data['status']) {
        this.selectedClientFirm = data['result'];
        this.CustomerForm = this.fb.group({
          Name: [ {value: data['result'].Name, disabled: true}, [Validators.required ] ],
          Email: [ data['result'].Email, [Validators.required, Validators.email ] ],
          Phone: [ data['result'].Phone, [Validators.required, Validators.min(1000000000), Validators.max(9999999999) ]],
          Purpose: [data['result'].Purpose, [ Validators.required ]],
          DepartmentID: [data['result'].DepartmentID, [ Validators.required ]],
          UserID: [data['result'].UserID, [ Validators.required ]],
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
    this.CustomerForm.reset();
  }
  getVisitorType(type) {
    this.mainTaskList = [];
    console.log(type);
    if (type === 'New') {
      this.mainTaskService.getAllMainTasks().subscribe((data: {}) => {
        this.mainTaskList = data['result'];
      }, err => {
        this.spinnerService.hide();
        this.snackBar.open('Server Error', 'Error', {
          duration: 5000,
          panelClass: ['danger-snackbar'],
          verticalPosition: 'top'
        });
      });
    } else if (type === 'Old') {
      this.workExistingService.getAllByClientFirm(selectedRow.id).subscribe((data: {}) => {
        this.mainTaskList = data['result'];
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

}

export interface ClientData {
  _id: string;
  Name: string;
  Address: string;
  Phone: string;
}

@Component({
  templateUrl: './details-dialog.html',
  styleUrls: ['./customer.component.scss']
})
export class DetailComponent {
  displayedColumns: string[] = ['Name', 'Address', 'Phone'];
  dataSource: MatTableDataSource<ClientData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  SearchPerson: FormGroup;
  selectedClients: any;
  showSpinner: boolean;
  isLoadingResults: any;
  isRateLimitReached: any;
  constructor(
    public dialogRef: MatDialogRef<DetailComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private clientService: ClientService
  ) {
    this.SearchPerson = fb.group({
      UID: [''],
      Name: [''],
      Phone: ['']
    });
    this.showSpinner = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmitForm() {
    if (this.SearchPerson.value.Name === '' && this.SearchPerson.value.Phone === '' && this.SearchPerson.value.UID === '') {
      this.snackBar.open('Please select anyone from UID, Client/Firm Name and Mobile No', 'warning', {
        duration: 5000,
        panelClass: ['warning-snackbar'],
        verticalPosition: 'top'
      });
      return 0;
    }
    this.clientService.getAllClientsByFilterValue(this.SearchPerson.value).subscribe((data: {}) => {
      if (data['status']) {
        this.selectedClients = data['result'];
        this.dataSource = new MatTableDataSource(this.selectedClients);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // this.SearchPerson.reset();
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
    }, err => {
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  getRowDetail(row) {
    if (row.CID) {
      selectedRow = {
        id: row._id,
        type: 'Client'
      };
    } else {
      selectedRow = {
        id: row._id,
        type: 'Firm'
      };
    }
    this.dialogRef.close();
  }
}

