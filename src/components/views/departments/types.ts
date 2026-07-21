import type * as React from "react";

export interface DepartmentsViewProps {
  searchQuery: string;
  departmentsList: any[];
  setDepartmentsList: React.Dispatch<React.SetStateAction<any[]>>;
  onEditDeptClick: (dept: any) => void;
  onViewDeptClick: (dept: any) => void;
}
