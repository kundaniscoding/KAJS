import { useEffect, useMemo, useState } from "react";
import { Users, Check, CalendarDays, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";
interface DashboardViewProps {
  searchQuery: string;
}

export function DashboardView({ searchQuery }: DashboardViewProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const kpis = [
    { label: "Total Employees", value: "248", delta: "+2%", up: true, sub: "from last month", icon: Users },
    { label: "Present Today", value: "213", delta: "+4.1%", up: true, sub: "vs yesterday", icon: Check },
    { label: "On Leave", value: "12", delta: "-1", up: false, sub: "vs yesterday", icon: CalendarDays },
    { label: "Total Payroll (Nov)", value: "रु 482,300", delta: "+3.2%", up: true, sub: "from Oct", icon: Wallet },
  ];

  const chartData = [
    { name: "Mon", Present: 210, Absent: 18 },
    { name: "Tue", Present: 218, Absent: 14 },
    { name: "Wed", Present: 205, Absent: 22 },
    { name: "Thu", Present: 224, Absent: 10 },
    { name: "Fri", Present: 216, Absent: 16 },
    { name: "Sat", Present: 130, Absent: 20 },
    { name: "Sun", Present: 40, Absent: 8 },
  ];

  const activity = [
    { who: "John Doe", what: "clocked in at 9:00 AM", when: "2m ago", tone: "green" },
    { who: "Jane Smith", what: "requested sick leave (Nov 22)", when: "18m ago", tone: "amber" },
    { who: "Marco Chen", what: "submitted timesheet for Week 46", when: "1h ago", tone: "indigo" },
    { who: "Priya Patel", what: "clocked out at 6:12 PM", when: "2h ago", tone: "slate" },
    { who: "Payroll", what: "October payroll marked as paid", when: "Yesterday", tone: "indigo" },
    { who: "Liam O'Neil", what: "leave request approved by Alex", when: "Yesterday", tone: "green" },
  ] as const;

  const filteredActivity = useMemo(() => {
    if (!searchQuery) return activity;
    const q = searchQuery.toLowerCase();
    return activity.filter(
      (a) =>
        a.who.toLowerCase().includes(q) ||
        a.what.toLowerCase().includes(q) ||
        a.when.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-200/50 bg-white/80 p-3 shadow-lg backdrop-blur-md">
          <p className="text-xs font-semibold text-slate-800 mb-1.5">{label}</p>
          <div className="space-y-1">
            <p className="text-xs text-indigo-600 font-medium">
              Present: <span className="font-semibold">{payload[0].value}</span>
            </p>
            {payload[1] && (
              <p className="text-xs text-slate-500 font-medium">
                Absent: <span className="font-semibold">{payload[1].value}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="relative overflow-hidden border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-500/20 group">
              <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-indigo-50/30 transition-all duration-500 group-hover:scale-150 group-hover:bg-indigo-50/50" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {k.label}
                  </span>
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white animate-fade-in">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-4 text-3xl font-bold tracking-tight text-slate-800">{k.value}</div>
                <div className="mt-2 flex items-center gap-1.5 text-xs">
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold text-[10px]",
                      k.up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700",
                    )}
                  >
                    {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {k.delta}
                  </span>
                  <span className="text-slate-400 font-medium">{k.sub}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Trends & Activity Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold text-slate-800">Attendance Trends</CardTitle>
              <p className="text-xs text-slate-400 font-medium">Last 7 days</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> Present
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> Absent
              </span>
            </div>
          </CardHeader>
          <CardContent className="h-[280px] w-full pt-4">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.6} />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <ChartTooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="Present"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPresent)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Absent"
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#colorAbsent)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                Loading trends...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800">Recent Activity</CardTitle>
            <p className="text-xs text-slate-400 font-medium">Live team updates</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 group transition-all">
                <span
                  className={cn(
                    "mt-1.5 h-2 w-2 shrink-0 rounded-full ring-4",
                    a.tone === "green" && "bg-emerald-500 ring-emerald-50/50",
                    a.tone === "amber" && "bg-amber-500 ring-amber-50/50",
                    a.tone === "indigo" && "bg-indigo-500 ring-indigo-50/50",
                    a.tone === "slate" && "bg-slate-400 ring-slate-50/50",
                  )}
                />
                <div className="min-w-0 flex-1 border-b border-slate-50 pb-2 last:border-0">
                  <div className="text-sm text-slate-600 leading-tight">
                    <span className="font-semibold text-slate-800">{a.who}</span>{" "}
                    {a.what}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium mt-1">{a.when}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
