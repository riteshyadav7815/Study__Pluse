import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, variant = "text", width, height, ...props }) => {
  const variants: Record<string, string> = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-md",
  };

  return (
    <div
      className={cn("skeleton", variants[variant], className)}
      style={{ width, height }}
      {...props}
    />
  );
};

export { Skeleton };