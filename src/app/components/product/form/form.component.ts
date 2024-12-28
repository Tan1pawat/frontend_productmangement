import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class ProductFormDialogComponent  implements OnInit {
  productForm: FormGroup = new FormGroup({});
  isEdit = false;
  imagePreview: string | null = null;
  imageFormData: FormData = new FormData()

  // These would come from your service
  units: any[] = [];
  productTypes: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductFormDialogComponent>,
    private _Productservice: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdit = !!data;
    this.initForm();
  }

  ngOnInit() {
    // Here you would fetch units and product types from your service
    this._Productservice.getunit().subscribe({
      next: (units) => {
        this.units = units;
      },
      error: (err) => {
        console.error('Error fetching units:', err);
      },
    });
  
    // Fetching product types
    this._Productservice.getproductTypes().subscribe({
      next: (productTypes) => {
        this.productTypes = productTypes;
      },
      error: (err) => {
        console.error('Error fetching product types:', err);
      },
    });


    if (this.isEdit && this.data) {
      this.productForm.patchValue(this.data);
      if (this.data.image) {
        this.imagePreview = this.data.image;
      }
    }
  }

  private initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      value: ['', Validators.required],
      unit_id: ['', Validators.required],
      product_type_id: ['', Validators.required],
      image: [null]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
  
      this.imageFormData.append('file', file);
  
      this.uploadImage(this.imageFormData); // No need to assign to a variable here
    }
  }
  
  uploadImage(formData: FormData) {
    this._Productservice.uploadImg(formData).subscribe(
      (response) => {
        console.log('Image uploaded successfully', response);
  
        // Patch the form value here
        this.productForm.patchValue({ image: response });
  
        // Log the path after setting it
        console.log('Patched image path:', response);
      },
      (error) => {
        console.error('Error uploading image', error);
      }
    );
  }

  onSubmit() {
    if (this.productForm.valid) {
      // Create FormData for file upload
      const formData = new FormData();
      const formValue = this.productForm.value;

      Object.keys(formValue).forEach(key => {
        formData.append(key, formValue[key]);
      });

      this._Productservice.create(formData).subscribe({
        next: (response) => {
          console.log('Product created successfully', response);
        },
        error: (error) => {
          console.error('Error creating product', error);
        }
      });

      this.dialogRef.close(formData);
    }
  }
}

