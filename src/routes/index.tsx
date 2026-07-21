import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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

const navItems: { key: ViewKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "portal", label: "My Portal", icon: UserCircle2 },
  { key: "employees", label: "Employees", icon: Users },
  { key: "departments", label: "Departments", icon: Building2 },
  { key: "devices", label: "Devices", icon: Cpu },
  { key: "shifts", label: "Shifts", icon: CalendarRange },
  { key: "leaves", label: "Leaves", icon: CalendarDays },
  { key: "payroll", label: "Payroll", icon: Wallet },
  { key: "settings", label: "Settings", icon: Settings },
];

function App() {
  const [view, setView] = useState<ViewKey>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [employeesList, setEmployeesList] = useState(initialEmployees);
  const [departmentsList, setDepartmentsList] = useState(initialDepartments);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<any | null>(null);
  const [isDeptViewOpen, setIsDeptViewOpen] = useState(false);
  const [viewingDept, setViewingDept] = useState<any | null>(null);
  const [formDeviceId, setFormDeviceId] = useState("");
  const [shiftsList, setShiftsList] = useState(initialShifts);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);

  useEffect(() => {
    if (isAddEmployeeOpen) {
      setFormDeviceId(selectedEmployee?.deviceId || "");
    }
  }, [isAddEmployeeOpen, selectedEmployee]);

  const handleSetView = (v: ViewKey) => {
    setView(v);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar view={view} setView={handleSetView} />
      <div className="md:pl-64">
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
          {view === "report-daily" && <DailyReportView searchQuery={searchQuery} />}
          {view === "report-weekly" && <WeeklyReportView searchQuery={searchQuery} />}
          {view === "report-15days" && <FifteenDaysReportView searchQuery={searchQuery} />}
          {view === "report-monthly" && <MonthlyReportView searchQuery={searchQuery} />}
        </main>
      </div>

      {/* --- ADD/EDIT EMPLOYEE MODAL --- */}
      {isAddEmployeeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/40 bg-white/85 p-6 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-3.5 shrink-0">
              <div>
                <h2 className="text-base font-bold text-slate-800 tracking-tight">
                  {selectedEmployee ? "Edit Employee Details" : "Add New Employee"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {selectedEmployee ? "Modify staff role and linked biometric device settings" : "Register new staff and link biometric device details"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAddEmployeeOpen(false)}
                className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4.5 w-4.5" />
              </Button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get("name") as string;
                const email = formData.get("email") as string;
                const role = formData.get("role") as string;
                const dept = formData.get("dept") as string;
                const status = formData.get("status") as string;
                const deviceId = formData.get("deviceId") as string;
                const empId = formData.get("empId") as string;
                const phone = formData.get("phone") as string;
                const gender = formData.get("gender") as string;
                const blood = formData.get("blood") as string;
                const pan = formData.get("pan") as string;
                const salary = formData.get("salary") as string;
                const shift = formData.get("shift") as string;
                const joined = formData.get("joined") as string;

                if (!name || !email || !role || !dept || !deviceId || !empId) {
                  toast.error("Please fill in all required fields (marked with *)");
                  return;
                }

                const updatedEmp = {
                  name,
                  email,
                  role,
                  dept,
                  status,
                  deviceId,
                  empId,
                  phone,
                  gender,
                  blood,
                  pan,
                  salary: salary ? parseInt(salary) || salary : "",
                  shift,
                  joined,
                };

                if (selectedEmployee) {
                  setEmployeesList((prev) =>
                    prev.map((emp) =>
                      emp.email === selectedEmployee.email ? { ...emp, ...updatedEmp } : emp
                    )
                  );
                  toast.success(`Successfully updated ${name}`);
                } else {
                  setEmployeesList((prev) => [updatedEmp, ...prev]);
                  toast.success(`Successfully added ${name} linked to Device ID ${deviceId}`);
                }
                setIsAddEmployeeOpen(false);
              }}
              className="flex-1 overflow-y-auto pr-1 py-4 space-y-5 text-left"
            >
              {/* Section 1: Personal Details */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-600/90 border-b border-indigo-50/60 pb-1">Personal Details</div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600">Full Name *</label>
                    <Input name="name" defaultValue={selectedEmployee?.name || ""} placeholder="E.g. Alexander Cole" required className="h-9 border-slate-200/80 bg-white/50 focus-visible:ring-indigo-500 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600">Work Email *</label>
                    <Input type="email" name="email" defaultValue={selectedEmployee?.email || ""} placeholder="alex.c@kajs.global" required className="h-9 border-slate-200/80 bg-white/50 focus-visible:ring-indigo-500 text-xs" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600">Phone Number</label>
                    <Input name="phone" defaultValue={selectedEmployee?.phone || ""} placeholder="E.g. +977 9801234567" className="h-9 border-slate-200/80 bg-white/50 focus-visible:ring-indigo-500 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600">Gender</label>
                    <select name="gender" defaultValue={selectedEmployee?.gender || "Male"} className="flex h-9 w-full rounded-md border border-slate-200/80 bg-white/50 px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600">Blood Group</label>
                    <select name="blood" defaultValue={selectedEmployee?.blood || "A+"} className="flex h-9 w-full rounded-md border border-slate-200/80 bg-white/50 px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500">
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Biometric Device & Work Config */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-600/90 border-b border-indigo-50/60 pb-1">Biometric & Role configuration</div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
                      Biometric Device ID *
                      <span className="text-[9px] text-slate-400 font-normal">(RFID/Face Device)</span>
                    </label>
                    <Input
                      name="deviceId"
                      value={formDeviceId}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setFormDeviceId(val);
                      }}
                      placeholder="E.g. 8025"
                      required
                      className="h-9 border-indigo-100 bg-indigo-50/10 focus-visible:ring-indigo-500 text-xs font-semibold text-indigo-700"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-505 flex items-center gap-1.5">
                      Employee ID / Code *
                      <span className="text-[9px] text-slate-400 font-normal">(Auto-Generated)</span>
                    </label>
                    <Input value={formDeviceId ? `KAJS-${formDeviceId}` : ""} readOnly disabled className="h-9 border-slate-200 bg-slate-100/80 focus-visible:ring-0 text-xs font-medium text-slate-500 cursor-not-allowed" />
                    <input type="hidden" name="empId" value={formDeviceId ? `KAJS-${formDeviceId}` : ""} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600">Job Title / Role *</label>
                    <Input name="role" defaultValue={selectedEmployee?.role || ""} placeholder="E.g. Backend Engineer" required className="h-9 border-slate-200/80 bg-white/50 focus-visible:ring-indigo-500 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600">Department *</label>
                    <select name="dept" defaultValue={selectedEmployee?.dept || "Engineering"} required className="flex h-9 w-full rounded-md border border-slate-200/80 bg-white/50 px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500">
                      {departmentsList.map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600">Shift Type</label>
                    <select name="shift" defaultValue={selectedEmployee?.shift || "Day"} className="flex h-9 w-full rounded-md border border-slate-200/80 bg-white/50 px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500">
                      <option value="Morning">Morning</option>
                      <option value="Day">Day</option>
                      <option value="Evening">Evening</option>
                      <option value="Night">Night</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: HR & Payroll config */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-600/90 border-b border-indigo-50/60 pb-1">HR & Payroll Configuration</div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600">PAN / Tax ID</label>
                    <Input name="pan" defaultValue={selectedEmployee?.pan || ""} placeholder="E.g. 609871524" className="h-9 border-slate-200/80 bg-white/50 focus-visible:ring-indigo-500 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600">Monthly Basic Salary</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">रु</span>
                      <Input type="number" name="salary" defaultValue={selectedEmployee?.salary || ""} placeholder="5500" className="h-9 pl-8 border-slate-200/80 bg-white/50 focus-visible:ring-indigo-500 text-xs" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600">Status *</label>
                    <select name="status" defaultValue={selectedEmployee?.status || "Active"} className="flex h-9 w-full rounded-md border border-slate-200/80 bg-white/50 px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500">
                      <option value="Active">Active</option>
                      <option value="On leave">On leave</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600">Joined Date</label>
                    <Input type="date" name="joined" defaultValue={selectedEmployee?.joined || ""} className="h-9 border-slate-200/80 bg-white/50 focus-visible:ring-indigo-500 text-xs text-slate-600" />
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-200/50 pt-4 mt-6 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddEmployeeOpen(false)}
                  className="h-9 border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold text-xs px-5"
                >
                  {selectedEmployee ? "Save Changes" : "Save & Register"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD/EDIT DEPARTMENT MODAL --- */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/40 bg-white/85 p-6 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-3 shrink-0">
              <div>
                <h2 className="text-base font-bold text-slate-800 tracking-tight">
                  {selectedDept ? "Edit Department" : "Add New Department"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {selectedDept ? "Modify team head, budget, and open vacancies" : "Create a new organizational team card"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDeptModalOpen(false)}
                className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-105"
              >
                <X className="h-4.5 w-4.5" />
              </Button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get("name") as string;
                const head = formData.get("head") as string;
                const tone = formData.get("tone") as string;
                const employeesVal = formData.get("employees") as string;
                const openRolesVal = formData.get("openRoles") as string;
                const budgetVal = formData.get("budget") as string;

                if (!name || !head || !budgetVal) {
                  toast.error("Please fill in all required fields");
                  return;
                }

                let formattedBudget = budgetVal.trim();
                if (!formattedBudget.startsWith("रु")) {
                  formattedBudget = `रु ${formattedBudget}`;
                }

                const updatedDept = {
                  name,
                  head,
                  employees: parseInt(employeesVal) || 0,
                  openRoles: parseInt(openRolesVal) || 0,
                  budget: formattedBudget,
                  tone,
                };

                if (selectedDept) {
                  setDepartmentsList((prev) =>
                    prev.map((d) => (d.name === selectedDept.name ? updatedDept : d))
                  );
                  toast.success(`Successfully updated department ${name}`);
                } else {
                  setDepartmentsList((prev) => [...prev, updatedDept]);
                  toast.success(`Successfully created department ${name}`);
                }
                setIsDeptModalOpen(false);
              }}
              className="mt-4 space-y-4 text-left"
            >
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600">Department Name *</label>
                <Input name="name" defaultValue={selectedDept?.name || ""} placeholder="E.g. Engineering" required className="h-9 border-slate-200 focus-visible:ring-indigo-500 text-xs" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600">Department Head *</label>
                <Input name="head" defaultValue={selectedDept?.head || ""} placeholder="E.g. Marco Chen" required className="h-9 border-slate-200 focus-visible:ring-indigo-500 text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    Employees Count
                    <span className="text-[9px] text-slate-400 font-normal">(Auto-calculated)</span>
                  </label>
                  <input type="hidden" name="employees" value={selectedDept?.employees || "0"} />
                  <Input type="number" value={selectedDept?.employees || "0"} disabled className="h-9 bg-slate-50/50 border-slate-200 text-slate-400 text-xs cursor-not-allowed" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600">Open Vacancies</label>
                  <Input type="number" name="openRoles" defaultValue={selectedDept?.openRoles || "0"} placeholder="0" className="h-9 border-slate-200 focus-visible:ring-indigo-500 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600">Annual Budget *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">रु</span>
                    <Input name="budget" defaultValue={selectedDept?.budget?.replace("रु", "").trim() || ""} placeholder="1.24M" required className="h-9 pl-8 border-slate-200 focus-visible:ring-indigo-500 text-xs" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600">Color Tone</label>
                  <select name="tone" defaultValue={selectedDept?.tone || "indigo"} className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500">
                    <option value="indigo">Indigo</option>
                    <option value="emerald">Emerald</option>
                    <option value="amber">Amber</option>
                    <option value="rose">Rose</option>
                    <option value="sky">Sky</option>
                    <option value="violet">Violet</option>
                    <option value="slate">Slate</option>
                    <option value="teal">Teal</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-200/50 pt-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDeptModalOpen(false)}
                  className="h-9 border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold text-xs px-5"
                >
                  {selectedDept ? "Save Changes" : "Create Department"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CREATE SHIFT MODAL --- */}
      {isShiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/40 bg-white/85 p-6 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-3 shrink-0">
              <div>
                <h2 className="text-base font-bold text-slate-800 tracking-tight">Create New Shift</h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Define shift hours, grace windows, capacity and theme color</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsShiftModalOpen(false)}
                className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4.5 w-4.5" />
              </Button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name       = formData.get("name") as string;
                const start      = formData.get("start") as string;
                const end        = formData.get("end") as string;
                const checkInFrom  = formData.get("checkInFrom") as string;
                const checkInUntil = formData.get("checkInUntil") as string;
                const checkOutFrom  = formData.get("checkOutFrom") as string;
                const checkOutUntil = formData.get("checkOutUntil") as string;
                const capacityVal  = formData.get("capacity") as string;
                const tone         = formData.get("tone") as string;
                const crossDay     = formData.get("crossDay") === "on";

                if (!name || !start || !end || !checkInFrom || !checkInUntil || !checkOutFrom || !checkOutUntil || !capacityVal) {
                  toast.error("Please fill in all required fields");
                  return;
                }

                const formatTime = (tStr: string) => {
                  const [h, m] = tStr.split(":").map(Number);
                  const ampm = h >= 12 ? "PM" : "AM";
                  const hours = h % 12 || 12;
                  const minutes = m.toString().padStart(2, "0");
                  return `${hours}:${minutes} ${ampm}`;
                };

                const timeRange = `${formatTime(start)} – ${formatTime(end)}`;

                let iconName = "Sun";
                const startHour = Number(start.split(":")[0]);
                if (startHour >= 5 && startHour < 9) iconName = "Sunrise";
                else if (startHour >= 9 && startHour < 14) iconName = "Sun";
                else if (startHour >= 14 && startHour < 21) iconName = "Clock";
                else iconName = "Moon";

                const newShift = {
                  name,
                  time: timeRange,
                  checkIn: formatTime(start),
                  checkOut: formatTime(end),
                  checkInFrom: formatTime(checkInFrom),
                  checkInUntil: formatTime(checkInUntil),
                  checkOutFrom: formatTime(checkOutFrom),
                  checkOutUntil: formatTime(checkOutUntil),
                  assigned: 0,
                  iconName,
                  tone,
                  crossDay,
                };

                setShiftsList((prev) => [...prev, newShift]);
                toast.success(`Successfully created ${name} shift.`);
                setIsShiftModalOpen(false);
              }}
              className="mt-4 space-y-4 text-left overflow-y-auto pr-1"
            >
              {/* Shift Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600">Shift Name *</label>
                <Input name="name" placeholder="E.g. Mid-Day, Night Shift" required className="h-9 border-slate-200 focus-visible:ring-indigo-500 text-xs" />
              </div>

              {/* Core Shift Hours */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Shift Hours *</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-medium">Start Time</label>
                    <Input type="time" name="start" required className="h-9 border-slate-200 focus-visible:ring-indigo-500 text-xs font-semibold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-medium">End Time</label>
                    <Input type="time" name="end" required className="h-9 border-slate-200 focus-visible:ring-indigo-500 text-xs font-semibold" />
                  </div>
                </div>
              </div>

              {/* Check-In Grace Window */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">Check-In Window</span>
                </div>
                <p className="text-[10px] text-emerald-700/70 font-medium -mt-1">Set how early employees can check-in and the latest accepted check-in time.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-semibold">Starts From *</label>
                    <Input type="time" name="checkInFrom" required className="h-9 border-emerald-200 focus-visible:ring-emerald-500 bg-white text-xs font-semibold" />
                    <p className="text-[9px] text-slate-400 font-medium">Earliest allowed check-in</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-semibold">Stops At *</label>
                    <Input type="time" name="checkInUntil" required className="h-9 border-rose-200 focus-visible:ring-rose-500 bg-white text-xs font-semibold" />
                    <p className="text-[9px] text-slate-400 font-medium">Latest accepted check-in (late cutoff)</p>
                  </div>
                </div>
              </div>

              {/* Check-Out Grace Window */}
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_6px_#6366f1]" />
                  <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wide">Check-Out Window</span>
                </div>
                <p className="text-[10px] text-indigo-700/70 font-medium -mt-1">Set how early employees can check-out and when overtime check-outs stop being logged.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-semibold">Starts From *</label>
                    <Input type="time" name="checkOutFrom" required className="h-9 border-amber-200 focus-visible:ring-amber-500 bg-white text-xs font-semibold" />
                    <p className="text-[9px] text-slate-400 font-medium">Earliest allowed check-out</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-semibold">Stops At *</label>
                    <Input type="time" name="checkOutUntil" required className="h-9 border-indigo-200 focus-visible:ring-indigo-500 bg-white text-xs font-semibold" />
                    <p className="text-[9px] text-slate-400 font-medium">Latest overtime check-out accepted</p>
                  </div>
                </div>
              </div>

              {/* Capacity & Color */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600">Coverage Capacity *</label>
                  <Input type="number" name="capacity" defaultValue="50" placeholder="50" min="1" required className="h-9 border-slate-200 focus-visible:ring-indigo-500 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600">Display Theme Color</label>
                  <select name="tone" defaultValue="indigo" className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500">
                    <option value="indigo">Indigo</option>
                    <option value="emerald">Emerald</option>
                    <option value="amber">Amber</option>
                    <option value="rose">Rose</option>
                    <option value="sky">Sky</option>
                    <option value="violet">Violet</option>
                    <option value="slate">Slate</option>
                  </select>
                </div>
              </div>

              {/* Cross Day */}
              <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-slate-200/70 bg-slate-50/50 px-4 py-3 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors">
                <input type="checkbox" name="crossDay" className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-indigo-600" />
                <div>
                  <div className="text-xs font-semibold text-slate-700 leading-tight">Cross Day Shift</div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">Shift spans across midnight (e.g. 10:00 PM – 6:00 AM)</div>
                </div>
              </label>

              <div className="flex items-center justify-end gap-3 border-t border-slate-200/50 pt-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsShiftModalOpen(false)}
                  className="h-9 border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold text-xs px-5"
                >
                  Create Shift
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* --- VIEW DEPARTMENT ROSTER MODAL --- */}
      {isDeptViewOpen && viewingDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/40 bg-white/85 p-6 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-3 shrink-0">
              <div>
                <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <Building2 className="h-4.5 w-4.5 text-indigo-600" />
                  {viewingDept.name} Department
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Overview & active department roster</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDeptViewOpen(false)}
                className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4.5 w-4.5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto mt-4 space-y-5 text-left pr-1">
              {/* Summary Stats Grid */}
              <div className="grid grid-cols-2 gap-4 bg-indigo-50/20 border border-indigo-100/30 p-4 rounded-xl">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Department Head</div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">{viewingDept.head}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Annual Budget</div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">{viewingDept.budget}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Employees</div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">{viewingDept.employees}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Open Vacancies</div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">{viewingDept.openRoles} Positions</div>
                </div>
              </div>

              {/* Roster Section */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Roster in {viewingDept.name}</div>
                <div className="border border-slate-200/50 rounded-xl overflow-hidden bg-white/40">
                  {(() => {
                    const matches = employeesList.filter(
                      (e) => e.dept.toLowerCase() === viewingDept.name.toLowerCase()
                    );
                    if (matches.length === 0) {
                      return (
                        <div className="p-6 text-center text-xs text-slate-400">
                          No employees registered under this department.
                        </div>
                      );
                    }
                    return (
                      <div className="divide-y divide-slate-100/60 max-h-56 overflow-y-auto">
                        {matches.map((e) => (
                          <div key={e.email} className="flex items-center justify-between p-3 hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-indigo-50 text-[10px] text-indigo-700 font-bold">
                                  {initials(e.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <div className="text-xs font-semibold text-slate-800 truncate">{e.name}</div>
                                <div className="text-[10px] text-slate-400 truncate">{e.role}</div>
                              </div>
                            </div>
                            <Badge
                              variant="secondary"
                              className={cn(
                                "border-0 text-[9px] px-1.5 py-0.5 font-semibold shrink-0",
                                e.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                              )}
                            >
                              {e.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-slate-200/50 pt-4 mt-5 shrink-0">
              <Button
                onClick={() => setIsDeptViewOpen(false)}
                className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold text-xs px-6"
              >
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Sidebar Component ---------------- */
function Sidebar({ view, setView }: { view: ViewKey; setView: (v: ViewKey) => void }) {
  const [isReportsExpanded, setIsReportsExpanded] = useState(
    view.startsWith("report-")
  );

  useEffect(() => {
    if (view.startsWith("report-")) {
      setIsReportsExpanded(true);
    }
  }, [view]);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white font-bold">
          K
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">KAJS Global</div>
          <div className="text-[11px] text-slate-500">Workforce Suite</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navItems.filter(item => item.key !== "settings").map((item) => {
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

        {/* Reports Navigation Group */}
        <div className="space-y-1 pt-1.5">
          <button
            onClick={() => setIsReportsExpanded(!isReportsExpanded)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              view.startsWith("report-")
                ? "bg-indigo-50/50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            <BarChart3 className={cn("h-4 w-4", view.startsWith("report-") ? "text-indigo-600" : "text-slate-500")} />
            <span className="text-sm font-medium">Reports</span>
            <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform duration-200 text-slate-400", isReportsExpanded && "rotate-180")} />
          </button>

          {isReportsExpanded && (
            <div className="space-y-1 pl-4.5 border-l border-slate-100 ml-5.5 mt-1 animate-in slide-in-from-top-1 duration-150 text-left">
              {[
                { key: "report-daily", label: "Daily Report" },
                { key: "report-weekly", label: "Weekly Report" },
                { key: "report-15days", label: "15 Days Report" },
                { key: "report-monthly", label: "Monthly Report" },
              ].map((sub) => {
                const active = view === sub.key;
                return (
                  <button
                    key={sub.key}
                    onClick={() => setView(sub.key as ViewKey)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                      active
                        ? "text-indigo-600 bg-indigo-50/40"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full transition-all duration-200", active ? "bg-indigo-600 scale-125" : "bg-slate-300")} />
                    {sub.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Settings button rendered at the very end */}
        {navItems.filter(item => item.key === "settings").map((item) => {
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

const viewSubtitles: Record<ViewKey, string> = {
  dashboard: "A snapshot of your workforce for today.",
  portal: "Clock your day, review hours, and grab payslips.",
  employees: "Manage your team roster and roles.",
  departments: "Organize your teams, leaders, and hiring pipeline.",
  devices: "Manage biometric devices, status, and synchronization logs.",
  shifts: "Define shift patterns and see who's scheduled this week.",
  leaves: "Approve or reject pending time-off requests.",
  payroll: "Review, generate, and disburse monthly payslips.",
  settings: "Configure your organization, policies, and integrations.",
  "report-daily": "Overview of today's attendance, punches, and active shifts.",
  "report-weekly": "Summary of attendance stats, working hours, and trends for the week.",
  "report-15days": "Half-monthly review of payroll cycles and time-off request tallies.",
  "report-monthly": "Comprehensive monthly breakdown of hours, leaves, and payroll records.",
};

/* ---------------- TopHeader Component ---------------- */
function TopHeader({
  view,
  searchQuery,
  setSearchQuery,
  onAddEmployeeClick,
  onAddDeptClick,
  onAddShiftClick,
}: {
  view: ViewKey;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAddEmployeeClick: () => void;
  onAddDeptClick: () => void;
  onAddShiftClick: () => void;
}) {
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
              <Button variant="ghost" size="icon" className="relative rounded-full h-9 w-9 shrink-0">
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-950 text-white font-medium text-xs py-1 px-2.5 rounded shadow">
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-slate-100 shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-indigo-600 text-xs text-white">AR</AvatarFallback>
              </Avatar>
              <div className="hidden text-left text-xs leading-tight sm:block">
                <div className="font-semibold text-slate-800">Alex Rivera</div>
                <div className="text-[10px] text-slate-500 font-medium">HR Admin</div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-505" />
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
      </div>
    </header>
  );
}
