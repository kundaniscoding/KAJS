import { PayrollViewProps } from "./types";
import { useMemo, useState, useEffect } from "react";
import { Edit, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { payroll, initials } from "@/lib/mockData";
import { TableFooterPagination } from "@/components/TableFooterPagination";

export function PayrollView({ searchQuery }: PayrollViewProps) {
  const rows = useMemo(
    () =>
      payroll.map((p) => {
        const otPay = p.ot * 45;
        const net = p.basic + otPay - p.ded;
        return { ...p, net };
      }),
    [],
  );

  const filteredRows = useMemo(() => {
    if (!searchQuery) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.basic.toString().includes(q) ||
        r.days.toString().includes(q) ||
        r.ot.toString().includes(q) ||
        r.ded.toString().includes(q) ||
        r.net.toString().includes(q) ||
        r.status.toLowerCase().includes(q),
    );
  }, [searchQuery, rows]);

  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const displayedRows = useMemo(() => {
    const start = (currentPage - 1) * 10;
    return filteredRows.slice(start, start + 10);
  }, [filteredRows, currentPage]);

  return (
    <div className="h-full flex flex-col space-y-4 min-h-0">
      <div className="grid gap-3 sm:grid-cols-3 shrink-0">
        {[
          {
            t: "Gross total",
            v: "रु 498,240",
            color: "text-slate-700 bg-slate-50",
            chartColor: "text-slate-300",
          },
          {
            t: "Deductions",
            v: "रु 15,940",
            color: "text-rose-700 bg-rose-50",
            chartColor: "text-rose-300",
          },
          {
            t: "Net payout",
            v: "रु 482,300",
            color: "text-indigo-700 bg-indigo-50",
            chartColor: "text-indigo-300",
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

      <Card className="border-slate-200 flex-1 flex flex-col min-h-0 overflow-hidden">
        <CardContent className="p-0 flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-auto custom-scrollbar">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Basic</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>OT hrs</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net pay</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedRows.map((r) => (
                  <TableRow key={r.name}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-indigo-100 text-xs text-indigo-700">
                            {initials(r.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm font-semibold text-slate-800">{r.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="tabular-nums text-sm">
                      रु {r.basic.toLocaleString()}
                    </TableCell>
                    <TableCell className="tabular-nums text-sm">{r.days}</TableCell>
                    <TableCell className="tabular-nums text-sm">{r.ot}</TableCell>
                    <TableCell className="tabular-nums text-sm text-red-600">
                      -रु {r.ded.toLocaleString()}
                    </TableCell>
                    <TableCell className="tabular-nums text-sm font-semibold">
                      रु {r.net.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "border-0 text-[10px] font-bold px-2 py-0.5",
                          r.status === "Paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700",
                        )}
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4 text-slate-500" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5 border-slate-200/80 hover:bg-slate-50 text-xs font-semibold"
                        >
                          <FileText className="h-3.5 w-3.5" /> Payslip
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <TableFooterPagination
            total={filteredRows.length}
            shown={displayedRows.length}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
