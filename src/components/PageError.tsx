import { AlertTriangle } from "lucide-react";
import React from "react";

interface PageErrorProps {
  message: string;
}

const PageError = ({ message = "Something went wrong" }: PageErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <AlertTriangle className="size-6 text-muted-foreground mb-2"></AlertTriangle>
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
};

export default PageError;
