export type ViewKey =
  | "dashboard"
  | "portal"
  | "employees"
  | "departments"
  | "devices"
  | "shifts"
  | "leaves"
  | "payroll"
  | "settings"
  | "report-daily"
  | "report-weekly"
  | "report-15days"
  | "report-monthly";

export interface BiometricDevice {
  id: string;
  location: string;
  type: string;
  ip: string;
  status: "Online" | "Offline";
  lastSync: string;
  model: string;
  sn: string;
}

export interface DeviceSyncLog {
  eventId: string;
  deviceId: string;
  employee: string;
  time: string;
  method: string;
  status: "Success" | "Failed";
}

export type LeaveType = "Sick" | "Vacation" | "Casual";

export interface LeaveRequest {
  name: string;
  type: LeaveType;
  dates: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface PayrollRecord {
  name: string;
  basic: number;
  days: number;
  ot: number;
  ded: number;
  status: "Paid" | "Pending";
}
