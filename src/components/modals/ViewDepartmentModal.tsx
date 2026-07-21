import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/mockData";

export function ViewDepartmentModal({
  isOpen,
  onClose,
  viewingDept,
  employeesList,
}: {
  isOpen: boolean;
  onClose: () => void;
  viewingDept: any | null;
  employeesList: any[];
}) {
  if (!isOpen || !viewingDept) return null;

  return (
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
            onClick={onClose}
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
            onClick={onClose}
            className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold text-xs px-6"
          >
            Close Details
          </Button>
        </div>
      </div>
    </div>
  );
}
