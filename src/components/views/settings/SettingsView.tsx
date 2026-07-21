import { SettingsViewProps } from "./types";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SettingsView({ searchQuery }: SettingsViewProps) {
  const settingsCards = [
    { t: "Organization profile", d: "Company name, logo, timezone, and address." },
    { t: "Work policies", d: "Shift patterns, overtime rules, weekly off days." },
    { t: "Leave policies", d: "Accrual, caps, and approval hierarchy." },
    { t: "Payroll setup", d: "Pay cycles, tax rates, and disbursement accounts." },
  ];

  const filtered = useMemo(() => {
    if (!searchQuery) return settingsCards;
    const q = searchQuery.toLowerCase();
    return settingsCards.filter(
      (s) => s.t.toLowerCase().includes(q) || s.d.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  return (
    <div className="h-full flex flex-col space-y-4 min-h-0">
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((s) => (
          <Card key={s.t} className="border-slate-200 transition-shadow hover:shadow-md">
            <CardContent className="p-5">
              <div className="text-sm font-semibold text-slate-800">{s.t}</div>
              <div className="mt-1 text-xs text-slate-500 font-medium">{s.d}</div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 border-slate-200/80 hover:bg-slate-50 text-xs font-semibold"
              >
                Configure
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
