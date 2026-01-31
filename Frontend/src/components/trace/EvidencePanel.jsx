import { cn } from "@/lib/utils";
import { X, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function EvidencePanel({
  evidences,
  activeCitation,
  onCitationClick,
  onClose,
  isOpen,
  className,
}) {
  if (!isOpen) return null;

  return (
    <aside className={cn(
      "w-80 h-screen flex flex-col border-l border-border bg-card animate-fade-in",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Evidence</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Evidence list */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {evidences.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Citations will appear here when you ask a question.
              </p>
            </div>
          ) : (
            evidences.map((evidence) => (
              <div
                key={evidence.id}
                onClick={() => onCitationClick(evidence.citationNumber)}
                className={cn(
                  "evidence-card p-3 rounded-lg bg-secondary/50 cursor-pointer",
                  activeCitation === evidence.citationNumber && "active bg-secondary"
                )}
              >
                {/* Citation header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="citation-badge">
                    [{evidence.citationNumber}]
                  </span>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>

                {/* Source file */}
                <div className="flex items-center gap-1.5 mb-2">
                  <FileText className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate">
                    {evidence.sourceFile}
                    {evidence.page && ` • Page ${evidence.page}`}
                    {evidence.timestamp && ` • ${evidence.timestamp}`}
                  </span>
                </div>

                {/* Excerpt */}
                <p className="text-sm text-foreground leading-relaxed line-clamp-4">
                  "{evidence.excerpt}"
                </p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
