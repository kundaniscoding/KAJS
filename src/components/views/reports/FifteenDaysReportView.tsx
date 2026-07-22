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

/* ---------------- 15 Days Report View ---------------- */
export function FifteenDaysReportView({
  searchQuery,
  departmentFilter,
  currentMonth,
}: MonthlyReportProps) {
  const logs = useMemo(() => {
    const base = [
      {
        name: "John Doe",
        dept: "Engineering",
        hoursLogged: 80,
        basePay: "रु 35,000",
        overtime: "रु 1,200",
        deduction: "रु 0",
        net: "रु 36,200",
        status: "Paid",
      },
      {
        name: "Jane Smith",
        dept: "Design",
        hoursLogged: 82.5,
        basePay: "रु 32,500",
        overtime: "रु 3,400",
        deduction: "रु 500",
        net: "रु 35,400",
        status: "Paid",
      },
      {
        name: "Marco Chen",
        dept: "Analytics",
        hoursLogged: 78,
        basePay: "रु 30,000",
        overtime: "रु 0",
        deduction: "रु 1,200",
        net: "रु 28,800",
        status: "Paid",
      },
      {
        name: "Priya Patel",
        dept: "People",
        hoursLogged: 81.2,
        basePay: "रु 28,000",
        overtime: "रु 800",
        deduction: "रु 0",
        net: "रु 28,800",
        status: "Paid",
      },
      {
        name: "Liam O'Neil",
        dept: "Engineering",
        hoursLogged: 48,
        basePay: "रु 22,000",
        overtime: "रु 0",
        deduction: "रु 2,000",
        net: "रु 20,000",
        status: "Pending",
      },
    ];
    // Alter slightly based on month so filters feel alive
    return base.map((log) => {
      if (currentMonth % 2 === 0 && log.status === "Pending") return { ...log, status: "Paid" };
      return log;
    });
  }, [currentMonth]);

  const filteredLogs = useMemo(() => {
    let result = logs;
    if (departmentFilter && departmentFilter !== "All") {
      result = result.filter((l) => l.dept === departmentFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.dept.toLowerCase().includes(q) ||
          l.basePay.toLowerCase().includes(q) ||
          l.overtime.toLowerCase().includes(q) ||
          l.net.toLowerCase().includes(q) ||
          l.status.toLowerCase().includes(q),
      );
    }
    return result;
  }, [searchQuery, departmentFilter]);

  const totalWorkHours = useMemo(() => {
    return filteredLogs.reduce((sum, log) => sum + log.hoursLogged, 0);
  }, [filteredLogs]);

  return (
    <div className="h-full flex flex-col space-y-4 min-h-0">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            t: "Total Work Hours",
            v: `${totalWorkHours.toFixed(1)} hrs`,
            color: "text-indigo-700 bg-indigo-50",
            chartColor: "text-indigo-300",
          },
          {
            t: "Mid-Month Net Payroll",
            v: "रु 1,49,200",
            color: "text-emerald-700 bg-emerald-50",
            chartColor: "text-emerald-300",
          },
          {
            t: "Avg. Compliance Factor",
            v: "94.2%",
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

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden rounded-2xl border border-white/60 bg-white/60 shadow-sm shadow-slate-200/50 backdrop-blur-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Employee</TableHead>
              <TableHead className="text-center">Hours Worked</TableHead>
              <TableHead className="text-center">Base Allowance</TableHead>
              <TableHead className="text-center">Overtime Pay</TableHead>
              <TableHead className="text-center">Deductions</TableHead>
              <TableHead className="text-center">Net Payout</TableHead>
              <TableHead className="pr-6 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-slate-400">
                    No data found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((l) => (
                  <TableRow key={l.name}>
                    <TableCell className="pl-6 pr-4 text-slate-800">{l.name}</TableCell>
                    <TableCell className="text-center text-slate-700 tabular-nums">
                      {l.hoursLogged} hrs
                    </TableCell>
                    <TableCell className="text-center tabular-nums text-slate-700">
                      {l.basePay}
                    </TableCell>
                    <TableCell className="text-center tabular-nums text-emerald-600">
                      {l.overtime}
                    </TableCell>
                    <TableCell className="text-center tabular-nums text-rose-500">
                      {l.deduction}
                    </TableCell>
                    <TableCell className="text-center tabular-nums text-slate-800">
                      {l.net}
                    </TableCell>
                    <TableCell className="pl-4 pr-6 text-right">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "border-0 px-2 py-0.5 shadow-sm/5 inline-flex items-center gap-1.5",
                          l.status === "Paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700",
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full animate-pulse",
                            l.status === "Paid" ? "bg-emerald-500" : "bg-amber-500",
                          )}
                        />
                        {l.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
