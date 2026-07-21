import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";

export function AddEmployeeModal({
  isOpen,
  onClose,
  selectedEmployee,
  setEmployeesList,
  departmentsList,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployee: any | null;
  setEmployeesList: React.Dispatch<React.SetStateAction<any[]>>;
  departmentsList: any[];
}) {
  const [formDeviceId, setFormDeviceId] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormDeviceId(selectedEmployee?.deviceId || "");
    }
  }, [isOpen, selectedEmployee]);

  if (!isOpen) return null;

  return (
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
            onClick={onClose}
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
            onClose();
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
              onClick={onClose}
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
  );
}
