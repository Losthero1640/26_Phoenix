import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getEvidence, getEvidenceContentUrl } from "@/lib/trace-api";

function formatTimestamp(seconds) {
  if (seconds == null) return "";
  const mins = Math.floor(Number(seconds) / 60);
  const secs = Math.floor(Number(seconds) % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function EvidenceViewerModal({ chunkId, citation, open, onOpenChange }) {
  const [evidence, setEvidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !chunkId) {
      setEvidence(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getEvidence(chunkId)
      .then((data) => {
        if (!cancelled) setEvidence(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Failed to load evidence");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [open, chunkId]);

  if (!open) return null;

  const modality = evidence?.modality || citation?.modality || "text";
  const location = evidence?.location || {};
  const contentUrl = evidence?.content_url ? getEvidenceContentUrl(evidence.content_url) : "";

  const renderBody = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      );
    }
    if (error) {
      return (
        <p className="text-destructive py-4">{error}</p>
      );
    }
    if (!evidence) return null;

    // Text / OCR
    if (modality === "text" || modality === "ocr") {
      return (
        <div className="rounded-lg bg-muted/50 p-4 font-mono text-sm whitespace-pre-wrap">
          {evidence.text_content || "No text content."}
        </div>
      );
    }

    // Image / video frame
    if (modality === "image" || modality === "video_frame") {
      return (
        <div className="flex justify-center">
          <img
            src={contentUrl}
            alt="Evidence"
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
      );
    }

    // Audio / video (with transcript)
    if (modality === "audio_transcript") {
      const isVideo = contentUrl && /\.(mp4|webm|mkv|avi|mov)$/i.test(contentUrl);
      return (
        <div className="space-y-4">
          {contentUrl && (
            isVideo ? (
              <video controls className="w-full rounded-lg" src={contentUrl} />
            ) : (
              <audio controls className="w-full" src={contentUrl} />
            )
          )}
          {evidence.text_content && (
            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">
                Transcript {location.timestamp_start != null && `(${formatTimestamp(location.timestamp_start)})`}
              </h4>
              <p className="text-sm whitespace-pre-wrap">{evidence.text_content}</p>
            </div>
          )}
        </div>
      );
    }

    // PDF / document – open in new tab or iframe
    if (contentUrl && (modality === "pdf" || contentUrl.toLowerCase().endsWith(".pdf"))) {
      return (
        <iframe
          title="PDF evidence"
          src={contentUrl}
          className="w-full h-[70vh] rounded-lg border border-border"
        />
      );
    }

    // Fallback text
    return (
      <div className="rounded-lg bg-muted/50 p-4 text-sm">
        {evidence.text_content || `Modality: ${modality}. Open source manually if needed.`}
      </div>
    );
  };

  const title = citation?.source_file || evidence?.source_file || "Evidence";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="truncate pr-8">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto min-h-0">{renderBody()}</div>
      </DialogContent>
    </Dialog>
  );
}
