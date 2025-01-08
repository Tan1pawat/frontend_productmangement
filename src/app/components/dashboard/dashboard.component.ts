import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';

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
export class DashboardComponent {
  isYearlyView = true;
  selectedYear = '2568'; // Default year
  selectedMonth = 'มกราคม'; // Default month
  years = ['2565', '2566', '2567', '2568', '2569'];
  months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  barChartData: any[] = [];
  pieChartData: any[] = [];

  // Mock data for simplicity
  private yearlyData = {
    income: [58000, 62000, 65000, 70000],
    expenses: [48000, 51000, 53000, 56000],
    expenseCategories: {
      Housing: 18000,
      Transportation: 9600,
      Food: 7200,
      Utilities: 4800,
      Entertainment: 3600,
      Others: 10800,
    },
  };

  private monthlyData: Record<string, {
    income: number[];
    expenses: number[];
    expenseCategories: {
      Housing: number;
      Transportation: number;
      Food: number;
      Utilities: number;
      Entertainment: number;
      Others: number;
    };
  }> = {
    '2568': {
      income: [4500, 5200, 4800, 5100, 4900, 5300, 5400, 5200, 5100, 5600, 5400, 5800],
      expenses: [3800, 4100, 3900, 4200, 4000, 4300, 4100, 4200, 4300, 4400, 4200, 4500],
      expenseCategories: {
        Housing: 1500,
        Transportation: 800,
        Food: 600,
        Utilities: 400,
        Entertainment: 300,
        Others: 900,
      },
    },
  };

  ngOnInit() {
    this.updateChartData();
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
    const yearIndex = this.years.indexOf(this.selectedYear);
    if (yearIndex >= 0) {
      const data = this.yearlyData;

      // Update bar chart
      this.barChartData = [
        {
          name: this.selectedYear,
          series: [
            { name: 'รายจ่าย', value: data.expenses[yearIndex] },
            { name: 'รายได้', value: data.income[yearIndex] },
          ],
        },
      ];

      // Update pie chart
      this.pieChartData = Object.entries(data.expenseCategories).map(([name, value]) => ({
        name,
        value,
      }));
    }
  }

  updateMonthlyData() {
    const yearData = this.monthlyData[this.selectedYear];
    if (!yearData) {
      console.error(`No data available for year: ${this.selectedYear}`);
      return;
    }
  
    const monthIndex = this.months.indexOf(this.selectedMonth);
    if (monthIndex >= 0) {
      const income = yearData.income[monthIndex];
      const expenses = yearData.expenses[monthIndex];
  
      // Update bar chart
      this.barChartData = [
        {
          name: this.selectedMonth,
          series: [
            { name: 'Income', value: income },
            { name: 'Expenses', value: expenses },
          ],
        },
      ];
  
      // Update pie chart
      this.pieChartData = Object.entries(yearData.expenseCategories).map(([name, value]) => ({
        name,
        value,
      }));
    }
  }

  getTotalIncome(): number {
    if (this.isYearlyView) {
      const index = this.years.indexOf(this.selectedYear);
      return this.yearlyData.income[index] || 0;
    } else {
      const data = this.monthlyData[this.selectedYear];
      const index = this.months.indexOf(this.selectedMonth);
      return data?.income[index] || 0;
    }
  }

  getTotalExpenses(): number {
    if (this.isYearlyView) {
      const index = this.years.indexOf(this.selectedYear);
      return this.yearlyData.expenses[index] || 0;
    } else {
      const data = this.monthlyData[this.selectedYear];
      const index = this.months.indexOf(this.selectedMonth);
      return data?.expenses[index] || 0;
    }
  }
}
