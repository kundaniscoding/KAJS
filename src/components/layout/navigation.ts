import {
  LayoutDashboard,
  UserCircle2,
  Users,
  Cpu,
  CalendarDays,
  Wallet,
  Settings,
  Building2,
  CalendarRange,
} from "lucide-react";
import { ViewKey } from "@/types";

export const navItems: { key: ViewKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
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

export const viewSubtitles: Record<ViewKey, string> = {
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
