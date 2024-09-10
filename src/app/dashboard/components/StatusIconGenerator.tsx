// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
import { ReactNode } from "react";
import { Tooltip } from "@mui/material";

// Define the expected types for icons and status
interface Icon {
  name: string;
  icon: ReactNode;
}

interface Status {
  name: string;
  color: string;
  tooltip: string;
}

interface StatusIconGeneratorProps {
  icons: Icon[];
  status: Status;
}

export default function StatusIconGenerator({
  icons,
  status,
}: StatusIconGeneratorProps) {
  const currentIcon = icons.find((icon) => icon.name === status.name);

  return (
    <div className={`${status.color} flex items-center w-full h-full`}>
      <Tooltip title={status.tooltip}>
        <div>
          {currentIcon ? currentIcon.icon : <span>Unknown status</span>}
        </div>
      </Tooltip>
    </div>
  );
}
