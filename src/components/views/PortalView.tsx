import { useEffect, useMemo, useState } from "react";
import { Play, Square, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface PortalViewProps {
  searchQuery: string;
}

export function PortalView({ searchQuery }: PortalViewProps) {
  const [now, setNow] = useState(new Date());
  const [clockedIn, setClockedIn] = useState(false);
  const [inSince, setInSince] = useState<Date | null>(null);
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const timeStr = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const payslips = [
    { period: "October 2025", net: "रु 4,820.00", date: "Oct 31, 2025" },
    { period: "September 2025", net: "रु 4,750.00", date: "Sep 30, 2025" },
    { period: "August 2025", net: "रु 4,690.00", date: "Aug 31, 2025" },
  ];

  const filteredPayslips = useMemo(() => {
    if (!searchQuery) return payslips;
    const q = searchQuery.toLowerCase();
    return payslips.filter(
      (p) =>
        p.period.toLowerCase().includes(q) ||
        p.net.toLowerCase().includes(q) ||
        p.date.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const workedHours = 32.4;
  const required = 40;
  const pct = Math.min(100, (workedHours / required) * 100);

  return (
    <div className="space-y-6">

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-slate-200 lg:col-span-2">
          <CardContent className="flex flex-col items-center gap-6 p-10">
            <div className="text-sm text-slate-500">{dateStr}</div>
            <div className="font-mono text-6xl font-semibold tracking-tight tabular-nums text-slate-900 sm:text-7xl">
              {timeStr}
            </div>
            {clockedIn && inSince && (
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                Clocked in since {inSince.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
              </Badge>
            )}
            <div className="flex gap-4">
              <Button
                size="lg"
                disabled={clockedIn}
                onClick={() => {
                  setClockedIn(true);
                  setInSince(new Date());
                  toast.success("Clocked in successfully");
                }}
                className="h-14 gap-2 rounded-full bg-indigo-600 px-8 text-base hover:bg-indigo-700 disabled:opacity-50"
              >
                <Play className="h-5 w-5" /> Clock In
              </Button>
              <Button
                size="lg"
                disabled={!clockedIn}
                onClick={() => {
                  setClockedIn(false);
                  setInSince(null);
                  toast.success("Clocked out successfully");
                }}
                className="h-14 gap-2 rounded-full bg-red-600 px-8 text-base hover:bg-red-700 disabled:opacity-50"
              >
                <Square className="h-5 w-5" /> Clock Out
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">This week</CardTitle>
            <p className="text-xs text-slate-500">Hours worked vs required</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold tabular-nums">{workedHours}</span>
              <span className="text-sm text-slate-500">/ {required} hrs</span>
            </div>
            <Progress value={pct} className="h-2" />
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-slate-500">Overtime</div>
                <div className="mt-1 text-sm font-semibold">2.1 hrs</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-slate-500">Late arrivals</div>
                <div className="mt-1 text-sm font-semibold">0</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Recent payslips</CardTitle>
          <p className="text-xs text-slate-500">Your last 3 pay periods</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pay period</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Net pay</TableHead>
                <TableHead className="text-right">Payslip</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayslips.map((p) => (
                <TableRow key={p.period}>
                  <TableCell className="font-medium">{p.period}</TableCell>
                  <TableCell className="text-slate-500">{p.date}</TableCell>
                  <TableCell className="tabular-nums">{p.net}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-indigo-600 hover:text-indigo-700">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
