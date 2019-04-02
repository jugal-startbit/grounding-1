import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router} from '@angular/router';
import { EntryService} from './entry.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { WorkListService} from '../../employee/workList/workList.service';
import { ClientService} from '../../settings/client/client.service';
import {MatSnackBar} from '@angular/material';
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import { AuthenticationService} from '../../../containers/_services/authentication.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-work-list',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {
  displayedColumns: string[] = ['select', 'Work', 'Client', 'Department', 'Employee', 'Cost', 'PaidAmount', 'DueAmount'];
  dataSource: MatTableDataSource<any>;
  isLoadingResults: any;
  isRateLimitReached: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //
  localStorage: any;
  showSpinner: boolean;
  allWork: any = [];
  allDueAmountWork: any = [];
  selectedDueAmountWork: any = [];
  allClients: any = [];
  viewActive = 'All';
  selectedClient = new FormControl();
  selection = new SelectionModel<any>(true, []);
  entryForm = {
    SpecialNotes: '',
    Discount: 0,
    PaymentMethod: '',
    Amount: 0,
    TransactionID: '',
    Other: ''
  }
  filteredOptions: Observable<any[]>;
  constructor(
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    public entryService: EntryService,
    public workListService: WorkListService,
    public clientService: ClientService,
    private snackBar: MatSnackBar,
    private cdref: ChangeDetectorRef,
    public authenticationService: AuthenticationService
  ) {
    setTimeout(() => {
      this.authenticationService.checkSelectedComponentVisiblity('Entry');
    }, 100);
    this.localStorage = JSON.parse(localStorage.getItem('currentUser'));
    this.showSpinner = false;
  }

  ngOnInit() {
    this.getAllWork();
    this.getAllWorkByDueAmount();
    this.getAllClients();
  }

  displayFn(employee?: any): string | undefined {
    return employee ? employee.Name : undefined;
  }

  setAutoComplete() {
    this.filteredOptions = this.selectedClient
      .valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.allClients.slice())
      );
  }
  private _filter(val: any) {
    const filterValue = val.toLowerCase();
    return this.allClients.filter(option => option.Name.toLowerCase().includes(filterValue));
  }

  getAllClients() {
    this.spinnerService.show();
    this.clientService.getAllClients().subscribe((data) => {
      if (data['status']) {
        this.spinnerService.hide();
        this.allClients = data['result'];
        this.setAutoComplete();
      }
    }, (err) => {
      this.spinnerService.hide();
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }
  getAllWork() {
    this.spinnerService.show();
    this.workListService.getAllWork(0, 0, 0).subscribe((data) => {
      if (data['status']) {
        this.spinnerService.hide();
        this.allWork = data['result'];
      }
    }, (err) => {
      this.spinnerService.hide();
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }

  getAllWorkByDueAmount() {
    this.spinnerService.show();
    this.workListService.getAllWorkByDueAmount().subscribe((data) => {
      if (data['status']) {
        this.spinnerService.hide();
        this.allDueAmountWork = data['result'];
        this.dataSource = new MatTableDataSource(data['result']);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }, (err) => {
      this.spinnerService.hide();
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }
  onChangeClient(selectedClientID) {
    if (selectedClientID === '0') {
      this.selectedDueAmountWork = this.allDueAmountWork;
    } else {
      this.selectedDueAmountWork = this.allDueAmountWork.filter(x => x.ClientID._id === selectedClientID);
    }
    this.selection = new SelectionModel<any>(true, []);
    this.dataSource = new MatTableDataSource(this.selectedDueAmountWork);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  getTotalCost() {
    const total = this.selection.selected.reduce(
      (a: number, b) => a + Number(b.Cost), 0);
    this.entryForm.Amount = total - Number(this.entryForm.Discount);
    return total;
  }
  getTotalPaidAmount() {
    const total = this.selection.selected.reduce(
      (a: number, b) => a + Number(b.PaidAmount), 0);
    return total;
  }
  getTotalDueAmount() {
    const total = this.selection.selected.reduce(
      (a: number, b) => a + Number(b.DueAmount), 0);
    return total;
  }

  onSubmit() {
    if ((this.entryForm.PaymentMethod === 'Paytm' || this.entryForm.PaymentMethod === 'Bank') && this.entryForm.TransactionID === '')  {
      this.snackBar.open('Transaction ID required', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
      return 0;
    } else if (this.entryForm.PaymentMethod === 'Cheque' && this.entryForm.TransactionID === '') {
      this.snackBar.open('Cheque no required', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
      return 0;
    } else if (this.entryForm.PaymentMethod === 'Other' && (this.entryForm.Other === '' || this.entryForm.TransactionID === '')) {
      this.snackBar.open('Payment type and transaction id required', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
      return 0;
    }
    const workArray = this.selection.selected;
    const payment = {
      Work: workArray,
      ClientID: this.selectedClient.value._id ,
      Message: this.entryForm.SpecialNotes,
      Discount: this.entryForm.Discount,
      Total: this.entryForm.Amount,
      PaymentMethod: this.entryForm.PaymentMethod,
      TransactionID: this.entryForm.TransactionID,
      ModifiedBy: this.localStorage.id
    };
    if (this.entryForm.PaymentMethod === 'Other') {
      payment.PaymentMethod = this.entryForm.Other;
    }
    this.spinnerService.show();
    this.entryService.addPayment(payment).subscribe((data) => {
      if (data['status']) {
        this.spinnerService.hide();
        this.snackBar.open(data['message'], 'Success', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['payments/register']);
      }
    }, (err) => {
      this.spinnerService.hide();
      this.snackBar.open('Server Error', 'Error', {
        duration: 5000,
        panelClass: ['danger-snackbar'],
        verticalPosition: 'top'
      });
    });
  }
}

