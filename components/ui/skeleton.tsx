import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <span
      className={cn("animate-pulse rounded-md bg-muted block", className)}
      {...props}
    />
  );
}

export { Skeleton };
