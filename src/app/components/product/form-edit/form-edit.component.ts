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
import { environment } from '../../../../environments/environment.development';
@Component({
  selector: 'app-form-edit',
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
  templateUrl: './form-edit.component.html',
  styleUrl: './form-edit.component.scss'
})
export class ProductFormEditComponent {
  productForm: FormGroup = new FormGroup({});
  isEdit = true;
  imagePreview: string | null = null;
  imageFormData: FormData = new FormData()

  // These would come from your service
  units: any[] = [];
  productTypes: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductFormEditComponent>,
    private _Productservice: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.initForm();
  }

  ngOnInit() {

    this._Productservice.getproductById(this.data.id).subscribe({
      next: (response) => {
        
        this.productForm.patchValue(response);
        if (response.image) {

          this.imagePreview = environment.baseURL + response.image;
        }
      },
      error: (error) => {
        console.error('Error fetching product:', error);
      },
    });

    this._Productservice.getunit().subscribe({
      next: (units) => {
        this.units = units;
      },
      error: (err) => {
        console.error('Error fetching units:', err);
      },
    });
  
    this._Productservice.getproductTypes().subscribe({
      next: (productTypes) => {
        this.productTypes = productTypes;
      },
      error: (err) => {
        console.error('Error fetching product types:', err);
      },
    });

  }

  private initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
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
      const updateData = {
        name: this.productForm.value.name,
        value: this.productForm.value.value,
        unit_id: this.productForm.value.unit_id,
        product_type_id: this.productForm.value.product_type_id,
        image: this.productForm.value.image
      };

      this._Productservice.update(updateData,this.data.id).subscribe({
        next: (response) => {
          console.log('Product update successfully', response);
        },
        error: (error) => {
          console.error('Error updating product', error);
        }
      });

      this.dialogRef.close(updateData);
    }
  }
}
