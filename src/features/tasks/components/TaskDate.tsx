import { cn } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";
import React from "react";

interface TaskDateProps {
  value: string;
  className?: string;
}

const TaskDate = ({ value, className }: TaskDateProps) => {
  const today = new Date();
  const endDate = new Date(value);
  const diffInDays = differenceInDays(endDate, today);

  const colorMapping = {
    overdue: "text-red-700", // Overdue tasks
    red: "text-red-500", // Urgent (≤ 3 days left)
    orange: "text-orange-500", // Approaching deadline (≤ 7 days left)
    yellow: "text-yellow-500", // Moderate urgency (≤ 14 days left)
    default: "text-muted-foreground", // Plenty of time left
  };

  const textColor =
    diffInDays < 0
      ? colorMapping.overdue
      : diffInDays <= 3
      ? colorMapping.red
      : diffInDays <= 7
      ? colorMapping.orange
      : diffInDays <= 14
      ? colorMapping.yellow
      : colorMapping.default;

  return (
    <div className={`${textColor} font-medium`}>
      <span className={cn("truncate", className)}>{format(value, "PPP")}</span>
    </div>
  );
};

export default TaskDate;
