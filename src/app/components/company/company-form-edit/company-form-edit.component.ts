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
  selector: 'app-company-form-edit',
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
  templateUrl: './company-form-edit.component.html',
  styleUrl: './company-form-edit.component.scss'
})
export class CompanyFormEditComponent {
  CompanyForm: FormGroup = new FormGroup({});
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CompanyFormEditComponent>,
    private _CompanyService: CompanyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdit = !!data;
    this.initForm();
  }

  ngOnInit() {

    this._CompanyService.getCompanyById(this.data.id).subscribe({
      next: (response) => {
        this.CompanyForm.patchValue(response);
      },
      error: (error) => {
        console.error('Error getting product', error);
      }
    });
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
      const formValue = this.CompanyForm.value;

      const CompanyForm = {
        name: formValue.name,
        code: formValue.code,
        sender_address: formValue.sender_address,
        sender_tax_number: formValue.sender_tax_number,
      }

      this._CompanyService.update(this.data.id,CompanyForm).subscribe({
        next: (response) => {
          console.log('Product created successfully', response);
        },
        error: (error) => {
          console.error('Error creating product', error);
        }
      });

      this.dialogRef.close(CompanyForm);
    }
  }
}
