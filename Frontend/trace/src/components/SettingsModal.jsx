import { useState } from "react";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function SettingsModal({ className }) {
  const [obsidianEnabled, setObsidianEnabled] = useState(false);
  const [obsidianApiKey, setObsidianApiKey] = useState("");
  const [obsidianApiUrl, setObsidianApiUrl] = useState("http://localhost:27123");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Simulate saving
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("h-9 w-9", className)}>
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure integrations and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Obsidian Integration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="obsidian-toggle" className="text-sm font-medium">
                  Obsidian Sync
                </Label>
                <p className="text-xs text-muted-foreground">
                  Save answers directly to your Obsidian vault
                </p>
              </div>
              <Switch
                id="obsidian-toggle"
                checked={obsidianEnabled}
                onCheckedChange={setObsidianEnabled}
              />
            </div>

            {obsidianEnabled && (
              <div className="space-y-4 pl-0 animate-slide-up">
                <div className="space-y-2">
                  <Label htmlFor="obsidian-api-key" className="text-xs text-muted-foreground uppercase tracking-wider">
                    API Key
                  </Label>
                  <Input
                    id="obsidian-api-key"
                    type="password"
                    placeholder="Leave empty to disable"
                    value={obsidianApiKey}
                    onChange={(e) => setObsidianApiKey(e.target.value)}
                    className="bg-secondary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="obsidian-api-url" className="text-xs text-muted-foreground uppercase tracking-wider">
                    API URL
                  </Label>
                  <Input
                    id="obsidian-api-url"
                    type="text"
                    placeholder="http://localhost:27123"
                    value={obsidianApiUrl}
                    onChange={(e) => setObsidianApiUrl(e.target.value)}
                    className="bg-secondary/50 font-mono text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Save button */}
          <Button onClick={handleSave} className="w-full" disabled={saved}>
            {saved ? (
              <span className="flex items-center gap-2">
                <span className="text-trace-success">✓</span> Saved
              </span>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
