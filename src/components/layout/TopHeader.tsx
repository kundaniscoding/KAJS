import { useState, useEffect, useMemo, useRef } from "react";
import { ViewKey } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Bell,
  ChevronDown,
  UserPlus,
  FolderPlus,
  CalendarPlus,
  RefreshCw,
  FileSpreadsheet,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { navItems, viewSubtitles } from "./navigation";
import { initialEmployees } from "@/lib/mockData";

export function TopHeader({
  view,
  searchQuery,
  setSearchQuery,
  onAddEmployeeClick,
  onAddDeptClick,
  onAddShiftClick,
  reportDepartmentFilter,
  setReportDepartmentFilter,
  reportMonth,
  setReportMonth,
  reportYear,
  setReportYear,
  reportWeek,
  setReportWeek,
}: {
  view: ViewKey;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAddEmployeeClick: () => void;
  onAddDeptClick: () => void;
  onAddShiftClick: () => void;
  reportDepartmentFilter?: string;
  setReportDepartmentFilter?: (val: string) => void;
  reportMonth?: number;
  setReportMonth?: (val: number) => void;
  reportYear?: number;
  setReportYear?: (val: number) => void;
  reportWeek?: number;
  setReportWeek?: (val: number) => void;
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [localDept, setLocalDept] = useState(reportDepartmentFilter || "All");
  const [localMonth, setLocalMonth] = useState(reportMonth ?? 6);
  const [localYear, setLocalYear] = useState(reportYear ?? 2026);
  const [localWeek, setLocalWeek] = useState(reportWeek ?? 1);

  useEffect(() => {
    if (isFilterOpen) {
      setLocalDept(reportDepartmentFilter || "All");
      setLocalMonth(reportMonth ?? 6);
      setLocalYear(reportYear ?? 2026);
      setLocalWeek(reportWeek ?? 1);
    }
  }, [isFilterOpen, reportDepartmentFilter, reportMonth, reportYear, reportWeek]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const allDepartments = useMemo(() => {
    const depts = new Set(initialEmployees.map(e => e.dept));
    return ["All", ...Array.from(depts)];
  }, []);

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

  let viewLabel = "";
  if (view === "report-daily") viewLabel = "Daily Report";
  else if (view === "report-weekly") viewLabel = "Weekly Report";
  else if (view === "report-15days") viewLabel = "15 Days Report";
  else if (view === "report-monthly") viewLabel = "Monthly Report";
  else {
    const activeItem = navItems.find((item) => item.key === view);
    viewLabel = activeItem ? activeItem.label : "";
  }

  const activeAction = useMemo(() => {
    switch (view) {
      case "dashboard":
      case "employees":
        return {
          label: "Add employee",
          icon: UserPlus,
          onClick: onAddEmployeeClick,
        };
      case "departments":
        return {
          label: "New department",
          icon: FolderPlus,
          onClick: onAddDeptClick,
        };
      case "devices":
        return {
          label: "Trigger Force Sync",
          icon: RefreshCw,
          onClick: () => {
            toast.success("Biometric Sync Configured Successfully");
          },
        };
      case "shifts":
        return {
          label: "New shift",
          icon: CalendarPlus,
          onClick: onAddShiftClick,
        };
      case "report-daily":
        return {
          label: "Export Daily Report",
          icon: FileSpreadsheet,
          onClick: () => {
            toast.success("Daily Report exported to Excel successfully.");
          },
        };
      case "report-weekly":
        return {
          label: "Export Weekly Report",
          icon: FileSpreadsheet,
          onClick: () => {
            toast.success("Weekly Report exported to Excel successfully.");
          },
        };
      case "report-15days":
        return {
          label: "Export 15 Days Report",
          icon: FileSpreadsheet,
          onClick: () => {
            toast.success("15 Days Report exported to Excel successfully.");
          },
        };
      case "report-monthly":
        return {
          label: "Export Monthly Report",
          icon: FileSpreadsheet,
          onClick: () => {
            toast.success("Monthly Report exported to Excel successfully.");
          },
        };
      default:
        return null;
    }
  }, [view]);

  return (
    <header className="sticky top-0 z-20 grid grid-cols-12 h-16 items-center border-b border-slate-200 bg-white/90 px-6 backdrop-blur">
      {/* Left Column: Menu Text & Description */}
      <div className="col-span-4 md:col-span-3 flex flex-col justify-center min-w-0">
        <h1 className="text-sm font-semibold tracking-tight text-slate-900 leading-none">{viewLabel}</h1>
        {viewSubtitles[view] && (
          <p className="text-[10px] text-slate-500 mt-1.5 leading-none font-medium truncate">{viewSubtitles[view]}</p>
        )}
      </div>

      {/* Center Column: Centered Searchbox */}
      <div className="col-span-4 md:col-span-6 flex justify-center min-w-0">
        <div className="relative w-full max-w-xs md:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search employees, payslips, requests..."
            className="h-9 border-slate-200 bg-slate-50 pl-9 focus-visible:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Right Column: Actions */}
      <div className="col-span-4 md:col-span-3 flex items-center justify-end gap-3 min-w-0">
        <TooltipProvider delayDuration={200}>
          {view.startsWith("report-") && (
            <div className="relative" ref={filterRef}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full border-slate-200 hover:bg-slate-50 hover:text-indigo-600 h-9 w-9 shrink-0 relative"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <Filter className="h-4.5 w-4.5" />
                    {(reportDepartmentFilter !== "All" || reportMonth !== 6) && (
                      <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-indigo-500 border border-white translate-x-[10%] -translate-y-[10%]"></span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-950 text-white font-medium text-xs py-1 px-2.5 rounded shadow">
                  <p>Filters</p>
                </TooltipContent>
              </Tooltip>
              
              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-4 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Month</label>
                    <input 
                      type="month" 
                      className="w-full text-xs border border-slate-200 rounded-md px-3 py-2 text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                      value={`${localYear}-${(localMonth + 1).toString().padStart(2, "0")}`}
                      onChange={(e) => {
                        if (e.target.value) {
                          const [y, m] = e.target.value.split("-");
                          setLocalYear(parseInt(y));
                          setLocalMonth(parseInt(m) - 1);
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Department</label>
                    <select
                      className="w-full text-xs border border-slate-200 rounded-md px-3 py-2 text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      value={localDept}
                      onChange={(e) => setLocalDept(e.target.value)}
                    >
                      {allDepartments.map(dept => (
                        <option key={dept} value={dept}>{dept === "All" ? "All Departments" : dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  {view === "report-weekly" && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Week</label>
                      <select
                        className="w-full text-xs border border-slate-200 rounded-md px-3 py-2 text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        value={localWeek}
                        onChange={(e) => setLocalWeek(parseInt(e.target.value))}
                      >
                        {[1, 2, 3, 4, 5].map(week => {
                          let label = "";
                          if (week === 1) label = "Week 1 (1-7)";
                          else if (week === 2) label = "Week 2 (8-14)";
                          else if (week === 3) label = "Week 3 (15-21)";
                          else if (week === 4) label = "Week 4 (22-28)";
                          else {
                            const daysInMonth = new Date(localYear, localMonth + 1, 0).getDate();
                            label = `Week 5 (29-${daysInMonth})`;
                          }
                          return <option key={week} value={week}>{label}</option>;
                        })}
                      </select>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs"
                      onClick={() => {
                        setReportDepartmentFilter?.("All");
                        setReportMonth?.(6);
                        setReportYear?.(2026);
                        if (view === "report-weekly") setReportWeek?.(1);
                        setIsFilterOpen(false);
                      }}
                    >
                      Clear
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={() => {
                        setReportDepartmentFilter?.(localDept);
                        setReportMonth?.(localMonth);
                        setReportYear?.(localYear);
                        if (view === "report-weekly") setReportWeek?.(localWeek);
                        setIsFilterOpen(false);
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeAction && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={activeAction.onClick}
                  variant="outline"
                  size="icon"
                  className="rounded-full border-slate-200 hover:bg-slate-50 hover:text-indigo-600 h-9 w-9 shrink-0"
                >
                  <activeAction.icon className="h-4.5 w-4.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-950 text-white font-medium text-xs py-1 px-2.5 rounded shadow">
                <p>{activeAction.label}</p>
              </TooltipContent>
            </Tooltip>
          )}

          <div className="hidden text-right text-xs leading-tight text-slate-505 sm:block mx-1">
            <div className="font-medium text-slate-700">{dateStr}</div>
            <div className="tabular-nums">{timeStr}</div>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="relative rounded-full border-slate-200 hover:bg-slate-50 hover:text-indigo-600 h-9 w-9 shrink-0">
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 border border-white translate-x-[10%] -translate-y-[10%]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-950 text-white font-medium text-xs py-1 px-2.5 rounded shadow">
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
}
