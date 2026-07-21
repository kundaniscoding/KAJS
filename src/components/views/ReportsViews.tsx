import { useEffect, useMemo, useState } from "react";
import { FileSpreadsheet } from "lucide-react";
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

/* ---------------- Daily Report View ---------------- */
export function DailyReportView({ searchQuery }: ReportProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const logs = [
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

  const filteredLogs = useMemo(() => {
    if (!searchQuery) return logs;
    const q = searchQuery.toLowerCase();
    return logs.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.role.toLowerCase().includes(q) ||
        l.dept.toLowerCase().includes(q) ||
        l.checkIn.toLowerCase().includes(q) ||
        l.device.toLowerCase().includes(q) ||
        l.verify.toLowerCase().includes(q) ||
        l.status.toLowerCase().includes(q)
    );
  }, [searchQuery]);

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

      <div className="grid gap-4 sm:grid-cols-5">
        {[
          { t: "Total Scheduled", v: stats.scheduled, c: "text-slate-600 bg-slate-50" },
          { t: "Present", v: stats.present, c: "text-emerald-700 bg-emerald-50" },
          { t: "Late Arrivals", v: stats.late, c: "text-amber-700 bg-amber-50" },
          { t: "Absent", v: stats.absent, c: "text-rose-700 bg-rose-50" },
          { t: "Total Work Hours", v: `${totalWorkHours.toFixed(1)} hrs`, c: "text-indigo-700 bg-indigo-50" },
        ].map((s) => (
          <Card key={s.t} className="border-slate-200/60 bg-white/70 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{s.t}</div>
                <div className="text-xl font-extrabold text-slate-800 mt-1">{s.v}</div>
              </div>
              <span className={cn("text-xs font-bold px-2 py-1 rounded-md", s.c)}>Today</span>
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
export function WeeklyReportView({ searchQuery }: ReportProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = [
    { name: "Engineering", Expected: 40, Logged: 38.8 },
    { name: "Product", Expected: 40, Logged: 39.5 },
    { name: "Design", Expected: 40, Logged: 36.4 },
    { name: "Marketing", Expected: 40, Logged: 37.2 },
    { name: "Sales", Expected: 40, Logged: 41.2 },
    { name: "People Ops", Expected: 40, Logged: 38.0 },
  ];

  const highlights = [
    { name: "Jane Smith", hours: 42.5, compliance: "98.2%", OT: 2.5 },
    { name: "John Doe", hours: 40.0, compliance: "96.4%", OT: 0.0 },
    { name: "Marco Chen", hours: 38.8, compliance: "92.1%", OT: 0.0 },
    { name: "Sofia Alvarez", hours: 45.2, compliance: "95.0%", OT: 5.2 },
    { name: "Liam O'Neil", hours: 24.0, compliance: "60.0%", OT: 0.0 },
  ];

  const filteredHighlights = useMemo(() => {
    if (!searchQuery) return highlights;
    const q = searchQuery.toLowerCase();
    return highlights.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.hours.toString().includes(q) ||
        h.compliance.toLowerCase().includes(q) ||
        h.OT.toString().includes(q)
    );
  }, [searchQuery]);

  const totalWorkHours = useMemo(() => {
    return filteredHighlights.reduce((sum, h) => sum + h.hours, 0);
  }, [filteredHighlights]);

  return (
    <div className="space-y-6">

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-slate-200/60 bg-white/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">Average Hours Logged per Department</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px] w-full pt-4">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.6} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <ChartTooltip />
                  <Bar dataKey="Logged" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">Loading chart...</div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {[
            { t: "Total Work Hours", v: `${totalWorkHours.toFixed(1)} hrs`, desc: "Sum of working hours for roster" },
            { t: "Total Overtime Logged", v: "45.0 hrs", desc: "Across all active teams" },
            { t: "Shift Compliance Rate", v: "96.4%", desc: "Expected vs actual compliance" },
          ].map((w) => (
            <Card key={w.t} className="border-slate-200/60 bg-white/70 shadow-sm">
              <CardContent className="p-4.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{w.t}</div>
                <div className="text-xl font-black text-slate-800 mt-1">{w.v}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{w.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/40 border-b border-slate-100 hover:bg-slate-50/40">
                <TableHead className="py-4 font-semibold text-slate-700">Employee</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700 text-center">Hours Worked</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700 text-center">Shift Compliance</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700 text-right">Overtime Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHighlights.map((h) => (
                <TableRow key={h.name} className="hover:bg-indigo-50/10 transition-colors border-b border-slate-100/60 last:border-0">
                  <TableCell className="py-3 font-semibold text-slate-800">{h.name}</TableCell>
                  <TableCell className="py-3 text-xs text-center font-bold tabular-nums text-slate-700">{h.hours} hrs</TableCell>
                  <TableCell className="py-3 text-xs text-center font-semibold text-indigo-600">{h.compliance}</TableCell>
                  <TableCell className="py-3 text-xs text-right font-bold tabular-nums text-slate-700">+{h.OT} hrs</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- 15 Days Report View ---------------- */
export function FifteenDaysReportView({ searchQuery }: ReportProps) {
  const logs = [
    { name: "John Doe", hoursLogged: 80, basePay: "रु 35,000", overtime: "रु 1,200", deduction: "रु 0", net: "रु 36,200", status: "Paid" },
    { name: "Jane Smith", hoursLogged: 82.5, basePay: "रु 32,500", overtime: "रु 3,400", deduction: "रु 500", net: "रु 35,400", status: "Paid" },
    { name: "Marco Chen", hoursLogged: 78, basePay: "रु 30,000", overtime: "रु 0", deduction: "रु 1,200", net: "रु 28,800", status: "Paid" },
    { name: "Priya Patel", hoursLogged: 81.2, basePay: "रु 28,000", overtime: "रु 800", deduction: "रु 0", net: "रु 28,800", status: "Paid" },
    { name: "Liam O'Neil", hoursLogged: 48, basePay: "रु 22,000", overtime: "रु 0", deduction: "रु 2,000", net: "रु 20,000", status: "Pending" },
  ];

  const filteredLogs = useMemo(() => {
    if (!searchQuery) return logs;
    const q = searchQuery.toLowerCase();
    return logs.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.basePay.toLowerCase().includes(q) ||
        l.overtime.toLowerCase().includes(q) ||
        l.net.toLowerCase().includes(q) ||
        l.status.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalWorkHours = useMemo(() => {
    return filteredLogs.reduce((sum, log) => sum + log.hoursLogged, 0);
  }, [filteredLogs]);

  return (
    <div className="space-y-6">

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { t: "Total Work Hours", v: `${totalWorkHours.toFixed(1)} hrs`, desc: "Sum of audited working hours" },
          { t: "Mid-Month Net Payroll", v: "रु 1,49,200", desc: "Total net disbursements" },
          { t: "Avg. Compliance Factor", v: "94.2%", desc: "Expected clock-in compliance" },
        ].map((c) => (
          <Card key={c.t} className="border-slate-200/60 bg-white/70 shadow-sm">
            <CardContent className="p-4.5">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{c.t}</div>
              <div className="text-lg font-extrabold text-slate-800 mt-1">{c.v}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{c.desc}</div>
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
export function MonthlyReportView({ searchQuery }: ReportProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const departmentsData = [
    { name: "Engineering", members: 68, hoursVal: 10880, budget: "रु 1.24M" },
    { name: "Product", members: 22, hoursVal: 3520, budget: "रु 480K" },
    { name: "Design", members: 14, hoursVal: 2240, budget: "रु 310K" },
    { name: "Marketing", members: 19, hoursVal: 3040, budget: "रु 520K" },
    { name: "Sales", members: 41, hoursVal: 6560, budget: "रु 980K" },
  ];

  const filteredDepts = useMemo(() => {
    if (!searchQuery) return departmentsData;
    const q = searchQuery.toLowerCase();
    return departmentsData.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.hoursVal.toString().includes(q) ||
        d.budget.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalWorkHours = useMemo(() => {
    return filteredDepts.reduce((sum, d) => sum + d.hoursVal, 0);
  }, [filteredDepts]);

  const trends = [
    { day: "05", Compliance: 92 },
    { day: "10", Compliance: 95 },
    { day: "15", Compliance: 94 },
    { day: "20", Compliance: 97 },
    { day: "25", Compliance: 96 },
    { day: "30", Compliance: 98 },
  ];

  return (
    <div className="space-y-6">

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-slate-200/60 bg-white/70 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">Month Compliance Trend (%)</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] w-full pt-4">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.6} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                  <ChartTooltip />
                  <Area type="monotone" dataKey="Compliance" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorCompliance)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">Loading compliance data...</div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {[
            { t: "Active Roster Month", v: "July 2026", desc: "Monthly evaluation cycle" },
            { t: "Total Work Hours", v: `${totalWorkHours.toLocaleString()} hrs`, desc: "Sum of work hours across departments" },
            { t: "Gross Payroll Cost", v: "रु 35,30,000", desc: "Full organization cost" },
          ].map((m) => (
            <Card key={m.t} className="border-slate-200/60 bg-white/70 shadow-sm">
              <CardContent className="p-4.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{m.t}</div>
                <div className="text-lg font-extrabold text-slate-800 mt-1">{m.v}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{m.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/40 border-b border-slate-100 hover:bg-slate-50/40">
                <TableHead className="py-4 font-semibold text-slate-700">Department</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700 text-center">Team Members</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700 text-center">Total Working Hours</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700 text-right">Allocated Budget</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepts.map((d) => (
                <TableRow key={d.name} className="hover:bg-indigo-50/10 transition-colors border-b border-slate-100/60 last:border-0">
                  <TableCell className="py-3 font-semibold text-slate-800">{d.name}</TableCell>
                  <TableCell className="py-3 text-xs text-center font-semibold text-slate-700">{d.members} members</TableCell>
                  <TableCell className="py-3 text-xs text-center tabular-nums font-bold text-indigo-600">{d.hoursVal.toLocaleString()} hrs</TableCell>
                  <TableCell className="py-3 text-xs text-right font-black text-slate-800">{d.budget}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
