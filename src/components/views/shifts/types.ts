import type * as React from "react";

export interface ShiftsViewProps {
  searchQuery: string;
  shiftsList: any[];
  setShiftsList: React.Dispatch<React.SetStateAction<any[]>>;
}
