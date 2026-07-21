import { DevicesViewProps } from "./types";
import { useMemo } from "react";
import { Cpu, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { initialDevices, syncLogs } from "@/lib/mockData";

export function DevicesView({ searchQuery }: DevicesViewProps) {
  const filteredDevices = useMemo(() => {
    if (!searchQuery) return initialDevices;
    const q = searchQuery.toLowerCase();
    return initialDevices.filter(
      (d) =>
        d.id.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q) ||
        d.ip.toLowerCase().includes(q) ||
        d.model.toLowerCase().includes(q) ||
        d.sn.toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const filteredLogs = useMemo(() => {
    if (!searchQuery) return syncLogs;
    const q = searchQuery.toLowerCase();
    return syncLogs.filter(
      (l) =>
        l.eventId.toLowerCase().includes(q) ||
        l.deviceId.toLowerCase().includes(q) ||
        l.employee.toLowerCase().includes(q) ||
        l.time.toLowerCase().includes(q) ||
        l.method.toLowerCase().includes(q) ||
        l.status.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const stats = useMemo(() => {
    return {
      total: initialDevices.length,
      online: initialDevices.filter((d) => d.status === "Online").length,
      offline: initialDevices.filter((d) => d.status === "Offline").length,
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid gap-3 sm:grid-cols-3 shrink-0">
        {[
          {
            t: "Total Registered Devices",
            v: stats.total,
            color: "text-slate-700 bg-slate-50",
            chartColor: "text-slate-300",
          },
          {
            t: "Active Devices (Online)",
            v: stats.online,
            color: "text-emerald-700 bg-emerald-50",
            chartColor: "text-emerald-300",
          },
          {
            t: "Inactive Devices (Offline)",
            v: stats.offline,
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Devices List Table */}
        <Card className="lg:col-span-2 border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">

          <CardContent className="p-0 flex-1 overflow-auto custom-scrollbar">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
                <TableRow>
                  <TableHead>
                    Device Details
                  </TableHead>
                  <TableHead>Model & SN</TableHead>
                  <TableHead>Type & IP</TableHead>
                  <TableHead>Last Synced</TableHead>
                  <TableHead className="text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((d) => (
                  <TableRow
                    key={d.id}
                    className="hover:bg-indigo-50/10 transition-colors border-b border-slate-100/60 last:border-0"
                  >
                    <TableCell>
                      <div className="font-semibold text-slate-800">{d.location}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">ID: {d.id}</div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="font-semibold text-slate-700">{d.model}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{d.sn}</div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="font-medium text-slate-600">{d.type}</div>
                      <div className="text-slate-400 font-mono text-[10px] mt-0.5">{d.ip}</div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 font-semibold">
                      {d.lastSync}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "border-0 text-[10px] px-2 py-0.5 font-bold",
                          d.status === "Online"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700",
                        )}
                      >
                        {d.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card className="border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm">

          <CardContent className="p-0 flex-1 overflow-auto custom-scrollbar">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
                <TableRow>
                  <TableHead>Punch Event</TableHead>
                  <TableHead>Scan Details</TableHead>
                  <TableHead className="text-right">
                    Sync Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((l) => (
                  <TableRow
                    key={l.eventId}
                    className="hover:bg-indigo-50/10 transition-colors border-b border-slate-100/60 last:border-0"
                  >
                    <TableCell>
                      <div className="font-semibold text-slate-800 text-xs">{l.employee}</div>
                      <div className="text-[9px] text-slate-400 font-mono mt-0.5">{l.time}</div>
                    </TableCell>
                    <TableCell className="text-[10px]">
                      <div className="font-medium text-slate-600">ID: {l.deviceId}</div>
                      <div className="text-slate-400 font-medium">{l.method}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "border-0 text-[9px] px-1.5 py-0.5 font-bold",
                          l.status === "Success"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700",
                        )}
                      >
                        {l.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
