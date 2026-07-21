import { useMemo } from "react";
import { Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/mockData";
import { TableFooterPagination } from "../TableFooterPagination";

interface EmployeesViewProps {
  searchQuery: string;
  employeesList: any[];
  setEmployeesList: React.Dispatch<React.SetStateAction<any[]>>;
  onEditEmployeeClick: (emp: any) => void;
}

export function EmployeesView({
  searchQuery,
  employeesList,
  setEmployeesList,
  onEditEmployeeClick,
}: EmployeesViewProps) {
  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return employeesList;
    const q = searchQuery.toLowerCase();
    return employeesList.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.dept.toLowerCase().includes(q) ||
        e.status.toLowerCase().includes(q)
    );
  }, [searchQuery, employeesList]);

  const displayedEmployees = useMemo(() => {
    return filteredEmployees.slice(0, 10);
  }, [filteredEmployees]);

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/40 backdrop-blur-sm border-b border-slate-100 hover:bg-slate-50/40">
                <TableHead className="py-4 font-semibold text-slate-700">Employee ID</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700">Employee Name</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700">Role</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700">Department</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700">Shift</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700">Status</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedEmployees.map((e) => (
                <TableRow key={e.email} className="hover:bg-indigo-50/20 transition-colors border-b border-slate-100/65 last:border-0 group">
                  <TableCell className="py-3.5 text-xs font-mono font-bold text-slate-500">{e.empId || "—"}</TableCell>
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 ring-2 ring-indigo-100/50 group-hover:ring-indigo-100 transition-all duration-300">
                        <AvatarFallback className="bg-indigo-50 text-xs text-indigo-700 font-semibold">
                          {initials(e.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors duration-200">{e.name}</div>
                        <div className="text-xs text-slate-400 font-medium">{e.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 text-sm font-medium text-slate-700">{e.role}</TableCell>
                  <TableCell className="py-3.5 text-sm font-medium text-slate-500">{e.dept}</TableCell>
                  <TableCell className="py-3.5 text-xs font-semibold text-slate-600">
                    <Badge variant="secondary" className="bg-slate-100/60 border-slate-200/40 text-slate-600 font-bold px-2 py-0.5">{e.shift || "Day"}</Badge>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "border-0 inline-flex items-center font-semibold text-[10px] px-2 py-0.5 shadow-sm/5",
                        e.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700",
                      )}
                    >
                      <span className={cn(
                        "mr-1.5 h-1.5 w-1.5 rounded-full animate-pulse",
                        e.status === "Active" ? "bg-emerald-500" : "bg-amber-500"
                      )} />
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3.5 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 hover:bg-indigo-600 hover:text-white border-slate-200 transition-all duration-200 shadow-sm/5 gap-1.5"
                      onClick={() => onEditEmployeeClick(e)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableFooterPagination total={filteredEmployees.length} shown={displayedEmployees.length} />
        </CardContent>
      </Card>
    </div>
  );
}
