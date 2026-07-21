import { useMemo } from "react";
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
import { TableFooterPagination } from "../TableFooterPagination";

interface PayrollViewProps {
  searchQuery: string;
}

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
        r.status.toLowerCase().includes(q)
    );
  }, [searchQuery, rows]);

  const displayedRows = useMemo(() => {
    return filteredRows.slice(0, 10);
  }, [filteredRows]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wide text-slate-500">Gross total</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums text-slate-800">रु 498,240</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wide text-slate-500">Deductions</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums text-slate-800 font-medium">रु 15,940</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wide text-slate-500">Net payout</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums text-indigo-700">रु 482,300</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
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
                  <TableCell className="tabular-nums text-sm">रु {r.basic.toLocaleString()}</TableCell>
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
                      <Button variant="outline" size="sm" className="h-8 gap-1.5 border-slate-200/80 hover:bg-slate-50 text-xs font-semibold">
                        <FileText className="h-3.5 w-3.5" /> Payslip
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableFooterPagination total={filteredRows.length} shown={displayedRows.length} />
        </CardContent>
      </Card>
    </div>
  );
}
