import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProductComponent } from './components/product/product.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
    , RouterModule
    , NavbarComponent
    , SidebarComponent
    , CommonModule
    ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isSidebarOpen = true;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}