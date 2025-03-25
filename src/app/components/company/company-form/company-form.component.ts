import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-company-form',
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
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.scss'
})
export class CompanyFormComponent {
  CompanyForm: FormGroup = new FormGroup({});
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CompanyFormComponent>,
    private _CompanyService: CompanyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdit = !!data;
    this.initForm();
  }

  ngOnInit() {

    if (this.isEdit && this.data) {
      this.CompanyForm.patchValue(this.data);
    }
  }

  private initForm() {
    this.CompanyForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      sender_address: ['', Validators.required],
      sender_tax_number: ['', Validators.required],
    });
  }


  onSubmit() {
    if (this.CompanyForm.valid) {
      // Create FormData for file upload
      const formData = new FormData();
      const formValue = this.CompanyForm.value;

      Object.keys(formValue).forEach(key => {
        formData.append(key, formValue[key]);
      });

      this._CompanyService.create(formData).subscribe({
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
