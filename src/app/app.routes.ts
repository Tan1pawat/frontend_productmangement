import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductComponent } from './components/product/product.component';
import { BillComponent } from './components/bill/bill.component';
import { CompanyComponent } from './components/company/company.component';
import { PrisonComponent } from './components/prison/prison.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboards', pathMatch: 'full' },
    { path: 'dashboards', component: DashboardComponent },
    { path: 'products', component: ProductComponent },
    { path: 'bills', component: BillComponent },
    { path: 'company', component: CompanyComponent },
    { path: 'prison',component:PrisonComponent}
];
