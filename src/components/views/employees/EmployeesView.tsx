import { EmployeesViewProps } from "./types";
import { useMemo, useState, useEffect } from "react";
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
import { TableFooterPagination } from "@/components/TableFooterPagination";

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
        e.status.toLowerCase().includes(q),
    );
  }, [searchQuery, employeesList]);

  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const displayedEmployees = useMemo(() => {
    const start = (currentPage - 1) * 10;
    return filteredEmployees.slice(start, start + 10);
  }, [filteredEmployees, currentPage]);

  const stats = useMemo(() => {
    return {
      total: employeesList.length,
      active: employeesList.filter((e) => e.status.toLowerCase() === "active").length,
      onLeave: employeesList.filter(
        (e) => e.status.toLowerCase() === "on leave" || e.status.toLowerCase() === "leave"
      ).length,
      resigned: employeesList.filter((e) => e.status.toLowerCase() === "resigned").length,
    };
  }, [employeesList]);

  return (
    <div className="h-full flex flex-col space-y-5 min-h-0">
      <div className="grid gap-3 sm:grid-cols-4 shrink-0">
        {[
          {
            t: "Total Employee",
            v: stats.total,
            color: "text-slate-700 bg-slate-100",
            chartColor: "text-slate-300",
          },
          {
            t: "Active",
            v: stats.active,
            color: "text-emerald-700 bg-emerald-50",
            chartColor: "text-emerald-300",
          },
          {
            t: "On Leave",
            v: stats.onLeave,
            color: "text-amber-700 bg-amber-50",
            chartColor: "text-amber-300",
          },
          {
            t: "Resigned",
            v: stats.resigned,
            color: "text-rose-700 bg-rose-50",
            chartColor: "text-rose-300",
          },
        ].map((c) => (
          <Card
            key={c.t}
            className="border-slate-200/60 bg-white/70 shadow-sm transition-all hover:shadow-md"
          >
            <CardContent className="px-3 py-2.5 flex flex-row items-center justify-between">
              <div className="text-xs font-bold text-slate-600 truncate mr-1">{c.t}</div>
              <div className="flex-1 flex justify-center mx-2 opacity-70">
                <svg
                  className={cn("w-12 h-4", c.chartColor)}
                  viewBox="0 0 40 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M0 14 L 10 8 L 20 10 L 30 4 L 40 2" />
                </svg>
              </div>
              <div
                className={cn(
                  "text-sm font-black rounded-md px-1.5 py-0.5 whitespace-nowrap",
                  c.color,
                )}
              >
                {c.v}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden rounded-2xl border border-white/60 bg-white/60 shadow-sm shadow-slate-200/50 backdrop-blur-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Employee ID</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {displayedEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-slate-400">
                    No employees match your search.
                  </TableCell>
                </TableRow>
              ) : (
                displayedEmployees.map((e) => (
                  <TableRow key={e.email}>
                    <TableCell className="pl-6 font-mono text-slate-500">
                      {e.empId || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 ring-2 ring-indigo-100/50 group-hover:ring-indigo-100 transition-all duration-300">
                          <AvatarFallback className="bg-indigo-50 text-xs text-indigo-700 font-semibold">
                            {initials(e.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors duration-200">
                            {e.name}
                          </div>
                          <div className="text-slate-400 mt-0.5">{e.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {e.role}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {e.dept}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      <Badge
                        variant="secondary"
                        className="bg-slate-100/60 border-slate-200/40 text-slate-600 px-2 py-0.5"
                      >
                        {e.shift || "Day"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "border-0 inline-flex items-center px-2 py-0.5 shadow-sm/5",
                          e.status.toLowerCase() === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : e.status.toLowerCase() === "resigned"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700",
                        )}
                      >
                        <span
                          className={cn(
                            "mr-1.5 h-1.5 w-1.5 rounded-full animate-pulse",
                            e.status.toLowerCase() === "active" 
                              ? "bg-emerald-500" 
                              : e.status.toLowerCase() === "resigned"
                              ? "bg-rose-500"
                              : "bg-amber-500",
                          )}
                        />
                        {e.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-3 rounded-lg text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all gap-1"
                        onClick={() => onEditEmployeeClick(e)}
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
          </TableBody>
        </Table>
        <div className="border-t border-slate-100/60 bg-white/40">
          <TableFooterPagination
            total={filteredEmployees.length}
            shown={displayedEmployees.length}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
