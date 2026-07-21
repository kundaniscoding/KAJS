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

interface ReportProps {
  searchQuery: string;
}

interface MonthlyReportProps extends ReportProps {
  departmentFilter: string;
  currentMonth: number;
  currentYear: number;
  reportWeek?: number;
}

/* ---------------- Daily Report View ---------------- */
export function DailyReportView({ searchQuery, departmentFilter, currentMonth }: MonthlyReportProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const logs = useMemo(() => {
    const base = [
      { name: "John Doe", role: "Backend Engineer", dept: "Engineering", checkIn: "9:02 AM", device: "DEV-8025", verify: "Face Recognition", status: "Present", hoursLogged: 8.0 },
      { name: "Jane Smith", role: "Product Designer", dept: "Design", checkIn: "8:56 AM", device: "DEV-8025", verify: "RFID Card", status: "Present", hoursLogged: 8.2 },
      { name: "Marco Chen", role: "Data Analyst", dept: "Analytics", checkIn: "9:15 AM", device: "DEV-9012", verify: "Face Recognition", status: "Late", hoursLogged: 7.5 },
      { name: "Priya Patel", role: "HR Specialist", dept: "People", checkIn: "8:45 AM", device: "DEV-8025", verify: "Fingerprint", status: "Present", hoursLogged: 8.5 },
      { name: "Noah Kim", role: "DevOps Engineer", dept: "Engineering", checkIn: "9:05 AM", device: "DEV-9012", verify: "RFID Card", status: "Present", hoursLogged: 8.0 },
      { name: "Sofia Alvarez", role: "Sales Lead", dept: "Revenue", checkIn: "9:42 AM", device: "DEV-8025", verify: "Face Recognition", status: "Late", hoursLogged: 6.8 },
      { name: "David Miller", role: "Security Engineer", dept: "Engineering", checkIn: "9:00 AM", device: "DEV-9012", verify: "Face Recognition", status: "Present", hoursLogged: 8.0 },
      { name: "Aisha Bello", role: "Recruiter", dept: "People", checkIn: "8:59 AM", device: "DEV-8025", verify: "Fingerprint", status: "Present", hoursLogged: 8.0 },
      { name: "Elena Rostova", role: "QA Lead", dept: "Engineering", checkIn: "—", device: "—", verify: "—", status: "Absent", hoursLogged: 0.0 },
    ];
    // Alter data slightly based on month to simulate filter working
    return base.map(log => {
      if (currentMonth % 2 !== 0 && log.status === "Late") return { ...log, status: "Present", hoursLogged: 8.0, checkIn: "8:55 AM" };
      if (currentMonth % 3 === 0 && log.name === "David Miller") return { ...log, status: "Absent", hoursLogged: 0, checkIn: "—", device: "—", verify: "—" };
      return log;
    });
  }, [currentMonth]);

  const filteredLogs = useMemo(() => {
    let result = logs;
    if (departmentFilter && departmentFilter !== "All") {
      result = result.filter(l => l.dept === departmentFilter);
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
          l.status.toLowerCase().includes(q)
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
    <div className="space-y-6">

      <div className="grid gap-3 sm:grid-cols-5">
        {[
          { t: "Total Scheduled", v: stats.scheduled, color: "text-slate-700 bg-slate-100", chartColor: "text-slate-300" },
          { t: "Present", v: stats.present, color: "text-emerald-700 bg-emerald-50", chartColor: "text-emerald-300" },
          { t: "Late Arrivals", v: stats.late, color: "text-amber-700 bg-amber-50", chartColor: "text-amber-300" },
          { t: "Absent", v: stats.absent, color: "text-rose-700 bg-rose-50", chartColor: "text-rose-300" },
          { t: "Total Work Hours", v: `${totalWorkHours.toFixed(1)} hrs`, color: "text-indigo-700 bg-indigo-50", chartColor: "text-indigo-300" },
        ].map((c) => (
          <Card key={c.t} className="border-slate-200/60 bg-white/70 shadow-sm transition-all hover:shadow-md">
            <CardContent className="px-3 py-2.5 flex flex-row items-center justify-between">
              <div className="text-xs font-bold text-slate-600 truncate mr-1">{c.t}</div>
              <div className="flex-1 flex justify-center mx-2 opacity-70">
                 <svg className={cn("w-12 h-4", c.chartColor)} viewBox="0 0 40 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M0 14 L 10 8 L 20 10 L 30 4 L 40 2" />
                 </svg>
              </div>
              <div className={cn("text-sm font-black rounded-md px-1.5 py-0.5 whitespace-nowrap", c.color)}>{c.v}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/40 border-b border-slate-100 hover:bg-slate-50/40">
                <TableHead className="py-4 font-semibold text-slate-700">Employee</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700">Role & Dept</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700">Check-in Time</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700">Device ID</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700">Verification</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700 text-center">Work Hours</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((l) => (
                <TableRow key={l.name} className="hover:bg-indigo-50/10 transition-colors border-b border-slate-100/60 last:border-0">
                  <TableCell className="py-3 font-semibold text-slate-800">{l.name}</TableCell>
                  <TableCell className="py-3 text-xs">
                    <div className="font-medium text-slate-600">{l.role}</div>
                    <div className="text-slate-400 font-medium">{l.dept}</div>
                  </TableCell>
                  <TableCell className="py-3 text-xs font-semibold tabular-nums text-slate-600">{l.checkIn}</TableCell>
                  <TableCell className="py-3 text-xs font-mono text-slate-505">{l.device}</TableCell>
                  <TableCell className="py-3 text-xs text-slate-500">{l.verify}</TableCell>
                  <TableCell className="py-3 text-xs text-center font-bold tabular-nums text-slate-700">
                    {l.hoursLogged > 0 ? `${l.hoursLogged.toFixed(1)} hrs` : "—"}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "border-0 text-[10px] px-2 py-0.5 font-semibold",
                        l.status === "Present" && "bg-emerald-50 text-emerald-700",
                        l.status === "Late" && "bg-amber-50 text-amber-700",
                        l.status === "Absent" && "bg-rose-50 text-rose-700"
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

/* ---------------- Weekly Report View ---------------- */
export function WeeklyReportView({ searchQuery, departmentFilter, currentMonth, reportWeek }: MonthlyReportProps) {
  const weeklyData = useMemo(() => {
    return initialEmployees.map((emp, index) => {
      // Use currentMonth and reportWeek to vary the mock data
      const offset = (currentMonth * 7) + (reportWeek || 1);
      const r = (index + offset) % 5;
      
      let presentDays = r === 0 ? 5 : r === 1 ? 4.5 : r === 2 ? 4 : 5;
      
      // Introduce week-based variance so total stats change per week
      if (index % 7 === (reportWeek || 1)) presentDays = 3;
      if (index % 11 === (reportWeek || 1)) presentDays = 2;
      
      const halfDays = (presentDays % 1 !== 0) ? 1 : 0;
      const workedDays = Math.ceil(presentDays);
      const workedHours = presentDays * 8;
      
      return {
        code: emp.empId.replace("KAJS-", ""),
        name: emp.name,
        dept: emp.dept,
        workedDays,
        presentDays,
        halfDays,
        workedHours
      };
    });
  }, [currentMonth, reportWeek]);

  const filteredWeeklyData = useMemo(() => {
    let result = weeklyData;
    if (departmentFilter && departmentFilter !== "All") {
      result = result.filter(d => d.dept === departmentFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.code.toLowerCase().includes(q) ||
        d.dept.toLowerCase().includes(q)
      );
    }
    return result;
  }, [weeklyData, departmentFilter, searchQuery]);

  const stats = useMemo(() => {
    let totalWorkedHours = 0;
    let totalPresentDays = 0;
    filteredWeeklyData.forEach(m => {
      totalWorkedHours += m.workedHours;
      totalPresentDays += m.presentDays;
    });
    const expectedDays = filteredWeeklyData.length * 5; // Assuming 5 days a week
    return {
      employees: filteredWeeklyData.length,
      hours: totalWorkedHours,
      present: totalPresentDays,
      compliance: expectedDays > 0 ? Math.round((totalPresentDays / expectedDays) * 100) : 0
    };
  }, [filteredWeeklyData]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { t: "Total Employees", v: stats.employees, color: "text-indigo-700 bg-indigo-50", chartColor: "text-indigo-300" },
          { t: "Total Worked Hours", v: `${stats.hours} hrs`, color: "text-emerald-700 bg-emerald-50", chartColor: "text-emerald-300" },
          { t: "Total Present Days", v: stats.present, color: "text-rose-700 bg-rose-50", chartColor: "text-rose-300" },
          { t: "Avg Attendance Rate", v: `${stats.compliance}%`, color: "text-slate-700 bg-slate-100", chartColor: "text-slate-300" },
        ].map((c) => (
          <Card key={c.t} className="border-slate-200/60 bg-white/70 shadow-sm transition-all hover:shadow-md">
            <CardContent className="px-3 py-2.5 flex flex-row items-center justify-between">
              <div className="text-xs font-bold text-slate-600 truncate mr-1">{c.t}</div>
              <div className="flex-1 flex justify-center mx-2 opacity-70">
                 <svg className={cn("w-12 h-4", c.chartColor)} viewBox="0 0 40 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M0 14 L 10 8 L 20 10 L 30 4 L 40 2" />
                 </svg>
              </div>
              <div className={cn("text-sm font-black rounded-md px-1.5 py-0.5 whitespace-nowrap", c.color)}>{c.v}</div>
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
                <tr key={row.code} className="border-b border-slate-100/60 last:border-0 hover:bg-slate-50/30">
                  <td className="py-3 px-4 font-bold text-slate-800">{row.code}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800 text-xs">{row.name}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{row.dept}</td>
                  <td className="py-3 px-4 text-center font-bold tabular-nums text-slate-700">{row.workedDays}</td>
                  <td className="py-3 px-4 text-center font-bold tabular-nums text-slate-700">{row.presentDays}</td>
                  <td className="py-3 px-4 text-center font-bold tabular-nums text-slate-700">{row.halfDays}</td>
                  <td className="py-3 px-4 text-right font-black tabular-nums text-emerald-600">{row.workedHours} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- 15 Days Report View ---------------- */
export function FifteenDaysReportView({ searchQuery, departmentFilter, currentMonth }: MonthlyReportProps) {
  const logs = useMemo(() => {
    const base = [
      { name: "John Doe", dept: "Engineering", hoursLogged: 80, basePay: "रु 35,000", overtime: "रु 1,200", deduction: "रु 0", net: "रु 36,200", status: "Paid" },
      { name: "Jane Smith", dept: "Design", hoursLogged: 82.5, basePay: "रु 32,500", overtime: "रु 3,400", deduction: "रु 500", net: "रु 35,400", status: "Paid" },
      { name: "Marco Chen", dept: "Analytics", hoursLogged: 78, basePay: "रु 30,000", overtime: "रु 0", deduction: "रु 1,200", net: "रु 28,800", status: "Paid" },
      { name: "Priya Patel", dept: "People", hoursLogged: 81.2, basePay: "रु 28,000", overtime: "रु 800", deduction: "रु 0", net: "रु 28,800", status: "Paid" },
      { name: "Liam O'Neil", dept: "Engineering", hoursLogged: 48, basePay: "रु 22,000", overtime: "रु 0", deduction: "रु 2,000", net: "रु 20,000", status: "Pending" },
    ];
    // Alter slightly based on month so filters feel alive
    return base.map(log => {
      if (currentMonth % 2 === 0 && log.status === "Pending") return { ...log, status: "Paid" };
      return log;
    });
  }, [currentMonth]);

  const filteredLogs = useMemo(() => {
    let result = logs;
    if (departmentFilter && departmentFilter !== "All") {
      result = result.filter(l => l.dept === departmentFilter);
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
          l.status.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery, departmentFilter]);

  const totalWorkHours = useMemo(() => {
    return filteredLogs.reduce((sum, log) => sum + log.hoursLogged, 0);
  }, [filteredLogs]);

  return (
    <div className="space-y-6">

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { t: "Total Work Hours", v: `${totalWorkHours.toFixed(1)} hrs`, color: "text-indigo-700 bg-indigo-50", chartColor: "text-indigo-300" },
          { t: "Mid-Month Net Payroll", v: "रु 1,49,200", color: "text-emerald-700 bg-emerald-50", chartColor: "text-emerald-300" },
          { t: "Avg. Compliance Factor", v: "94.2%", color: "text-slate-700 bg-slate-100", chartColor: "text-slate-300" },
        ].map((c) => (
          <Card key={c.t} className="border-slate-200/60 bg-white/70 shadow-sm transition-all hover:shadow-md">
            <CardContent className="px-3 py-2.5 flex flex-row items-center justify-between">
              <div className="text-xs font-bold text-slate-600 truncate mr-1">{c.t}</div>
              <div className="flex-1 flex justify-center mx-2 opacity-70">
                 <svg className={cn("w-12 h-4", c.chartColor)} viewBox="0 0 40 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M0 14 L 10 8 L 20 10 L 30 4 L 40 2" />
                 </svg>
              </div>
              <div className={cn("text-sm font-black rounded-md px-1.5 py-0.5 whitespace-nowrap", c.color)}>{c.v}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/40 border-b border-slate-100 hover:bg-slate-50/40">
                <TableHead className="py-4 font-semibold text-slate-700">Employee</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700 text-center">Hours Worked</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700 text-center">Base Allowance</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700 text-center">Overtime Pay</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700 text-center">Deductions</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700 text-center">Net Payout</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((l) => (
                <TableRow key={l.name} className="hover:bg-indigo-50/10 transition-colors border-b border-slate-100/60 last:border-0">
                  <TableCell className="py-3 font-semibold text-slate-800">{l.name}</TableCell>
                  <TableCell className="py-3 text-xs text-center font-bold text-slate-700 tabular-nums">{l.hoursLogged} hrs</TableCell>
                  <TableCell className="py-3 text-xs text-center tabular-nums font-semibold text-slate-700">{l.basePay}</TableCell>
                  <TableCell className="py-3 text-xs text-center tabular-nums font-semibold text-emerald-600">{l.overtime}</TableCell>
                  <TableCell className="py-3 text-xs text-center tabular-nums font-semibold text-rose-500">{l.deduction}</TableCell>
                  <TableCell className="py-3 text-xs text-center tabular-nums font-bold text-slate-800">{l.net}</TableCell>
                  <TableCell className="py-3 text-right">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "border-0 text-[10px] px-2 py-0.5 font-semibold",
                        l.status === "Paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
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

/* ---------------- Monthly Report View ---------------- */
export function MonthlyReportView({ searchQuery, departmentFilter, currentMonth, currentYear }: MonthlyReportProps) {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedEmpLog, setSelectedEmpLog] = useState<{ name: string; code: string } | undefined>(undefined);
  const [selectedDateLog, setSelectedDateLog] = useState<{ date: string; month: string; year: string } | undefined>(undefined);

  const daysCount = new Date(currentYear, currentMonth + 1, 0).getDate();

  const daysInMonth = Array.from({ length: daysCount }, (_, i) => {
    const d = new Date(currentYear, currentMonth, i + 1);
    return {
      date: (i + 1).toString().padStart(2, "0"),
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      year: currentYear.toString(),
    };
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const baseMatrixData = useMemo(() => {
    const daysCount = new Date(currentYear, currentMonth + 1, 0).getDate();
    return initialEmployees.map((emp, index) => {
      const attendance: Record<number, string> = {};
      let present = 0;
      let absent = 0;

      // Generate some consistent mock data for selected month
      for (let i = 1; i <= daysCount; i++) {
        const d = new Date(currentYear, currentMonth, i);
        if (d.getDay() === 0 || d.getDay() === 6) {
          attendance[i] = "-"; // Weekend
        } else {
          const r = (index * 7 + i) % 10;
          if (r < 8) { attendance[i] = "P"; present++; }
          else if (r === 8) { attendance[i] = "HD"; present += 0.5; absent += 0.5; }
          else { attendance[i] = "A"; absent++; }
        }
      }

      return {
        code: emp.empId.replace("KAJS-", ""),
        name: emp.name,
        dept: emp.dept,
        attendance,
        present,
        absent,
        extra: 0,
        total: present + absent
      };
    });
  }, [currentMonth, currentYear]);

  const filteredMatrix = useMemo(() => {
    let result = baseMatrixData;
    if (departmentFilter !== "All") {
      result = result.filter(m => m.dept === departmentFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q));
    }
    return result;
  }, [searchQuery, baseMatrixData, departmentFilter]);

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredMatrix.length / itemsPerPage);

  const paginatedMatrix = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMatrix.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMatrix, currentPage]);

  // Summary stats for the top
  const stats = useMemo(() => {
    let totalPresent = 0;
    let totalAbsent = 0;
    filteredMatrix.forEach(m => {
      totalPresent += m.present;
      totalAbsent += m.absent;
    });
    return {
      employees: filteredMatrix.length,
      present: totalPresent,
      absent: totalAbsent,
      compliance: totalPresent + totalAbsent > 0 ? Math.round((totalPresent / (totalPresent + totalAbsent)) * 100) : 0
    };
  }, [filteredMatrix]);

  return (
    <div className="space-y-6">

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { t: "Total Employees", v: stats.employees, color: "text-indigo-700 bg-indigo-50", chartColor: "text-indigo-300" },
          { t: "Total Present Days", v: stats.present, color: "text-emerald-700 bg-emerald-50", chartColor: "text-emerald-300" },
          { t: "Total Absent Days", v: stats.absent, color: "text-rose-700 bg-rose-50", chartColor: "text-rose-300" },
          { t: "Avg Attendance Rate", v: `${stats.compliance}%`, color: "text-slate-700 bg-slate-100", chartColor: "text-slate-300" },
        ].map((c) => (
          <Card key={c.t} className="border-slate-200/60 bg-white/70 shadow-sm transition-all hover:shadow-md">
            <CardContent className="px-3 py-2.5 flex flex-row items-center justify-between">
              <div className="text-xs font-bold text-slate-600 truncate mr-1">{c.t}</div>
              <div className="flex-1 flex justify-center mx-2 opacity-70">
                <svg className={cn("w-12 h-4", c.chartColor)} viewBox="0 0 40 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M0 14 L 10 8 L 20 10 L 30 4 L 40 2" />
                </svg>
              </div>
              <div className={cn("text-sm font-black rounded-md px-1.5 py-0.5 whitespace-nowrap", c.color)}>{c.v}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Attendance Matrix */}
      <Card className="border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden w-full">
        <CardContent className="p-0 overflow-x-auto scrollbar-hide">
          <table className="w-full text-xs text-left min-w-max">
            <thead>
              <tr className="bg-slate-50/40 border-b border-slate-100/60">
                <th className="py-3 px-2 text-center font-bold text-slate-700 sticky left-0 bg-slate-50/90 z-20 w-[60px]">Code</th>
                <th className="py-3 px-4 font-bold text-slate-700 sticky left-[60px] bg-slate-50/90 z-20 w-[200px] whitespace-nowrap shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]">Employee Name</th>
                {daysInMonth.map(d => (
                  <th key={d.date} className="py-2 px-1 text-center font-semibold text-slate-600 min-w-[44px] w-[44px]">
                    <div className="text-[11px] font-bold text-slate-800">{d.date}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">{d.day}</div>
                  </th>
                ))}
                <th className="py-3 px-1 font-bold text-slate-700 text-center sticky right-[150px] bg-slate-50/90 z-20 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)] w-[60px]">Present</th>
                <th className="py-3 px-1 font-bold text-slate-700 text-center sticky right-[100px] bg-slate-50/90 z-20 w-[50px]">Absent</th>
                <th className="py-3 px-1 font-bold text-slate-700 text-center sticky right-[60px] bg-slate-50/90 z-20 w-[40px]">OT</th>
                <th className="py-3 px-1 font-bold text-slate-700 text-center sticky right-0 bg-slate-50/90 z-20 w-[60px]">Total Days</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMatrix.map((row) => (
                <tr key={row.code} className="border-b border-slate-100/60 last:border-0 hover:bg-slate-50/30">
                  <td className="py-2.5 px-2 text-center font-bold text-slate-800 sticky left-0 bg-white/95 z-10 w-[60px]">{row.code}</td>
                  <td className="py-2.5 px-4 sticky left-[60px] bg-white/95 z-10 w-[200px] whitespace-nowrap shadow-[4px_0_6px_-2px_rgba(0,0,0,0.02)]">
                    <div className="font-bold text-slate-800 text-xs truncate">{row.name}</div>
                  </td>
                  {daysInMonth.map((d, i) => {
                    const status = row.attendance[(i + 1) as keyof typeof row.attendance] || "-";
                    return (
                      <td key={d.date} className="py-2.5 px-1 text-center min-w-[44px] w-[44px]">
                        {status === "P" && (
                          <button
                            onClick={() => {
                              setSelectedEmpLog({ name: row.name, code: row.code });
                              setSelectedDateLog({ date: d.date, month: d.month, year: d.year });
                              setIsLogModalOpen(true);
                            }}
                            className="mx-auto inline-flex w-7 h-6 items-center justify-center bg-emerald-100/60 text-emerald-700 font-bold rounded shadow-sm text-[10px] hover:bg-emerald-200 transition-colors"
                          >
                            P
                          </button>
                        )}
                        {status === "HD" && (
                          <button
                            onClick={() => {
                              setSelectedEmpLog({ name: row.name, code: row.code });
                              setSelectedDateLog({ date: d.date, month: d.month, year: d.year });
                              setIsLogModalOpen(true);
                            }}
                            className="mx-auto inline-flex w-7 h-6 items-center justify-center bg-amber-100/60 text-amber-700 font-bold rounded shadow-sm text-[10px] hover:bg-amber-200 transition-colors"
                          >
                            HD
                          </button>
                        )}
                        {status === "A" && (
                          <button
                            onClick={() => {
                              setSelectedEmpLog({ name: row.name, code: row.code });
                              setSelectedDateLog({ date: d.date, month: d.month, year: d.year });
                              setIsLogModalOpen(true);
                            }}
                            className="mx-auto inline-flex w-7 h-6 items-center justify-center bg-rose-100/60 text-rose-700 font-bold rounded shadow-sm text-[10px] hover:bg-rose-200 transition-colors"
                          >
                            A
                          </button>
                        )}
                        {status === "-" && (
                          <span className="text-slate-300 font-medium">-</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="py-2.5 px-1 font-bold text-emerald-700 text-center sticky right-[150px] bg-white/95 z-10 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.02)]">{row.present}</td>
                  <td className="py-2.5 px-1 font-bold text-rose-600 text-center sticky right-[100px] bg-white/95 z-10">{row.absent}</td>
                  <td className="py-2.5 px-1 font-bold text-blue-600 text-center sticky right-[60px] bg-white/95 z-10">{row.extra}</td>
                  <td className="py-2.5 px-1 font-black text-slate-800 text-center sticky right-0 bg-white/95 z-10">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>

        {true && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/30">
            <div className="text-xs text-slate-500 font-medium">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredMatrix.length)} of {filteredMatrix.length} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 px-2 text-xs bg-white"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <div className="text-xs font-semibold px-2 text-slate-700">
                Page {Math.max(1, currentPage)} of {Math.max(1, totalPages)}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="h-8 px-2 text-xs bg-white"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <AttendanceLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        employeeInfo={selectedEmpLog}
        dateInfo={selectedDateLog}
      />
    </div>
  );
}
