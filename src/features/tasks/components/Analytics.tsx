import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ProjectAnalyticsResponseType } from "@/features/projects/api/useGetProjectAnalytics";
import React from "react";
import AnalyticsCard from "./AnalyticsCard";
import DottedSeparator from "@/components/DottedSeparator";

const Analytics = ({ data }: ProjectAnalyticsResponseType) => {
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Total Tasks"
            value={data.taskCount}
            variant={data.taskDifference > 0 ? "up" : "down"}
            increaseValue={data.taskDifference}
          ></AnalyticsCard>
          <DottedSeparator direction="vertical"></DottedSeparator>
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Assigned Tasks"
            value={data.assignedTaskCount}
            variant={data.assignedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.assignedTaskDifference}
          ></AnalyticsCard>
          <DottedSeparator direction="vertical"></DottedSeparator>
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Completed Tasks"
            value={data.completeTaskCount}
            variant={data.completeTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.completeTaskDifference}
          ></AnalyticsCard>
          <DottedSeparator direction="vertical"></DottedSeparator>
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Overdue Tasks"
            value={data.overdueTaskCount}
            variant={data.overdueTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.overdueTaskDifference}
          ></AnalyticsCard>
          <DottedSeparator direction="vertical"></DottedSeparator>
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Incomplete Tasks"
            value={data.incompleteTaskCount}
            variant={data.incompleteTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.incompleteTaskDifference}
          ></AnalyticsCard>
          <DottedSeparator direction="vertical"></DottedSeparator>
        </div>
      </div>
      <ScrollBar orientation="horizontal"></ScrollBar>
    </ScrollArea>
  );
};

export default Analytics;
