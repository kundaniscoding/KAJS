import { DevicesViewProps } from "./types";
import { useMemo, useState } from "react";
import { Cpu, FileText, Edit, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { initialDevices, syncLogs } from "@/lib/mockData";

export function DevicesView({ searchQuery }: DevicesViewProps) {
  const [devices, setDevices] = useState(initialDevices);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLocation, setEditLocation] = useState<string>("");

  const filteredDevices = useMemo(() => {
    if (!searchQuery) return devices;
    const q = searchQuery.toLowerCase();
    return devices.filter(
      (d) =>
        d.id.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q) ||
        d.ip.toLowerCase().includes(q) ||
        d.model.toLowerCase().includes(q) ||
        d.sn.toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q),
    );
  }, [searchQuery, devices]);

  const stats = useMemo(() => {
    return {
      total: devices.length,
      online: devices.filter((d) => d.status === "Online").length,
      offline: devices.filter((d) => d.status === "Offline").length,
    };
  }, [devices]);

  const handleEditClick = (id: string, currentLocation: string) => {
    setEditingId(id);
    setEditLocation(currentLocation);
  };

  const handleSaveClick = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, location: editLocation } : d))
    );
    setEditingId(null);
  };

  return (
    <div className="h-full flex flex-col space-y-5 min-h-0">
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

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden rounded-2xl border border-white/60 bg-white/60 shadow-sm shadow-slate-200/50 backdrop-blur-xl">
        <Table>
          <TableHeader>
            <TableRow>
              {[
                "Device ID",
                "Location",
                "Model",
                "Serial No.",
                "IP",
                "Last Sync",
                "Status",
                "Action",
              ].map((h, i) => (
                <TableHead
                  key={`${h}-${i}`}
                  className={cn(
                    i === 0 ? "pl-6" : "",
                    i === 7 ? "pr-6 text-right" : ""
                  )}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
              {filteredDevices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-slate-400">
                    No devices match your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDevices.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="pl-6 font-mono text-slate-700">
                      {d.id}
                    </TableCell>
                    <TableCell className="text-slate-800 leading-tight">
                      {editingId === d.id ? (
                        <input
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveClick(d.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="border border-indigo-200 bg-white rounded px-2 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 w-full min-w-[120px]"
                          autoFocus
                        />
                      ) : (
                        d.location
                      )}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {d.model}
                    </TableCell>
                    <TableCell className="font-mono text-slate-500">
                      {d.sn}
                    </TableCell>
                    <TableCell className="font-mono text-slate-500">
                      {d.ip}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {d.lastSync}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "border-0 px-2 py-0.5 shadow-sm/5 inline-flex items-center gap-1.5",
                          d.status === "Online"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700",
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full animate-pulse",
                            d.status === "Online" ? "bg-emerald-500" : "bg-rose-500",
                          )}
                        />
                        {d.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      {editingId === d.id ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSaveClick(d.id)}
                          className="h-7 px-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg gap-1 transition-all"
                        >
                          <Check className="h-3 w-3" /> Save
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditClick(d.id, d.location)}
                          className="h-7 w-7 p-0 rounded-lg text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
