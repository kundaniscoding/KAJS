import { useEffect, useMemo, useState, useRef } from "react";
import { FileSpreadsheet, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { initialEmployees } from "@/lib/mockData";
import { AttendanceLogModal } from "@/components/modals/AttendanceLogModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";

import { MonthlyReportProps } from "./types";

/* ---------------- Monthly Report View ---------------- */
export function MonthlyReportView({
  searchQuery,
  departmentFilter,
  currentMonth,
  currentYear,
}: MonthlyReportProps) {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedEmpLog, setSelectedEmpLog] = useState<{ name: string; code: string } | undefined>(
    undefined,
  );
  const [selectedDateLog, setSelectedDateLog] = useState<
    { date: string; month: string; year: string } | undefined
  >(undefined);

  const daysCount = new Date(currentYear, currentMonth + 1, 0).getDate();

  const daysInMonth = Array.from({ length: daysCount }, (_, i) => {
    const d = new Date(currentYear, currentMonth, i + 1);
    return {
      date: (i + 1).toString().padStart(2, "0"),
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      year: currentYear.toString(),
    };
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const baseMatrixData = useMemo(() => {
    const daysCount = new Date(currentYear, currentMonth + 1, 0).getDate();
    return initialEmployees.map((emp, index) => {
      const attendance: Record<number, string> = {};
      let present = 0;
      let absent = 0;

      // Generate some consistent mock data for selected month
      for (let i = 1; i <= daysCount; i++) {
        const d = new Date(currentYear, currentMonth, i);
        if (d.getDay() === 0 || d.getDay() === 6) {
          attendance[i] = "-"; // Weekend
        } else {
          const r = (index * 7 + i) % 10;
          if (r < 8) {
            attendance[i] = "P";
            present++;
          } else if (r === 8) {
            attendance[i] = "HD";
            present += 0.5;
            absent += 0.5;
          } else {
            attendance[i] = "A";
            absent++;
          }
        }
      }

      return {
        code: emp.empId.replace("KAJS-", ""),
        name: emp.name,
        dept: emp.dept,
        attendance,
        present,
        absent,
        extra: 0,
        total: present + absent,
      };
    });
  }, [currentMonth, currentYear]);

  const filteredMatrix = useMemo(() => {
    let result = baseMatrixData;
    if (departmentFilter !== "All") {
      result = result.filter((m) => m.dept === departmentFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) => m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q),
      );
    }
    return result;
  }, [searchQuery, baseMatrixData, departmentFilter]);

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredMatrix.length / itemsPerPage);

  const paginatedMatrix = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMatrix.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMatrix, currentPage]);

  // Summary stats for the top
  const stats = useMemo(() => {
    let totalPresent = 0;
    let totalAbsent = 0;
    filteredMatrix.forEach((m) => {
      totalPresent += m.present;
      totalAbsent += m.absent;
    });
    return {
      employees: filteredMatrix.length,
      present: totalPresent,
      absent: totalAbsent,
      compliance:
        totalPresent + totalAbsent > 0
          ? Math.round((totalPresent / (totalPresent + totalAbsent)) * 100)
          : 0,
    };
  }, [filteredMatrix]);

  return (
    <div className="h-full flex flex-col space-y-4 min-h-0">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          {
            t: "Total Employees",
            v: stats.employees,
            color: "text-indigo-700 bg-indigo-50",
            chartColor: "text-indigo-300",
          },
          {
            t: "Total Present Days",
            v: stats.present,
            color: "text-emerald-700 bg-emerald-50",
            chartColor: "text-emerald-300",
          },
          {
            t: "Total Absent Days",
            v: stats.absent,
            color: "text-rose-700 bg-rose-50",
            chartColor: "text-rose-300",
          },
          {
            t: "Avg Attendance Rate",
            v: `${stats.compliance}%`,
            color: "text-slate-700 bg-slate-100",
            chartColor: "text-slate-300",
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

      {/* Monthly Attendance Matrix */}
      <Card className="border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden w-full">
        <CardContent className="p-0 overflow-x-auto scrollbar-hide">
          <table className="w-full text-xs text-left min-w-max">
            <thead>
              <tr className="bg-slate-50/40 border-b border-slate-100/60">
                <th className="py-3 px-2 text-center font-bold text-slate-700 sticky left-0 bg-slate-50/90 z-20 w-[60px]">
                  Code
                </th>
                <th className="py-3 px-4 font-bold text-slate-700 sticky left-[60px] bg-slate-50/90 z-20 w-[200px] whitespace-nowrap shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                  Employee Name
                </th>
                {daysInMonth.map((d) => (
                  <th
                    key={d.date}
                    className="py-2 px-1 text-center font-semibold text-slate-600 min-w-[44px] w-[44px]"
                  >
                    <div className="text-[11px] font-bold text-slate-800">{d.date}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">{d.day}</div>
                  </th>
                ))}
                <th className="py-3 px-1 font-bold text-slate-700 text-center sticky right-[150px] bg-slate-50/90 z-20 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)] w-[60px]">
                  Present
                </th>
                <th className="py-3 px-1 font-bold text-slate-700 text-center sticky right-[100px] bg-slate-50/90 z-20 w-[50px]">
                  Absent
                </th>
                <th className="py-3 px-1 font-bold text-slate-700 text-center sticky right-[60px] bg-slate-50/90 z-20 w-[40px]">
                  OT
                </th>
                <th className="py-3 px-1 font-bold text-slate-700 text-center sticky right-0 bg-slate-50/90 z-20 w-[60px]">
                  Total Days
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedMatrix.map((row) => (
                <tr
                  key={row.code}
                  className="border-b border-slate-100/60 last:border-0 hover:bg-slate-50/30"
                >
                  <td className="py-2.5 px-2 text-center font-bold text-slate-800 sticky left-0 bg-white/95 z-10 w-[60px]">
                    {row.code}
                  </td>
                  <td className="py-2.5 px-4 sticky left-[60px] bg-white/95 z-10 w-[200px] whitespace-nowrap shadow-[4px_0_6px_-2px_rgba(0,0,0,0.02)]">
                    <div className="font-bold text-slate-800 text-xs truncate">{row.name}</div>
                  </td>
                  {daysInMonth.map((d, i) => {
                    const status = row.attendance[(i + 1) as keyof typeof row.attendance] || "-";
                    return (
                      <td key={d.date} className="py-2.5 px-1 text-center min-w-[44px] w-[44px]">
                        {status === "P" && (
                          <button
                            onClick={() => {
                              setSelectedEmpLog({ name: row.name, code: row.code });
                              setSelectedDateLog({ date: d.date, month: d.month, year: d.year });
                              setIsLogModalOpen(true);
                            }}
                            className="mx-auto inline-flex w-7 h-6 items-center justify-center bg-emerald-100/60 text-emerald-700 font-bold rounded shadow-sm text-[10px] hover:bg-emerald-200 transition-colors"
                          >
                            P
                          </button>
                        )}
                        {status === "HD" && (
                          <button
                            onClick={() => {
                              setSelectedEmpLog({ name: row.name, code: row.code });
                              setSelectedDateLog({ date: d.date, month: d.month, year: d.year });
                              setIsLogModalOpen(true);
                            }}
                            className="mx-auto inline-flex w-7 h-6 items-center justify-center bg-amber-100/60 text-amber-700 font-bold rounded shadow-sm text-[10px] hover:bg-amber-200 transition-colors"
                          >
                            HD
                          </button>
                        )}
                        {status === "A" && (
                          <button
                            onClick={() => {
                              setSelectedEmpLog({ name: row.name, code: row.code });
                              setSelectedDateLog({ date: d.date, month: d.month, year: d.year });
                              setIsLogModalOpen(true);
                            }}
                            className="mx-auto inline-flex w-7 h-6 items-center justify-center bg-rose-100/60 text-rose-700 font-bold rounded shadow-sm text-[10px] hover:bg-rose-200 transition-colors"
                          >
                            A
                          </button>
                        )}
                        {status === "-" && <span className="text-slate-300 font-medium">-</span>}
                      </td>
                    );
                  })}
                  <td className="py-2.5 px-1 font-bold text-emerald-700 text-center sticky right-[150px] bg-white/95 z-10 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.02)]">
                    {row.present}
                  </td>
                  <td className="py-2.5 px-1 font-bold text-rose-600 text-center sticky right-[100px] bg-white/95 z-10">
                    {row.absent}
                  </td>
                  <td className="py-2.5 px-1 font-bold text-blue-600 text-center sticky right-[60px] bg-white/95 z-10">
                    {row.extra}
                  </td>
                  <td className="py-2.5 px-1 font-black text-slate-800 text-center sticky right-0 bg-white/95 z-10">
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>

        {true && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/30">
            <div className="text-xs text-slate-500 font-medium">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredMatrix.length)} of{" "}
              {filteredMatrix.length} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 px-2 text-xs bg-white"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <div className="text-xs font-semibold px-2 text-slate-700">
                Page {Math.max(1, currentPage)} of {Math.max(1, totalPages)}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="h-8 px-2 text-xs bg-white"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <AttendanceLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        employeeInfo={selectedEmpLog}
        dateInfo={selectedDateLog}
      />
    </div>
  );
}
