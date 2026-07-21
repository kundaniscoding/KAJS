import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableFooterPaginationProps {
  total: number;
  shown: number;
}

export function TableFooterPagination({ total, shown }: TableFooterPaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500 bg-slate-50/20">
      <div>
        Showing <span className="font-medium text-slate-700">1–{shown}</span> of{" "}
        <span className="font-medium text-slate-700">{total}</span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" className="h-8 gap-1 border-slate-200 hover:bg-slate-50 text-xs font-medium">
          <ChevronLeft className="h-3.5 w-3.5" /> Prev
        </Button>
        {[1, 2, 3].map((p) => (
          <Button
            key={p}
            variant={p === 1 ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-8 w-8 p-0 text-xs font-semibold border-slate-200/80",
              p === 1 ? "bg-indigo-600 hover:bg-indigo-700 text-white border-0" : "hover:bg-slate-50"
            )}
          >
            {p}
          </Button>
        ))}
        <Button variant="outline" size="sm" className="h-8 gap-1 border-slate-200 hover:bg-slate-50 text-xs font-medium">
          Next <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
