import { useState, useEffect } from "react";
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

const OBSIDIAN_KEY = "obsidian_api_key";
const OBSIDIAN_URL = "obsidian_api_url";
const DEFAULT_OBSIDIAN_URL = "http://localhost:27123";

export function SettingsModal({ className }) {
  const [obsidianApiKey, setObsidianApiKey] = useState("");
  const [obsidianApiUrl, setObsidianApiUrl] = useState(DEFAULT_OBSIDIAN_URL);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setObsidianApiKey(sessionStorage.getItem(OBSIDIAN_KEY) || "");
    setObsidianApiUrl(sessionStorage.getItem(OBSIDIAN_URL) || DEFAULT_OBSIDIAN_URL);
  }, []);

  const handleSave = () => {
    sessionStorage.setItem(OBSIDIAN_KEY, obsidianApiKey.trim());
    sessionStorage.setItem(OBSIDIAN_URL, obsidianApiUrl.trim());
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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="obsidian-api-key" className="text-xs text-muted-foreground uppercase tracking-wider">
                Obsidian API Key (optional)
              </Label>
              <Input
                id="obsidian-api-key"
                type="password"
                placeholder="Leave empty to disable"
                value={obsidianApiKey}
                onChange={(e) => setObsidianApiKey(e.target.value)}
                className="bg-secondary/50 font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="obsidian-api-url" className="text-xs text-muted-foreground uppercase tracking-wider">
                Obsidian API URL
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
