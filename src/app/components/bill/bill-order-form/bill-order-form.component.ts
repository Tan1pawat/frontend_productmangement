import { Component, OnInit } from '@angular/core';
import { BillService } from '../bill.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-bill-order-form',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule
  ],
  templateUrl: './bill-order-form.component.html',
  styleUrls: ['./bill-order-form.component.scss']
})
export class BillOrderFormComponent implements OnInit {
  form: FormGroup;

  prisons: any[] = [];
  companies: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BillOrderFormComponent>,
    private _Billservice: BillService
  ) {
    this.form = this.fb.group({
      prison_id: [null, Validators.required],
      company_id: [null, Validators.required],
      bill_type: [1, Validators.required], // Default value is 1
      date: [new Date().toISOString(), Validators.required],
      bill_order: this.fb.array([]),
    });
  }

  get billOrder(): FormArray {
    return this.form.get('bill_order') as FormArray;
  }

  ngOnInit(): void {
    this._Billservice.getprisons().subscribe({
      next: (prisons) => {
        this.prisons = prisons;
      },
      error: (err) => {
        console.error('Error fetching prisons:', err);
      },
    });

    this._Billservice.getcompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
      },
      error: (err) => {
        console.error('Error fetching companies:', err);
      },
    });
  }

  addBillOrder(): void {
    const billOrderGroup = this.fb.group({
      product_id: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      value: [null, [Validators.required, Validators.min(1)]],
    });
    this.billOrder.push(billOrderGroup);
  }

  removeBillOrder(index: number): void {
    this.billOrder.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      console.error('Form is invalid');
    }
  }
}
