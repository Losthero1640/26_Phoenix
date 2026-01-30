import { FileText, CheckCircle, Sparkles, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: CheckCircle,
    title: "Evidence-backed answers",
    description: "Every response is grounded in your uploaded documents",
  },
  {
    icon: Link2,
    title: "Clickable citations",
    description: "Jump directly to the source with inline references",
  },
  {
    icon: Sparkles,
    title: "Multi-modal support",
    description: "Analyze PDFs, images, audio, and video files",
  },
];

export function HeroEmptyState({ className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-16 px-8 animate-fade-in", className)}>
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-xl -z-10" />
      </div>

      {/* Headline */}
      <h1 className="text-3xl font-semibold text-foreground mb-3">
        Welcome to <span className="text-primary">TRACE</span>
      </h1>
      
      <p className="text-lg text-muted-foreground max-w-md mb-10">
        Upload documents, images, audio, or video files and ask questions.
        All answers are grounded in evidence with clickable citations.
      </p>

      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="flex flex-col items-center p-4 rounded-lg bg-secondary/30 border border-border/50 transition-all duration-200 hover:bg-secondary/50 hover:border-border animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <feature.icon className="h-5 w-5 text-primary mb-2" />
            <h3 className="text-sm font-medium text-foreground mb-1">
              {feature.title}
            </h3>
            <p className="text-xs text-muted-foreground text-center">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Getting started hint */}
      <div className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-8 h-px bg-border" />
        <span>Upload a document to get started</span>
        <div className="w-8 h-px bg-border" />
      </div>
    </div>
  );
}
