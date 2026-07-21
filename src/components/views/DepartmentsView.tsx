import { useMemo } from "react";
import { Building2, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DepartmentsViewProps {
  searchQuery: string;
  departmentsList: any[];
  setDepartmentsList: React.Dispatch<React.SetStateAction<any[]>>;
  onEditDeptClick: (dept: any) => void;
  onViewDeptClick: (dept: any) => void;
}

export function DepartmentsView({
  searchQuery,
  departmentsList,
  setDepartmentsList,
  onEditDeptClick,
  onViewDeptClick,
}: DepartmentsViewProps) {
  const toneMap: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    sky: "bg-sky-50 text-sky-700",
    violet: "bg-violet-50 text-violet-700",
    slate: "bg-slate-100 text-slate-700",
    teal: "bg-teal-50 text-teal-700",
  };

  const filteredDepartments = useMemo(() => {
    if (!searchQuery) return departmentsList;
    const q = searchQuery.toLowerCase();
    return departmentsList.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.head.toLowerCase().includes(q) ||
        d.budget.toLowerCase().includes(q) ||
        d.employees.toString().includes(q) ||
        d.openRoles.toString().includes(q)
    );
  }, [searchQuery, departmentsList]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filteredDepartments.map((d) => (
          <Card key={d.name} className="border-slate-200 transition-shadow hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={cn("grid h-10 w-10 place-items-center rounded-lg", toneMap[d.tone])}>
                  <Building2 className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {d.openRoles} open
                </Badge>
              </div>
              <div className="mt-4 text-base font-semibold text-slate-900">{d.name}</div>
              <div className="mt-0.5 text-xs text-slate-500 font-medium">Led by {d.head}</div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs">
                <div>
                  <div className="text-slate-500">Employees</div>
                  <div className="font-semibold text-slate-900">{d.employees}</div>
                </div>
                <div>
                  <div className="text-slate-500">Budget</div>
                  <div className="font-semibold text-slate-900">{d.budget}</div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => onViewDeptClick(d)}>
                  View Roster
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-slate-55"
                  onClick={() => onEditDeptClick(d)}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
