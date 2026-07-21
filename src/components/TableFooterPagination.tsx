import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableFooterPaginationProps {
  total: number;
  shown: number;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export function TableFooterPagination({ 
  total, 
  shown,
  currentPage = 1,
  itemsPerPage = 10,
  onPageChange
}: TableFooterPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
  const startItem = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, total);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (currentPage >= totalPages - 2) {
        pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500 bg-slate-50/20 shrink-0">
      <div>
        Showing <span className="font-medium text-slate-700">{startItem}–{endItem}</span> of{" "}
        <span className="font-medium text-slate-700">{total}</span>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 border-slate-200 hover:bg-slate-50 text-xs font-medium"
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Prev
        </Button>
        {getPageNumbers().map((p) => (
          <Button
            key={p}
            variant={p === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange?.(p)}
            className={cn(
              "h-8 w-8 p-0 text-xs font-semibold border-slate-200/80",
              p === currentPage
                ? "bg-indigo-600 hover:bg-indigo-700 text-white border-0"
                : "hover:bg-slate-50",
            )}
          >
            {p}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 border-slate-200 hover:bg-slate-50 text-xs font-medium"
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
