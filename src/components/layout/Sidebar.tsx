import { useState, useEffect } from "react";
import { ViewKey } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronLeft, ChevronDown, BarChart3, Settings, LogOut } from "lucide-react";
import { navItems } from "./navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Sidebar({
  view,
  setView,
  isCollapsed,
  setIsCollapsed
}: {
  view: ViewKey;
  setView: (v: ViewKey) => void;
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}) {
  const [isReportsExpanded, setIsReportsExpanded] = useState(
    view.startsWith("report-")
  );

  useEffect(() => {
    if (view.startsWith("report-")) {
      setIsReportsExpanded(true);
    }
  }, [view]);

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-30 hidden border-r border-slate-200 bg-white md:flex md:flex-col transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className={cn("flex h-16 items-center border-b border-slate-200 relative transition-all duration-300 overflow-hidden", isCollapsed ? "px-0 justify-center" : "px-4 justify-start")}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-600 text-white font-bold transition-all duration-300">
            K
          </div>
          <div className={cn(
            "whitespace-nowrap overflow-hidden transition-all duration-300",
            isCollapsed ? "max-w-0 opacity-0" : "max-w-[150px] opacity-100"
          )}>
            <div className="text-sm font-semibold tracking-tight">KAJS Global</div>
            <div className="text-[11px] text-slate-500">Workforce Suite</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto overflow-x-hidden">
        {navItems.filter(item => item.key !== "settings").map((item) => {
          const Icon = item.icon;
          const active = view === item.key;
          return (
            <TooltipProvider key={item.key} delayDuration={isCollapsed ? 0 : 1000}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setView(item.key)}
                    className={cn(
                      "relative flex items-center rounded-lg py-2 text-sm font-medium transition-all duration-300",
                      active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                      isCollapsed ? "justify-center px-0 w-10 mx-auto" : "w-full px-3"
                    )}
                  >
                    <Icon className={cn("h-4.5 w-4.5 shrink-0 transition-colors", active ? "text-indigo-600" : "text-slate-500")} />
                    <span className={cn(
                      "whitespace-nowrap transition-all duration-300 overflow-hidden",
                      isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[130px] opacity-100 ml-3"
                    )}>
                      {item.label}
                    </span>
                    <div className={cn(
                      "absolute right-3 transition-all duration-300 flex items-center justify-center overflow-hidden",
                      (!isCollapsed && active) ? "w-1.5 opacity-100" : "w-0 opacity-0"
                    )}>
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                    </div>
                  </button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        })}

        {/* Reports Navigation Group */}
        <div className="space-y-1 pt-1.5">
          <TooltipProvider delayDuration={isCollapsed ? 0 : 1000}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    if (isCollapsed) setIsCollapsed(false);
                    setIsReportsExpanded(!isReportsExpanded);
                  }}
                  className={cn(
                    "relative flex items-center rounded-lg py-2 text-sm font-medium transition-all duration-300",
                    view.startsWith("report-")
                      ? "bg-indigo-50/50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    isCollapsed ? "justify-center px-0 w-10 mx-auto" : "w-full px-3"
                  )}
                >
                  <BarChart3 className={cn("h-4.5 w-4.5 shrink-0 transition-colors", view.startsWith("report-") ? "text-indigo-600" : "text-slate-500")} />
                  <span className={cn(
                    "whitespace-nowrap transition-all duration-300 overflow-hidden text-left",
                    isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[100px] opacity-100 ml-3"
                  )}>
                    Reports
                  </span>
                  <div className={cn(
                    "absolute right-3 transition-all duration-300 flex items-center justify-center overflow-hidden",
                    isCollapsed ? "w-0 opacity-0" : "w-4 opacity-100"
                  )}>
                    <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200 text-slate-400", isReportsExpanded && "rotate-180")} />
                  </div>
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                  <p>Reports</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          <div className={cn(
            "transition-all duration-300 overflow-hidden",
            (!isCollapsed && isReportsExpanded) ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          )}>
            <div className="space-y-1 pl-4.5 border-l border-slate-100 ml-5.5 mt-1 text-left">
              {[
                { key: "report-daily", label: "Daily Report" },
                { key: "report-weekly", label: "Weekly Report" },
                { key: "report-15days", label: "15 Days Report" },
                { key: "report-monthly", label: "Monthly Report" },
              ].map((sub) => {
                const active = view === sub.key;
                return (
                  <button
                    key={sub.key}
                    onClick={() => setView(sub.key as ViewKey)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap",
                      active
                        ? "text-indigo-600 bg-indigo-50/40"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200", active ? "bg-indigo-600 scale-125" : "bg-slate-300")} />
                    {sub.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Settings button rendered at the very end */}
        {navItems.filter(item => item.key === "settings").map((item) => {
          const Icon = item.icon;
          const active = view === item.key;
          return (
            <TooltipProvider key={item.key} delayDuration={isCollapsed ? 0 : 1000}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setView(item.key)}
                    className={cn(
                      "relative flex items-center rounded-lg py-2 text-sm font-medium transition-all duration-300",
                      active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                      isCollapsed ? "justify-center px-0 w-10 mx-auto mt-2" : "w-full px-3 mt-2"
                    )}
                  >
                    <Icon className={cn("h-4.5 w-4.5 shrink-0 transition-colors", active ? "text-indigo-600" : "text-slate-500")} />
                    <span className={cn(
                      "whitespace-nowrap transition-all duration-300 overflow-hidden",
                      isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[130px] opacity-100 ml-3"
                    )}>
                      {item.label}
                    </span>
                    <div className={cn(
                      "absolute right-3 transition-all duration-300 flex items-center justify-center overflow-hidden",
                      (!isCollapsed && active) ? "w-1.5 opacity-100" : "w-0 opacity-0"
                    )}>
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                    </div>
                  </button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </nav>
      <div className="relative border-t border-slate-200 transition-all duration-300 flex flex-col shrink-0 bg-white">
        {/* Toggle Button Overlapping Right Border */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-7 w-7 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 absolute -right-3.5 -top-3.5 z-40 hidden md:flex shadow-sm ring-[5px] ring-white"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform duration-300", isCollapsed && "rotate-180")} />
        </Button>

        {/* User Section */}
        <div className={cn("border-b border-slate-100 p-3", isCollapsed ? "flex justify-center" : "px-4")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn("flex items-center gap-3 rounded-xl hover:bg-slate-50 transition-colors w-full text-left", isCollapsed ? "justify-center p-1" : "p-2")}>
                <Avatar className="h-9 w-9 shrink-0 ring-2 ring-white shadow-sm">
                  <AvatarFallback className="bg-indigo-600 font-semibold text-xs text-white">AR</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="font-semibold text-slate-800 text-sm truncate">Alex Rivera</div>
                    <div className="text-[11px] text-slate-500 font-medium truncate">HR Admin</div>
                  </div>
                )}
                {!isCollapsed && <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isCollapsed ? "center" : "end"} side="right" sideOffset={8} className="w-56">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 gap-2 focus:bg-red-50 focus:text-red-700">
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Company Info Box */}
        <div className={cn("transition-all duration-300 overflow-hidden", isCollapsed ? "h-0 opacity-0" : "p-4 opacity-100")}>
          <div className="w-full rounded-xl bg-slate-50 border border-slate-100 p-3 shadow-sm">
            <div className="text-xs font-bold text-slate-800 tracking-tight">KAJS Global</div>
            <div className="mt-1 text-[10px] font-medium text-slate-500 uppercase tracking-widest">Running Package: Pro</div>
          </div>
        </div>

        {/* Collapsed Company Info (KG) */}
        <div className={cn(
          "flex justify-center transition-all duration-300 overflow-hidden",
          isCollapsed ? "p-4 opacity-100" : "h-0 opacity-0 p-0"
        )}>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700 font-bold text-sm cursor-pointer shadow-sm border border-indigo-100/50">
                  KG
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                <p>KAJS Global (Pro)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </aside>
  );
}
