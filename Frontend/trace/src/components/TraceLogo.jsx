import { cn } from "@/lib/utils";
import { Diamond } from "lucide-react";

export function TraceLogo({ className, showTagline = false }) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Diamond className="h-6 w-6 text-primary" strokeWidth={2.5} />
          <div className="absolute inset-0 blur-md bg-primary/30 -z-10" />
        </div>
        <span className="font-semibold text-lg tracking-tight text-foreground">
          TRACE
        </span>
      </div>
      {showTagline && (
        <p className="text-xs text-muted-foreground mt-1 pl-8">
          Ask questions. Get answers. See the evidence.
        </p>
      )}
    </div>
  );
}
