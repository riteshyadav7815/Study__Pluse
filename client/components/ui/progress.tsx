import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
  showLabel?: boolean;
}

const Progress: React.FC<ProgressProps> = ({ value, className, indicatorClassName, showLabel }) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="space-y-1">
      <div
        className={cn("h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full rounded-full bg-primary transition-all duration-500 ease-in-out",
            indicatorClassName
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted-foreground text-right">{clampedValue.toFixed(0)}%</p>
      )}
    </div>
  );
};

export { Progress };