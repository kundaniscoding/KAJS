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

/* ---------------- Daily Report View ---------------- */
export function DailyReportView({
  searchQuery,
  departmentFilter,
  currentMonth,
}: MonthlyReportProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const logs = useMemo(() => {
    const base = [
      {
        name: "John Doe",
        role: "Backend Engineer",
        dept: "Engineering",
        checkIn: "9:02 AM",
        device: "DEV-8025",
        verify: "Face Recognition",
        status: "Present",
        hoursLogged: 8.0,
      },
      {
        name: "Jane Smith",
        role: "Product Designer",
        dept: "Design",
        checkIn: "8:56 AM",
        device: "DEV-8025",
        verify: "RFID Card",
        status: "Present",
        hoursLogged: 8.2,
      },
      {
        name: "Marco Chen",
        role: "Data Analyst",
        dept: "Analytics",
        checkIn: "9:15 AM",
        device: "DEV-9012",
        verify: "Face Recognition",
        status: "Late",
        hoursLogged: 7.5,
      },
      {
        name: "Priya Patel",
        role: "HR Specialist",
        dept: "People",
        checkIn: "8:45 AM",
        device: "DEV-8025",
        verify: "Fingerprint",
        status: "Present",
        hoursLogged: 8.5,
      },
      {
        name: "Noah Kim",
        role: "DevOps Engineer",
        dept: "Engineering",
        checkIn: "9:05 AM",
        device: "DEV-9012",
        verify: "RFID Card",
        status: "Present",
        hoursLogged: 8.0,
      },
      {
        name: "Sofia Alvarez",
        role: "Sales Lead",
        dept: "Revenue",
        checkIn: "9:42 AM",
        device: "DEV-8025",
        verify: "Face Recognition",
        status: "Late",
        hoursLogged: 6.8,
      },
      {
        name: "David Miller",
        role: "Security Engineer",
        dept: "Engineering",
        checkIn: "9:00 AM",
        device: "DEV-9012",
        verify: "Face Recognition",
        status: "Present",
        hoursLogged: 8.0,
      },
      {
        name: "Aisha Bello",
        role: "Recruiter",
        dept: "People",
        checkIn: "8:59 AM",
        device: "DEV-8025",
        verify: "Fingerprint",
        status: "Present",
        hoursLogged: 8.0,
      },
      {
        name: "Elena Rostova",
        role: "QA Lead",
        dept: "Engineering",
        checkIn: "—",
        device: "—",
        verify: "—",
        status: "Absent",
        hoursLogged: 0.0,
      },
    ];
    // Alter data slightly based on month to simulate filter working
    return base.map((log) => {
      if (currentMonth % 2 !== 0 && log.status === "Late")
        return { ...log, status: "Present", hoursLogged: 8.0, checkIn: "8:55 AM" };
      if (currentMonth % 3 === 0 && log.name === "David Miller")
        return { ...log, status: "Absent", hoursLogged: 0, checkIn: "—", device: "—", verify: "—" };
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
          l.role.toLowerCase().includes(q) ||
          l.dept.toLowerCase().includes(q) ||
          l.checkIn.toLowerCase().includes(q) ||
          l.device.toLowerCase().includes(q) ||
          l.verify.toLowerCase().includes(q) ||
          l.status.toLowerCase().includes(q),
      );
    }
    return result;
  }, [searchQuery, departmentFilter]);

  const stats = useMemo(() => {
    return {
      scheduled: logs.length,
      present: logs.filter((l) => l.status === "Present").length,
      late: logs.filter((l) => l.status === "Late").length,
      absent: logs.filter((l) => l.status === "Absent").length,
    };
  }, []);

  const totalWorkHours = useMemo(() => {
    return filteredLogs.reduce((sum, log) => sum + log.hoursLogged, 0);
  }, [filteredLogs]);

  return (
    <div className="h-full flex flex-col space-y-4 min-h-0">
      <div className="grid gap-3 sm:grid-cols-5">
        {[
          {
            t: "Total Scheduled",
            v: stats.scheduled,
            color: "text-slate-700 bg-slate-100",
            chartColor: "text-slate-300",
          },
          {
            t: "Present",
            v: stats.present,
            color: "text-emerald-700 bg-emerald-50",
            chartColor: "text-emerald-300",
          },
          {
            t: "Late Arrivals",
            v: stats.late,
            color: "text-amber-700 bg-amber-50",
            chartColor: "text-amber-300",
          },
          {
            t: "Absent",
            v: stats.absent,
            color: "text-rose-700 bg-rose-50",
            chartColor: "text-rose-300",
          },
          {
            t: "Total Work Hours",
            v: `${totalWorkHours.toFixed(1)} hrs`,
            color: "text-indigo-700 bg-indigo-50",
            chartColor: "text-indigo-300",
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

      <Card className="border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
        <CardContent className="p-0 flex-1 overflow-auto custom-scrollbar">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role & Dept</TableHead>
                <TableHead>Check-in Time</TableHead>
                <TableHead>Device ID</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead className="text-center">
                  Work Hours
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((l) => (
                <TableRow
                  key={l.name}
                  className="hover:bg-indigo-50/10 transition-colors border-b border-slate-100/60 last:border-0"
                >
                  <TableCell className="font-semibold text-slate-800">{l.name}</TableCell>
                  <TableCell className="text-xs">
                    <div className="font-medium text-slate-600">{l.role}</div>
                    <div className="text-slate-400 font-medium">{l.dept}</div>
                  </TableCell>
                  <TableCell className="text-xs font-semibold tabular-nums text-slate-600">
                    {l.checkIn}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-slate-505">
                    {l.device}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{l.verify}</TableCell>
                  <TableCell className="text-xs text-center font-bold tabular-nums text-slate-700">
                    {l.hoursLogged > 0 ? `${l.hoursLogged.toFixed(1)} hrs` : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "border-0 text-[10px] px-2 py-0.5 font-semibold",
                        l.status === "Present" && "bg-emerald-50 text-emerald-700",
                        l.status === "Late" && "bg-amber-50 text-amber-700",
                        l.status === "Absent" && "bg-rose-50 text-rose-700",
                      )}
                    >
                      {l.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
