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
import { ProductService } from '../../product/product.service';
import { MatIcon } from '@angular/material/icon';

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
    MatDatepickerModule,
    MatIcon
  ],
  templateUrl: './bill-order-form.component.html',
  styleUrls: ['./bill-order-form.component.scss']
})
export class BillOrderFormComponent implements OnInit {
  form: FormGroup;

  prisons: any[] = [];
  companies: any[] = [];
  products: any[] = [];
  selectedProductIds: Set<number> = new Set<number>();


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BillOrderFormComponent>,
    private _Billservice: BillService,
    private _Productservice: ProductService
  ) {
    this.form = this.fb.group({
      prison_id: [null, Validators.required],
      company_id: [null, Validators.required],
      bill_type: [1, Validators.required],
      date: [new Date(), Validators.required], // Changed to use Date object directly
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

    this._Productservice.getlist().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });

    this.billOrder.valueChanges.subscribe(() => {
      this.updateSelectedProducts();
    });

  }

  isProductDisabled(productId: number): boolean {
    return this.selectedProductIds.has(productId);
  }
  
  updateSelectedProducts(): void {
    const selectedIds = new Set<number>();
    this.billOrder.controls.forEach(control => {
      const productId = control.get('product_id')?.value;
      if (productId !== null && productId !== undefined) {
        selectedIds.add(productId);
      }
    });
    this.selectedProductIds = selectedIds;
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
    this.updateSelectedProducts();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = {
        ...this.form.value,
        date: this.form.get('date')?.value.toISOString() // Convert date to ISO string for submission
      };
      console.log(formData);
      // Add your submission logic here
      this.dialogRef.close(formData);
    } else {
      console.error('Form is invalid');
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}