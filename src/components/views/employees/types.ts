import type * as React from "react";

export interface EmployeesViewProps {
  searchQuery: string;
  employeesList: any[];
  setEmployeesList: React.Dispatch<React.SetStateAction<any[]>>;
  onEditEmployeeClick: (emp: any) => void;
}
