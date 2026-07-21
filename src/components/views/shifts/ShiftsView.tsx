import { ShiftsViewProps } from "./types";
import { useMemo, useState } from "react";
import {
  Sunrise,
  Sun,
  Clock,
  Moon,
  CalendarRange,
  Edit,
  Users,
  UserCheck,
  UserX,
  LayoutList,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sunrise,
  Sun,
  Clock,
  Moon,
  CalendarRange,
};

const TONE_ICON: Record<string, string> = {
  amber: "bg-gradient-to-br from-amber-100 to-amber-200/60 text-amber-700 shadow-amber-100",
  indigo: "bg-gradient-to-br from-indigo-100 to-indigo-200/60 text-indigo-700 shadow-indigo-100",
  rose: "bg-gradient-to-br from-rose-100 to-rose-200/60 text-rose-700 shadow-rose-100",
  slate: "bg-gradient-to-br from-slate-100 to-slate-200/60 text-slate-600 shadow-slate-100",
  emerald:
    "bg-gradient-to-br from-emerald-100 to-emerald-200/60 text-emerald-700 shadow-emerald-100",
  sky: "bg-gradient-to-br from-sky-100 to-sky-200/60 text-sky-700 shadow-sky-100",
  violet: "bg-gradient-to-br from-violet-100 to-violet-200/60 text-violet-700 shadow-violet-100",
};

const TONE_BAR: Record<string, string> = {
  amber: "bg-gradient-to-r from-amber-400 to-orange-400",
  indigo: "bg-gradient-to-r from-indigo-500 to-violet-500",
  rose: "bg-gradient-to-r from-rose-500 to-pink-500",
  slate: "bg-gradient-to-r from-slate-500 to-slate-600",
  emerald: "bg-gradient-to-r from-emerald-500 to-teal-500",
  sky: "bg-gradient-to-r from-sky-500 to-cyan-500",
  violet: "bg-gradient-to-r from-violet-500 to-purple-500",
};

/** Convert "HH:MM AM/PM" → "HH:MM" for <input type="time"> */
function to24(t: string): string {
  if (!t) return "";
  const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return "";
  let h = parseInt(match[1]);
  const m = match[2];
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return `${h.toString().padStart(2, "0")}:${m}`;
}

/** Convert "HH:MM" → "HH:MM AM/PM" */
function to12(t: string): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hours = h % 12 || 12;
  return `${hours}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function ShiftsView({ searchQuery, shiftsList, setShiftsList }: ShiftsViewProps) {
  const [editingShift, setEditingShift] = useState<any | null>(null);

  const capacityMap: Record<string, number> = { Morning: 100, Day: 150, Evening: 80, Night: 50 };

  const filteredShifts = useMemo(() => {
    if (!searchQuery) return shiftsList;
    const q = searchQuery.toLowerCase();
    return shiftsList.filter(
      (s) => s.name.toLowerCase().includes(q) || s.time.toLowerCase().includes(q),
    );
  }, [searchQuery, shiftsList]);

  const totalEmployees = 242;
  const totalShifts = shiftsList.length;
  const totalAssigned = useMemo(
    () => shiftsList.reduce((sum, s) => sum + (s.assigned || 0), 0),
    [shiftsList],
  );
  const totalUnassigned = totalEmployees - totalAssigned;

  const statCards = [
    {
      label: "Total Employees",
      value: totalEmployees,
      icon: Users,
      iconCls: "bg-gradient-to-br from-indigo-100 to-indigo-200/60 text-indigo-600",
      valueCls: "text-indigo-700",
      ringCls: "ring-indigo-100/60",
    },
    {
      label: "Total Shifts",
      value: totalShifts,
      icon: LayoutList,
      iconCls: "bg-gradient-to-br from-violet-100 to-violet-200/60 text-violet-600",
      valueCls: "text-violet-700",
      ringCls: "ring-violet-100/60",
    },
    {
      label: "Assigned to Shifts",
      value: totalAssigned,
      icon: UserCheck,
      iconCls: "bg-gradient-to-br from-emerald-100 to-emerald-200/60 text-emerald-600",
      valueCls: "text-emerald-700",
      ringCls: "ring-emerald-100/60",
    },
    {
      label: "Unassigned",
      value: totalUnassigned,
      icon: UserX,
      iconCls: "bg-gradient-to-br from-rose-100 to-rose-200/60 text-rose-600",
      valueCls: "text-rose-700",
      ringCls: "ring-rose-100/60",
    },
  ];

  return (
    <div className="h-full flex flex-col space-y-5 min-h-0">
      {/* ── Summary Stats ── */}
      <div className="grid gap-3 sm:grid-cols-4 shrink-0">
        {[
          {
            t: "Total Employees",
            v: totalEmployees,
            color: "text-indigo-700 bg-indigo-50",
            chartColor: "text-indigo-300",
          },
          {
            t: "Total Shifts",
            v: totalShifts,
            color: "text-violet-700 bg-violet-50",
            chartColor: "text-violet-300",
          },
          {
            t: "Assigned to Shifts",
            v: totalAssigned,
            color: "text-emerald-700 bg-emerald-50",
            chartColor: "text-emerald-300",
          },
          {
            t: "Unassigned",
            v: totalUnassigned,
            color: "text-rose-700 bg-rose-50",
            chartColor: "text-rose-300",
          },
        ].map((c) => (
          <Card
            key={c.t}
            className="border-slate-200/60 bg-white/70 shadow-sm transition-all hover:shadow-md"
          >
            <CardContent className="px-3 py-2.5 flex flex-row items-center justify-between">
              <div className="text-xs font-bold text-slate-600 truncate mr-1">{c.t}</div>
              <div className="flex-1 flex justify-center mx-2 opacity-70">
                <svg
                  className={cn("w-12 h-4", c.chartColor)}
                  viewBox="0 0 40 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M0 14 L 10 8 L 20 10 L 30 4 L 40 2" />
                </svg>
              </div>
              <div
                className={cn(
                  "text-sm font-black rounded-md px-1.5 py-0.5 whitespace-nowrap",
                  c.color,
                )}
              >
                {c.v}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Shift Definitions Table ── */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden rounded-2xl border border-white/60 bg-white/60 shadow-sm shadow-slate-200/50 backdrop-blur-xl">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100/60 bg-slate-50/40 sticky top-0 z-10 backdrop-blur-sm">
                {[
                  "Shift",
                  "Hours",
                  "Check-In Window",
                  "Check-Out Window",
                  "Assigned",
                  "Coverage",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider first:pl-6 last:pr-6 last:text-right"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredShifts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-xs text-slate-400 font-medium">
                    No shifts match your search.
                  </td>
                </tr>
              ) : (
                filteredShifts.map((s) => {
                  const Icon = ICON_MAP[s.iconName] || Sun;
                  const capacity = capacityMap[s.name] || 100;
                  const pct = Math.min(100, Math.round((s.assigned / capacity) * 100));

                  return (
                    <tr
                      key={s.name}
                      className="border-b border-slate-100/40 last:border-0 hover:bg-slate-50/50 transition-colors group"
                    >
                      {/* Shift icon + name */}
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "grid h-9 w-9 shrink-0 place-items-center rounded-xl shadow-sm",
                              TONE_ICON[s.tone] || TONE_ICON.slate,
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-[13px] leading-tight">
                              {s.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                              Shift
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Hours */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-700 tabular-nums">
                          {s.checkIn} – {s.checkOut}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="text-[10px] text-slate-400 font-medium">
                            Scheduled window
                          </div>
                          {s.crossDay && (
                            <span className="inline-flex items-center rounded-full bg-violet-50 px-1.5 py-0.5 text-[9px] font-bold text-violet-700 ring-1 ring-violet-200/60 uppercase tracking-wide">
                              Cross Day
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Check-In Window */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200/60">
                            From {s.checkInFrom || s.checkIn || "—"}
                          </span>
                          <span className="inline-flex w-fit items-center rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 ring-1 ring-rose-200/60">
                            Until {s.checkInUntil || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Check-Out Window */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex w-fit items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200/60">
                            From {s.checkOutFrom || s.checkOut || "—"}
                          </span>
                          <span className="inline-flex w-fit items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 ring-1 ring-indigo-200/60">
                            Until {s.checkOutUntil || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Assigned */}
                      <td className="py-4 px-4 text-center">
                        <div className="text-base font-black text-slate-800">{s.assigned}</div>
                        <div className="text-[10px] text-slate-400">of {capacity}</div>
                      </td>

                      {/* Coverage bar */}
                      <td className="py-4 px-4 min-w-[140px]">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] text-slate-400 font-semibold">Coverage</span>
                          <span className="text-[10px] font-bold text-slate-600">{pct}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100/80">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-700",
                              TONE_BAR[s.tone] || TONE_BAR.slate,
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-4 pr-6 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingShift(s)}
                          className="h-7 px-3 rounded-lg text-[10px] font-semibold text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Edit Shift Modal ── */}
      {editingShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/40 bg-white/85 p-6 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-3 shrink-0">
              <div>
                <h2 className="text-base font-bold text-slate-800 tracking-tight">
                  Edit Shift — {editingShift.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Update shift hours, grace windows and theme
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingShift(null)}
                className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const name = (fd.get("name") as string).trim();
                const start = fd.get("start") as string;
                const end = fd.get("end") as string;
                const checkInFrom = fd.get("checkInFrom") as string;
                const checkInUntil = fd.get("checkInUntil") as string;
                const checkOutFrom = fd.get("checkOutFrom") as string;
                const checkOutUntil = fd.get("checkOutUntil") as string;
                const tone = fd.get("tone") as string;

                const crossDay =
                  (e.currentTarget.elements.namedItem("crossDay") as HTMLInputElement)?.checked ??
                  false;

                if (
                  !name ||
                  !start ||
                  !end ||
                  !checkInFrom ||
                  !checkInUntil ||
                  !checkOutFrom ||
                  !checkOutUntil
                ) {
                  toast.error("Please fill in all required fields.");
                  return;
                }

                const checkIn = to12(start);
                const checkOut = to12(end);

                let iconName = "Sun";
                const sh = Number(start.split(":")[0]);
                if (sh >= 5 && sh < 9) iconName = "Sunrise";
                else if (sh >= 9 && sh < 14) iconName = "Sun";
                else if (sh >= 14 && sh < 21) iconName = "Clock";
                else iconName = "Moon";

                setShiftsList((prev) =>
                  prev.map((s) =>
                    s.name === editingShift.name
                      ? {
                          ...s,
                          name,
                          checkIn,
                          checkOut,
                          time: `${checkIn} – ${checkOut}`,
                          checkInFrom: to12(checkInFrom),
                          checkInUntil: to12(checkInUntil),
                          checkOutFrom: to12(checkOutFrom),
                          checkOutUntil: to12(checkOutUntil),
                          tone,
                          iconName,
                          crossDay,
                        }
                      : s,
                  ),
                );
                toast.success(`${name} shift updated successfully.`);
                setEditingShift(null);
              }}
              className="mt-4 space-y-4 text-left overflow-y-auto pr-1"
            >
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600">Shift Name *</label>
                <Input
                  name="name"
                  defaultValue={editingShift.name}
                  required
                  className="h-9 border-slate-200 focus-visible:ring-indigo-500 text-xs"
                />
              </div>

              {/* Shift Hours */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
                  Shift Hours *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-medium">Start Time</label>
                    <Input
                      type="time"
                      name="start"
                      defaultValue={to24(editingShift.checkIn)}
                      required
                      className="h-9 border-slate-200 focus-visible:ring-indigo-500 text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-medium">End Time</label>
                    <Input
                      type="time"
                      name="end"
                      defaultValue={to24(editingShift.checkOut)}
                      required
                      className="h-9 border-slate-200 focus-visible:ring-indigo-500 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Check-In Window */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                    Check-In Window
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-semibold">
                      Starts From *
                    </label>
                    <Input
                      type="time"
                      name="checkInFrom"
                      defaultValue={to24(editingShift.checkInFrom || editingShift.checkIn)}
                      required
                      className="h-9 border-emerald-200 focus-visible:ring-emerald-500 bg-white text-xs font-semibold"
                    />
                    <p className="text-[9px] text-slate-400 font-medium">
                      Earliest allowed check-in
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-semibold">Stops At *</label>
                    <Input
                      type="time"
                      name="checkInUntil"
                      defaultValue={to24(editingShift.checkInUntil || editingShift.checkIn)}
                      required
                      className="h-9 border-rose-200 focus-visible:ring-rose-500 bg-white text-xs font-semibold"
                    />
                    <p className="text-[9px] text-slate-400 font-medium">
                      Latest accepted check-in
                    </p>
                  </div>
                </div>
              </div>

              {/* Check-Out Window */}
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_6px_#6366f1]" />
                  <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wide">
                    Check-Out Window
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-semibold">
                      Starts From *
                    </label>
                    <Input
                      type="time"
                      name="checkOutFrom"
                      defaultValue={to24(editingShift.checkOutFrom || editingShift.checkOut)}
                      required
                      className="h-9 border-amber-200 focus-visible:ring-amber-500 bg-white text-xs font-semibold"
                    />
                    <p className="text-[9px] text-slate-400 font-medium">
                      Earliest allowed check-out
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-semibold">Stops At *</label>
                    <Input
                      type="time"
                      name="checkOutUntil"
                      defaultValue={to24(editingShift.checkOutUntil || editingShift.checkOut)}
                      required
                      className="h-9 border-indigo-200 focus-visible:ring-indigo-500 bg-white text-xs font-semibold"
                    />
                    <p className="text-[9px] text-slate-400 font-medium">
                      Latest overtime check-out
                    </p>
                  </div>
                </div>
              </div>

              {/* Theme Color */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600">
                  Display Theme Color
                </label>
                <select
                  name="tone"
                  defaultValue={editingShift.tone}
                  className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
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

              {/* Cross Day */}
              <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-slate-200/70 bg-slate-50/50 px-4 py-3 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors">
                <input
                  type="checkbox"
                  name="crossDay"
                  defaultChecked={!!editingShift.crossDay}
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

              {/* Footer buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-200/50 pt-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingShift(null)}
                  className="h-9 border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold text-xs px-5"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
