import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatInput({ onSend, isLoading, disabled, className }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSend(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setMessage(e.target.value);
    // Auto-resize
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
  };

  return (
    <div className={cn("relative flex items-end gap-2 p-4 border-t border-border bg-background", className)}>
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your documents..."
          disabled={disabled || isLoading}
          rows={1}
          className={cn(
            "w-full resize-none rounded-lg border border-input bg-secondary/50 px-4 py-3 pr-12",
            "text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200"
          )}
        />
      </div>
      <Button
        onClick={handleSend}
        disabled={!message.trim() || isLoading || disabled}
        size="icon"
        className="h-11 w-11 rounded-lg shrink-0"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

export function ChatMessageItem({ message, onCitationClick }) {
  const isUser = message.role === "user";
  const confidence = message.confidence;

  // Confidence Meter Logic
  const getConfidenceBadge = (score) => {
    if (score == null) return null;
    let label = "Low";
    let colorClass = "bg-red-100 text-red-700 border-red-200";
    
    if (score >= 0.8) {
      label = "High";
      colorClass = "bg-green-100 text-green-700 border-green-200";
    } else if (score >= 0.5) {
      label = "Medium";
      colorClass = "bg-yellow-100 text-yellow-700 border-yellow-200";
    }

    return (
      <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full border font-medium uppercase tracking-wide", colorClass)}>
        {label} Confidence
      </span>
    );
  };

  // Parse content for citation markers like [1], [2], etc.
  const renderContent = (content) => {
    const parts = content.split(/(\[\d+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const citationNum = parseInt(match[1]);
        return (
          <button
            key={index}
            onClick={() => onCitationClick(citationNum)}
            className="citation-badge mx-0.5"
          >
            {part}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={cn(
      "flex animate-slide-up",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3 relative group",
        isUser ? "message-user rounded-br-sm" : "message-ai rounded-bl-sm"
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap mb-1">
          {isUser ? message.content : renderContent(message.content)}
        </p>
        
        {!isUser && confidence != null && (
          <div className="flex items-center justify-end mt-2 opacity-100 transition-opacity">
            {getConfidenceBadge(confidence)}
          </div>
        )}
      </div>
    </div>
  );
}
