import { useMemo, useState } from "react";
import { CalendarDays, Clock, Check, X, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { leaves, initials } from "@/lib/mockData";
import { LeaveType, LeaveRequest } from "@/types";
import { toast } from "sonner";

interface LeavesViewProps {
  searchQuery: string;
}

type TabType = "All" | "Pending" | "Approved" | "Rejected";

export function LeavesView({ searchQuery }: LeavesViewProps) {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(leaves);
  const [activeTab, setActiveTab] = useState<TabType>("All");

  const leaveTone: Record<LeaveType, string> = {
    Sick: "bg-red-50 text-red-700 border-red-100",
    Vacation: "bg-indigo-50 text-indigo-700 border-indigo-100",
    Casual: "bg-amber-50 text-amber-700 border-amber-100",
  };

  const statusTone: Record<"Pending" | "Approved" | "Rejected", string> = {
    Pending: "bg-amber-50 text-amber-700 border-amber-150",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-150",
    Rejected: "bg-rose-50 text-rose-700 border-rose-150",
  };

  const handleStatusChange = (index: number, name: string, newStatus: "Approved" | "Rejected") => {
    setLeaveRequests((prev) =>
      prev.map((req, i) => (i === index ? { ...req, status: newStatus } : req))
    );
    if (newStatus === "Approved") {
      toast.success(`Leave request for ${name} has been approved.`);
    } else {
      toast.error(`Leave request for ${name} has been rejected.`);
    }
  };

  // Filter requests based on Search Query & Active Tab
  const filteredLeaves = useMemo(() => {
    return leaveRequests.filter((l) => {
      // Search filter
      const matchesSearch = searchQuery
        ? l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.dates.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.reason.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      // Tab filter
      const matchesTab = activeTab === "All" ? true : l.status === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [leaveRequests, searchQuery, activeTab]);

  const stats = useMemo(() => {
    return {
      total: leaveRequests.length,
      pending: leaveRequests.filter((l) => l.status === "Pending").length,
      approved: leaveRequests.filter((l) => l.status === "Approved").length,
      rejected: leaveRequests.filter((l) => l.status === "Rejected").length,
    };
  }, [leaveRequests]);

  return (
    <div className="space-y-6">
      {/* Stats Counter Section */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Requests", val: stats.total, color: "border-slate-200 bg-slate-50 text-slate-700", icon: CalendarDays },
          { label: "Pending Approval", val: stats.pending, color: "border-amber-100 bg-amber-50/40 text-amber-700", icon: AlertCircle },
          { label: "Approved Leaves", val: stats.approved, color: "border-emerald-100 bg-emerald-50/40 text-emerald-700", icon: CheckCircle2 },
          { label: "Rejected Leaves", val: stats.rejected, color: "border-rose-100 bg-rose-50/40 text-rose-700", icon: XCircle },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className={cn("border shadow-sm transition-all duration-300", s.color)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">{s.label}</div>
                  <div className="text-xl font-black mt-1">{s.val}</div>
                </div>
                <Icon className="h-5 w-5 opacity-80" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filter Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit border border-slate-200/50">
          {(["All", "Pending", "Approved", "Rejected"] as TabType[]).map((tab) => {
            const count = tab === "All" ? leaveRequests.length : leaveRequests.filter(l => l.status === tab).length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-2",
                  isActive
                    ? "bg-white text-indigo-700 shadow-sm border border-slate-200/40"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/40"
                )}
              >
                {tab}
                <span className={cn(
                  "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                  isActive ? "bg-indigo-50 text-indigo-700" : "bg-slate-200 text-slate-600"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Card */}
      <Card className="border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/40 border-b border-slate-100 hover:bg-slate-50/40">
                <TableHead className="py-4 font-semibold text-slate-700 pl-5">Employee</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700">Leave Type</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700">Dates</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700 text-center">Duration</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700 max-w-[280px]">Reason</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700">Status</TableHead>
                <TableHead className="py-4 font-semibold text-slate-700 text-right pr-5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-xs text-slate-400 font-medium">
                    No leave requests found matching the current search & filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeaves.map((l) => {
                  const originalIndex = leaveRequests.findIndex(
                    (r) => r.name === l.name && r.dates === l.dates && r.reason === l.reason
                  );

                  return (
                    <TableRow key={`${l.name}-${l.dates}`} className="hover:bg-indigo-50/10 transition-colors border-b border-slate-100/60 last:border-0 group">
                      <TableCell className="py-3.5 pl-5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 ring-2 ring-indigo-50/20">
                            <AvatarFallback className="bg-indigo-50 text-[10px] text-indigo-700 font-bold">
                              {initials(l.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-xs font-semibold text-slate-800">{l.name}</div>
                            <div className="text-[9px] text-slate-400 font-medium">Requested 2h ago</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5">
                        <Badge variant="secondary" className={cn("border font-bold text-[9px] px-2 py-0.5", leaveTone[l.type])}>
                          {l.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3.5 text-xs text-slate-600 font-semibold">{l.dates}</TableCell>
                      <TableCell className="py-3.5 text-xs text-center font-bold text-slate-700">
                        {l.days} day{l.days > 1 ? "s" : ""}
                      </TableCell>
                      <TableCell className="py-3.5 text-xs text-slate-500 font-medium truncate max-w-[280px]" title={l.reason}>
                        {l.reason}
                      </TableCell>
                      <TableCell className="py-3.5">
                        <Badge variant="secondary" className={cn("border font-bold text-[9px] px-2 py-0.5 uppercase tracking-wide", statusTone[l.status])}>
                          {l.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3.5 text-right pr-5">
                        {l.status === "Pending" ? (
                          <div className="flex justify-end gap-1.5">
                            <Button
                              size="sm"
                              className="h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-[10px] font-semibold gap-1 text-white shadow-sm"
                              onClick={() => handleStatusChange(originalIndex, l.name, "Approved")}
                            >
                              <Check className="h-3 w-3" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2.5 border-rose-200 text-rose-700 hover:bg-rose-55 text-[10px] font-semibold gap-1"
                              onClick={() => handleStatusChange(originalIndex, l.name, "Rejected")}
                            >
                              <X className="h-3 w-3" /> Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Archived
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
