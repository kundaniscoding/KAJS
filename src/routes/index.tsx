import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  UserCircle2,
  Users,
  CalendarClock,
  CalendarDays,
  Wallet,
  Settings,
  Search,
  Bell,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Clock,
  Download,
  Check,
  X,
  Edit,
  FileText,
  Play,
  Square,
  ChevronLeft,
  ChevronRight,
  Plus,
  Building2,
  CalendarRange,
  Sunrise,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kairos HR — Attendance & Payroll" },
      {
        name: "description",
        content:
          "Modern attendance and payroll management for growing teams. Track time, approve leaves, and run payroll in one place.",
      },
      { property: "og:title", content: "Kairos HR — Attendance & Payroll" },
      {
        property: "og:description",
        content:
          "Modern attendance and payroll management for growing teams.",
      },
    ],
  }),
  component: App,
});

type ViewKey =
  | "dashboard"
  | "portal"
  | "employees"
  | "departments"
  | "attendance"
  | "shifts"
  | "leaves"
  | "payroll"
  | "settings";

const navItems: { key: ViewKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "portal", label: "My Portal", icon: UserCircle2 },
  { key: "employees", label: "Employees", icon: Users },
  { key: "departments", label: "Departments", icon: Building2 },
  { key: "attendance", label: "Attendance", icon: CalendarClock },
  { key: "shifts", label: "Shifts", icon: CalendarRange },
  { key: "leaves", label: "Leaves", icon: CalendarDays },
  { key: "payroll", label: "Payroll", icon: Wallet },
  { key: "settings", label: "Settings", icon: Settings },
];

function App() {
  const [view, setView] = useState<ViewKey>("dashboard");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar view={view} setView={setView} />
      <div className="md:pl-64">
        <TopHeader />
        <main className="p-6 lg:p-8">
          {view === "dashboard" && <DashboardView />}
          {view === "portal" && <PortalView />}
          {view === "employees" && <EmployeesView />}
          {view === "departments" && <DepartmentsView />}
          {view === "attendance" && <AttendanceView />}
          {view === "shifts" && <ShiftsView />}
          {view === "leaves" && <LeavesView />}
          {view === "payroll" && <PayrollView />}
          {view === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

/* ---------------- Sidebar ---------------- */
function Sidebar({ view, setView }: { view: ViewKey; setView: (v: ViewKey) => void }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white font-bold">
          K
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">Kairos HR</div>
          <div className="text-[11px] text-slate-500">Workforce Suite</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = view === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-indigo-600" : "text-slate-500")} />
              {item.label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="text-xs font-semibold text-slate-700">Pro plan</div>
          <div className="mt-1 text-[11px] text-slate-500">62 of 100 seats used</div>
          <Progress value={62} className="mt-2 h-1.5" />
        </div>
      </div>
    </aside>
  );
}

/* ---------------- Header ---------------- */
function TopHeader() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/90 px-6 backdrop-blur">
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search employees, payslips, requests..."
          className="h-9 border-slate-200 bg-slate-50 pl-9 focus-visible:ring-indigo-500"
        />
      </div>
      <div className="hidden text-right text-xs leading-tight text-slate-500 sm:block">
        <div className="font-medium text-slate-700">{dateStr}</div>
        <div className="tabular-nums">{timeStr}</div>
      </div>
      <Button variant="ghost" size="icon" className="relative rounded-full">
        <Bell className="h-4 w-4" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-slate-100">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-indigo-600 text-xs text-white">AR</AvatarFallback>
            </Avatar>
            <div className="hidden text-left text-xs leading-tight sm:block">
              <div className="font-semibold">Alex Rivera</div>
              <div className="text-slate-500">HR Admin</div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Preferences</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

/* ---------------- Page helpers ---------------- */
function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
function DashboardView() {
  const kpis = [
    { label: "Total Employees", value: "248", delta: "+2%", up: true, sub: "from last month" },
    { label: "Present Today", value: "213", delta: "+4.1%", up: true, sub: "vs yesterday" },
    { label: "On Leave", value: "12", delta: "-1", up: false, sub: "vs yesterday" },
    { label: "Total Payroll (Nov)", value: "$482,300", delta: "+3.2%", up: true, sub: "from Oct" },
  ];
  const chart = [
    { d: "Mon", present: 210, absent: 18 },
    { d: "Tue", present: 218, absent: 14 },
    { d: "Wed", present: 205, absent: 22 },
    { d: "Thu", present: 224, absent: 10 },
    { d: "Fri", present: 216, absent: 16 },
    { d: "Sat", present: 130, absent: 20 },
    { d: "Sun", present: 40, absent: 8 },
  ];
  const max = Math.max(...chart.map((c) => c.present + c.absent));
  const activity = [
    { who: "John Doe", what: "clocked in at 9:00 AM", when: "2m ago", tone: "green" },
    { who: "Jane Smith", what: "requested sick leave (Nov 22)", when: "18m ago", tone: "amber" },
    { who: "Marco Chen", what: "submitted timesheet for Week 46", when: "1h ago", tone: "indigo" },
    { who: "Priya Patel", what: "clocked out at 6:12 PM", when: "2h ago", tone: "slate" },
    { who: "Payroll", what: "October payroll marked as paid", when: "Yesterday", tone: "indigo" },
    { who: "Liam O'Neil", what: "leave request approved by Alex", when: "Yesterday", tone: "green" },
  ] as const;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="A snapshot of your workforce for today."
        action={
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Add employee
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="border-slate-200">
            <CardContent className="p-5">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {k.label}
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-tight">{k.value}</div>
              <div className="mt-2 flex items-center gap-1.5 text-xs">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-medium",
                    k.up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700",
                  )}
                >
                  {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {k.delta}
                </span>
                <span className="text-slate-500">{k.sub}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-200 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Attendance trends</CardTitle>
              <p className="text-xs text-slate-500">Last 7 days</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-indigo-600" /> Present
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-slate-300" /> Absent
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-56 items-end gap-4">
              {chart.map((c) => {
                const total = c.present + c.absent;
                const pH = (c.present / max) * 100;
                const aH = (c.absent / max) * 100;
                return (
                  <div key={c.d} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-full w-full flex-col justify-end gap-0.5">
                      <div
                        className="w-full rounded-sm bg-slate-200 transition-all hover:bg-slate-300"
                        style={{ height: `${aH}%` }}
                        title={`Absent ${c.absent}`}
                      />
                      <div
                        className="w-full rounded-sm bg-indigo-600 transition-all hover:bg-indigo-700"
                        style={{ height: `${pH}%` }}
                        title={`Present ${c.present}`}
                      />
                    </div>
                    <div className="text-xs text-slate-500">{c.d}</div>
                    <div className="text-[10px] font-medium tabular-nums text-slate-400">
                      {total}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
            <p className="text-xs text-slate-500">Live team updates</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                    a.tone === "green" && "bg-emerald-500",
                    a.tone === "amber" && "bg-amber-500",
                    a.tone === "indigo" && "bg-indigo-500",
                    a.tone === "slate" && "bg-slate-400",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm">
                    <span className="font-medium text-slate-900">{a.who}</span>{" "}
                    <span className="text-slate-600">{a.what}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{a.when}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- My Portal ---------------- */
function PortalView() {
  const [now, setNow] = useState(new Date());
  const [clockedIn, setClockedIn] = useState(false);
  const [inSince, setInSince] = useState<Date | null>(null);
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const timeStr = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const payslips = [
    { period: "October 2025", net: "$4,820.00", date: "Oct 31, 2025" },
    { period: "September 2025", net: "$4,750.00", date: "Sep 30, 2025" },
    { period: "August 2025", net: "$4,690.00", date: "Aug 31, 2025" },
  ];

  const workedHours = 32.4;
  const required = 40;
  const pct = Math.min(100, (workedHours / required) * 100);

  return (
    <div className="space-y-6">
      <PageHeader title="My portal" subtitle="Clock your day, review hours, and grab payslips." />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-slate-200 lg:col-span-2">
          <CardContent className="flex flex-col items-center gap-6 p-10">
            <div className="text-sm text-slate-500">{dateStr}</div>
            <div className="font-mono text-6xl font-semibold tracking-tight tabular-nums text-slate-900 sm:text-7xl">
              {timeStr}
            </div>
            {clockedIn && inSince && (
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                Clocked in since {inSince.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
              </Badge>
            )}
            <div className="flex gap-4">
              <Button
                size="lg"
                disabled={clockedIn}
                onClick={() => {
                  setClockedIn(true);
                  setInSince(new Date());
                }}
                className="h-14 gap-2 rounded-full bg-emerald-600 px-8 text-base hover:bg-emerald-700 disabled:opacity-50"
              >
                <Play className="h-5 w-5" /> Clock In
              </Button>
              <Button
                size="lg"
                disabled={!clockedIn}
                onClick={() => {
                  setClockedIn(false);
                  setInSince(null);
                }}
                className="h-14 gap-2 rounded-full bg-red-600 px-8 text-base hover:bg-red-700 disabled:opacity-50"
              >
                <Square className="h-5 w-5" /> Clock Out
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">This week</CardTitle>
            <p className="text-xs text-slate-500">Hours worked vs required</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold tabular-nums">{workedHours}</span>
              <span className="text-sm text-slate-500">/ {required} hrs</span>
            </div>
            <Progress value={pct} className="h-2" />
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-slate-500">Overtime</div>
                <div className="mt-1 text-sm font-semibold">2.1 hrs</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-slate-500">Late arrivals</div>
                <div className="mt-1 text-sm font-semibold">0</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Recent payslips</CardTitle>
          <p className="text-xs text-slate-500">Your last 3 pay periods</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pay period</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Net pay</TableHead>
                <TableHead className="text-right">Payslip</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payslips.map((p) => (
                <TableRow key={p.period}>
                  <TableCell className="font-medium">{p.period}</TableCell>
                  <TableCell className="text-slate-500">{p.date}</TableCell>
                  <TableCell className="tabular-nums">{p.net}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-indigo-600 hover:text-indigo-700">
                      <Download className="h-4 w-4" />
                    </Button>
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

/* ---------------- Employees ---------------- */
const employees = [
  { name: "John Doe", email: "john.doe@kairos.co", role: "Backend Engineer", dept: "Engineering", status: "Active" },
  { name: "Jane Smith", email: "jane.smith@kairos.co", role: "Product Designer", dept: "Design", status: "Active" },
  { name: "Marco Chen", email: "marco.chen@kairos.co", role: "Data Analyst", dept: "Analytics", status: "Active" },
  { name: "Priya Patel", email: "priya.patel@kairos.co", role: "HR Specialist", dept: "People", status: "Active" },
  { name: "Liam O'Neil", email: "liam.oneil@kairos.co", role: "Frontend Engineer", dept: "Engineering", status: "On leave" },
  { name: "Sofia Alvarez", email: "sofia.a@kairos.co", role: "Sales Lead", dept: "Revenue", status: "Active" },
  { name: "Noah Kim", email: "noah.kim@kairos.co", role: "DevOps Engineer", dept: "Engineering", status: "Active" },
  { name: "Aisha Bello", email: "aisha.b@kairos.co", role: "Recruiter", dept: "People", status: "Active" },
];

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function EmployeesView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        subtitle="Manage your team roster and roles."
        action={
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Add employee
          </Button>
        }
      />
      <Card className="border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((e) => (
                <TableRow key={e.email}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-indigo-100 text-xs text-indigo-700">
                          {initials(e.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{e.name}</div>
                        <div className="text-xs text-slate-500">{e.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{e.role}</TableCell>
                  <TableCell className="text-sm text-slate-600">{e.dept}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "border-0",
                        e.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700",
                      )}
                    >
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableFooterPagination total={248} shown={employees.length} />
        </CardContent>
      </Card>
    </div>
  );
}

function TableFooterPagination({ total, shown }: { total: number; shown: number }) {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
      <div>
        Showing <span className="font-medium text-slate-700">1–{shown}</span> of{" "}
        <span className="font-medium text-slate-700">{total}</span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <ChevronLeft className="h-3.5 w-3.5" /> Prev
        </Button>
        {[1, 2, 3, 4].map((p) => (
          <Button
            key={p}
            variant={p === 1 ? "default" : "outline"}
            size="sm"
            className={cn("h-8 w-8 p-0", p === 1 && "bg-indigo-600 hover:bg-indigo-700")}
          >
            {p}
          </Button>
        ))}
        <Button variant="outline" size="sm" className="h-8 gap-1">
          Next <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

/* ---------------- Attendance ---------------- */
type Status = "Present" | "Absent" | "Late" | "Half-day";
const attendance: {
  name: string;
  date: string;
  shift: string;
  in: string;
  out: string;
  hours: string;
  status: Status;
}[] = [
  { name: "John Doe", date: "Nov 20, 2025", shift: "Morning", in: "09:00", out: "18:04", hours: "9.0", status: "Present" },
  { name: "Jane Smith", date: "Nov 20, 2025", shift: "Morning", in: "—", out: "—", hours: "0.0", status: "Absent" },
  { name: "Marco Chen", date: "Nov 20, 2025", shift: "Morning", in: "09:42", out: "18:15", hours: "8.5", status: "Late" },
  { name: "Priya Patel", date: "Nov 20, 2025", shift: "Morning", in: "09:00", out: "13:10", hours: "4.2", status: "Half-day" },
  { name: "Liam O'Neil", date: "Nov 20, 2025", shift: "Evening", in: "14:00", out: "22:03", hours: "8.0", status: "Present" },
  { name: "Sofia Alvarez", date: "Nov 20, 2025", shift: "Morning", in: "08:55", out: "18:10", hours: "9.2", status: "Present" },
  { name: "Noah Kim", date: "Nov 20, 2025", shift: "Morning", in: "09:22", out: "18:00", hours: "8.6", status: "Late" },
  { name: "Aisha Bello", date: "Nov 20, 2025", shift: "Morning", in: "09:01", out: "18:05", hours: "9.0", status: "Present" },
];
const statusStyles: Record<Status, string> = {
  Present: "bg-emerald-50 text-emerald-700",
  Absent: "bg-red-50 text-red-700",
  Late: "bg-amber-50 text-amber-700",
  "Half-day": "bg-orange-50 text-orange-700",
};

function AttendanceView() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance & timesheets"
        subtitle="Track daily clock-ins, shifts, and hours worked."
      />
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {date ? date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Pick date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
            <div className="flex gap-2">
              {(["All", "Present", "Late", "Absent"] as const).map((f, i) => (
                <Button
                  key={f}
                  variant={i === 0 ? "default" : "outline"}
                  size="sm"
                  className={cn(i === 0 && "bg-indigo-600 hover:bg-indigo-700")}
                >
                  {f}
                </Button>
              ))}
            </div>
            <div className="ml-auto text-xs text-slate-500">
              Showing <span className="font-medium text-slate-700">248</span> employees
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Clock in</TableHead>
                <TableHead>Clock out</TableHead>
                <TableHead>Total hrs</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((a, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-indigo-100 text-xs text-indigo-700">
                          {initials(a.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm font-medium">{a.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{a.date}</TableCell>
                  <TableCell className="text-sm">{a.shift}</TableCell>
                  <TableCell className="tabular-nums text-sm">{a.in}</TableCell>
                  <TableCell className="tabular-nums text-sm">{a.out}</TableCell>
                  <TableCell className="tabular-nums text-sm font-medium">{a.hours}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn("border-0", statusStyles[a.status])}>
                      {a.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableFooterPagination total={248} shown={attendance.length} />
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Leaves ---------------- */
type LeaveType = "Sick" | "Vacation" | "Casual";
const leaves: {
  name: string;
  type: LeaveType;
  dates: string;
  days: number;
  reason: string;
}[] = [
  { name: "Jane Smith", type: "Sick", dates: "Nov 22", days: 1, reason: "Fever and rest advised by doctor." },
  { name: "Marco Chen", type: "Vacation", dates: "Dec 1 – Dec 5", days: 5, reason: "Family trip to Kyoto, booked months ago." },
  { name: "Priya Patel", type: "Casual", dates: "Nov 25", days: 1, reason: "Personal errand at city hall." },
  { name: "Noah Kim", type: "Vacation", dates: "Dec 22 – Dec 30", days: 7, reason: "Winter holiday with family." },
  { name: "Aisha Bello", type: "Sick", dates: "Nov 21 – Nov 22", days: 2, reason: "Migraine, needs recovery." },
  { name: "Sofia Alvarez", type: "Casual", dates: "Nov 28", days: 1, reason: "Apartment move-in." },
];
const leaveTone: Record<LeaveType, string> = {
  Sick: "bg-red-50 text-red-700",
  Vacation: "bg-indigo-50 text-indigo-700",
  Casual: "bg-amber-50 text-amber-700",
};

function LeavesView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave requests"
        subtitle="Approve or reject pending time-off requests."
        action={
          <div className="flex gap-2 text-xs">
            <Badge variant="secondary" className="border-0 bg-amber-50 text-amber-700">
              {leaves.length} pending
            </Badge>
          </div>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {leaves.map((l, i) => (
          <Card key={i} className="border-slate-200 transition-shadow hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-indigo-100 text-sm text-indigo-700">
                      {initials(l.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-semibold">{l.name}</div>
                    <div className="text-xs text-slate-500">Requested 2h ago</div>
                  </div>
                </div>
                <Badge variant="secondary" className={cn("border-0", leaveTone[l.type])}>
                  {l.type}
                </Badge>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                  {l.dates}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {l.days} day{l.days > 1 ? "s" : ""}
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-slate-600">{l.reason}</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  <Check className="mr-1.5 h-4 w-4" /> Approve
                </Button>
                <Button size="sm" variant="outline" className="flex-1 border-red-200 text-red-700 hover:bg-red-50">
                  <X className="mr-1.5 h-4 w-4" /> Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Payroll ---------------- */
const payroll = [
  { name: "John Doe", basic: 5200, days: 22, ot: 4, ded: 380, status: "Paid" as const },
  { name: "Jane Smith", basic: 4800, days: 20, ot: 0, ded: 540, status: "Pending" as const },
  { name: "Marco Chen", basic: 4600, days: 22, ot: 6, ded: 320, status: "Paid" as const },
  { name: "Priya Patel", basic: 5000, days: 21, ot: 2, ded: 410, status: "Pending" as const },
  { name: "Liam O'Neil", basic: 5100, days: 18, ot: 0, ded: 620, status: "Pending" as const },
  { name: "Sofia Alvarez", basic: 5600, days: 22, ot: 8, ded: 460, status: "Paid" as const },
  { name: "Noah Kim", basic: 5400, days: 22, ot: 3, ded: 400, status: "Paid" as const },
  { name: "Aisha Bello", basic: 4700, days: 22, ot: 1, ded: 350, status: "Pending" as const },
];

function PayrollView() {
  const rows = useMemo(
    () =>
      payroll.map((p) => {
        const otPay = p.ot * 45;
        const net = p.basic + otPay - p.ded;
        return { ...p, net };
      }),
    [],
  );
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll"
        subtitle="Review, generate, and disburse monthly payslips."
        action={
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Wallet className="mr-2 h-4 w-4" /> Generate payroll for November
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wide text-slate-500">Gross total</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">$498,240</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wide text-slate-500">Deductions</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">$15,940</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wide text-slate-500">Net payout</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums text-indigo-700">$482,300</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Basic</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>OT hrs</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.name}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-indigo-100 text-xs text-indigo-700">
                          {initials(r.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm font-medium">{r.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums text-sm">${r.basic.toLocaleString()}</TableCell>
                  <TableCell className="tabular-nums text-sm">{r.days}</TableCell>
                  <TableCell className="tabular-nums text-sm">{r.ot}</TableCell>
                  <TableCell className="tabular-nums text-sm text-red-600">
                    -${r.ded.toLocaleString()}
                  </TableCell>
                  <TableCell className="tabular-nums text-sm font-semibold">
                    ${r.net.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "border-0",
                        r.status === "Paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700",
                      )}
                    >
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4 text-slate-500" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 gap-1.5">
                        <FileText className="h-3.5 w-3.5" /> Payslip
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableFooterPagination total={248} shown={rows.length} />
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Settings ---------------- */
function SettingsView() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Configure your organization, policies, and integrations." />
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { t: "Organization profile", d: "Company name, logo, timezone, and address." },
          { t: "Work policies", d: "Shift patterns, overtime rules, weekly off days." },
          { t: "Leave policies", d: "Accrual, caps, and approval hierarchy." },
          { t: "Payroll setup", d: "Pay cycles, tax rates, and disbursement accounts." },
        ].map((s) => (
          <Card key={s.t} className="border-slate-200 transition-shadow hover:shadow-md">
            <CardContent className="p-5">
              <div className="text-sm font-semibold">{s.t}</div>
              <div className="mt-1 text-xs text-slate-500">{s.d}</div>
              <Button variant="outline" size="sm" className="mt-4">
                Configure
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Departments ---------------- */
function DepartmentsView() {
  const departments = [
    { name: "Engineering", head: "Marco Chen", employees: 68, openRoles: 5, budget: "$1.24M", tone: "indigo" },
    { name: "Product", head: "Priya Patel", employees: 22, openRoles: 2, budget: "$480K", tone: "emerald" },
    { name: "Design", head: "Lena Osei", employees: 14, openRoles: 1, budget: "$310K", tone: "amber" },
    { name: "Marketing", head: "Jane Smith", employees: 19, openRoles: 3, budget: "$520K", tone: "rose" },
    { name: "Sales", head: "Liam O'Neil", employees: 41, openRoles: 6, budget: "$980K", tone: "sky" },
    { name: "Customer Support", head: "Aiko Tanaka", employees: 33, openRoles: 4, budget: "$610K", tone: "violet" },
    { name: "Finance", head: "Noah Becker", employees: 12, openRoles: 0, budget: "$290K", tone: "slate" },
    { name: "People Ops", head: "Alex Rivera", employees: 9, openRoles: 1, budget: "$220K", tone: "teal" },
  ] as const;

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        subtitle="Organize your teams, leaders, and hiring pipeline."
        action={
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> New department
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {departments.map((d) => (
          <Card key={d.name} className="border-slate-200 transition-shadow hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={cn("grid h-10 w-10 place-items-center rounded-lg", toneMap[d.tone])}>
                  <Building2 className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {d.openRoles} open
                </Badge>
              </div>
              <div className="mt-4 text-base font-semibold text-slate-900">{d.name}</div>
              <div className="mt-0.5 text-xs text-slate-500">Led by {d.head}</div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs">
                <div>
                  <div className="text-slate-500">Employees</div>
                  <div className="font-semibold text-slate-900">{d.employees}</div>
                </div>
                <div>
                  <div className="text-slate-500">Budget</div>
                  <div className="font-semibold text-slate-900">{d.budget}</div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Shifts ---------------- */
function ShiftsView() {
  const shifts = [
    { name: "Morning", time: "6:00 AM – 2:00 PM", assigned: 62, icon: Sunrise, tone: "amber" },
    { name: "Day", time: "9:00 AM – 6:00 PM", assigned: 128, icon: Sun, tone: "indigo" },
    { name: "Evening", time: "2:00 PM – 10:00 PM", assigned: 34, icon: Clock, tone: "rose" },
    { name: "Night", time: "10:00 PM – 6:00 AM", assigned: 18, icon: Moon, tone: "slate" },
  ] as const;

  const toneMap: Record<string, string> = {
    amber: "bg-amber-50 text-amber-700",
    indigo: "bg-indigo-50 text-indigo-700",
    rose: "bg-rose-50 text-rose-700",
    slate: "bg-slate-100 text-slate-700",
  };

  const employees = [
    { name: "John Doe", dept: "Engineering", shift: "Day", start: "9:00 AM", end: "6:00 PM", status: "Active" },
    { name: "Jane Smith", dept: "Marketing", shift: "Day", start: "9:00 AM", end: "6:00 PM", status: "Active" },
    { name: "Marco Chen", dept: "Engineering", shift: "Morning", start: "6:00 AM", end: "2:00 PM", status: "Active" },
    { name: "Priya Patel", dept: "Product", shift: "Evening", start: "2:00 PM", end: "10:00 PM", status: "Active" },
    { name: "Liam O'Neil", dept: "Sales", shift: "Day", start: "9:00 AM", end: "6:00 PM", status: "On leave" },
    { name: "Aiko Tanaka", dept: "Support", shift: "Night", start: "10:00 PM", end: "6:00 AM", status: "Active" },
    { name: "Noah Becker", dept: "Finance", shift: "Day", start: "9:00 AM", end: "6:00 PM", status: "Active" },
    { name: "Lena Osei", dept: "Design", shift: "Morning", start: "6:00 AM", end: "2:00 PM", status: "Active" },
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const week = [
    { name: "Morning", cells: ["M", "M", "M", "M", "M", "-", "-"] },
    { name: "Day", cells: ["D", "D", "D", "D", "D", "D", "-"] },
    { name: "Evening", cells: ["E", "E", "E", "E", "E", "E", "-"] },
    { name: "Night", cells: ["N", "N", "N", "N", "N", "N", "N"] },
  ];

  const cellTone: Record<string, string> = {
    M: "bg-amber-100 text-amber-800",
    D: "bg-indigo-100 text-indigo-800",
    E: "bg-rose-100 text-rose-800",
    N: "bg-slate-200 text-slate-700",
    "-": "bg-slate-50 text-slate-300",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shifts"
        subtitle="Define shift patterns and see who's scheduled this week."
        action={
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> New shift
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {shifts.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.name} className="border-slate-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className={cn("grid h-10 w-10 place-items-center rounded-lg", toneMap[s.tone])}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {s.assigned} assigned
                  </Badge>
                </div>
                <div className="mt-4 text-base font-semibold text-slate-900">{s.name} shift</div>
                <div className="mt-0.5 text-xs text-slate-500">{s.time}</div>
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  Manage
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Weekly schedule</CardTitle>
          <p className="text-xs text-slate-500">Coverage across shifts (M=Morning, D=Day, E=Evening, N=Night)</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[120px_repeat(7,1fr)] gap-1 text-xs">
            <div />
            {days.map((d) => (
              <div key={d} className="text-center font-medium text-slate-500">
                {d}
              </div>
            ))}
            {week.map((row) => (
              <div key={row.name} className="contents">
                <div className="flex items-center pr-2 font-medium text-slate-700">
                  {row.name}
                </div>
                {row.cells.map((c, i) => (
                  <div
                    key={`${row.name}-${i}`}
                    className={cn(
                      "grid h-10 place-items-center rounded-md font-semibold",
                      cellTone[c],
                    )}
                  >
                    {c}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Employee assignments</CardTitle>
            <p className="text-xs text-slate-500">Current shift for each team member</p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-3.5 w-3.5" /> Export
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((e) => (
                <TableRow key={e.name}>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell className="text-slate-600">{e.dept}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{e.shift}</Badge>
                  </TableCell>
                  <TableCell className="tabular-nums text-slate-600">{e.start}</TableCell>
                  <TableCell className="tabular-nums text-slate-600">{e.end}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        e.status === "Active"
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-100",
                      )}
                    >
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
            <div>Showing 1–8 of 248</div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="sm" className="h-7 px-2">
                1
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                2
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                3
              </Button>
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
