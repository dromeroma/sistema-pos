import { Component } from '@angular/core';
import { PosRegisterComponent } from '../../../shared/components/sales/pos-register/pos-register.component';

@Component({
  selector: 'app-invoice',
  imports: [
    PosRegisterComponent,
  ],
  templateUrl: './invoice.component.html',
})
export class InvoiceComponent {}
