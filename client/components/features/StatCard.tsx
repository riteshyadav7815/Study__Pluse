"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  progress?: number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  subtitle,
  progress,
  icon,
  trend,
  className,
  isLoading,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="space-y-3">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-8 w-16" />
          <div className="skeleton h-3 w-32" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("group transition-all hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold tracking-tight">{value}</span>
              {trend && (
                <span
                  className={cn(
                    "flex items-center text-xs font-medium",
                    trend === "up" && "text-emerald-500",
                    trend === "down" && "text-red-500",
                    trend === "neutral" && "text-muted-foreground"
                  )}
                >
                  {trend === "up" && <TrendingUp className="mr-0.5 h-3 w-3" />}
                  {trend === "down" && <TrendingDown className="mr-0.5 h-3 w-3" />}
                  {trend === "neutral" && <Minus className="mr-0.5 h-3 w-3" />}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>
        {typeof progress === "number" && (
          <div className="mt-4">
            <Progress value={progress} showLabel />
          </div>
        )}
      </CardContent>
    </Card>
  );
}