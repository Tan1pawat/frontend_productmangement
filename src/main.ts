import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter, Routes } from '@angular/router';
import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { ProductComponent } from './app/components/product/product.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));

