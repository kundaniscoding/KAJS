import { ShiftsViewProps } from "./types";
import { useMemo, useState, useEffect } from "react";
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
import { TableFooterPagination } from "@/components/TableFooterPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

  const filteredShifts = useMemo(() => {
    if (!searchQuery) return shiftsList;
    const q = searchQuery.toLowerCase();
    return shiftsList.filter(
      (s) => s.name.toLowerCase().includes(q) || s.time.toLowerCase().includes(q),
    );
  }, [searchQuery, shiftsList]);

  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const displayedShifts = useMemo(() => {
    const start = (currentPage - 1) * 10;
    return filteredShifts.slice(start, start + 10);
  }, [filteredShifts, currentPage]);

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead className="text-center">Capacity</TableHead>
              <TableHead className="text-center">Assigned</TableHead>
              <TableHead>Coverage</TableHead>
              <TableHead className="pr-6 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {filteredShifts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-slate-400">
                    No shifts match your search.
                  </TableCell>
                </TableRow>
              ) : (
                displayedShifts.map((s) => {
                  const Icon = ICON_MAP[s.iconName] || Sun;
                  const capacity = s.capacity || 100;
                  const pct = Math.min(100, Math.round((s.assigned / capacity) * 100));

                  return (
                    <TableRow key={s.name}>
                      {/* Shift name */}
                      <TableCell className="pl-6">
                        <div className="text-slate-800 font-medium leading-tight">
                          {s.name}
                        </div>
                      </TableCell>

                      {/* Shift Code */}
                      <TableCell>
                        <span className="inline-flex items-center rounded-md bg-slate-100/80 px-2 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200/50 backdrop-blur-sm shadow-sm">
                          {s.code}
                        </span>
                      </TableCell>

                      {/* Time */}
                      <TableCell>
                        <div className="text-slate-700 tabular-nums">
                          {s.checkIn} – {s.checkOut}
                        </div>
                        {s.crossDay && (
                          <div className="mt-1">
                            <span className="inline-flex items-center rounded-full bg-violet-50 px-1.5 py-0.5 text-violet-700 ring-1 ring-violet-200/60 text-[10px] uppercase tracking-wide font-semibold">
                              Cross Day
                            </span>
                          </div>
                        )}
                      </TableCell>

                      {/* Check-In Window */}
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 ring-1 ring-emerald-200/60">
                            From {s.checkInFrom || s.checkIn || "—"}
                          </span>
                          <span className="inline-flex w-fit items-center rounded-full bg-rose-50 px-2 py-0.5 text-rose-700 ring-1 ring-rose-200/60">
                            Until {s.checkInUntil || "—"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Check-Out Window */}
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex w-fit items-center rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 ring-1 ring-amber-200/60">
                            From {s.checkOutFrom || s.checkOut || "—"}
                          </span>
                          <span className="inline-flex w-fit items-center rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-700 ring-1 ring-indigo-200/60">
                            Until {s.checkOutUntil || "—"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Capacity */}
                      <TableCell className="text-center">
                        <span className="font-semibold text-slate-600">{capacity}</span>
                      </TableCell>

                      {/* Assigned */}
                      <TableCell className="text-center">
                        <div className="text-slate-800">{s.assigned}</div>
                        <div className="text-slate-400">of {capacity}</div>
                      </TableCell>

                      {/* Coverage bar */}
                      <TableCell className="min-w-[140px]">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-slate-400">Coverage</span>
                          <span className="text-slate-600">{pct}%</span>
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
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="pr-6 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingShift(s)}
                          className="h-7 px-3 rounded-lg text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
          </TableBody>
        </Table>
        <div className="border-t border-slate-100/60 bg-white/40">
          <TableFooterPagination
            total={filteredShifts.length}
            shown={displayedShifts.length}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* ── Edit Shift Modal ── */}
      {editingShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/80 bg-white/75 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] ring-1 ring-black/5">
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
                const code = (fd.get("code") as string).toUpperCase();
                const start = fd.get("start") as string;
                const end = fd.get("end") as string;
                const checkInFrom = fd.get("checkInFrom") as string;
                const checkInUntil = fd.get("checkInUntil") as string;
                const checkOutFrom = fd.get("checkOutFrom") as string;
                const checkOutUntil = fd.get("checkOutUntil") as string;
                const capacityVal = fd.get("capacity") as string;
                const tone = fd.get("tone") as string;

                const crossDay =
                  (e.currentTarget.elements.namedItem("crossDay") as HTMLInputElement)?.checked ??
                  false;

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
                          code,
                          checkIn,
                          checkOut,
                          time: `${checkIn} – ${checkOut}`,
                          checkInFrom: to12(checkInFrom),
                          checkInUntil: to12(checkInUntil),
                          checkOutFrom: to12(checkOutFrom),
                          checkOutUntil: to12(checkOutUntil),
                          capacity: parseInt(capacityVal, 10),
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
              {/* Name & Code */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600">Shift Name *</label>
                  <Input
                    name="name"
                    defaultValue={editingShift.name}
                    required
                    className="h-9 bg-white/70 backdrop-blur-md border-white/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] focus-visible:bg-white focus-visible:ring-indigo-500 text-xs transition-all duration-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600">Shift Code *</label>
                  <Input
                    name="code"
                    defaultValue={editingShift.code}
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
                      defaultValue={to24(editingShift.checkIn)}
                      required
                      className="h-9 bg-white/70 backdrop-blur-md border-white/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] focus-visible:bg-white focus-visible:ring-indigo-500 text-xs font-semibold transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-medium">End Time</label>
                    <Input
                      type="time"
                      name="end"
                      defaultValue={to24(editingShift.checkOut)}
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
                      defaultValue={to24(editingShift.checkInFrom || editingShift.checkIn)}
                      required
                      className="h-9 bg-white/70 backdrop-blur-md border-white/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] focus-visible:bg-white focus-visible:ring-indigo-500 text-xs font-semibold transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-medium">Stops At</label>
                    <Input
                      type="time"
                      name="checkInUntil"
                      defaultValue={to24(editingShift.checkInUntil || editingShift.checkIn)}
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
                      defaultValue={to24(editingShift.checkOutFrom || editingShift.checkOut)}
                      required
                      className="h-9 bg-white/70 backdrop-blur-md border-white/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] focus-visible:bg-white focus-visible:ring-indigo-500 text-xs font-semibold transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-medium">Stops At</label>
                    <Input
                      type="time"
                      name="checkOutUntil"
                      defaultValue={to24(editingShift.checkOutUntil || editingShift.checkOut)}
                      required
                      className="h-9 bg-white/70 backdrop-blur-md border-white/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] focus-visible:bg-white focus-visible:ring-indigo-500 text-xs font-semibold transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Capacity & Theme Color */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600">Capacity / Max</label>
                  <Input
                    type="number"
                    name="capacity"
                    defaultValue={editingShift.capacity || 100}
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
                    defaultValue={editingShift.tone}
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
