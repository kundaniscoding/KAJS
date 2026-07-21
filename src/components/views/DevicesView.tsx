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

interface DevicesViewProps {
  searchQuery: string;
}

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
        d.status.toLowerCase().includes(q)
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
        l.status.toLowerCase().includes(q)
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
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { t: "Total Registered Devices", v: stats.total, c: "text-slate-600 bg-slate-50 border-slate-200" },
          { t: "Active Devices (Online)", v: stats.online, c: "text-emerald-700 bg-emerald-50 border-emerald-100" },
          { t: "Inactive Devices (Offline)", v: stats.offline, c: "text-rose-700 bg-rose-50 border-rose-100" },
        ].map((s) => (
          <Card key={s.t} className={cn("shadow-sm border", s.c)}>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">{s.t}</div>
                <div className="text-2xl font-black mt-1.5">{s.v}</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/60 uppercase shadow-sm">Devices</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Devices List Table */}
        <Card className="lg:col-span-2 border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-500" />
              Registered Devices
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/40 border-b border-slate-100 hover:bg-slate-50/40">
                  <TableHead className="py-3 font-semibold text-slate-700">Device Details</TableHead>
                  <TableHead className="py-3 font-semibold text-slate-700">Model & SN</TableHead>
                  <TableHead className="py-3 font-semibold text-slate-700">Type & IP</TableHead>
                  <TableHead className="py-3 font-semibold text-slate-700">Last Synced</TableHead>
                  <TableHead className="py-3 font-semibold text-slate-700 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((d) => (
                  <TableRow key={d.id} className="hover:bg-indigo-50/10 transition-colors border-b border-slate-100/60 last:border-0">
                    <TableCell className="py-3.5">
                      <div className="font-semibold text-slate-800">{d.location}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">ID: {d.id}</div>
                    </TableCell>
                    <TableCell className="py-3.5 text-xs">
                      <div className="font-semibold text-slate-700">{d.model}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{d.sn}</div>
                    </TableCell>
                    <TableCell className="py-3.5 text-xs">
                      <div className="font-medium text-slate-600">{d.type}</div>
                      <div className="text-slate-400 font-mono text-[10px] mt-0.5">{d.ip}</div>
                    </TableCell>
                    <TableCell className="py-3.5 text-xs text-slate-500 font-semibold">{d.lastSync}</TableCell>
                    <TableCell className="py-3.5 text-right">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "border-0 text-[10px] px-2 py-0.5 font-bold",
                          d.status === "Online" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
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
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-500" />
              Recent Sync Event Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/40 border-b border-slate-100 hover:bg-slate-50/40">
                  <TableHead className="py-3 font-semibold text-slate-700">Punch Event</TableHead>
                  <TableHead className="py-3 font-semibold text-slate-700">Scan Details</TableHead>
                  <TableHead className="py-3 font-semibold text-slate-700 text-right">Sync Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((l) => (
                  <TableRow key={l.eventId} className="hover:bg-indigo-50/10 transition-colors border-b border-slate-100/60 last:border-0">
                    <TableCell className="py-3">
                      <div className="font-semibold text-slate-800 text-xs">{l.employee}</div>
                      <div className="text-[9px] text-slate-400 font-mono mt-0.5">{l.time}</div>
                    </TableCell>
                    <TableCell className="py-3 text-[10px]">
                      <div className="font-medium text-slate-600">ID: {l.deviceId}</div>
                      <div className="text-slate-400 font-medium">{l.method}</div>
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "border-0 text-[9px] px-1.5 py-0.5 font-bold",
                          l.status === "Success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
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
