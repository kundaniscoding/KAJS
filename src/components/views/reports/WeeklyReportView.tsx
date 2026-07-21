import { useEffect, useMemo, useState, useRef } from "react";
import { FileSpreadsheet, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { initialEmployees } from "@/lib/mockData";
import { AttendanceLogModal } from "@/components/modals/AttendanceLogModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";

import { MonthlyReportProps } from "./types";

/* ---------------- Weekly Report View ---------------- */
export function WeeklyReportView({
  searchQuery,
  departmentFilter,
  currentMonth,
  reportWeek,
}: MonthlyReportProps) {
  const weeklyData = useMemo(() => {
    return initialEmployees.map((emp, index) => {
      // Use currentMonth and reportWeek to vary the mock data
      const offset = currentMonth * 7 + (reportWeek || 1);
      const r = (index + offset) % 5;

      let presentDays = r === 0 ? 5 : r === 1 ? 4.5 : r === 2 ? 4 : 5;

      // Introduce week-based variance so total stats change per week
      if (index % 7 === (reportWeek || 1)) presentDays = 3;
      if (index % 11 === (reportWeek || 1)) presentDays = 2;

      const halfDays = presentDays % 1 !== 0 ? 1 : 0;
      const workedDays = Math.ceil(presentDays);
      const workedHours = presentDays * 8;

      return {
        code: emp.empId.replace("KAJS-", ""),
        name: emp.name,
        dept: emp.dept,
        workedDays,
        presentDays,
        halfDays,
        workedHours,
      };
    });
  }, [currentMonth, reportWeek]);

  const filteredWeeklyData = useMemo(() => {
    let result = weeklyData;
    if (departmentFilter && departmentFilter !== "All") {
      result = result.filter((d) => d.dept === departmentFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.code.toLowerCase().includes(q) ||
          d.dept.toLowerCase().includes(q),
      );
    }
    return result;
  }, [weeklyData, departmentFilter, searchQuery]);

  const stats = useMemo(() => {
    let totalWorkedHours = 0;
    let totalPresentDays = 0;
    filteredWeeklyData.forEach((m) => {
      totalWorkedHours += m.workedHours;
      totalPresentDays += m.presentDays;
    });
    const expectedDays = filteredWeeklyData.length * 5; // Assuming 5 days a week
    return {
      employees: filteredWeeklyData.length,
      hours: totalWorkedHours,
      present: totalPresentDays,
      compliance: expectedDays > 0 ? Math.round((totalPresentDays / expectedDays) * 100) : 0,
    };
  }, [filteredWeeklyData]);

  return (
    <div className="h-full flex flex-col space-y-4 min-h-0">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          {
            t: "Total Employees",
            v: stats.employees,
            color: "text-indigo-700 bg-indigo-50",
            chartColor: "text-indigo-300",
          },
          {
            t: "Total Worked Hours",
            v: `${stats.hours} hrs`,
            color: "text-emerald-700 bg-emerald-50",
            chartColor: "text-emerald-300",
          },
          {
            t: "Total Present Days",
            v: stats.present,
            color: "text-rose-700 bg-rose-50",
            chartColor: "text-rose-300",
          },
          {
            t: "Avg Attendance Rate",
            v: `${stats.compliance}%`,
            color: "text-slate-700 bg-slate-100",
            chartColor: "text-slate-300",
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

      <Card className="border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden w-full">
        <CardContent className="p-0 overflow-x-auto scrollbar-hide">
          <table className="w-full text-xs text-left min-w-max">
            <thead>
              <tr className="bg-slate-50/40 border-b border-slate-100/60">
                <th className="py-3 px-4 font-bold text-slate-700 w-[80px]">Code</th>
                <th className="py-3 px-4 font-bold text-slate-700 w-[200px]">Employee</th>
                <th className="py-3 px-4 font-bold text-slate-700">Department</th>
                <th className="py-3 px-4 font-bold text-slate-700 text-center">Worked Days</th>
                <th className="py-3 px-4 font-bold text-slate-700 text-center">Present Days</th>
                <th className="py-3 px-4 font-bold text-slate-700 text-center">Half Days</th>
                <th className="py-3 px-4 font-bold text-slate-700 text-right">Worked Hours</th>
              </tr>
            </thead>
            <tbody>
              {filteredWeeklyData.map((row) => (
                <tr
                  key={row.code}
                  className="border-b border-slate-100/60 last:border-0 hover:bg-slate-50/30"
                >
                  <td className="py-3 px-4 font-bold text-slate-800">{row.code}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800 text-xs">{row.name}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{row.dept}</td>
                  <td className="py-3 px-4 text-center font-bold tabular-nums text-slate-700">
                    {row.workedDays}
                  </td>
                  <td className="py-3 px-4 text-center font-bold tabular-nums text-slate-700">
                    {row.presentDays}
                  </td>
                  <td className="py-3 px-4 text-center font-bold tabular-nums text-slate-700">
                    {row.halfDays}
                  </td>
                  <td className="py-3 px-4 text-right font-black tabular-nums text-emerald-600">
                    {row.workedHours} hrs
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
