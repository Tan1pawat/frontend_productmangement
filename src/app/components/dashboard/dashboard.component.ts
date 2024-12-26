import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  view: [number, number] = [700, 400];

  // Color scheme
  colorScheme = {
    domain: ['#4CAF50', '#F44336', '#2196F3', '#9C27B0', '#FF9800']
  };

  // Financial data
  financialData = [
    {
      name: 'January',
      series: [
        { name: 'Income', value: 50000 },
        { name: 'Expense', value: 30000 }
      ]
    },
    {
      name: 'February',
      series: [
        { name: 'Income', value: 55000 },
        { name: 'Expense', value: 32000 }
      ]
    },
    {
      name: 'March',
      series: [
        { name: 'Income', value: 60000 },
        { name: 'Expense', value: 35000 }
      ]
    },
    {
      name: 'April',
      series: [
        { name: 'Income', value: 58000 },
        { name: 'Expense', value: 33000 }
      ]
    },
    {
      name: 'May',
      series: [
        { name: 'Income', value: 65000 },
        { name: 'Expense', value: 38000 }
      ]
    }
  ];

  // Stock data
  stockData = [
    { name: 'Product A', value: 150 },
    { name: 'Product B', value: 200 },
    { name: 'Product C', value: 80 },
    { name: 'Product D', value: 120 }
  ];

  // Sales trend data
  salesTrendData = [
    {
      name: 'Product A',
      series: [
        { name: 'Jan', value: 45 },
        { name: 'Feb', value: 52 },
        { name: 'Mar', value: 48 },
        { name: 'Apr', value: 60 },
        { name: 'May', value: 55 }
      ]
    },
    {
      name: 'Product B',
      series: [
        { name: 'Jan', value: 30 },
        { name: 'Feb', value: 35 },
        { name: 'Mar', value: 42 },
        { name: 'Apr', value: 45 },
        { name: 'May', value: 48 }
      ]
    }
  ];

  onSelect(event: any) {
    console.log('Item clicked', event);
  }
}
