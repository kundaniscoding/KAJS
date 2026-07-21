import { BiometricDevice, DeviceSyncLog, LeaveRequest, PayrollRecord } from "../types";

export const initials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const initialEmployees = [
  { name: "John Doe", email: "john.doe@kajs.global", role: "Backend Engineer", dept: "Engineering", status: "Active", deviceId: "8025", empId: "KAJS-8025", shift: "Day" },
  { name: "Jane Smith", email: "jane.smith@kajs.global", role: "Product Designer", dept: "Design", status: "Active", deviceId: "8026", empId: "KAJS-8026", shift: "Morning" },
  { name: "Marco Chen", email: "marco.chen@kajs.global", role: "Data Analyst", dept: "Analytics", status: "Active", deviceId: "9012", empId: "KAJS-9012", shift: "Day" },
  { name: "Priya Patel", email: "priya.patel@kajs.global", role: "HR Specialist", dept: "People", status: "Active", deviceId: "7011", empId: "KAJS-7011", shift: "Day" },
  { name: "Liam O'Neil", email: "liam.oneil@kajs.global", role: "Frontend Engineer", dept: "Engineering", status: "On leave", deviceId: "7012", empId: "KAJS-7012", shift: "Evening" },
  { name: "Sofia Alvarez", email: "sofia.a@kajs.global", role: "Sales Lead", dept: "Revenue", status: "Active", deviceId: "6012", empId: "KAJS-6012", shift: "Day" },
  { name: "Noah Kim", email: "noah.kim@kajs.global", role: "DevOps Engineer", dept: "Engineering", status: "Active", deviceId: "9013", empId: "KAJS-9013", shift: "Day" },
  { name: "Aisha Bello", email: "aisha.b@kajs.global", role: "Recruiter", dept: "People", status: "Active", deviceId: "5099", empId: "KAJS-5099", shift: "Day" },
  { name: "David Miller", email: "david.miller@kajs.global", role: "Security Engineer", dept: "Engineering", status: "Active", deviceId: "9014", empId: "KAJS-9014", shift: "Day" },
  { name: "Elena Rostova", email: "elena.r@kajs.global", role: "QA Lead", dept: "Engineering", status: "Active", deviceId: "4050", empId: "KAJS-4050", shift: "Day" },
  { name: "Marcus Aurelius", email: "marcus.a@kajs.global", role: "Operations Manager", dept: "Operations", status: "Active", deviceId: "3001", empId: "KAJS-3001", shift: "Day" },
  { name: "Sienna Brooks", email: "sienna.b@kajs.global", role: "Content Writer", dept: "Marketing", status: "Active", deviceId: "3002", empId: "KAJS-3002", shift: "Day" },
  { name: "Kenji Sato", email: "kenji.sato@kajs.global", role: "Frontend Developer", dept: "Engineering", status: "Active", deviceId: "3003", empId: "KAJS-3003", shift: "Day" },
  { name: "Zara Patel", email: "zara.p@kajs.global", role: "Financial Analyst", dept: "Finance", status: "Active", deviceId: "3004", empId: "KAJS-3004", shift: "Day" },
  { name: "Olivier Dubois", email: "olivier.d@kajs.global", role: "Product Manager", dept: "Product", status: "On leave", deviceId: "3005", empId: "KAJS-3005", shift: "Morning" },
];

export const initialDepartments = [
  { name: "Engineering", head: "Marco Chen", employees: 68, openRoles: 5, budget: "रु 1.24M", tone: "indigo" },
  { name: "Product", head: "Priya Patel", employees: 22, openRoles: 2, budget: "रु 480K", tone: "emerald" },
  { name: "Design", head: "Lena Osei", employees: 14, openRoles: 1, budget: "रु 310K", tone: "amber" },
  { name: "Marketing", head: "Jane Smith", employees: 19, openRoles: 3, budget: "रु 520K", tone: "rose" },
  { name: "Sales", head: "Liam O'Neil", employees: 41, openRoles: 6, budget: "रु 980K", tone: "sky" },
  { name: "Customer Support", head: "Aiko Tanaka", employees: 33, openRoles: 4, budget: "रु 610K", tone: "violet" },
  { name: "Finance", head: "Noah Becker", employees: 12, openRoles: 0, budget: "रु 290K", tone: "slate" },
  { name: "People Ops", head: "Alex Rivera", employees: 9, openRoles: 1, budget: "रु 220K", tone: "teal" },
];

export const initialShifts = [
  { name: "Morning", time: "06:00 AM – 02:00 PM", checkIn: "06:00 AM", checkOut: "02:00 PM", checkInFrom: "05:50 AM", checkInUntil: "06:15 AM", checkOutFrom: "01:50 PM", checkOutUntil: "02:30 PM", assigned: 62, iconName: "Sunrise", tone: "amber" },
  { name: "Day", time: "09:00 AM – 06:00 PM", checkIn: "09:00 AM", checkOut: "06:00 PM", checkInFrom: "08:00 AM", checkInUntil: "09:15 AM", checkOutFrom: "05:45 PM", checkOutUntil: "07:00 PM", assigned: 128, iconName: "Sun", tone: "indigo" },
  { name: "Evening", time: "02:00 PM – 10:00 PM", checkIn: "02:00 PM", checkOut: "10:00 PM", checkInFrom: "01:50 PM", checkInUntil: "02:15 PM", checkOutFrom: "09:45 PM", checkOutUntil: "10:30 PM", assigned: 34, iconName: "Clock", tone: "rose" },
  { name: "Night", time: "10:00 PM – 06:00 AM", checkIn: "10:00 PM", checkOut: "06:00 AM", checkInFrom: "09:40 PM", checkInUntil: "10:20 PM", checkOutFrom: "05:45 AM", checkOutUntil: "06:30 AM", assigned: 18, iconName: "Moon", tone: "slate", crossDay: true },

];

export const initialDevices: BiometricDevice[] = [
  { id: "8025", location: "Main Entrance Lobby", type: "Face Device + RFID", ip: "192.168.1.150", status: "Online", lastSync: "2026-07-21, 09:02 AM", model: "ZKTeco SpeedFace V5L", sn: "SN-9827402519" },
  { id: "9012", location: "Back Gate Entrance", type: "RFID Card Reader", ip: "192.168.1.151", status: "Online", lastSync: "2026-07-21, 09:15 AM", model: "Hikvision DS-K1T804", sn: "SN-4819273618" },
  { id: "7011", location: "Annex Office Front", type: "Fingerprint Reader", ip: "192.168.1.155", status: "Online", lastSync: "2026-07-21, 08:45 AM", model: "ZKTeco SilkBio-101TC", sn: "SN-2938174620" },
  { id: "4050", location: "Warehouse Entrance", type: "Face Device Only", ip: "192.168.1.160", status: "Offline", lastSync: "2026-07-20, 06:00 PM", model: "Anviz FacePass 7", sn: "SN-1029384756" },
  { id: "6012", location: "Executive Floor Elevators", type: "RFID Reader", ip: "192.168.1.170", status: "Online", lastSync: "2026-07-21, 09:42 AM", model: "Suprema BioEntry W2", sn: "SN-8374920182" },
  { id: "5099", location: "Server Room Lock", type: "Fingerprint Device", ip: "192.168.1.180", status: "Online", lastSync: "2026-07-21, 09:00 AM", model: "Suprema BioLite N2", sn: "SN-7483920194" },
];

export const syncLogs: DeviceSyncLog[] = [
  { eventId: "LOG-90251", deviceId: "8025", employee: "John Doe", time: "2026-07-21, 09:02:14 AM", method: "Face ID", status: "Success" },
  { eventId: "LOG-90252", deviceId: "8025", employee: "Jane Smith", time: "2026-07-21, 08:56:45 AM", method: "RFID Card", status: "Success" },
  { eventId: "LOG-90253", deviceId: "9012", employee: "Marco Chen", time: "2026-07-21, 09:15:10 AM", method: "Face ID", status: "Success" },
  { eventId: "LOG-90254", deviceId: "7011", employee: "Priya Patel", time: "2026-07-21, 08:45:30 AM", method: "Fingerprint", status: "Success" },
  { eventId: "LOG-90255", deviceId: "9012", employee: "Noah Kim", time: "2026-07-21, 09:05:12 AM", method: "RFID Card", status: "Success" },
  { eventId: "LOG-90256", deviceId: "8025", employee: "Sofia Alvarez", time: "2026-07-21, 09:42:01 AM", method: "Face ID", status: "Success" },
  { eventId: "LOG-90257", deviceId: "9012", employee: "David Miller", time: "2026-07-21, 09:00:05 AM", method: "Face ID", status: "Success" },
  { eventId: "LOG-90258", deviceId: "8025", employee: "Aisha Bello", time: "2026-07-21, 08:59:18 AM", method: "Fingerprint", status: "Success" },
  { eventId: "LOG-90259", deviceId: "4050", employee: "Elena Rostova", time: "—", method: "—", status: "Failed" },
];

export const leaves: LeaveRequest[] = [
  { name: "Jane Smith", type: "Sick", dates: "26-11-22", days: 1, reason: "Fever and rest advised by doctor.", status: "Pending" },
  { name: "Marco Chen", type: "Vacation", dates: "26-12-01 - 26-12-05", days: 5, reason: "Family trip to Kyoto, booked months ago.", status: "Approved" },
  { name: "Priya Patel", type: "Casual", dates: "26-11-25", days: 1, reason: "Personal errand at city hall.", status: "Pending" },
  { name: "Noah Kim", type: "Vacation", dates: "26-12-22 - 26-12-30", days: 7, reason: "Winter holiday with family.", status: "Rejected" },
  { name: "Aisha Bello", type: "Sick", dates: "26-11-21 - 26-11-22", days: 2, reason: "Migraine, needs recovery.", status: "Pending" },
  { name: "Sofia Alvarez", type: "Casual", dates: "26-11-28", days: 1, reason: "Apartment move-in.", status: "Approved" },
];

export const payroll: PayrollRecord[] = [
  { name: "John Doe", basic: 5200, days: 22, ot: 4, ded: 380, status: "Paid" },
  { name: "Jane Smith", basic: 4800, days: 20, ot: 0, ded: 540, status: "Pending" },
  { name: "Marco Chen", basic: 4600, days: 22, ot: 6, ded: 320, status: "Paid" },
  { name: "Priya Patel", basic: 5000, days: 21, ot: 2, ded: 410, status: "Pending" },
  { name: "Liam O'Neil", basic: 5100, days: 18, ot: 0, ded: 620, status: "Pending" },
  { name: "Sofia Alvarez", basic: 5600, days: 22, ot: 8, ded: 460, status: "Paid" },
  { name: "Noah Kim", basic: 5400, days: 22, ot: 3, ded: 400, status: "Paid" },
  { name: "Aisha Bello", basic: 4700, days: 22, ot: 1, ded: 350, status: "Pending" },
];
