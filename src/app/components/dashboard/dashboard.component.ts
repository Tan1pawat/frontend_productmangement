import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxChartsModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatCardModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isYearlyView = true;
  selectedYear = '2568'; // Default year
  selectedMonth = 'มกราคม'; // Default month
  years = ['2565', '2566', '2567', '2568', '2569'];
  months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  barChartData: any[] = [];
  pieChartData: any[] = [];

  yearlyData: Record<string, any> = {};
  monthlyData: Record<string, any> = {};

  constructor(private _DashboardService: DashboardService) {}

  ngOnInit() {
    this._DashboardService.getdashboard(this.years).subscribe({
      next: (response: any) => {
          this.processDashboardData(response);
          this.updateChartData();
      },
      error: (err) => {
        console.error('Error fetching Dashboard data:', err);
      },
    });
  }

  onViewToggle() {
    this.updateChartData();
  }
  processDashboardData(data: any) {
    if (data.yearlyData) {
      this.yearlyData = data.yearlyData;
    }

    if (data.monthlyData) {
      this.monthlyData = data.monthlyData;
    }
  }

  onViewChange() {
    this.updateChartData();
    this.isYearlyView = false;
  }

  updateChartData() {
    if (this.isYearlyView) {
      this.updateYearlyData();
    } else {
      this.updateMonthlyData();
    }
  }

  updateYearlyData() {
    const yearData = this.yearlyData[this.selectedYear];
    if (yearData) {
      const income = yearData.income.reduce((sum: number, val: any) => sum + parseFloat(val || 0), 0);
      const expenses = yearData.expenses.reduce((sum: number, val: any) => sum + parseFloat(val || 0), 0);

      // Update bar chart
      this.barChartData = [
        {
          name: this.selectedYear,
          series: [
            { name: 'รายจ่าย', value: expenses },
            { name: 'รายได้', value: income },
          ],
        },
      ];

      // Update pie chart
      this.pieChartData = Object.entries(yearData.expenseCategories || {}).map(([name, value]) => ({
        name,
        value,
      }));
    }else{
      this.barChartData = [];
      this.pieChartData = [];
    }
  }

  updateMonthlyData() {
    const monthKey = `${this.selectedYear}-${this.getMonthKey()}`;
    const monthData = this.monthlyData[monthKey];

    if (monthData) {
      const income = parseFloat(monthData.income[0] || 0);
      const expenses = parseFloat(monthData.expenses[0] || 0);

      // Update bar chart
      this.barChartData = [
        {
          name: this.selectedMonth,
          series: [
            { name: 'รายจ่าย', value: expenses },
            { name: 'รายได้', value: income },
          ],
        },
      ];

      // Update pie chart
      this.pieChartData = Object.entries(monthData.expenseCategories || {}).map(([name, value]) => ({
        name,
        value,
      }));
    } else {
      this.barChartData = [];
      this.pieChartData = [];
    }
  }

  getTotalIncome(): number {
    if (this.isYearlyView) {
      const yearData = this.yearlyData[this.selectedYear];
      return yearData ? yearData.income.reduce((sum: number, val: any) => sum + parseFloat(val || 0), 0) : 0;
    } else {
      const monthKey = `${this.selectedYear}-${this.getMonthKey()}`;
      const monthData = this.monthlyData[monthKey];
      return monthData ? parseFloat(monthData.income[0] || 0) : 0;
    }
  }

  getTotalExpenses(): number {
    if (this.isYearlyView) {
      const yearData = this.yearlyData[this.selectedYear];
      return yearData ? yearData.expenses.reduce((sum: number, val: any) => sum + parseFloat(val || 0), 0) : 0;
    } else {
      const monthKey = `${this.selectedYear}-${this.getMonthKey()}`;
      const monthData = this.monthlyData[monthKey];
      return monthData ? parseFloat(monthData.expenses[0] || 0) : 0;
    }
  }

  private getMonthKey(): string {
    const monthIndex = this.months.indexOf(this.selectedMonth) + 1;
    return monthIndex.toString().padStart(2, '0');
  }
}
