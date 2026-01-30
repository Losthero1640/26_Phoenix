import { useState, useCallback } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { EvidencePanel } from "@/components/EvidencePanel";
import { HeroEmptyState } from "@/components/HeroEmptyState";
import { ChatInput, ChatMessageItem } from "@/components/ChatInterface";
import { SettingsModal } from "@/components/SettingsModal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Link2 } from "lucide-react";

// Mock data for demonstration
const mockEvidences = [
  {
    id: "1",
    citationNumber: 1,
    sourceFile: "Research Paper.pdf",
    excerpt: "The study found that machine learning models trained on diverse datasets showed 23% improvement in generalization compared to those trained on homogeneous data.",
    page: 12,
  },
  {
    id: "2",
    citationNumber: 2,
    sourceFile: "Meeting Notes.pdf",
    excerpt: "Action items include reviewing the Q3 budget allocation and scheduling follow-up sessions with the engineering team.",
    page: 3,
  },
  {
    id: "3",
    citationNumber: 3,
    sourceFile: "Audio Recording.mp3",
    excerpt: "We need to prioritize the user experience improvements before the product launch scheduled for next quarter.",
    timestamp: "02:34",
  },
];

const mockMessages = [
  {
    id: "1",
    role: "user",
    content: "What were the key findings about machine learning generalization?",
  },
  {
    id: "2",
    role: "assistant",
    content: "Based on the research paper, the study found that machine learning models trained on diverse datasets showed a 23% improvement in generalization [1]. This suggests that dataset diversity is crucial for building robust models.\n\nAdditionally, the meeting notes mention that the engineering team should schedule follow-up sessions [2] to discuss implementation strategies, and the audio recording indicates prioritizing user experience improvements [3].",
    citations: [1, 2, 3],
  },
];

export default function Index() {
  const [files, setFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [evidences, setEvidences] = useState([]);
  const [isEvidencePanelOpen, setIsEvidencePanelOpen] = useState(true);
  const [activeCitation, setActiveCitation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const hasFiles = files.some((f) => f.status === "ready");
  const hasMessages = messages.length > 0;

  const handleSendMessage = useCallback((content) => {
    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [...prev, ...mockMessages.slice(1)]);
      setEvidences(mockEvidences);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleCitationClick = (num) => {
    setActiveCitation(num);
    if (num && !isEvidencePanelOpen) {
      setIsEvidencePanelOpen(true);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Sidebar */}
      <AppSidebar files={files} onFilesChange={setFiles} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            {hasFiles && (
              <span className="text-sm text-muted-foreground">
                {files.filter((f) => f.status === "ready").length} document(s) ready
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" disabled={!hasMessages}>
              <Download className="h-3.5 w-3.5" />
              Download Markdown
            </Button>
            <Button variant="outline" size="sm" className="gap-2" disabled={!hasMessages}>
              <Link2 className="h-3.5 w-3.5" />
              Save to Obsidian
            </Button>
            <SettingsModal />
          </div>
        </header>

        {/* Chat area */}
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
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {/* Chat input */}
          <ChatInput
            onSend={handleSendMessage}
            isLoading={isLoading}
            disabled={!hasFiles}
          />
        </div>
      </main>

      {/* Evidence Panel */}
      <EvidencePanel
        evidences={evidences}
        activeCitation={activeCitation}
        onCitationClick={handleCitationClick}
        onClose={() => setIsEvidencePanelOpen(false)}
        isOpen={isEvidencePanelOpen}
      />
    </div>
  );
}
