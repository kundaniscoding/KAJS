import { DepartmentsViewProps } from "./types";
import { useMemo, useState, useEffect } from "react";
import { Building2, Edit, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { TableFooterPagination } from "@/components/TableFooterPagination";

export function DepartmentsView({
  searchQuery,
  departmentsList,
  setDepartmentsList,
  onEditDeptClick,
  onViewDeptClick,
}: DepartmentsViewProps) {
  const toneMap: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    sky: "bg-sky-50 text-sky-700",
    violet: "bg-violet-50 text-violet-700",
    slate: "bg-slate-100 text-slate-700",
    teal: "bg-teal-50 text-teal-700",
  };

  const filteredDepartments = useMemo(() => {
    if (!searchQuery) return departmentsList;
    const q = searchQuery.toLowerCase();
    return departmentsList.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.head.toLowerCase().includes(q) ||
        d.budget.toLowerCase().includes(q) ||
        d.employees.toString().includes(q) ||
        d.openRoles.toString().includes(q),
    );
  }, [searchQuery, departmentsList]);

  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const displayedDepartments = useMemo(() => {
    const start = (currentPage - 1) * 10;
    return filteredDepartments.slice(start, start + 10);
  }, [filteredDepartments, currentPage]);

  const stats = useMemo(() => {
    const totalEmployees = departmentsList.reduce((acc, d) => acc + d.employees, 0);
    const totalOpenRoles = departmentsList.reduce((acc, d) => acc + d.openRoles, 0);
    return {
      total: departmentsList.length,
      employees: totalEmployees,
      openRoles: totalOpenRoles,
    };
  }, [departmentsList]);

  return (
    <div className="h-full flex flex-col space-y-5 min-h-0">
      <div className="grid gap-3 sm:grid-cols-3 shrink-0">
        {[
          {
            t: "Total Departments",
            v: stats.total,
            color: "text-indigo-700 bg-indigo-50",
            chartColor: "text-indigo-300",
          },
          {
            t: "Total Employees",
            v: stats.employees,
            color: "text-emerald-700 bg-emerald-50",
            chartColor: "text-emerald-300",
          },
          {
            t: "Open Roles",
            v: stats.openRoles,
            color: "text-amber-700 bg-amber-50",
            chartColor: "text-amber-300",
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
              <TableHead className="pl-6">Department</TableHead>
              <TableHead>Head of Department</TableHead>
              <TableHead className="text-center">Employees</TableHead>
              <TableHead className="text-center">Open Roles</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {displayedDepartments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-slate-400">
                    No departments match your search.
                  </TableCell>
                </TableRow>
              ) : (
                displayedDepartments.map((d) => (
                  <TableRow key={d.name}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl shadow-sm", toneMap[d.tone] || toneMap.slate)}
                        >
                          <Building2 className="h-4.5 w-4.5" />
                        </div>
                        <div className="text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors duration-200">
                          {d.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {d.head}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className="bg-slate-100/60 border-slate-200/40 text-slate-600 font-bold px-2 py-0.5"
                      >
                        {d.employees}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {d.openRoles > 0 ? (
                        <Badge
                          variant="secondary"
                          className="bg-amber-50 border-0 text-amber-700 font-bold px-2 py-0.5"
                        >
                          {d.openRoles} Open
                        </Badge>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600 text-right">
                      {d.budget}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-3 rounded-lg text-[10px] font-semibold text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all gap-1.5"
                          onClick={() => onViewDeptClick(d)}
                        >
                          <Users className="h-3.5 w-3.5" />
                          Roster
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 rounded-lg text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all"
                          onClick={() => onEditDeptClick(d)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
          </TableBody>
        </Table>
        <div className="border-t border-slate-100/60 bg-white/40">
          <TableFooterPagination
            total={filteredDepartments.length}
            shown={displayedDepartments.length}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
