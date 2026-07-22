import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";

export function AddShiftModal({
  isOpen,
  onClose,
  setShiftsList,
}: {
  isOpen: boolean;
  onClose: () => void;
  setShiftsList: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/80 bg-white/75 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] ring-1 ring-black/5">
        <div className="flex items-center justify-between border-b border-slate-200/50 pb-3 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">Create New Shift</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Define shift hours, grace windows, capacity and theme color
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
            const code = (formData.get("code") as string).toUpperCase();
            const start = formData.get("start") as string;
            const end = formData.get("end") as string;
            const checkInFrom = formData.get("checkInFrom") as string;
            const checkInUntil = formData.get("checkInUntil") as string;
            const checkOutFrom = formData.get("checkOutFrom") as string;
            const checkOutUntil = formData.get("checkOutUntil") as string;
            const capacityVal = formData.get("capacity") as string;
            const tone = formData.get("tone") as string;
            const crossDay = formData.get("crossDay") === "on";

            if (
              !name ||
              !code ||
              !start ||
              !end ||
              !checkInFrom ||
              !checkInUntil ||
              !checkOutFrom ||
              !checkOutUntil ||
              !capacityVal
            ) {
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
              code,
              time: timeRange,
              checkIn: formatTime(start),
              checkOut: formatTime(end),
              checkInFrom: formatTime(checkInFrom),
              checkInUntil: formatTime(checkInUntil),
              checkOutFrom: formatTime(checkOutFrom),
              checkOutUntil: formatTime(checkOutUntil),
              assigned: 0,
              capacity: parseInt(capacityVal, 10),
              iconName,
              tone,
              crossDay,
            };

            setShiftsList((prev) => [...prev, newShift]);
            toast.success(`Successfully created ${name} shift.`);
            onClose();
          }}
          className="mt-4 space-y-4 text-left overflow-y-auto pr-1"
        >
          {/* Shift Name & Code */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600">Shift Name *</label>
              <Input
                name="name"
                placeholder="E.g. Mid-Day, Night Shift"
                required
                className="h-9 bg-white/70 backdrop-blur-md border-white/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] focus-visible:bg-white focus-visible:ring-indigo-500 text-xs transition-all duration-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600">Shift Code *</label>
              <Input
                name="code"
                placeholder="E.g. MOR, DAY"
                required
                className="h-9 bg-white/70 backdrop-blur-md border-white/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] focus-visible:bg-white focus-visible:ring-indigo-500 text-xs uppercase transition-all duration-200"
              />
            </div>
          </div>

          {/* Time */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
              Time *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-medium">Start Time</label>
                <Input
                  type="time"
                  name="start"
                  required
                  className="h-9 bg-white/70 backdrop-blur-md border-white/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] focus-visible:bg-white focus-visible:ring-indigo-500 text-xs font-semibold transition-all duration-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-medium">End Time</label>
                <Input
                  type="time"
                  name="end"
                  required
                  className="h-9 bg-white/70 backdrop-blur-md border-white/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] focus-visible:bg-white focus-visible:ring-indigo-500 text-xs font-semibold transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Check In */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
              Check In *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-medium">Starts From</label>
                <Input
                  type="time"
                  name="checkInFrom"
                  required
                  className="h-9 bg-white/70 backdrop-blur-md border-white/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] focus-visible:bg-white focus-visible:ring-indigo-500 text-xs font-semibold transition-all duration-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-medium">Stops At</label>
                <Input
                  type="time"
                  name="checkInUntil"
                  required
                  className="h-9 bg-white/70 backdrop-blur-md border-white/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] focus-visible:bg-white focus-visible:ring-indigo-500 text-xs font-semibold transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Check Out */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
              Check Out *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-medium">Starts From</label>
                <Input
                  type="time"
                  name="checkOutFrom"
                  required
                  className="h-9 bg-white/70 backdrop-blur-md border-white/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] focus-visible:bg-white focus-visible:ring-indigo-500 text-xs font-semibold transition-all duration-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-medium">Stops At</label>
                <Input
                  type="time"
                  name="checkOutUntil"
                  required
                  className="h-9 bg-white/70 backdrop-blur-md border-white/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] focus-visible:bg-white focus-visible:ring-indigo-500 text-xs font-semibold transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Capacity & Color */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600">
                Coverage Capacity *
              </label>
              <Input
                type="number"
                name="capacity"
                defaultValue="50"
                placeholder="50"
                min="1"
                required
                className="h-9 bg-white/70 backdrop-blur-md border-white/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] focus-visible:bg-white focus-visible:ring-indigo-500 text-xs transition-all duration-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600">
                Display Theme Color
              </label>
              <select
                name="tone"
                defaultValue="indigo"
                className="flex h-9 w-full rounded-md border border-white/80 bg-white/70 backdrop-blur-md px-3 py-1 text-xs shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] transition-all duration-200 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
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
            <input
              type="checkbox"
              name="crossDay"
              className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-indigo-600"
            />
            <div>
              <div className="text-xs font-semibold text-slate-700 leading-tight">
                Cross Day Shift
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                Shift spans across midnight (e.g. 10:00 PM – 6:00 AM)
              </div>
            </div>
          </label>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200/50 pt-4 mt-2">
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
              Create Shift
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
