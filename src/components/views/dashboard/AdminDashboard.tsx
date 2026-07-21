import { AdminDashboardProps } from "./types";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Hourglass, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminDashboard({
  searchQuery,
  employeesList = [],
  departmentsList = [],
}: AdminDashboardProps) {
  // Generate stats based on employees list
  const totalEmployees = employeesList?.length || 1;
  const presentCount = Math.floor(totalEmployees * 0.85);
  const absentCount = totalEmployees - presentCount;
  const onTimeCount = Math.floor(presentCount * 0.75);
  const lateCount = presentCount - onTimeCount;

  const topStats = [
    {
      label: "Present",
      value: presentCount,
      pct: Math.round((presentCount / totalEmployees) * 100),
      color: "#3b82f6",
    },
    {
      label: "Absent",
      value: absentCount,
      pct: Math.round((absentCount / totalEmployees) * 100),
      color: "#f43f5e",
    },
    {
      label: "On Time",
      value: onTimeCount,
      pct: Math.round((onTimeCount / totalEmployees) * 100),
      color: "#14b8a6",
    },
    {
      label: "Late",
      value: lateCount,
      pct: Math.round((lateCount / totalEmployees) * 100),
      color: "#f59e0b",
    },
  ];

  const deptData = [
    { name: "Late", value: 15, color: "#f59e0b" },
    { name: "On Leave", value: 10, color: "#10b981" },
    { name: "Absent", value: 25, color: "#f43f5e" },
    { name: "On Time", value: 40, color: "#14b8a6" },
    { name: "Holiday/Off Day", value: 10, color: "#cbd5e1" },
  ];

  const allDepts = departmentsList?.length
    ? departmentsList.map((d) => d.name)
    : ["Production & Delivery", "R&D", "Business & Strategy", "Finance", "HR", "Sales"];

  const numPages = Math.ceil(allDepts.length / 3);
  const [chartIndex, setChartIndex] = useState(0);

  useEffect(() => {
    if (numPages <= 1) return;
    const interval = setInterval(() => {
      setChartIndex((prev) => (prev + 1) % numPages);
    }, 4000);
    return () => clearInterval(interval);
  }, [numPages]);

  const dashboardDepartments = allDepts.slice(chartIndex * 3, chartIndex * 3 + 3);

  const handlePrev = () => setChartIndex((prev) => (prev - 1 + numPages) % numPages);
  const handleNext = () => setChartIndex((prev) => (prev + 1) % numPages);

  const getManager = (deptName: string) =>
    departmentsList?.find((d) => d.name === deptName)?.head || "Not Set";

  const lateToday =
    employeesList?.slice(0, 5).map((e, i) => ({
      name: e.name,
      id: e.id || `EMP${1001 + i}`,
      dept: e.dept,
      manager: getManager(e.dept),
      time: "10:28 AM",
      duration: "1h 28m",
      days: (i + 1) * 3,
      avatar: `https://i.pravatar.cc/150?u=${i + 1}`,
    })) || [];

  const leaveEmployees = employeesList?.filter((e) => e.status?.toLowerCase() === "on leave") || [];
  const fallbackLeaves = employeesList?.filter((e) => e.status?.toLowerCase() !== "on leave") || [];
  const combinedLeaves = [...leaveEmployees, ...fallbackLeaves];

  const onLeave = combinedLeaves.slice(0, 5).map((e, i) => ({
    name: e.name,
    id: e.id || `EMP${1001 + i}`,
    dept: e.dept,
    manager: getManager(e.dept),
    range: "10 Oct 2026 - 12 Oct 2026",
    avatar: `https://i.pravatar.cc/150?u=${i + 10}`,
  }));

  const feed =
    employeesList?.slice(0, 10).map((e, i) => ({
      name: e.name,
      id: e.id || `EMP${1001 + i}`,
      hq: `Inovace HQ (${e.deviceId || "4007"})`,
      time: i < 3 ? "02:28 PM" : i < 7 ? "10:28 AM" : "09:14 AM",
      ago: i === 0 ? "Moments Ago" : `${(i + 1) * 15}m Ago`,
      avatar: `https://i.pravatar.cc/150?u=${i + 20}`,
      duration: i === 5 ? "1h 28m" : null,
    })) || [];

  // Custom Circular Progress Component
  const CircleProgress = ({ pct, color }: { pct: number; color: string }) => {
    const r = 24;
    const c = Math.PI * (r * 2);
    const strokeDashoffset = ((100 - pct) / 100) * c;
    return (
      <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
        <svg className="transform -rotate-90 w-16 h-16">
          <circle cx="32" cy="32" r={r} stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
          <circle
            cx="32"
            cy="32"
            r={r}
            stroke={color}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={c}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-[11px] font-bold text-slate-700">{pct}%</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-full min-h-[700px] max-w-[1600px] mx-auto overflow-hidden">
      {/* --- LEFT MAIN COLUMN --- */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          {topStats.map((stat, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm"
            >
              <CircleProgress pct={stat.pct} color={stat.color} />
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-0.5">{stat.label}</div>
                <div className="text-2xl font-black text-slate-800 tracking-tight">
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DEPARTMENT WISE ATTENDANCE */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm shrink-0">
          <h2 className="text-sm font-bold text-teal-600 mb-6 px-2">Department Wise Attendance</h2>

          <div className="flex items-center justify-between px-2 mb-6">
            <button
              onClick={handlePrev}
              disabled={numPages <= 1}
              className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-50"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {/* CHARTS CONTAINER */}
            <div className="flex-1 flex justify-evenly">
              {dashboardDepartments.map((dept, i) => (
                <div key={dept} className="relative w-40 h-40 animate-fade-in">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deptData}
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                        isAnimationActive={true}
                        animationDuration={800}
                        animationEasing="ease-out"
                      >
                        {deptData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Inner text */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-bold text-slate-600 text-center px-6 leading-tight">
                      {dept}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={numPages <= 1}
              className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-50"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* DOTS */}
          <div className="flex justify-center gap-1.5 mb-6">
            {Array.from({ length: numPages }).map((_, dot) => (
              <div
                key={dot}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors",
                  dot === chartIndex ? "bg-teal-500" : "bg-slate-200",
                )}
              />
            ))}
          </div>

          {/* LEGEND */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-[11px] font-semibold text-slate-600">
            {deptData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="h-2 w-5 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM TWO PANELS */}
        <div className="grid lg:grid-cols-2 gap-6 items-start flex-1 overflow-hidden min-h-0">
          {/* LATE TODAY */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col">
            <h2 className="text-sm font-bold text-teal-600 mb-5 shrink-0">Late Today</h2>
            <div className="space-y-6 overflow-y-auto custom-scrollbar flex-1 pr-2">
              {lateToday.map((user, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[13px] font-bold text-slate-800 truncate">{user.name}</div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        ID: {user.id}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-[10px] text-slate-600 font-medium bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                          <Clock className="h-3 w-3 text-slate-400" /> {user.time}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-red-600 font-semibold bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                          <Hourglass className="h-3 w-3" /> {user.duration}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[9px] text-slate-400 font-medium">
                        This Month: <span className="text-red-500 font-semibold">{user.days} Days</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ON LEAVE */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col">
            <h2 className="text-sm font-bold text-teal-600 mb-5 shrink-0">On Leave</h2>
            <div className="space-y-6 overflow-y-auto custom-scrollbar flex-1 pr-2">
              {onLeave.map((user, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[13px] font-bold text-slate-800 truncate">{user.name}</div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        ID: {user.id}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 whitespace-nowrap">
                      <CalendarDays className="h-3.5 w-3.5 text-slate-400" /> {user.range}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDEBAR: ATTENDANCE FEED --- */}
      <div className="w-full xl:w-[380px] shrink-0 bg-white border border-slate-200 rounded-xl flex flex-col shadow-sm h-full overflow-hidden">
        <div className="p-5 border-b border-slate-100 shrink-0">
          <h2 className="text-sm font-bold text-teal-600">Attendance Feed</h2>
        </div>
        <div className="flex-1 p-5 space-y-6 overflow-y-auto custom-scrollbar">
          {feed.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                <AvatarImage src={item.avatar} />
                <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[13px] font-bold text-slate-800 truncate">{item.name}</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                    ID: {item.id}
                  </div>
                </div>
                <div className="text-[11px] font-bold text-slate-600 whitespace-nowrap bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                  {item.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
