export interface ReportProps {
  searchQuery: string;
}

export interface MonthlyReportProps extends ReportProps {
  departmentFilter: string;
  currentMonth: number;
  currentYear: number;
  reportWeek?: number;
}
