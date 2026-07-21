import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";

export function AddDepartmentModal({
  isOpen,
  onClose,
  selectedDept,
  setDepartmentsList,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedDept: any | null;
  setDepartmentsList: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/40 bg-white/85 p-6 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-200/50 pb-3 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              {selectedDept ? "Edit Department" : "Add New Department"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {selectedDept
                ? "Modify team head, budget, and open vacancies"
                : "Create a new organizational team card"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
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
                prev.map((d) => (d.name === selectedDept.name ? updatedDept : d)),
              );
              toast.success(`Successfully updated department ${name}`);
            } else {
              setDepartmentsList((prev) => [...prev, updatedDept]);
              toast.success(`Successfully created department ${name}`);
            }
            onClose();
          }}
          className="mt-4 space-y-4 text-left"
        >
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600">Department Name *</label>
            <Input
              name="name"
              defaultValue={selectedDept?.name || ""}
              placeholder="E.g. Engineering"
              required
              className="h-9 border-slate-200 focus-visible:ring-indigo-500 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600">Department Head *</label>
            <Input
              name="head"
              defaultValue={selectedDept?.head || ""}
              placeholder="E.g. Marco Chen"
              required
              className="h-9 border-slate-200 focus-visible:ring-indigo-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                Employees Count
                <span className="text-[9px] text-slate-400 font-normal">(Auto-calculated)</span>
              </label>
              <input type="hidden" name="employees" value={selectedDept?.employees || "0"} />
              <Input
                type="number"
                value={selectedDept?.employees || "0"}
                disabled
                className="h-9 bg-slate-50/50 border-slate-200 text-slate-400 text-xs cursor-not-allowed"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600">Open Vacancies</label>
              <Input
                type="number"
                name="openRoles"
                defaultValue={selectedDept?.openRoles || "0"}
                placeholder="0"
                className="h-9 border-slate-200 focus-visible:ring-indigo-500 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600">Annual Budget *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  रु
                </span>
                <Input
                  name="budget"
                  defaultValue={selectedDept?.budget?.replace("रु", "").trim() || ""}
                  placeholder="1.24M"
                  required
                  className="h-9 pl-8 border-slate-200 focus-visible:ring-indigo-500 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600">Color Tone</label>
              <select
                name="tone"
                defaultValue={selectedDept?.tone || "indigo"}
                className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
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
              onClick={onClose}
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
  );
}
