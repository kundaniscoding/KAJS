import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

export function AttendanceLogModal({
  isOpen,
  onClose,
  employeeInfo,
  dateInfo,
}: {
  isOpen: boolean;
  onClose: () => void;
  employeeInfo?: { name: string; code: string };
  dateInfo?: { date: string; month: string; year: string }; // e.g. 20, July, 2026
}) {
  if (!isOpen) return null;

  // Mocked data matching the screenshot exactly
  const displayCode = employeeInfo?.code || "1058";
  const displayName = employeeInfo?.name || `Employee ${displayCode}`;
  const displayDateString = dateInfo
    ? `${dateInfo.month} ${dateInfo.date}, ${dateInfo.year}`
    : "July 20, 2026";

  const logs = [
    {
      datetime: "Jul 20, 2026, 08:21",
      time: "02:36:02",
      type: "OUT",
      device: "MFP3241900342",
      status: "1",
    },
    {
      datetime: "Jul 20, 2026, 08:58",
      time: "03:13:17",
      type: "OUT",
      device: "MFP3241900342",
      status: "1",
    },
    {
      datetime: "Jul 20, 2026, 08:58",
      time: "03:13:20",
      type: "OUT",
      device: "MFP3241900342",
      status: "1",
    },
    {
      datetime: "Jul 20, 2026, 19:26",
      time: "13:41:47",
      type: "OUT",
      device: "MFP3243500184",
      status: "1",
    },
    {
      datetime: "Jul 20, 2026, 19:26",
      time: "13:41:49",
      type: "OUT",
      device: "MFP3243500184",
      status: "1",
    },
    {
      datetime: "Jul 20, 2026, 20:10",
      time: "14:25:35",
      type: "OUT",
      device: "MFP3243500184",
      status: "1",
    },
    {
      datetime: "Jul 20, 2026, 20:10",
      time: "14:25:53",
      type: "OUT",
      device: "MFP3243500184",
      status: "1",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="mb-6">
          <div className="text-sm font-medium text-slate-500 mb-1">{displayCode}</div>
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">{displayName}</h2>
          <div className="text-[15px] text-slate-600 mt-1">{displayDateString}</div>

          <div className="flex items-center gap-2 mt-5">
            <Badge className="bg-slate-800 hover:bg-slate-800 text-white rounded text-xs px-2.5 py-0.5">
              Present
            </Badge>
            <Badge
              variant="outline"
              className="text-slate-700 border-slate-200 rounded text-xs px-2.5 py-0.5 font-medium bg-slate-50/50"
            >
              Attendance logs found without roster
            </Badge>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <Card className="shadow-none border-slate-200 bg-[#fcfdfd]">
              <CardContent className="px-4 py-3">
                <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-1">
                  Planned Time
                </div>
                <div className="text-lg font-bold text-slate-800">-</div>
              </CardContent>
            </Card>

            <Card className="shadow-none border-slate-200 bg-[#fcfdfd]">
              <CardContent className="px-4 py-3">
                <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-1">
                  Actual Time
                </div>
                <div className="text-lg font-bold text-slate-800">08:21 - 20:10</div>
              </CardContent>
            </Card>

            <Card className="shadow-none border-slate-200 bg-[#fcfdfd]">
              <CardContent className="px-4 py-3">
                <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-1">
                  Worked Hours
                </div>
                <div className="text-lg font-bold text-slate-800">11.82</div>
              </CardContent>
            </Card>

            <Card className="shadow-none border-slate-200 bg-[#fcfdfd]">
              <CardContent className="px-4 py-3">
                <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-1">
                  Planned Hours
                </div>
                <div className="text-lg font-bold text-slate-800">0.00</div>
              </CardContent>
            </Card>

            <Card className="shadow-none border-slate-200 bg-[#fcfdfd]">
              <CardContent className="px-4 py-3">
                <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-1">
                  Late Minutes
                </div>
                <div className="text-lg font-bold text-slate-800">0</div>
              </CardContent>
            </Card>

            <Card className="shadow-none border-slate-200 bg-[#fcfdfd]">
              <CardContent className="px-4 py-3">
                <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase mb-1">
                  Overtime Minutes
                </div>
                <div className="text-lg font-bold text-slate-800">0</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-800">Attendance Log Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-2 font-bold text-black w-1/4">Date Time</th>
                    <th className="py-3 px-2 font-bold text-black w-1/6">Time</th>
                    <th className="py-3 px-2 font-bold text-black w-1/6">Type</th>
                    <th className="py-3 px-2 font-bold text-black w-1/4">Device</th>
                    <th className="py-3 px-2 font-bold text-black">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log, index) => (
                    <tr key={index} className="hover:bg-slate-50/50">
                      <td className="py-3 px-2 text-slate-800">{log.datetime}</td>
                      <td className="py-3 px-2 text-slate-800">{log.time}</td>
                      <td className="py-3 px-2 text-slate-800">{log.type}</td>
                      <td className="py-3 px-2 text-slate-800">{log.device}</td>
                      <td className="py-3 px-2 text-slate-800">{log.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
