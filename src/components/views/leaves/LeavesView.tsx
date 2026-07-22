import { LeavesViewProps } from "./types";
import { useMemo, useState, useEffect } from "react";
import { Check, X } from "lucide-react";
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
import { leaves, initials } from "@/lib/mockData";
import { LeaveType, LeaveRequest } from "@/types";
import { toast } from "sonner";
import { TableFooterPagination } from "@/components/TableFooterPagination";

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
      prev.map((req, i) => (i === index ? { ...req, status: newStatus } : req)),
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

  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  const displayedLeaves = useMemo(() => {
    const start = (currentPage - 1) * 10;
    return filteredLeaves.slice(start, start + 10);
  }, [filteredLeaves, currentPage]);

  return (
    <div className="h-full flex flex-col space-y-4 min-h-0">
      {/* Stats Counter Section */}
      <div className="grid gap-3 sm:grid-cols-4 shrink-0">
        {[
          {
            t: "Total Requests",
            v: stats.total,
            color: "text-indigo-700 bg-indigo-50",
            chartColor: "text-indigo-300",
            tabName: "All",
          },
          {
            t: "Pending Approval",
            v: stats.pending,
            color: "text-amber-700 bg-amber-50",
            chartColor: "text-amber-300",
            tabName: "Pending",
          },
          {
            t: "Approved Leaves",
            v: stats.approved,
            color: "text-emerald-700 bg-emerald-50",
            chartColor: "text-emerald-300",
            tabName: "Approved",
          },
          {
            t: "Rejected Leaves",
            v: stats.rejected,
            color: "text-rose-700 bg-rose-50",
            chartColor: "text-rose-300",
            tabName: "Rejected",
          },
        ].map((c) => (
          <Card
            key={c.t}
            onClick={() => setActiveTab(c.tabName as TabType)}
            className={cn(
              "border-slate-200/60 bg-white/70 shadow-sm transition-all hover:shadow-md cursor-pointer",
              activeTab === c.tabName ? "ring-2 ring-indigo-500 shadow-md" : "hover:ring-1 hover:ring-slate-300"
            )}
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



      {/* Table Card */}
      {/* Table Card */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden rounded-2xl border border-white/60 bg-white/60 shadow-sm shadow-slate-200/50 backdrop-blur-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Employee</TableHead>
              <TableHead>Leave Type</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead className="text-center">Duration</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {displayedLeaves.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-slate-400"
                  >
                    No leave requests found matching the current search & filters.
                  </TableCell>
                </TableRow>
              ) : (
                displayedLeaves.map((l) => {
                  const originalIndex = leaveRequests.findIndex(
                    (r) => r.name === l.name && r.dates === l.dates && r.reason === l.reason,
                  );

                  return (
                    <TableRow key={`${l.name}-${l.dates}`}>
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 ring-2 ring-indigo-50/20 group-hover:ring-indigo-100 transition-all duration-300">
                            <AvatarFallback className="bg-indigo-50 text-[10px] text-indigo-700 font-bold">
                              {initials(l.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors duration-200">{l.name}</div>
                            <div className="text-slate-400 mt-0.5">
                              Requested 2h ago
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "border px-2 py-0.5",
                            leaveTone[l.type],
                          )}
                        >
                          {l.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {l.dates}
                      </TableCell>
                      <TableCell className="text-center text-slate-700">
                        {l.days} day{l.days > 1 ? "s" : ""}
                      </TableCell>
                      <TableCell
                        className="text-slate-500 truncate max-w-[280px]"
                        title={l.reason}
                      >
                        {l.reason}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "border px-2 py-0.5 shadow-sm/5 inline-flex items-center gap-1.5",
                            statusTone[l.status],
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full animate-pulse",
                              l.status === "Approved" ? "bg-emerald-500" : l.status === "Rejected" ? "bg-rose-500" : "bg-amber-500",
                            )}
                          />
                          {l.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        {l.status === "Pending" ? (
                          <div className="flex justify-end gap-1.5">
                            <Button
                              size="sm"
                              className="h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 gap-1 text-white shadow-sm"
                              onClick={() => handleStatusChange(originalIndex, l.name, "Approved")}
                            >
                              <Check className="h-3 w-3" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2.5 border-rose-200 text-rose-700 hover:bg-rose-55 gap-1"
                              onClick={() => handleStatusChange(originalIndex, l.name, "Rejected")}
                            >
                              <X className="h-3 w-3" /> Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-slate-400 uppercase tracking-wider">
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
        <div className="border-t border-slate-100/60 bg-white/40">
          <TableFooterPagination
            total={filteredLeaves.length}
            shown={displayedLeaves.length}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
