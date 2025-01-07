import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BillService } from '../bill.service';
import { ProductService } from '../../product/product.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-bill-order-form-edit',
  standalone: true,
  imports: [
        CommonModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIcon,
        MatProgressSpinnerModule
        
  ],
  templateUrl: './bill-order-form-edit.component.html',
  styleUrl: './bill-order-form-edit.component.scss'
})
export class BillOrderFormEditComponent implements OnInit {

    form: FormGroup;
  
    prisons: any[] = [];
    companies: any[] = [];
    products: any[] = [];
    selectedProductIds: Set<number> = new Set<number>();
    isLoading = true;
  
    constructor(
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<BillOrderFormEditComponent>,
      private _Billservice: BillService,
      private _Productservice: ProductService,
      private dateAdapter: DateAdapter<Date>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.form = this.fb.group({
        prison_id: [null, Validators.required],
        company_id: [null, Validators.required],
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

      this._Billservice.getall(this.data.id).subscribe({
        next: (bill) => {

          // Patch the main form values
          this.form.patchValue({
            prison_id: bill.prison_id,
            company_id: bill.company_id,
            date: new Date(bill.date), // Convert string to Date object if necessary
          });
    
          // Clear existing form array
          this.billOrder.clear();
    
          // Populate the bill_order array
          bill.bill_orders.forEach((order: any) => {
            const billOrderGroup = this.fb.group({
              product_id: [order.product_id, Validators.required],
              price: [order.price, [Validators.required, Validators.min(0)]],
              value: [order.value, [Validators.required, Validators.min(1)]],
              buy_price: [{ value: order.product.price, disabled: true }], // Disabled as it's auto-filled
              quantity: [{ value: order.product.value, disabled: true }],  // Disabled as it's auto-filled
            });
    
            // Add the group to the array
            this.billOrder.push(billOrderGroup);
          });
    
          this.updateSelectedProducts();
          this.isLoading = false; // Stop loading
          
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
        buy_price: [{ value: null, disabled: true }], // Disabled because it's auto-filled
        quantity: [{ value: null, disabled: true }], // Disabled because it's auto-filled
      });
  
      billOrderGroup.get('product_id')?.valueChanges.subscribe((productId) => {
        const selectedProduct = this.products.find(product => product.id === productId);
        if (selectedProduct) {
          billOrderGroup.get('buy_price')?.setValue(selectedProduct.price);
          billOrderGroup.get('quantity')?.setValue(selectedProduct.value);
  
          billOrderGroup.get('value')?.setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(+selectedProduct.value) // Use max validator
          ]);
          billOrderGroup.get('value')?.updateValueAndValidity(); // Re-evaluate the validation
        } else {
          billOrderGroup.get('buy_price')?.setValue(null);
          billOrderGroup.get('quantity')?.setValue(null);
          billOrderGroup.get('value')?.clearValidators(); // Remove validators if no product is selected
          billOrderGroup.get('value')?.updateValueAndValidity();
        }
      });
      this.billOrder.push(billOrderGroup);
    }
  
    removeBillOrder(index: number): void {
      this.billOrder.removeAt(index);
      this.updateSelectedProducts();
    }
  
    onSubmit(): void {
      if (this.form.valid) {
        const formValue = this.form.value;
        const date = new Date(formValue.date);
  
        // Convert to Thai Buddhist Era (CE + 543)
        const thaiYear = date.getFullYear() + 543;
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
        // Format as DD/MM/YYYY
        const thaiDate = `${day}/${month}/${thaiYear}`;
  
        const formData = {
          ...formValue,
          date: thaiDate
        };

        
  
        this._Billservice.updated(formData,this.data.id).subscribe({
          next: (response) => {
            console.log('Bill created successfully', response);
          },
          error: (error) => {
            console.error('Error creating bill', error);
          }
        })
        this.dialogRef.close(formData);
      } else {
        console.error('Form is invalid');
      }
    }
  
    onClose(): void {
      this.dialogRef.close();
    }
}
