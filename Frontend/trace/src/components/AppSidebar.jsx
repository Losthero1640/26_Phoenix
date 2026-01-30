import { TraceLogo } from "@/components/TraceLogo";
import { UploadZone } from "@/components/UploadZone";
import { cn } from "@/lib/utils";
import { getAuth, logoutAndGoHome } from "@/lib/auth";
import { Clock, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockRecentDocs = [
  { id: "1", name: "Research Paper.pdf", date: "2 hours ago" },
  { id: "2", name: "Meeting Notes.pdf", date: "Yesterday" },
  { id: "3", name: "Legal Contract.pdf", date: "3 days ago" },
];

export function AppSidebar({ files, onFilesChange, className }) {
  const auth = getAuth();
  return (
    <aside className={cn(
      "w-72 h-screen flex flex-col border-r border-sidebar-border bg-sidebar",
      className
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <TraceLogo showTagline />
      </div>

      {/* Upload section */}
      <div className="p-4 border-b border-sidebar-border">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Documents
        </h3>
        <UploadZone files={files} onFilesChange={onFilesChange} />
      </div>

      {/* Recent documents */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Clock className="h-3 w-3" />
          Recent Sessions
        </h3>
        <div className="space-y-1">
          {mockRecentDocs.map((doc) => (
            <button
              key={doc.id}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left hover:bg-sidebar-accent transition-colors group"
            >
              <FileText className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate text-sidebar-foreground">{doc.name}</p>
                <p className="text-2xs text-muted-foreground">{doc.date}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        {auth?.email && (
          <p className="text-xs text-muted-foreground truncate px-1" title={auth.email}>
            {auth.email}
          </p>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground pointer-events-auto relative z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            logoutAndGoHome();
          }}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
        <p className="text-2xs text-muted-foreground text-center">
          Evidence-grounded AI assistant
        </p>
      </div>
    </aside>
  );
}
