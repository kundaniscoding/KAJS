import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { AddEmployeeModal } from "@/components/modals/AddEmployeeModal";
import { AddDepartmentModal } from "@/components/modals/AddDepartmentModal";
import { ViewDepartmentModal } from "@/components/modals/ViewDepartmentModal";
import { AddShiftModal } from "@/components/modals/AddShiftModal";
import {
  LayoutDashboard,
  UserCircle2,
  Users,
  Cpu,
  CalendarDays,
  Wallet,
  Settings,
  Search,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Building2,
  CalendarRange,
  UserPlus,
  FolderPlus,
  CalendarPlus,
  BarChart3,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

// Types
import { ViewKey } from "@/types";

// Mock Data & Helpers
import {
  initialEmployees,
  initialDepartments,
  initialShifts,
  initials,
} from "@/lib/mockData";

// Views
import { DashboardView } from "@/components/views/DashboardView";
import { PortalView } from "@/components/views/PortalView";
import { EmployeesView } from "@/components/views/EmployeesView";
import { DepartmentsView } from "@/components/views/DepartmentsView";
import { DevicesView } from "@/components/views/DevicesView";
import { ShiftsView } from "@/components/views/ShiftsView";
import { LeavesView } from "@/components/views/LeavesView";
import { PayrollView } from "@/components/views/PayrollView";
import { SettingsView } from "@/components/views/SettingsView";
import {
  DailyReportView,
  WeeklyReportView,
  FifteenDaysReportView,
  MonthlyReportView,
} from "@/components/views/ReportsViews";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KAJS Global — Attendance & Payroll" },
      {
        name: "description",
        content:
          "Modern attendance and payroll management for growing teams. Track time, approve leaves, and run payroll in one place.",
      },
      { property: "og:title", content: "KAJS Global — Attendance & Payroll" },
      {
        property: "og:description",
        content:
          "Modern attendance and payroll management for growing teams.",
      },
    ],
  }),
  component: App,
});

function App() {
  const [view, setView] = useState<ViewKey>("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [employeesList, setEmployeesList] = useState(initialEmployees);
  const [departmentsList, setDepartmentsList] = useState(initialDepartments);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<any | null>(null);
  const [isDeptViewOpen, setIsDeptViewOpen] = useState(false);
  const [viewingDept, setViewingDept] = useState<any | null>(null);
  const [shiftsList, setShiftsList] = useState(initialShifts);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);

  const [reportDepartmentFilter, setReportDepartmentFilter] = useState("All");
  const [reportMonth, setReportMonth] = useState(6); // 6 is July (0-indexed)
  const [reportYear, setReportYear] = useState(2026);
  const [reportWeek, setReportWeek] = useState(1);

  const handleSetView = (v: ViewKey) => {
    setView(v);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      <Sidebar view={view} setView={handleSetView} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={cn("transition-all duration-300", isCollapsed ? "md:pl-20" : "md:pl-64")}>
        <TopHeader
          view={view}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddEmployeeClick={() => {
            setSelectedEmployee(null);
            setIsAddEmployeeOpen(true);
          }}
          onAddDeptClick={() => {
            setSelectedDept(null);
            setIsDeptModalOpen(true);
          }}
          onAddShiftClick={() => {
            setIsShiftModalOpen(true);
          }}
          reportDepartmentFilter={reportDepartmentFilter}
          setReportDepartmentFilter={setReportDepartmentFilter}
          reportMonth={reportMonth}
          setReportMonth={setReportMonth}
          reportYear={reportYear}
          setReportYear={setReportYear}
          reportWeek={reportWeek}
          setReportWeek={setReportWeek}
        />
        <main className="p-6 lg:p-8">
          {view === "dashboard" && <DashboardView searchQuery={searchQuery} />}
          {view === "portal" && <PortalView searchQuery={searchQuery} />}
          {view === "employees" && (
            <EmployeesView
              searchQuery={searchQuery}
              employeesList={employeesList}
              setEmployeesList={setEmployeesList}
              onEditEmployeeClick={(emp) => {
                setSelectedEmployee(emp);
                setIsAddEmployeeOpen(true);
              }}
            />
          )}
          {view === "departments" && (
            <DepartmentsView
              searchQuery={searchQuery}
              departmentsList={departmentsList}
              setDepartmentsList={setDepartmentsList}
              onEditDeptClick={(dept) => {
                setSelectedDept(dept);
                setIsDeptModalOpen(true);
              }}
              onViewDeptClick={(dept) => {
                setViewingDept(dept);
                setIsDeptViewOpen(true);
              }}
            />
          )}
          {view === "devices" && <DevicesView searchQuery={searchQuery} />}
          {view === "shifts" && (
            <ShiftsView
              searchQuery={searchQuery}
              shiftsList={shiftsList}
              setShiftsList={setShiftsList}
            />
          )}
          {view === "leaves" && <LeavesView searchQuery={searchQuery} />}
          {view === "payroll" && <PayrollView searchQuery={searchQuery} />}
          {view === "settings" && <SettingsView searchQuery={searchQuery} />}
          {view === "report-daily" && (
            <DailyReportView 
              searchQuery={searchQuery}
              departmentFilter={reportDepartmentFilter}
              currentMonth={reportMonth}
              currentYear={reportYear}
            />
          )}
          {view === "report-weekly" && (
            <WeeklyReportView 
              searchQuery={searchQuery}
              departmentFilter={reportDepartmentFilter}
              currentMonth={reportMonth}
              currentYear={reportYear}
              reportWeek={reportWeek}
            />
          )}
          {view === "report-15days" && (
            <FifteenDaysReportView 
              searchQuery={searchQuery}
              departmentFilter={reportDepartmentFilter}
              currentMonth={reportMonth}
              currentYear={reportYear}
            />
          )}
          {view === "report-monthly" && (
            <MonthlyReportView 
              searchQuery={searchQuery}
              departmentFilter={reportDepartmentFilter}
              currentMonth={reportMonth}
              currentYear={reportYear}
            />
          )}
        </main>
      </div>

      <AddEmployeeModal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        selectedEmployee={selectedEmployee}
        setEmployeesList={setEmployeesList}
        departmentsList={departmentsList}
      />

      <AddDepartmentModal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        selectedDept={selectedDept}
        setDepartmentsList={setDepartmentsList}
      />

      <ViewDepartmentModal
        isOpen={isDeptViewOpen}
        onClose={() => setIsDeptViewOpen(false)}
        viewingDept={viewingDept}
        employeesList={employeesList}
      />

      <AddShiftModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        setShiftsList={setShiftsList}
      />
    </div>
  );
}
