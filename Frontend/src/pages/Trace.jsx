import { useState, useCallback } from "react";
import { AppSidebar } from "@/components/trace/AppSidebar";
import { EvidencePanel } from "@/components/trace/EvidencePanel";
import { HeroEmptyState } from "@/components/trace/HeroEmptyState";
import { ChatInput, ChatMessageItem } from "@/components/trace/ChatInterface";
import { SettingsModal } from "@/components/trace/SettingsModal";
import { EvidenceViewerModal } from "@/components/trace/EvidenceViewerModal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Link2 } from "lucide-react";
import * as api from "@/lib/trace-api";

function formatTimestamp(seconds) {
  if (seconds == null) return "";
  const mins = Math.floor(Number(seconds) / 60);
  const secs = Math.floor(Number(seconds) % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function citationToEvidence(citation, index) {
  const loc = citation.location || {};
  return {
    id: citation.chunk_id,
    chunk_id: citation.chunk_id,
    citationNumber: index + 1,
    sourceFile: citation.source_file || "unknown",
    excerpt: citation.text_snippet || "Visual content",
    page: loc.page,
    timestamp: loc.timestamp_start != null ? formatTimestamp(loc.timestamp_start) : null,
    modality: citation.modality,
    confidence: citation.confidence,
    conflicts_with: citation.conflicts_with || [],
  };
}

export default function Index() {
  const [files, setFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [evidences, setEvidences] = useState([]);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [isEvidencePanelOpen, setIsEvidencePanelOpen] = useState(true);
  const [activeCitation, setActiveCitation] = useState(null);
  const [viewerCitation, setViewerCitation] = useState(null);
  const [viewerChunkId, setViewerChunkId] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalityScope, setModalityScope] = useState("all");

  const hasFiles = files.some((f) => f.status === "ready");
  const hasMessages = messages.length > 0;

  const handleUpload = useCallback(async (formData, fileId, onProgress) => {
    // Pass onProgress to api.ingest
    const result = await api.ingest(formData, onProgress);
    return result;
  }, []);

  const handleSendMessage = useCallback(
    async (content) => {
      const userMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setCurrentResponse(null);
      setEvidences([]);

      try {
        const body = {
          query: content,
          max_results: 5,
        };
        if (modalityScope === "video") {
          body.modalities = ["video_frame", "audio_transcript"];
        }

        const data = await api.query(body);
        setCurrentResponse(data);

        const assistantContent = data.refused
          ? `⚠️ ${data.answer}`
          : data.answer;
        const citations = data.citations || [];
        const conflicts = data.conflicts || [];

        const assistantMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: assistantContent,
          citations: citations.map((_, i) => i + 1),
          confidence: data.confidence,
          conflicts,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setEvidences(citations.map((c, i) => citationToEvidence(c, i)));
      } catch (err) {
        const errMsg = err?.message || "Failed to process query. Please try again.";
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `Error: ${errMsg}`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [modalityScope]
  );

  const handleCitationClick = useCallback((num) => {
    const oneBased = typeof num === "number" ? num : parseInt(num, 10);
    const idx = oneBased - 1;
    const ev = evidences[idx];
    if (ev?.chunk_id) {
      setViewerChunkId(ev.chunk_id);
      setViewerCitation(ev);
      setViewerOpen(true);
    }
    setActiveCitation(oneBased);
    if (oneBased && !isEvidencePanelOpen) {
      setIsEvidencePanelOpen(true);
    }
  }, [evidences, isEvidencePanelOpen]);

  const handleExportMarkdown = useCallback(async () => {
    if (!currentResponse) return;
    try {
      const blob = await api.exportMarkdown(currentResponse);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `TRACE_Query_${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  }, [currentResponse]);

  const handleSaveToObsidian = useCallback(async () => {
    if (!currentResponse) return;
    const apiKey = sessionStorage.getItem("obsidian_api_key") || "";
    const apiUrl = sessionStorage.getItem("obsidian_api_url") || "http://localhost:27123";
    if (!apiKey) {
      return;
    }
    try {
      const result = await api.exportObsidian({
        ...currentResponse,
        obsidian_api_key: apiKey,
        obsidian_api_url: apiUrl,
      });
      if (result?.status === "success") {
        // optional: toast
      }
    } catch (err) {
      console.error(err);
    }
  }, [currentResponse]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar
        files={files}
        onFilesChange={setFiles}
        onUpload={handleUpload}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            {hasFiles && (
              <span className="text-sm text-muted-foreground">
                {files.filter((f) => f.status === "ready").length} document(s) ready
              </span>
            )}
            <select
              value={modalityScope}
              onChange={(e) => setModalityScope(e.target.value)}
              className="rounded-md border border-input bg-background px-2 py-1 text-sm"
            >
              <option value="all">Search: All</option>
              <option value="video">Search: Video</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={!currentResponse}
              onClick={handleExportMarkdown}
            >
              <Download className="h-3.5 w-3.5" />
              Download Markdown
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={!currentResponse}
              onClick={handleSaveToObsidian}
            >
              <Link2 className="h-3.5 w-3.5" />
              Save to Obsidian
            </Button>
            
            <Button
              variant={isEvidencePanelOpen ? "secondary" : "outline"}
              size="sm"
              onClick={() => setIsEvidencePanelOpen(!isEvidencePanelOpen)}
              title={isEvidencePanelOpen ? "Close Evidence Panel" : "Open Evidence Panel"}
            >
               {isEvidencePanelOpen ? "Hide Evidence" : "Show Evidence"}
            </Button>

            <SettingsModal />
          </div>
        </header>

        <div className="flex-1 flex flex-col min-h-0">
          {!hasMessages ? (
            <div className="flex-1 flex items-center justify-center">
              <HeroEmptyState />
            </div>
          ) : (
            <ScrollArea className="flex-1 px-6">
              <div className="max-w-3xl mx-auto py-6 space-y-4">
                {messages.map((msg) => (
                  <ChatMessageItem
                    key={msg.id}
                    message={msg}
                    onCitationClick={handleCitationClick}
                  />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="message-ai rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <div
                          className="w-2 h-2 rounded-full bg-primary animate-pulse"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-primary animate-pulse"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          <ChatInput
            onSend={handleSendMessage}
            isLoading={isLoading}
            disabled={false}
          />
        </div>
      </main>

      <EvidencePanel
        evidences={evidences}
        activeCitation={activeCitation}
        onCitationClick={handleCitationClick}
        onClose={() => setIsEvidencePanelOpen(false)}
        isOpen={isEvidencePanelOpen}
      />

      <EvidenceViewerModal
        chunkId={viewerChunkId}
        citation={viewerCitation}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
      />
    </div>
  );
}
